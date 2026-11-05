import React from 'react';
import { Compass, Box, Sparkles, ArrowRight, Layers } from 'lucide-react';
import { Button } from '../ui/Button';

export interface HomeHeroProps {
  onNavigate: (path: string) => void;
}

export const Hero: React.FC<HomeHeroProps> = ({ onNavigate }) => {
  return (
    <section className="relative w-full bg-[#FAF8F5] text-[#171513] py-16 sm:py-24 md:py-28 overflow-hidden">
      {/* Subtle organic cultural pattern and ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(#171513 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#FFE600]/15 blur-3xl rounded-full" />
        <div className="absolute bottom-10 right-10 w-[280px] h-[280px] bg-[#8B2635]/5 blur-3xl rounded-full" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        
        {/* Kicker badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-stone-300 shadow-2xs text-xs font-semibold uppercase tracking-wider text-stone-700">
          <span className="w-2 h-2 rounded-full bg-[#185ADB] animate-pulse" />
          <span>Cultural Heritage Digital Archive</span>
        </div>

        {/* Headline Typography */}
        <div className="space-y-2">
          <p className="hero-title-prefix font-display text-3xl sm:text-5xl md:text-6xl text-stone-800 font-bold tracking-tight">
            Welcome to
          </p>
          <h1 className="hero-title font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight text-[#171513]">
            Bodo handloom
          </h1>
          <div className="mt-1 sm:mt-2 inline-block">
            <span className="hero-title-highlight font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-[#171513] font-bold tracking-tight">
              heritage
            </span>
          </div>
        </div>

        {/* Narrative Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-stone-700 font-editorial italic max-w-2xl mx-auto leading-relaxed">
          &ldquo;Preserving the living knowledge, Ahimsa Eri silk lineage, sacred Agor geometry, and traditional craftsmanship of Northeast India.&rdquo;
        </p>

        {/* Primary Call to Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button
            variant="primary"
            size="lg"
            onClick={() => onNavigate('/museum')}
            icon={<ArrowRight className="w-4 h-4 text-[#FFE600]" />}
          >
            Explore Digital Museum
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={() => onNavigate('/explore')}
            icon={<Layers className="w-4 h-4 text-[#8B2635]" />}
          >
            The 9 Weaving Stages
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => onNavigate('/3d')}
            icon={<Box className="w-4 h-4 text-[#185ADB]" />}
          >
            3D Artifact Viewer
          </Button>
        </div>

        {/* Quick Launchpad to AI & AR/VR */}
        <div className="pt-6 max-w-xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          <button
            onClick={() => onNavigate('/ai')}
            className="flex items-start gap-3 p-3.5 bg-white rounded-xl border border-stone-200/90 shadow-2xs hover:shadow-xs hover:border-stone-300 transition-all text-left cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-[#185ADB]/10 flex items-center justify-center text-[#185ADB] shrink-0 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 text-[#185ADB]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-stone-900">Bodo Heritage AI</span>
                <span className="text-[9px] bg-stone-100 text-stone-600 px-1.5 py-0.2 rounded font-mono">UI</span>
              </div>
              <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                Knowledge assistant interface & expertise selectors
              </p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('/arvr')}
            className="flex items-start gap-3 p-3.5 bg-white rounded-xl border border-stone-200/90 shadow-2xs hover:shadow-xs hover:border-stone-300 transition-all text-left cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-[#8B2635]/10 flex items-center justify-center text-[#8B2635] shrink-0 group-hover:scale-105 transition-transform">
              <Compass className="w-4 h-4 text-[#8B2635]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-stone-900">AR & VR Integration</span>
                <span className="text-[9px] bg-stone-100 text-stone-600 px-1.5 py-0.2 rounded font-mono">UI</span>
              </div>
              <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                Launch points for real-world and VR exhibits
              </p>
            </div>
          </button>
        </div>

      </div>
    </section>
  );
};
