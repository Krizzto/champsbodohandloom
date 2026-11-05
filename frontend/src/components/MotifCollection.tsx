import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Box, Compass, Sparkles } from 'lucide-react';
import { useMuseumStore } from '../store/museumStore';
import { useContentStore } from '../store/contentStore';
import { ImageChangeButton } from './ImageChangeButton';
import { Motif } from '../types';

export const MotifCollection: React.FC = () => {
  const {
    selectedMotifId,
    setSelectedMotifId,
    open3DViewer,
    openAR,
    openAIPanelWithContext,
  } = useMuseumStore();

  const {
    motifs,
    siteContent,
    artifacts,
    customImages,
    isEditModeActive,
  } = useContentStore();

  const agorContent = siteContent.agorSection;

  // Find active motif in contentStore motifs
  const currentMotif = motifs.find((m) => m.id === selectedMotifId) || motifs[0] || {
    id: 'hajw-agor',
    name: 'Hajw Agor',
    bodoName: 'हाजो आगोर (Hajw Agor)',
    translation: 'Mountain Motif',
    meaning: 'Depicts sacred hills and endurance.',
    description: 'Traditional motif frequently woven on the borders of Dokhona Thaosi and ceremonial Aronai. It honors the ancient geography of Bodoland.',
    culturalSignificance: 'Traditional motif on Dokhona borders.',
    textileAssociation: 'Dokhona, Aronai, Jwmgra',
    wovenIn: 'Dokhona, Aronai, Jwmgra',
    image: '/assets/images/motifs/motif-01.jpg',
    imageUrl: '/assets/images/motifs/motif-01.jpg',
    colorway: { bg: '#8B1E3F', pattern: '#FFE600', accent: '#2B6E44' },
    symbolism: ['Elevation', 'Steadfastness', 'Ancestral Horizon'],
  };

  const currentIndex = Math.max(0, motifs.findIndex((m) => m.id === currentMotif.id));

  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + motifs.length) % motifs.length;
    setSelectedMotifId(motifs[prevIdx].id);
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % motifs.length;
    setSelectedMotifId(motifs[nextIdx].id);
  };

  const handleOpen3D = () => {
    const textileArtifact = artifacts.find((a) => a.id === 'dokhona-thaosi') || artifacts[0];
    if (textileArtifact) open3DViewer(textileArtifact, 'textile');
  };

  const handleOpenAR = () => {
    const textileArtifact = artifacts.find((a) => a.id === 'dokhona-thaosi') || artifacts[0];
    if (textileArtifact) openAR(textileArtifact);
  };

  // Helper to resolve the exact existing image path for an Agor item
  const getMotifImageUrl = (motif: Motif): string => {
    return (
      customImages[`motif-photo-${motif.id}`] ||
      customImages[motif.id] ||
      motif.image ||
      motif.imageUrl ||
      `/assets/images/motifs/${motif.id}.jpg`
    );
  };

  const currentMotifImage = getMotifImageUrl(currentMotif);

  return (
    <section id="agor" className="py-20 md:py-28 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial 3-Column Layout matching reference */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT COLUMN: Editorial Typography & Cultural Context */}
          <div className="lg:col-span-4 flex flex-col space-y-6">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-editorial font-bold text-[#171513] leading-tight">
                {agorContent.heading || 'Collection of'} <br />
                <span className="yellow-highlight">{agorContent.highlightWord || 'agor'}</span>
              </h2>
              <p className="text-lg sm:text-xl font-editorial text-stone-700 italic mt-2">
                {agorContent.subtitle || '(Patterns and motifs...)'}
              </p>
            </div>

            <p className="text-sm sm:text-base text-stone-600 font-editorial leading-relaxed">
              {agorContent.description}
            </p>

            {/* Cultural Symbolism Card - dynamically updates with selected Agor */}
            <div className="p-4 rounded-xs bg-[#F4EFE6] border-l-3 border-[#8B1E3F] space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-wider text-stone-500 font-bold">
                  Sacred Cultural Symbolism
                </p>
                <span className="text-[11px] font-semibold text-[#8B1E3F]">
                  {currentMotif.name}
                </span>
              </div>

              {/* Existing Symbolism keywords */}
              {currentMotif.symbolism && (
                <div className="flex flex-wrap gap-1.5 py-0.5">
                  {Array.isArray(currentMotif.symbolism) ? (
                    currentMotif.symbolism.map((sym, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-white text-[#8B2635] border border-stone-200 shadow-2xs"
                      >
                        {sym}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-stone-700">{currentMotif.symbolism}</span>
                  )}
                </div>
              )}

              <p className="text-xs sm:text-sm italic font-editorial text-stone-800 leading-relaxed">
                &ldquo;{currentMotif.culturalSignificance || currentMotif.description || agorContent.symbolismQuote}&rdquo;
              </p>
            </div>

            {/* Selected Motif Metadata Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentMotif.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="p-5 rounded-lg border border-stone-200 bg-white shadow-xs space-y-3"
              >
                {/* Agor Name & local Bodo name */}
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="text-xl font-bold font-editorial text-[#171513]">
                    {currentMotif.name}
                  </h3>
                  {currentMotif.bodoName && (
                    <span className="text-xs text-stone-500 font-medium whitespace-nowrap">
                      {currentMotif.bodoName}
                    </span>
                  )}
                </div>

                {/* Meaning */}
                <div>
                  <p className="text-xs text-[#8B2635] font-semibold uppercase tracking-wider mb-0.5">
                    Meaning: {currentMotif.translation}
                  </p>
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-editorial">
                    {currentMotif.meaning}
                  </p>
                </div>

                {/* Description */}
                {(currentMotif.description || currentMotif.culturalSignificance) && (
                  <div className="pt-2 border-t border-stone-100">
                    <p className="text-xs text-stone-500 font-semibold uppercase tracking-wider mb-0.5">
                      Description
                    </p>
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-editorial">
                      {currentMotif.description || currentMotif.culturalSignificance}
                    </p>
                  </div>
                )}

                {/* Woven in */}
                <p className="text-xs text-stone-500 font-editorial italic pt-1 border-t border-stone-100">
                  Woven in: <span className="font-semibold text-stone-700">{currentMotif.wovenIn || currentMotif.textileAssociation}</span>
                </p>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    onClick={handleOpen3D}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#171513] text-white hover:bg-stone-800 text-xs font-medium transition-colors shadow-xs cursor-pointer"
                  >
                    <Box className="w-3.5 h-3.5" />
                    VIEW IN 3D
                  </button>

                  <button
                    onClick={handleOpenAR}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-stone-50 text-stone-800 text-xs font-medium border border-stone-300 transition-colors shadow-xs cursor-pointer"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    VIEW IN AR
                  </button>

                  <button
                    onClick={() =>
                      openAIPanelWithContext(
                        null,
                        `Tell me the origin and deep cultural significance of the ${currentMotif.name} (${currentMotif.bodoName}) in Bodo handloom.`
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFE600] text-black hover:bg-[#ebd300] text-xs font-semibold transition-colors shadow-xs cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    ASK AI
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* CENTER COLUMN: Large Vertical Agor Image Display on Pedestal (matching reference) */}
          <div className="lg:col-span-5 flex items-center justify-center relative">
            
            {/* Left navigation arrow pointer */}
            <button
              onClick={handlePrev}
              aria-label="Previous motif"
              className="absolute left-0 sm:-left-4 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#992B45] shadow-md flex items-center justify-center transition-transform hover:scale-110 active:scale-95 border border-stone-200 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Central Vertical Textile on Podium */}
            <div className="flex flex-col items-center w-full max-w-[320px] sm:max-w-[360px] relative group/central">
              {/* Change Image Button */}
              <div className={`absolute top-3 right-3 z-30 transition-opacity ${isEditModeActive ? 'opacity-100' : 'opacity-0 group-hover/central:opacity-100'}`}>
                <ImageChangeButton
                  imageKey={`motif-photo-${currentMotif.id}`}
                  label="CHANGE IMAGE"
                  variant="floating"
                />
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentMotif.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.4 }}
                  className="relative w-full aspect-9/16 rounded-t-lg overflow-hidden shadow-2xl border-4 border-stone-800 bg-[#780016]"
                >
                  {/* Large Central Agor Image */}
                  <img
                    src={currentMotifImage}
                    alt={currentMotif.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.currentTarget;
                      const src = target.src;
                      if (src.endsWith('.jpg')) {
                        target.src = src.replace(/\.jpg$/, '.JPG');
                      } else if (src.endsWith('.JPG')) {
                        target.src = src.replace(/\.JPG$/, '.png');
                      }
                    }}
                  />

                  {/* Top traditional inscription banner */}
                  <div className="absolute top-0 inset-x-0 bg-gradient-to-b from-black/80 via-black/40 to-transparent p-3 text-center z-10">
                    <p className="text-[10px] sm:text-xs text-white/90 font-editorial tracking-widest uppercase">
                      {currentMotif.name} &bull; {currentMotif.bodoName}
                    </p>
                  </div>

                  {/* Bottom Regional Inscription banner */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-3 text-center z-10">
                    <p className="text-[10px] sm:text-[11px] font-bold tracking-widest text-[#FFE600] uppercase">
                      {currentMotif.translation} &bull; BODOLAND, ASSAM, INDIA
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Pedestal / Podium matching reference */}
              <div className="w-full h-12 sm:h-14 -mt-2 rounded-b-2xl bg-gradient-to-r from-[#500010] via-[#A8183A] to-[#500010] shadow-xl flex items-center justify-center border-t border-white/20">
                <span className="text-[10px] tracking-widest text-white/70 font-semibold uppercase">
                  Sacred Handloom Archive
                </span>
              </div>
            </div>

            {/* Right navigation arrow pointer matching reference */}
            <button
              onClick={handleNext}
              aria-label="Next motif"
              className="absolute right-0 sm:-right-4 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#992B45] shadow-md flex items-center justify-center transition-transform hover:scale-110 active:scale-95 border border-stone-200 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* RIGHT COLUMN: 2-Column Agor Thumbnails Grid (matching reference) */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-[280px] mx-auto lg:max-w-none">
              {motifs.map((motif) => {
                const isSelected = motif.id === currentMotif.id;
                const thumbImage = getMotifImageUrl(motif);

                return (
                  <button
                    key={motif.id}
                    onClick={() => setSelectedMotifId(motif.id)}
                    className={`group relative aspect-square rounded-lg p-1.5 border-2 transition-all cursor-pointer overflow-hidden shadow-xs flex flex-col items-center justify-center ${
                      isSelected
                        ? 'border-[#FFE600] ring-3 ring-[#FFE600]/40 scale-102 bg-white'
                        : 'border-stone-300 hover:border-stone-500 bg-white/80'
                    }`}
                    title={`${motif.name} (${motif.bodoName})`}
                  >
                    <div className="w-full h-full rounded overflow-hidden relative">
                      <img
                        src={thumbImage}
                        alt={motif.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.currentTarget;
                          const src = target.src;
                          if (src.endsWith('.jpg')) {
                            target.src = src.replace(/\.jpg$/, '.JPG');
                          } else if (src.endsWith('.JPG')) {
                            target.src = src.replace(/\.JPG$/, '.png');
                          }
                        }}
                      />
                      {/* Name label on thumbnail */}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white text-[9px] sm:text-[10px] py-1 text-center truncate px-1">
                        {motif.name}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-stone-500 font-editorial italic text-center mt-3">
              Click any Agor thumbnail to inspect patterns, meanings, and 3D preview.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
