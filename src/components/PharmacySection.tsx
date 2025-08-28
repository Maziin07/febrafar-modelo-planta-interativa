import React from 'react';
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
  isActive?: boolean;
}

const PharmacySection: React.FC<PharmacySectionProps> = ({
  section,
  onClick,
  isActive = false
}) => {
  const categoryClasses = {
    cosmetics: 'category-cosmetics',
    hygiene: 'category-hygiene',
    promotional: 'category-promotional',
    medical: 'category-medical',
    children: 'category-children',
    special: 'category-special',
    food: 'category-food'
  };

  return (
    <div
      className={cn(
        'category-section',
        categoryClasses[section.category],
        isActive && 'ring-2 ring-white/60 scale-105 z-10'
      )}
      style={{
        position: 'absolute',
        top: `${section.position.top}%`,
        left: `${section.position.left}%`,
        width: `${section.position.width}%`,
        height: `${section.position.height}%`,
      }}
      onClick={() => onClick(section)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick(section);
        }
      }}
    >
      <div className="flex items-center justify-center h-full text-center">
        <span className="text-xs sm:text-sm font-semibold leading-tight">
          {section.name}
        </span>
      </div>
    </div>
  );
};

export default PharmacySection;