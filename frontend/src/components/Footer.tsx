import React from 'react';
import { BodoLogo } from './CulturalVisuals';
import { useMuseumStore } from '../store/museumStore';

export const Footer: React.FC = () => {
  const { toggleAIPanel, openVRMuseum } = useMuseumStore();

  return (
    <footer className="bg-[#171513] text-[#FAF8F5] py-16 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-stone-800">
          
          {/* Brand & Purpose */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <BodoLogo className="w-10 h-10 bg-white" />
              <div>
                <span className="font-bold text-lg tracking-tight block">
                  BODO VR MUSEUM
                </span>
                <span className="text-xs text-stone-400">
                  Digital Cultural Heritage & Handloom Archive
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-400 font-editorial leading-relaxed max-w-sm">
              Preserving traditional knowledge, sacred Agor motifs, botanical dyeing techniques, and oral histories of the Bodo weaving community of Assam, Northeast India.
            </p>
          </div>

          {/* Cultural Navigation */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FFE600] block">
              Curated Galleries
            </span>
            <ul className="space-y-2 text-xs text-stone-300 font-editorial">
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  About Handloom Heritage
                </a>
              </li>
              <li>
                <a href="#agor" className="hover:text-white transition-colors">
                  Collection of Agor (Motifs)
                </a>
              </li>
              <li>
                <a href="#dyeing" className="hover:text-white transition-colors">
                  Collection of Dyeing
                </a>
              </li>
              <li>
                <a href="#weaver" className="hover:text-white transition-colors">
                  Meet the Weaver Archive
                </a>
              </li>
              <li>
                <a href="#process" className="hover:text-white transition-colors">
                  The Journey of a Thread
                </a>
              </li>
              <li>
                <a href="#museum" className="hover:text-white transition-colors">
                  Artifact Repository
                </a>
              </li>
            </ul>
          </div>

          {/* Spatial & AI Access */}
          <div className="md:col-span-4 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FFE600] block">
              Immersive Experiences
            </span>
            <div className="space-y-2">
              <button
                onClick={openVRMuseum}
                className="w-full text-left px-4 py-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-800 text-xs font-medium transition-colors flex items-center justify-between cursor-pointer"
              >
                <span>Enter VR Museum Hall</span>
                <span className="text-[10px] text-[#FFE600]">WebXR 3D</span>
              </button>

              <button
                onClick={toggleAIPanel}
                className="w-full text-left px-4 py-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-800 text-xs font-medium transition-colors flex items-center justify-between cursor-pointer"
              >
                <span>Consult Bodo AI Assistant</span>
                <span className="text-[10px] text-[#FFE600]">RAG Ready</span>
              </button>
            </div>
            <p className="text-[11px] text-stone-500 font-editorial italic pt-2">
              All cultural data grounded in verified ethnological field studies in Kokrajhar, Bodoland Territorial Region.
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Bodo VR Museum · In reverence to the master weavers of Bodoland.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-stone-300">Central Institute of Technology Kokrajhar</span>
            <span>·</span>
            <span className="hover:text-stone-300">Northeast India Tribal Archives</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
