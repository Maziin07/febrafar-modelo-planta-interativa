import React, { useState } from 'react';
import PharmacyHeader from '@/components/PharmacyHeader';
import DimensionControls from '@/components/DimensionControls';
import PharmacyLayout from '@/components/PharmacyLayout';
import CategoryLegend from '@/components/CategoryLegend';

const Index = () => {
  const [dimensions, setDimensions] = useState({
    width: 800,
    height: 600
  });

  const handleWidthChange = (width: number) => {
    setDimensions(prev => ({ ...prev, width }));
  };

  const handleHeightChange = (height: number) => {
    setDimensions(prev => ({ ...prev, height }));
  };

  const handleReset = () => {
    setDimensions({ width: 800, height: 600 });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <PharmacyHeader />

        {/* Controls */}
        <div className="mb-8">
          <DimensionControls
            width={dimensions.width}
            height={dimensions.height}
            onWidthChange={handleWidthChange}
            onHeightChange={handleHeightChange}
            onReset={handleReset}
          />
        </div>

        {/* Main content area */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Pharmacy Layout */}
          <div className="flex-1 flex justify-center">
            <div className="w-full max-w-none overflow-auto">
              <PharmacyLayout 
                width={dimensions.width} 
                height={dimensions.height} 
              />
            </div>
          </div>

          {/* Legend */}
          <div className="lg:w-80 w-full">
            <CategoryLegend />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>💡 Dica: Clique nas seções para ver informações detalhadas dos produtos</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
