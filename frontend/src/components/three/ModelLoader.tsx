import React from 'react';

export const ModelLoader: React.FC<{ message?: string }> = ({
  message = 'Loading 3D photogrammetry model...'
}) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#FAF8F5]/90 backdrop-blur-xs z-10 pointer-events-none space-y-3">
      <div className="w-10 h-10 border-3 border-stone-300 border-t-[#FFE600] rounded-full animate-spin" />
      <p className="text-xs font-editorial text-stone-700 tracking-wide">{message}</p>
      <span className="text-[10px] text-stone-500 font-mono">Parsing GLB / GLTF Buffer</span>
    </div>
  );
};
