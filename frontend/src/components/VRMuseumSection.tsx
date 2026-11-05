import React from 'react';
import { motion } from 'motion/react';
import { Compass, Sparkles, Eye, Move } from 'lucide-react';
import { useMuseumStore } from '../store/museumStore';

export const VRMuseumSection: React.FC = () => {
  const { openVRMuseum, openAIPanelWithContext } = useMuseumStore();

  return (
    <section id="vr" className="relative py-24 md:py-32 bg-[#121110] text-white overflow-hidden">
      {/* Background Architectural Atmosphere */}
      <div className="absolute inset-0 opacity-40">
        <svg viewBox="0 0 1440 800" className="w-full h-full object-cover" preserveAspectRatio="xMidYMid slice">
          {/* Spatial museum hall wireframe perspective */}
          <line x1="0" y1="800" x2="720" y2="400" stroke="#FFE600" strokeWidth="1" strokeOpacity="0.3" />
          <line x1="1440" y1="800" x2="720" y2="400" stroke="#FFE600" strokeWidth="1" strokeOpacity="0.3" />
          <line x1="0" y1="0" x2="720" y2="400" stroke="#FAF8F5" strokeWidth="1" strokeOpacity="0.2" />
          <line x1="1440" y1="0" x2="720" y2="400" stroke="#FAF8F5" strokeWidth="1" strokeOpacity="0.2" />
          {/* Spatial Grid Floor */}
          {[100, 200, 300, 450, 600, 750].map((y) => (
            <line key={y} x1="0" y1={y} x2="1440" y2={y} stroke="#FAF8F5" strokeWidth="1" strokeOpacity="0.08" />
          ))}
          {/* Glowing Pedestals */}
          <circle cx="720" cy="400" r="180" fill="none" stroke="#FFE600" strokeWidth="2" strokeOpacity="0.4" />
          <circle cx="720" cy="400" r="90" fill="#FFE600" fillOpacity="0.05" />
        </svg>
      </div>

      {/* Atmospheric Vignette */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#121110]/80 to-[#121110]" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs text-[#FFE600] font-semibold uppercase tracking-wider"
        >
          <Compass className="w-4 h-4" />
          WebXR Spatial Computing
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-editorial font-bold tracking-tight text-white"
        >
          Explore the <span className="yellow-highlight text-black">Heritage Village</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-lg sm:text-xl text-stone-300 font-editorial italic max-w-2xl mx-auto leading-relaxed"
        >
          &ldquo;Walk through an interactive 3D outdoor Bodo village in Assam — traditional bamboo houses, handloom weaving sheds, silk tools, and authentic cultural artifacts.&rdquo;
        </motion.p>

        {/* Gallery Zone Pills */}
        <div className="flex flex-wrap justify-center gap-2 pt-2 text-xs text-stone-400">
          <span className="px-3 py-1 rounded bg-white/5 border border-white/10">VILLAGE ENTRANCE</span>
          <span className="text-stone-600">→</span>
          <span className="px-3 py-1 rounded bg-white/5 border border-white/10">TRADITIONAL HOMESTEAD</span>
          <span className="text-stone-600">→</span>
          <span className="px-3 py-1 rounded bg-white/5 border border-white/10">HANDLOOM WORKSHOP</span>
          <span className="text-stone-600">→</span>
          <span className="px-3 py-1 rounded bg-white/5 border border-white/10">TEXTILE GALLERY</span>
          <span className="text-stone-600">→</span>
          <span className="px-3 py-1 rounded bg-white/5 border border-white/10">TOOLS & MATERIALS</span>
          <span className="text-stone-600">→</span>
          <span className="px-3 py-1 rounded bg-white/5 border border-white/10">MOTIF & DYEING</span>
        </div>

        {/* Action Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={openVRMuseum}
            className="w-full sm:w-auto px-10 py-4 rounded-full bg-[#FFE600] hover:bg-[#F0D500] text-black font-bold text-sm tracking-wider uppercase transition-transform hover:scale-105 active:scale-95 shadow-xl cursor-pointer flex items-center justify-center gap-2.5 font-editorial"
          >
            <Compass className="w-5 h-5" />
            ENTER HERITAGE VILLAGE
          </button>

          <button
            onClick={() =>
              openAIPanelWithContext(
                null,
                'What can I experience inside the Bodo Heritage Village outdoor spatial environment?'
              )
            }
            className="w-full sm:w-auto px-6 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold tracking-wider transition-colors border border-white/20 cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#FFE600]" />
            Ask AI about Village Areas
          </button>
        </motion.div>

        {/* Device compatibility notice */}
        <div className="pt-4 flex items-center justify-center gap-6 text-[11px] text-stone-400">
          <span className="flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-[#FFE600]" /> Meta Quest / Apple Vision Pro / WebXR
          </span>
          <span className="flex items-center gap-1.5">
            <Move className="w-3.5 h-3.5 text-[#FFE600]" /> Desktop 3D Navigation Fallback Included
          </span>
        </div>
      </div>
    </section>
  );
};
