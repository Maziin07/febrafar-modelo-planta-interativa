import React, { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

export interface PharmacySection {
  id: string;
  name: string;
  category: 'cosmetics' | 'hygiene' | 'promotional' | 'medical' | 'children' | 'special' | 'food';
  position: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  products?: string[];
}

interface PharmacySectionProps {
  section: PharmacySection;
  onClick: (section: PharmacySection) => void;
  onPositionChange: (id: string, position: { top: number; left: number; width: number; height: number }) => void;
  onProductsChange: (id: string, products: string[]) => void;
  isActive?: boolean;
  containerDimensions: { width: number; height: number };
}

const PharmacySection: React.FC<PharmacySectionProps> = ({
  section,
  onClick,
  onPositionChange,
  onProductsChange,
  isActive = false,
  containerDimensions
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showProductManager, setShowProductManager] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  const categoryClasses = {
    cosmetics: 'category-cosmetics',
    hygiene: 'category-hygiene',
    promotional: 'category-promotional',
    medical: 'category-medical',
    children: 'category-children',
    special: 'category-special',
    food: 'category-food'
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    
    const rect = elementRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Check if click is on resize handles
    const target = e.target as HTMLElement;
    if (target.closest('.resize-handle')) {
      setIsResizing(true);
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    // Otherwise, start dragging
    setIsDragging(true);
    setDragStart({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging && !isResizing) return;

    const containerRect = elementRef.current?.parentElement?.getBoundingClientRect();
    if (!containerRect) return;

    if (isDragging) {
      // Calculate new position with smooth movement
      const newLeft = ((e.clientX - containerRect.left - dragStart.x) / containerRect.width) * 100;
      const newTop = ((e.clientY - containerRect.top - dragStart.y) / containerRect.height) * 100;
      
      // Constrain to container bounds with padding
      const padding = 1; // 1% padding from edges
      const constrainedLeft = Math.max(padding, Math.min(100 - section.position.width - padding, newLeft));
      const constrainedTop = Math.max(padding, Math.min(100 - section.position.height - padding, newTop));
      
      onPositionChange(section.id, {
        ...section.position,
        left: constrainedLeft,
        top: constrainedTop
      });
    }

    if (isResizing) {
      // More precise resizing calculation
      const currentRect = elementRef.current?.getBoundingClientRect();
      if (!currentRect) return;

      const newWidth = ((e.clientX - currentRect.left) / containerRect.width) * 100;
      const newHeight = ((e.clientY - currentRect.top) / containerRect.height) * 100;
      
      // Constrain size with better bounds
      const minWidth = 8; // Minimum 8% width
      const minHeight = 5; // Minimum 5% height
      const maxWidth = 100 - section.position.left - 1; // Leave 1% margin
      const maxHeight = 100 - section.position.top - 1; // Leave 1% margin
      
      const constrainedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
      const constrainedHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));
      
      onPositionChange(section.id, {
        ...section.position,
        width: constrainedWidth,
        height: constrainedHeight
      });
    }
  }, [isDragging, isResizing, dragStart, section, onPositionChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);

  // Add/remove event listeners
  React.useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = isDragging ? 'grabbing' : 'se-resize';
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = 'auto';
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  const handleSectionClick = (e: React.MouseEvent) => {
    if (isDragging || isResizing) return;
    
    // Single click to show section info, double click to manage products
    if (e.detail === 2) {
      setShowProductManager(true);
      e.stopPropagation();
    } else {
      onClick(section);
    }
  };

  const [newProductName, setNewProductName] = useState('');

  const addProduct = () => {
    if (newProductName.trim()) {
      const newProducts = [...(section.products || []), newProductName.trim()];
      onProductsChange(section.id, newProducts);
      setNewProductName('');
    }
  };

  const removeProduct = (index: number) => {
    const newProducts = (section.products || []).filter((_, i) => i !== index);
    onProductsChange(section.id, newProducts);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addProduct();
    }
  };

  return (
    <>
      <div
        ref={elementRef}
        className={cn(
          'category-section select-none',
          categoryClasses[section.category],
          isActive && 'ring-2 ring-white/60 scale-105 z-20',
          (isDragging || isResizing) && 'z-30',
          isDragging && 'cursor-grabbing',
          'hover:cursor-grab'
        )}
        style={{
          position: 'absolute',
          top: `${section.position.top}%`,
          left: `${section.position.left}%`,
          width: `${section.position.width}%`,
          height: `${section.position.height}%`,
        }}
        onMouseDown={handleMouseDown}
        onClick={handleSectionClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onClick(section);
          }
        }}
      >
        <div className="flex flex-col items-center justify-center h-full text-center p-1">
          <span className="text-xs sm:text-sm font-semibold leading-tight mb-1">
            {section.name}
          </span>
          {section.products && section.products.length > 0 && (
            <span className="text-xs opacity-80">
              {section.products.length} produto(s)
            </span>
          )}
        </div>
        
        {/* Resize handles */}
        <div className="resize-handle absolute bottom-0 right-0 w-4 h-4 cursor-se-resize opacity-0 hover:opacity-100 transition-all duration-200 group">
          <div className="w-full h-full bg-white/60 rounded-tl-lg group-hover:bg-white/80 shadow-sm">
            <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-white/80"></div>
          </div>
        </div>
        
        {/* Corner resize handles */}
        <div className="resize-handle absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize opacity-0 hover:opacity-80 transition-opacity">
          <div className="w-full h-full bg-white/50 rounded-tr-lg" />
        </div>
        <div className="resize-handle absolute top-0 right-0 w-3 h-3 cursor-ne-resize opacity-0 hover:opacity-80 transition-opacity">
          <div className="w-full h-full bg-white/50 rounded-bl-lg" />
        </div>
        
        {/* Edge resize handles */}
        <div className="resize-handle absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-2 cursor-s-resize opacity-0 hover:opacity-80 transition-opacity">
          <div className="w-full h-full bg-white/40 rounded-t-lg" />
        </div>
        <div className="resize-handle absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-6 cursor-e-resize opacity-0 hover:opacity-80 transition-opacity">
          <div className="w-full h-full bg-white/40 rounded-l-lg" />
        </div>
      </div>

      {/* Product Manager Modal */}
      {showProductManager && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-card rounded-xl shadow-2xl p-6 w-full max-w-lg border border-border">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-foreground">
                📦 {section.name}
              </h3>
              <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
                {section.products?.length || 0} produtos
              </span>
            </div>
            
            {/* Add new product */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Adicionar novo produto
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Nome do produto..."
                  className="flex-1 px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button
                  onClick={addProduct}
                  disabled={!newProductName.trim()}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  ➕
                </button>
              </div>
            </div>
            
            {/* Products list */}
            <div className="space-y-2 mb-6 max-h-64 overflow-y-auto">
              {section.products?.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border/50 hover:bg-muted transition-colors group">
                  <span className="text-sm font-medium text-foreground">{product}</span>
                  <button
                    onClick={() => removeProduct(index)}
                    className="text-destructive hover:text-destructive/80 opacity-0 group-hover:opacity-100 transition-all duration-200 p-1 hover:bg-destructive/10 rounded"
                    title="Remover produto"
                  >
                    🗑️
                  </button>
                </div>
              ))}
              {(!section.products || section.products.length === 0) && (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">📦</div>
                  <p className="text-muted-foreground text-sm">
                    Nenhum produto adicionado ainda
                  </p>
                  <p className="text-muted-foreground text-xs mt-1">
                    Use o campo acima para adicionar produtos
                  </p>
                </div>
              )}
            </div>
            
            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowProductManager(false)}
                className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-foreground"
              >
                Fechar
              </button>
              <button
                onClick={() => {
                  if (section.products && section.products.length > 0) {
                    if (confirm('Tem certeza que deseja limpar todos os produtos?')) {
                      onProductsChange(section.id, []);
                    }
                  }
                }}
                disabled={!section.products || section.products.length === 0}
                className="px-4 py-2 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg hover:bg-destructive/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Limpar Todos
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PharmacySection;