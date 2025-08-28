import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { RotateCcw, Maximize, Minimize } from 'lucide-react';

interface DimensionControlsProps {
  width: number;
  height: number;
  onWidthChange: (width: number) => void;
  onHeightChange: (height: number) => void;
  onReset: () => void;
}

const DimensionControls: React.FC<DimensionControlsProps> = ({
  width,
  height,
  onWidthChange,
  onHeightChange,
  onReset
}) => {
  const handleLargeSize = () => {
    onWidthChange(1200);
    onHeightChange(900);
  };

  const handleSmallSize = () => {
    onWidthChange(600);
    onHeightChange(450);
  };

  return (
    <div className="control-panel space-y-6">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-foreground flex items-center justify-center gap-2">
          🎛️ Controles de Dimensão da Planta
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Width Control */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">📏 Largura: {width}px</span>
          </div>
          <Slider
            value={[width]}
            onValueChange={(value) => onWidthChange(value[0])}
            max={1400}
            min={400}
            step={10}
            className="w-full"
          />
          <div className="text-xs text-muted-foreground">
            Min: 400px | Max: 1400px
          </div>
        </div>

        {/* Height Control */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">📐 Altura: {height}px</span>
          </div>
          <Slider
            value={[height]}
            onValueChange={(value) => onHeightChange(value[0])}
            max={1200}
            min={300}
            step={10}
            className="w-full"
          />
          <div className="text-xs text-muted-foreground">
            Min: 300px | Max: 1200px
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2 justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          🔄 Restaurar Padrão
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLargeSize}
          className="flex items-center gap-2"
        >
          <Maximize className="h-4 w-4" />
          📏 Planta Grande
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSmallSize}
          className="flex items-center gap-2"
        >
          <Minimize className="h-4 w-4" />
          📐 Planta Pequena
        </Button>
      </div>
    </div>
  );
};

export default DimensionControls;