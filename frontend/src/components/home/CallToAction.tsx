import React from 'react';
import { Box, Sparkles, Compass, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

export interface CallToActionProps {
  onNavigate: (path: string) => void;
}

export const CallToAction: React.FC<CallToActionProps> = ({ onNavigate }) => {
  return (
    <section className="py-20 md:py-24 bg-[#171513] text-[#FAF8F5] relative overflow-hidden">
      {/* Decorative ambient elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFE600]/10 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#8B2635]/15 blur-3xl rounded-full pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <span className="text-xs uppercase tracking-widest font-semibold text-[#FFE600] font-sans">
          Step Inside the Living Archive
        </span>

        <h2 className="text-3xl sm:text-5xl font-editorial font-bold text-white tracking-tight leading-tight">
          Explore Northeast India&apos;s Handloom Heritage in 3D
        </h2>

        <p className="text-sm sm:text-base text-stone-300 font-editorial italic max-w-xl mx-auto leading-relaxed">
          Rotate, zoom, and inspect traditional wooden ginning rollers (Zenther), carved shuttles (Maku), and ceremonial Aronai textiles in real-time WebGL.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button
            variant="accent"
            size="lg"
            onClick={() => onNavigate('/3d')}
            icon={<Box className="w-4 h-4 text-[#171513]" />}
          >
            Launch 3D Model Viewer
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={() => onNavigate('/explore')}
            icon={<ArrowRight className="w-4 h-4 text-[#8B2635]" />}
          >
            Trace The 9-Stage Thread
          </Button>
        </div>

        {/* Feature badge strip */}
        <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-stone-400 font-editorial">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>GLB / GLTF Photogrammetry</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>OrbitControls & Wireframe</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            <span>AI Assistant Interface Ready</span>
          </div>
        </div>
      </div>
    </section>
  );
};
