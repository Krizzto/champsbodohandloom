import React from 'react';
import { Box, FileWarning } from 'lucide-react';

export interface ModelErrorProps {
  modelPath?: string;
  errorMessage?: string;
}

export const ModelError: React.FC<ModelErrorProps> = ({
  modelPath,
  errorMessage = '3D model unavailable'
}) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#FAF8F5] z-10 space-y-3">
      <div className="w-14 h-14 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-500 shadow-xs">
        <Box className="w-7 h-7 text-stone-400" />
      </div>

      <div className="space-y-1">
        <h4 className="text-base font-bold font-editorial text-stone-800">
          3D model unavailable
        </h4>
        <p className="text-xs text-stone-500 max-w-xs font-editorial">
          {errorMessage || 'A GLB/GLTF model has not been uploaded to this accession path yet.'}
        </p>
      </div>

      {modelPath && (
        <div className="flex items-center gap-1.5 px-3 py-1 bg-stone-100 rounded-md text-[11px] font-mono text-stone-600 border border-stone-200">
          <FileWarning className="w-3.5 h-3.5 text-amber-600" />
          <span className="truncate max-w-[240px]">{modelPath}</span>
        </div>
      )}

      <p className="text-[11px] text-stone-400 italic">
        Place your GLB model into <code className="bg-stone-200/70 px-1 py-0.5 rounded font-mono">public/assets/models/</code> to view it in 3D.
      </p>
    </div>
  );
};
