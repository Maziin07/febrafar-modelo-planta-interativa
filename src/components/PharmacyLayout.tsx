import React, { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import PharmacySection, { PharmacySection as PharmacySectionType } from './PharmacySection';

interface PharmacyLayoutProps {
  width: number;
  height: number;
}

const pharmacySections: PharmacySectionType[] = [
  // Top row - Beauty & Cosmetics
  { id: '1', name: 'COSMÉTICOS', category: 'cosmetics', position: { top: 5, left: 5, width: 12, height: 8 } },
  { id: '2', name: 'PROTEÇÃO SOLAR', category: 'cosmetics', position: { top: 5, left: 20, width: 14, height: 8 } },
  { id: '3', name: 'CABELOS', category: 'cosmetics', position: { top: 5, left: 37, width: 10, height: 8 } },
  { id: '4', name: 'COLORAÇÃO', category: 'cosmetics', position: { top: 5, left: 50, width: 12, height: 8 } },
  { id: '5', name: 'MAQUIAGENS', category: 'cosmetics', position: { top: 5, left: 65, width: 12, height: 8 } },
  
  // Second row - Hygiene
  { id: '6', name: 'HIGIENE ÍNTIMA', category: 'hygiene', position: { top: 16, left: 8, width: 14, height: 7 } },
  { id: '7', name: 'SABONETES', category: 'hygiene', position: { top: 16, left: 25, width: 11, height: 7 } },
  { id: '8', name: 'PÉS CUTELARIA', category: 'hygiene', position: { top: 16, left: 39, width: 13, height: 7 } },
  { id: '9', name: 'SAÚDE SEXUAL', category: 'special', position: { top: 16, left: 55, width: 12, height: 7 } },
  
  // Third row - Nutrition & Personal Care
  { id: '10', name: 'NUTRIÇÃO ESPORTIVA', category: 'special', position: { top: 26, left: 5, width: 15, height: 8 } },
  { id: '11', name: 'NUTRIÇÃO ADULTA', category: 'special', position: { top: 26, left: 23, width: 14, height: 8 } },
  { id: '12', name: 'DESODORANTES FEM', category: 'hygiene', position: { top: 26, left: 40, width: 15, height: 8 } },
  { id: '13', name: 'DESODORANTE MASC', category: 'hygiene', position: { top: 26, left: 58, width: 15, height: 8 } },
  { id: '14', name: 'BARBA', category: 'hygiene', position: { top: 26, left: 76, width: 8, height: 8 } },
  
  // Middle section - Adult care
  { id: '15', name: 'Cuidado Adulto', category: 'medical', position: { top: 37, left: 8, width: 13, height: 9 } },
  { id: '16', name: 'HIGIENE ORAL', category: 'hygiene', position: { top: 37, left: 24, width: 12, height: 9 } },
  { id: '17', name: 'PRIMEIROS SOCORROS', category: 'medical', position: { top: 37, left: 39, width: 16, height: 9 } },
  { id: '18', name: 'BANHO E TROCA', category: 'children', position: { top: 37, left: 58, width: 13, height: 9 } },
  { id: '19', name: 'PUERICULTURA', category: 'children', position: { top: 37, left: 74, width: 12, height: 9 } },
  
  // Lower section - Vitamins & Children
  { id: '20', name: 'VITAMINAS', category: 'medical', position: { top: 49, left: 5, width: 11, height: 8 } },
  { id: '21', name: 'OTC MIP', category: 'medical', position: { top: 49, left: 19, width: 8, height: 8 } },
  { id: '22', name: 'FRALDA INFANTIL', category: 'children', position: { top: 49, left: 30, width: 13, height: 8 } },
  { id: '23', name: 'NUTRIÇÃO INFANTIL', category: 'children', position: { top: 49, left: 46, width: 14, height: 8 } },
  { id: '24', name: 'ALIMENTOS', category: 'food', position: { top: 49, left: 63, width: 11, height: 8 } },
  { id: '25', name: 'GELADEIRA', category: 'food', position: { top: 49, left: 77, width: 10, height: 8 } },
  
  // Promotional area
  { id: '26', name: 'Área promocional\n🎯 Ofertas!', category: 'promotional', position: { top: 70, left: 15, width: 18, height: 12 } },
];

const PharmacyLayout: React.FC<PharmacyLayoutProps> = ({ width, height }) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const handleSectionClick = (section: PharmacySectionType) => {
    setActiveSection(section.id);
    
    toast({
      title: `📍 ${section.name}`,
      description: `Categoria: ${getCategoryDisplayName(section.category)}`,
      duration: 3000,
    });
    
    // Auto-clear active section after 3 seconds
    setTimeout(() => {
      setActiveSection(null);
    }, 3000);
  };

  const getCategoryDisplayName = (category: string): string => {
    const categoryNames = {
      cosmetics: 'Cosméticos & Beleza',
      hygiene: 'Higiene & Cuidados',
      promotional: 'Área Promocional',
      medical: 'Medicamentos & Primeiros Socorros',
      children: 'Produtos Infantis',
      special: 'Produtos Especiais',
      food: 'Alimentos & Refrigerados'
    };
    return categoryNames[category as keyof typeof categoryNames] || category;
  };

  return (
    <div 
      className="pharmacy-layout relative"
      style={{ width, height }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-12 grid-rows-8 h-full w-full">
          {Array.from({ length: 96 }, (_, i) => (
            <div key={i} className="border border-muted-foreground/20" />
          ))}
        </div>
      </div>
      
      {/* Pharmacy sections */}
      {pharmacySections.map((section) => (
        <PharmacySection
          key={section.id}
          section={section}
          onClick={handleSectionClick}
          isActive={activeSection === section.id}
        />
      ))}
      
      {/* Corner labels for orientation */}
      <div className="absolute top-2 left-2 text-xs text-muted-foreground font-medium">
        Entrada Principal
      </div>
      <div className="absolute bottom-2 right-2 text-xs text-muted-foreground font-medium">
        Balcão de Atendimento
      </div>
    </div>
  );
};

export default PharmacyLayout;