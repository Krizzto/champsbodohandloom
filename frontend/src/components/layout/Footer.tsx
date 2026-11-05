import React from 'react';
import { footerLinks } from '../../data/navigation';
import { Sparkles, Compass, Box, BookOpen } from 'lucide-react';

export interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-[#171513] text-[#FAF8F5] pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-stone-800">
          
          {/* Brand & Cultural Mission */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#FFE600] flex items-center justify-center font-bold text-xs text-[#171513]">
                बद
              </div>
              <span className="font-editorial font-bold text-lg text-white">
                Bodo Handloom Digital Museum
              </span>
            </div>

            <p className="text-xs sm:text-sm text-stone-400 font-editorial leading-relaxed">
              A comprehensive digital cultural heritage platform preserving indigenous weaving traditions, Ahimsa Eri silk, sacred Agor motifs, and living master craftswomen of Northeast India.
            </p>

            <div className="p-3 bg-stone-900/80 rounded-xl border border-stone-800 text-xs text-stone-400 space-y-1">
              <span className="font-bold text-[#FFE600] block text-[11px] uppercase tracking-wider">
                Frontend Heritage Architecture
              </span>
              <p className="text-[11px]">
                Built with modular React, Three.js 3D inspection, and clean backend integration boundaries for future AI and AR/VR services.
              </p>
            </div>
          </div>

          {/* Column 2: Exhibitions */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FFE600] font-sans">
              Museum Accessions
            </h4>
            <ul className="space-y-2 text-xs">
              {footerLinks.exhibitions.map((item, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => onNavigate(item.path)}
                    className="text-stone-400 hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Explore */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FFE600] font-sans">
              Explore Lineage
            </h4>
            <ul className="space-y-2 text-xs">
              {footerLinks.explore.map((item, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => onNavigate(item.path)}
                    className="text-stone-400 hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Integration Points */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FFE600] font-sans">
              Future Integrations
            </h4>
            <ul className="space-y-2 text-xs">
              {footerLinks.futureIntegrations.map((item, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => onNavigate(item.path)}
                    className="text-stone-400 hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} Bodo Handloom Cultural Heritage Digital Museum. Frontend Only.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Kokrajhar • Chirang • Baksa • Udalguri</span>
            <span>•</span>
            <span className="text-stone-400">Assam, India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
