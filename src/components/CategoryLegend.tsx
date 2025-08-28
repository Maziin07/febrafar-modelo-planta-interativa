import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const categories = [
  { name: 'Cosméticos & Beleza', color: 'category-cosmetics', key: 'cosmetics' },
  { name: 'Higiene & Cuidados', color: 'category-hygiene', key: 'hygiene' },
  { name: 'Área Promocional', color: 'category-promotional', key: 'promotional' },
  { name: 'Medicamentos & Primeiros Socorros', color: 'category-medical', key: 'medical' },
  { name: 'Produtos Infantis', color: 'category-children', key: 'children' },
  { name: 'Produtos Especiais', color: 'category-special', key: 'special' },
  { name: 'Alimentos & Refrigerados', color: 'category-food', key: 'food' }
];

const CategoryLegend: React.FC = () => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          📋 Legenda das Seções
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {categories.map((category) => (
          <div key={category.key} className="flex items-center gap-3">
            <div 
              className={`w-4 h-4 rounded ${category.color} border border-white/20`}
            />
            <span className="text-sm font-medium">{category.name}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default CategoryLegend;