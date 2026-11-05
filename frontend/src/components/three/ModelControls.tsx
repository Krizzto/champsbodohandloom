import React from 'react';
import { RotateCcw, Play, Pause, Maximize2, Minimize2, Grid, Layers } from 'lucide-react';

export interface ModelControlsProps {
  autoRotate: boolean;
  onToggleAutoRotate: () => void;
  wireframe: boolean;
  onToggleWireframe: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onResetCamera: () => void;
  className?: string;
}

export const ModelControls: React.FC<ModelControlsProps> = ({
  autoRotate,
  onToggleAutoRotate,
  wireframe,
  onToggleWireframe,
  isFullscreen,
  onToggleFullscreen,
  onResetCamera,
  className = ''
}) => {
  return (
    <div
      className={`flex items-center gap-1.5 p-1.5 bg-[#171513]/85 text-white backdrop-blur-md rounded-xl shadow-lg border border-white/20 select-none ${className}`}
    >
      {/* Auto-rotate toggle */}
      <button
        type="button"
        onClick={onToggleAutoRotate}
        className={`p-2 rounded-lg transition-colors cursor-pointer ${
          autoRotate ? 'bg-[#FFE600] text-[#171513]' : 'hover:bg-white/10 text-white'
        }`}
        title={autoRotate ? 'Pause 360° rotation' : 'Enable 360° rotation'}
      >
        {autoRotate ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
      </button>

      {/* Reset Camera */}
      <button
        type="button"
        onClick={onResetCamera}
        className="p-2 rounded-lg hover:bg-white/10 text-white transition-colors cursor-pointer"
        title="Reset camera zoom and pan"
      >
        <RotateCcw className="w-4 h-4" />
      </button>

      {/* Wireframe toggle */}
      <button
        type="button"
        onClick={onToggleWireframe}
        className={`p-2 rounded-lg transition-colors cursor-pointer ${
          wireframe ? 'bg-white/30 text-[#FFE600]' : 'hover:bg-white/10 text-white'
        }`}
        title={wireframe ? 'Shaded mode' : 'Wireframe inspection'}
      >
        <Grid className="w-4 h-4" />
      </button>

      {/* Fullscreen */}
      <button
        type="button"
        onClick={onToggleFullscreen}
        className="p-2 rounded-lg hover:bg-white/10 text-white transition-colors cursor-pointer"
        title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
      >
        {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
      </button>
    </div>
  );
};
