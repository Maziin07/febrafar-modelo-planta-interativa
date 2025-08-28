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

    // Check if click is near edges for resizing (10px threshold)
    const edgeThreshold = 10;
    const isNearRightEdge = e.clientX > rect.right - edgeThreshold;
    const isNearBottomEdge = e.clientY > rect.bottom - edgeThreshold;
    
    if (isNearRightEdge || isNearBottomEdge) {
      setIsResizing(true);
      e.preventDefault();
      e.stopPropagation();
    } else {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      e.preventDefault();
    }
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging && !isResizing) return;

    const containerRect = elementRef.current?.parentElement?.getBoundingClientRect();
    if (!containerRect) return;

    if (isDragging) {
      // Calculate new position with low sensitivity
      const sensitivity = 0.8;
      const newLeft = ((e.clientX - containerRect.left - dragStart.x) / containerRect.width) * 100 * sensitivity;
      const newTop = ((e.clientY - containerRect.top - dragStart.y) / containerRect.height) * 100 * sensitivity;
      
      // Constrain to container bounds
      const constrainedLeft = Math.max(0, Math.min(100 - section.position.width, newLeft));
      const constrainedTop = Math.max(0, Math.min(100 - section.position.height, newTop));
      
      onPositionChange(section.id, {
        ...section.position,
        left: constrainedLeft,
        top: constrainedTop
      });
    }

    if (isResizing) {
      // Calculate new size with low sensitivity
      const sensitivity = 0.6;
      const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100 * sensitivity - section.position.left;
      const newHeight = ((e.clientY - containerRect.top) / containerRect.height) * 100 * sensitivity - section.position.top;
      
      // Constrain size (min 8%, max within container)
      const constrainedWidth = Math.max(8, Math.min(100 - section.position.left, newWidth));
      const constrainedHeight = Math.max(6, Math.min(100 - section.position.top, newHeight));
      
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
    
    // Double click to manage products
    if (e.detail === 2) {
      setShowProductManager(true);
      e.stopPropagation();
    } else {
      onClick(section);
    }
  };

  const addProduct = () => {
    const productName = prompt('Nome do produto:');
    if (productName && productName.trim()) {
      const newProducts = [...(section.products || []), productName.trim()];
      onProductsChange(section.id, newProducts);
    }
  };

  const removeProduct = (index: number) => {
    const newProducts = (section.products || []).filter((_, i) => i !== index);
    onProductsChange(section.id, newProducts);
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
        
        {/* Resize handle */}
        <div className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize opacity-0 hover:opacity-60 transition-opacity">
          <div className="w-full h-full bg-white/50 rounded-tl-lg" />
        </div>
      </div>

      {/* Product Manager Modal */}
      {showProductManager && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Gerenciar Produtos - {section.name}</h3>
            
            <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
              {section.products?.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                  <span className="text-sm">{product}</span>
                  <button
                    onClick={() => removeProduct(index)}
                    className="text-destructive hover:text-destructive/80 text-sm font-medium"
                  >
                    Remover
                  </button>
                </div>
              ))}
              {(!section.products || section.products.length === 0) && (
                <p className="text-muted-foreground text-sm text-center py-4">
                  Nenhum produto adicionado
                </p>
              )}
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={addProduct}
                className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Adicionar Produto
              </button>
              <button
                onClick={() => setShowProductManager(false)}
                className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PharmacySection;