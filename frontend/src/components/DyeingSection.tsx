import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle2, ChevronLeft, ChevronRight, Flame, Wind, Droplets, Filter, Waves, X, ZoomIn } from 'lucide-react';
import { useMuseumStore } from '../store/museumStore';
import { useContentStore } from '../store/contentStore';
import { DocumentaryImage } from './CulturalVisuals';
import { ImageChangeButton } from './ImageChangeButton';
import { HeritageImage } from './ui/HeritageImage';
import { DyeingImageRecord } from '../types';

// Documented traditional colours from Bodo Knowledge Repository
const DOCUMENTED_COLOURS = [
  { name: 'Red', hex: '#9B2226' },
  { name: 'Yellow', hex: '#E9B44C' },
  { name: 'Reddish Yellow', hex: '#D05A3F' },
  { name: 'Green', hex: '#386641' },
  { name: 'Black', hex: '#1B1B1E' },
  { name: 'Blue', hex: '#1D3557' },
];

/**
 * Authentic Craft Process Visual for each of the 5 Documented Stages
 */
const DyeingStageCraftVisual: React.FC<{ stageId: string; order: number }> = ({ stageId, order }) => {
  switch (order) {
    case 1:
      // STAGE 1: Preparation of Yarn for Dyeing (Alum dissolving in boiling water + yarn immersion; no dye)
      return (
        <div className="relative w-full h-56 sm:h-64 bg-gradient-to-b from-[#F2ECE1] to-[#E5DDD0] rounded-xl overflow-hidden flex flex-col items-center justify-center p-4 border border-stone-300/80 shadow-inner">
          <div className="absolute top-2 left-3 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/80 border border-stone-200 text-[10px] font-bold text-stone-700 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Mordanting • No Dye Applied
          </div>

          <div className="relative flex flex-col items-center mt-2">
            {/* Rising steam waves */}
            <div className="flex gap-3 mb-1 text-stone-400 opacity-70">
              <span className="text-xs animate-bounce" style={{ animationDelay: '0ms' }}>♨</span>
              <span className="text-sm animate-bounce" style={{ animationDelay: '200ms' }}>♨</span>
              <span className="text-xs animate-bounce" style={{ animationDelay: '400ms' }}>♨</span>
            </div>

            {/* Boiling Vessel */}
            <div className="relative w-36 h-28 bg-[#4A3B32] rounded-b-3xl rounded-t-lg border-2 border-[#2E241E] shadow-lg flex flex-col items-center justify-between p-2 overflow-hidden">
              {/* Rim */}
              <div className="w-full h-3 bg-[#634F43] rounded-t border-b border-black/30" />
              
              {/* Boiling Water solution */}
              <div className="w-full h-20 bg-gradient-to-b from-[#D4E4EC] via-[#B8D3E0] to-[#9CBECF] rounded-b-2xl relative flex items-center justify-center overflow-hidden">
                {/* Dissolved Alum (Fitkaari) crystals representation */}
                <div className="absolute inset-0 flex items-center justify-around opacity-60">
                  <div className="w-2 h-2 rotate-45 bg-white border border-stone-300 animate-pulse" />
                  <div className="w-1.5 h-1.5 rotate-12 bg-white border border-stone-300 animate-pulse" style={{ animationDelay: '300ms' }} />
                  <div className="w-2 h-2 rotate-45 bg-white border border-stone-300 animate-pulse" style={{ animationDelay: '600ms' }} />
                </div>

                {/* Natural White/Ecru Yarn being immersed */}
                <div className="w-20 h-16 border-4 border-dashed border-[#FDFBF7] rounded-full opacity-90 shadow-sm flex items-center justify-center">
                  <span className="text-[9px] font-bold text-stone-600 bg-white/90 px-1 rounded shadow-2xs">
                    Natural Yarn
                  </span>
                </div>
              </div>
            </div>

            {/* Firewood / Heat Source below pot */}
            <div className="flex items-center gap-1.5 mt-1">
              <Flame className="w-4 h-4 text-amber-600 animate-pulse" />
              <div className="flex gap-1">
                <span className="w-6 h-1.5 bg-[#593D28] rounded-full" />
                <span className="w-7 h-1.5 bg-[#422C1C] rounded-full" />
                <span className="w-6 h-1.5 bg-[#593D28] rounded-full" />
              </div>
              <Flame className="w-4 h-4 text-red-500 animate-pulse" />
            </div>
          </div>

          <div className="mt-2 text-center">
            <span className="text-[11px] font-semibold text-stone-700">
              Alum (Fitkaari) Dissolves in Boiling Water → Yarn Immersed
            </span>
          </div>
        </div>
      );

    case 2:
      // STAGE 2: Extraction of Dyes (Barks, Leaves, Roots boiling in water; pigments released into potion; NO yarn)
      return (
        <div className="relative w-full h-56 sm:h-64 bg-gradient-to-b from-[#F3EBE1] to-[#E2D2BE] rounded-xl overflow-hidden flex flex-col items-center justify-center p-4 border border-stone-300/80 shadow-inner">
          <div className="absolute top-2 left-3 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/80 border border-stone-200 text-[10px] font-bold text-stone-700 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
            Pigment Extraction • No Yarn in Vessel
          </div>

          <div className="relative flex flex-col items-center mt-2">
            {/* Boiling Steam & Vigorous Heat */}
            <div className="flex gap-2 mb-1 text-amber-700 opacity-80">
              <span className="text-sm animate-bounce" style={{ animationDelay: '100ms' }}>♨</span>
              <span className="text-base animate-bounce" style={{ animationDelay: '300ms' }}>♨</span>
              <span className="text-sm animate-bounce" style={{ animationDelay: '500ms' }}>♨</span>
            </div>

            {/* Boiling Cauldron */}
            <div className="relative w-38 h-28 bg-[#3E2723] rounded-b-3xl rounded-t-lg border-2 border-[#1B0000] shadow-xl flex flex-col items-center justify-between p-2 overflow-hidden">
              <div className="w-full h-3 bg-[#4E342E] rounded-t border-b border-black/40" />

              {/* Concentrated Dye Potion Liquid */}
              <div className="w-full h-20 bg-gradient-to-b from-[#BF360C] via-[#A02808] to-[#6E1A04] rounded-b-2xl relative flex items-center justify-center p-1 overflow-hidden">
                {/* Botanicals releasing pigments (barks, leaves, roots) */}
                <div className="flex items-center justify-center gap-2">
                  {/* Bark slice */}
                  <div className="w-6 h-3 bg-[#5D4037] border border-[#3E2723] rounded-sm transform -rotate-12 shadow-xs" title="Tree bark" />
                  {/* Root chunk */}
                  <div className="w-5 h-4 bg-[#8D6E63] border border-[#4E342E] rounded-full transform rotate-45 shadow-xs" title="Roots" />
                  {/* Forest leaves */}
                  <div className="w-5 h-3 bg-[#33691E] border border-[#1B5E20] rounded-tl-full rounded-br-full transform rotate-12 shadow-xs" title="Leaves" />
                </div>

                {/* Pigment diffusion swirls */}
                <div className="absolute inset-0 bg-radial from-[#FF7043]/30 via-transparent to-transparent animate-pulse" />
              </div>
            </div>

            {/* Active Firewood Hearth */}
            <div className="flex items-center gap-2 mt-1">
              <Flame className="w-5 h-5 text-orange-600 animate-pulse" />
              <Flame className="w-4 h-4 text-amber-500 animate-bounce" />
              <Flame className="w-5 h-5 text-red-600 animate-pulse" />
            </div>
          </div>

          <div className="mt-2 text-center">
            <span className="text-[11px] font-semibold text-stone-700">
              Gathered Botanicals Boiled in Water → Concentrated Dye Potion
            </span>
          </div>
        </div>
      );

    case 3:
      // STAGE 3: Straining the Dyed Potion (Filtering solid debris, adjusting colour strength before yarn)
      return (
        <div className="relative w-full h-56 sm:h-64 bg-gradient-to-b from-[#F5EFE6] to-[#E5D7C6] rounded-xl overflow-hidden flex flex-col items-center justify-center p-4 border border-stone-300/80 shadow-inner">
          <div className="absolute top-2 left-3 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/80 border border-stone-200 text-[10px] font-bold text-stone-700 uppercase tracking-wider">
            <Filter className="w-3 h-3 text-[#8B2635]" />
            Treating & Straining • Debris Removed
          </div>

          <div className="relative flex flex-col items-center mt-3">
            {/* Top Pouring / Extracted Potion */}
            <div className="w-24 h-4 bg-[#BF360C] rounded-t-md opacity-90 border-t border-x border-[#870000]" />

            {/* Fine Straining Cloth / Mesh Sieve */}
            <div className="w-28 h-5 bg-gradient-to-r from-stone-200 via-stone-100 to-stone-200 border-2 border-stone-400 rounded-sm flex items-center justify-center relative shadow-sm">
              <div className="flex gap-1 text-[8px] text-stone-500 font-mono tracking-widest">
                ••••••••••
              </div>
              {/* Captured debris */}
              <div className="absolute -top-1 w-14 h-1.5 bg-[#4E342E]/70 rounded-full" />
            </div>

            {/* Filtered Liquid Stream */}
            <div className="w-3 h-8 bg-gradient-to-b from-[#8B2635] to-[#B22222] my-0.5 rounded-full animate-pulse" />

            {/* Lower Settling & Treatment Pot (Pure stabilized dye bath) */}
            <div className="relative w-34 h-20 bg-[#5A3825] rounded-b-2xl rounded-t-md border-2 border-[#381E10] shadow-md flex flex-col items-center justify-end p-1.5 overflow-hidden">
              {/* Pure Clear Dye Bath */}
              <div className="w-full h-14 bg-gradient-to-b from-[#9E1B32] via-[#7B1113] to-[#500002] rounded-b-xl flex items-center justify-center">
                <span className="text-[9px] font-bold text-amber-200 tracking-wide bg-black/30 px-2 py-0.5 rounded">
                  Rich Stabilized Dye Bath
                </span>
              </div>
            </div>
          </div>

          <div className="mt-2 text-center">
            <span className="text-[11px] font-semibold text-stone-700">
              Plant Residue Strained Out → Liquid Treated to Required Strength
            </span>
          </div>
        </div>
      );

    case 4:
      // STAGE 4: Application of Dyes to the Yarn (Mordanted yarn enters dye bath, simmering, turning & pressing, uniform absorption)
      return (
        <div className="relative w-full h-56 sm:h-64 bg-gradient-to-b from-[#F7ECE4] to-[#E9D6C8] rounded-xl overflow-hidden flex flex-col items-center justify-center p-4 border border-stone-300/80 shadow-inner">
          <div className="absolute top-2 left-3 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/80 border border-stone-200 text-[10px] font-bold text-stone-700 uppercase tracking-wider">
            <Waves className="w-3 h-3 text-[#A64B2A]" />
            Dye Application • Simmer & Turn
          </div>

          <div className="relative flex flex-col items-center mt-2">
            {/* Turning Sticks manipulating the yarn */}
            <div className="flex gap-4 mb-0.5">
              <div className="w-1.5 h-10 bg-[#D4A373] border border-[#8C6239] rounded-full transform -rotate-15 shadow-xs" />
              <div className="w-1.5 h-10 bg-[#D4A373] border border-[#8C6239] rounded-full transform rotate-15 shadow-xs" />
            </div>

            {/* Simmering Dye Cauldron */}
            <div className="relative w-38 h-28 bg-[#422C1C] rounded-b-3xl rounded-t-lg border-2 border-[#251508] shadow-lg flex flex-col items-center justify-between p-2 overflow-hidden">
              <div className="w-full h-3 bg-[#5C3D28] rounded-t border-b border-black/30" />

              {/* Deep Pigment Bath with Immersed Yarn */}
              <div className="w-full h-20 bg-gradient-to-b from-[#A64B2A] via-[#8B2635] to-[#5C1D24] rounded-b-2xl relative flex items-center justify-center overflow-hidden">
                {/* Yarn Hank undergoing uniform absorption */}
                <div className="w-22 h-14 border-4 border-[#E9C46A] bg-[#E76F51]/60 rounded-full shadow-inner flex items-center justify-center animate-pulse">
                  <span className="text-[9px] font-bold text-white tracking-wider bg-black/40 px-1.5 py-0.5 rounded">
                    Colour Absorbing
                  </span>
                </div>
              </div>
            </div>

            {/* Gentle Simmer Embers */}
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              <span className="w-8 h-1.5 bg-[#422C1C] rounded-full" />
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            </div>
          </div>

          <div className="mt-2 text-center">
            <span className="text-[11px] font-semibold text-stone-700">
              Simmering & Repeated Turning → Uniform Colour Absorption
            </span>
          </div>
        </div>
      );

    case 5:
      // STAGE 5: Drying the Dyed Yarn (Hung on bamboo racks in shaded well-ventilated area, protected from direct sun)
      return (
        <div className="relative w-full h-56 sm:h-64 bg-gradient-to-b from-[#EFF3F6] to-[#DCE5EB] rounded-xl overflow-hidden flex flex-col items-center justify-center p-4 border border-stone-300/80 shadow-inner">
          <div className="absolute top-2 left-3 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/80 border border-stone-200 text-[10px] font-bold text-stone-700 uppercase tracking-wider">
            <Wind className="w-3 h-3 text-[#185ADB]" />
            Shaded Aeration • UV Protected
          </div>

          <div className="relative flex flex-col items-center w-full max-w-[260px] mt-1">
            {/* Shaded Veranda Roof Structure */}
            <div className="w-full h-3 bg-[#6D5947] rounded-sm border-b-2 border-[#4A3C30] flex items-center justify-center">
              <span className="text-[8px] font-bold uppercase tracking-widest text-white/90">
                Shaded & Well-Ventilated Veranda
              </span>
            </div>

            {/* Suspended Bamboo Hanging Pole */}
            <div className="w-5/6 h-2 bg-[#D4A373] border border-[#A67C52] rounded-full my-2 shadow-xs" />

            {/* Dyed Yarn Hanks Hanging to Dry */}
            <div className="flex justify-around w-full px-2 gap-2">
              {/* Red Hank */}
              <div className="flex flex-col items-center">
                <div className="w-7 h-20 bg-gradient-to-b from-[#9B2226] via-[#B22222] to-[#800F14] rounded-b-xl border border-black/20 shadow-sm animate-pulse" />
                <span className="text-[8px] font-bold text-stone-600 mt-1">Red</span>
              </div>
              {/* Yellow Hank */}
              <div className="flex flex-col items-center">
                <div className="w-7 h-20 bg-gradient-to-b from-[#E9B44C] via-[#F4A261] to-[#E76F51] rounded-b-xl border border-black/20 shadow-sm animate-pulse" style={{ animationDelay: '150ms' }} />
                <span className="text-[8px] font-bold text-stone-600 mt-1">Yellow</span>
              </div>
              {/* Green Hank */}
              <div className="flex flex-col items-center">
                <div className="w-7 h-20 bg-gradient-to-b from-[#386641] via-[#2D5A27] to-[#1E3F20] rounded-b-xl border border-black/20 shadow-sm animate-pulse" style={{ animationDelay: '300ms' }} />
                <span className="text-[8px] font-bold text-stone-600 mt-1">Green</span>
              </div>
              {/* Blue Hank */}
              <div className="flex flex-col items-center">
                <div className="w-7 h-20 bg-gradient-to-b from-[#1D3557] via-[#2A4D69] to-[#13293D] rounded-b-xl border border-black/20 shadow-sm animate-pulse" style={{ animationDelay: '450ms' }} />
                <span className="text-[8px] font-bold text-stone-600 mt-1">Blue</span>
              </div>
            </div>

            {/* Gentle Wind Indicator */}
            <div className="flex items-center gap-1 text-[10px] text-stone-500 italic mt-2">
              <Wind className="w-3 h-3 text-[#185ADB]" />
              <span>Gentle breeze cures thread for loom</span>
            </div>
          </div>

          <div className="mt-1 text-center">
            <span className="text-[11px] font-semibold text-stone-700">
              Shaded Drying Prevents Sun Bleaching → Ready for Weaving
            </span>
          </div>
        </div>
      );

    default:
      return null;
  }
};

export const DyeingSection: React.FC = () => {
  const { selectedDyeingStepId, setSelectedDyeingStepId, openAIPanelWithContext } = useMuseumStore();
  const { siteContent, dyeingSteps, dyeingImages, customImages, isEditModeActive } = useContentStore();
  const [selectedPreviewImage, setSelectedPreviewImage] = useState<DyeingImageRecord | null>(null);

  const publishedImages = dyeingImages
    .filter((img) => img.published)
    .sort((a, b) => a.order - b.order);

  // Requirement: Limit the Dyeing Image Archive to a maximum of 4 images, sourced from the existing Dyeing folder
  const archiveImages = publishedImages.slice(0, 4);

  const dyeingContent = siteContent.dyeingSection;

  // Find active step among dyeingSteps (exactly 5 sequential stages)
  const currentStep =
    dyeingSteps.find((s) => s.id === selectedDyeingStepId) ||
    dyeingSteps[0] || {
      id: 'stage-1-preparation',
      stage: 'Stage 1 of 5',
      title: 'Preparation of Yarn for Dyeing',
      bodoTitle: 'खुन साजायनाय (Mordanting with Alum)',
      description:
        'Alum (Fitkaari) is dissolved in a pot of boiling water. The yarn is immersed in the alum solution. This is the mordanting stage before dyeing. Alum acts as a mordant and helps the yarn fibres bond more effectively with the natural dye.',
      ingredients: ['Natural yarn', 'Alum (Fitkaari)', 'Boiling water'],
      toolsUsed: ['Boiling vessel / pot', 'Stirring rod', 'Heat source'],
      botanicalSource: 'Alum (Fitkaari) mineral mordant',
      colorOutcome: 'Mordanted natural yarn ready for dyeing',
      colorHex: '#E5DFD5',
      traditionalWisdom:
        'Alum acts as a mordant and helps the yarn fibres bond more effectively with the natural dye.',
      order: 1,
      materials: ['Yarn', 'Alum (Fitkaari)', 'Water'],
      processFlow: [
        'Alum (Fitkaari) is dissolved in a pot of boiling water',
        'The yarn is immersed in the alum solution',
        'Mordanting stage prepares fibres for dye bonding',
      ],
    };

  const currentIndex = Math.max(0, dyeingSteps.findIndex((s) => s.id === currentStep.id));
  const currentOrder = currentStep.order || currentIndex + 1;

  const handlePrev = () => {
    if (currentIndex > 0) {
      setSelectedDyeingStepId(dyeingSteps[currentIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (currentIndex < dyeingSteps.length - 1) {
      setSelectedDyeingStepId(dyeingSteps[currentIndex + 1].id);
    }
  };

  return (
    <section id="dyeing" className="py-20 md:py-28 bg-[#FAF8F5] text-[#171513]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* TOP SECTION: Editorial Header & Photograph Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Heading, Subtitle & Introduction */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-editorial font-bold text-[#171513] leading-tight">
                {dyeingContent.heading || 'Collection of'} <br />
                <span className="yellow-highlight">{dyeingContent.highlightWord || 'dyeing'}</span>
              </h2>
              <p className="text-base sm:text-lg font-editorial text-stone-800 italic mt-3 font-semibold leading-snug">
                &ldquo;{dyeingContent.subtitle || 'One of the most important creative and lucrative arts of the Bodos is colouring the thread.'}&rdquo;
              </p>
            </div>

            <p className="text-sm sm:text-base text-stone-700 font-editorial leading-relaxed">
              {dyeingContent.description}
            </p>

            {/* Documented Traditional Colours Palette */}
            <div className="p-3.5 bg-[#F4EFE6] rounded-lg border border-stone-200 space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-600">
                Documented Traditional Colours in Bodo Handloom:
              </p>
              <div className="flex flex-wrap gap-2">
                {DOCUMENTED_COLOURS.map((col) => (
                  <div
                    key={col.name}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-stone-300 shadow-2xs text-xs font-medium text-stone-800"
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-black/20 shrink-0"
                      style={{ backgroundColor: col.hex }}
                    />
                    <span>{col.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Documented Core Materials */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-stone-600">
              <span className="font-bold text-stone-800 uppercase text-[10px] tracking-wider">Documented Materials:</span>
              <span className="px-2 py-0.5 bg-stone-100 border border-stone-200 rounded">Yarn</span>
              <span className="px-2 py-0.5 bg-stone-100 border border-stone-200 rounded">Alum (Fitkaari)</span>
              <span className="px-2 py-0.5 bg-stone-100 border border-stone-200 rounded">Barks, Leaves, Roots</span>
            </div>

            <div className="pt-1">
              <button
                onClick={() =>
                  openAIPanelWithContext(
                    null,
                    'Explain the 5 documented stages of traditional Bodo thread dyeing from the Bodo Knowledge Repository: Preparation with Alum, Extraction of Dyes, Straining the Potion, Application to Yarn, and Shaded Drying.'
                  )
                }
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#0F4C81] hover:text-black underline underline-offset-4 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FFE600] fill-[#FFE600]" />
                Ask AI about the 5 documented dyeing stages
              </button>
            </div>
          </div>

          {/* Right Column: Data-Driven Gallery of Dyeing Photographs */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-stone-200/80">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-600 font-mono">
                Dyeing Image Archive ({archiveImages.length} Photographs)
              </span>
              <span className="text-[11px] text-stone-400 font-mono hidden sm:inline">
                assets/images/dyeing/
              </span>
            </div>

            {archiveImages.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {archiveImages.map((img, idx) => (
                  <motion.div
                    key={img.id}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => setSelectedPreviewImage(img)}
                    className="group/card rounded-xl border border-stone-200/90 bg-white p-2.5 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div className="relative aspect-square rounded-lg overflow-hidden bg-[#F4EFE6] border border-stone-200">
                      <HeritageImage
                        src={img.url}
                        alt={img.title}
                        imageKey={img.id}
                        showChangeButton={true}
                        fallbackText={`${img.title} photo coming soon`}
                        className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                      />

                      {/* Zoom overlay badge */}
                      <div className="absolute inset-0 bg-black/35 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                        <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-xs text-white flex items-center gap-1.5 text-[11px] font-bold shadow-md">
                          <ZoomIn className="w-3.5 h-3.5 text-[#FFE600]" />
                          <span>Preview</span>
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 px-0.5">
                      <h4 className="text-xs font-bold text-stone-900 truncate" title={img.title}>
                        {img.title}
                      </h4>
                      {img.caption && (
                        <p className="text-[11px] text-stone-500 line-clamp-1 font-editorial mt-0.5" title={img.caption}>
                          {img.caption}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-white rounded-xl border border-dashed border-stone-300 text-stone-500">
                <p className="text-sm font-semibold">No dyeing photographs are currently published.</p>
                <p className="text-xs text-stone-400 mt-1">
                  Photos placed in the Dyeing archive folder will appear here.
                </p>
              </div>
            )}
          </div>

        </div>

        {/* INTERACTIVE DYEING STORY: 5 Documented Sequential Stages */}
        <div className="mt-16 pt-12 border-t border-stone-200">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs uppercase tracking-widest font-semibold text-stone-500">
              Bodo Knowledge Repository Methodology
            </span>
            <h3 className="text-2xl sm:text-3xl font-editorial font-bold text-[#171513] mt-1">
              Interactive Dyeing Story
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 font-editorial mt-1">
              The 5 documented sequential stages of colouring thread in traditional Bodo handloom.
            </p>
          </div>

          {/* Stepper Navigation: [1 Preparation] → [2 Extraction] → [3 Straining] → [4 Application] → [5 Drying] */}
          <div className="max-w-4xl mx-auto mb-6">
            <div className="flex items-center justify-between overflow-x-auto py-2 px-1 gap-2 no-scrollbar">
              {dyeingSteps.map((step, idx) => {
                const isActive = step.id === currentStep.id;
                const isPassed = idx < currentIndex;
                const stepNum = idx + 1;

                // Short clean stage labels for stepper
                const shortLabels = [
                  '1 Preparation',
                  '2 Extraction',
                  '3 Straining',
                  '4 Application',
                  '5 Drying',
                ];

                return (
                  <React.Fragment key={step.id}>
                    <button
                      onClick={() => setSelectedDyeingStepId(step.id)}
                      className={`flex items-center gap-2 shrink-0 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer border text-left ${
                        isActive
                          ? 'bg-[#171513] text-white border-[#171513] shadow-md ring-2 ring-[#FFE600]/60 scale-102'
                          : isPassed
                          ? 'bg-white hover:bg-stone-50 text-stone-800 border-stone-300 shadow-2xs'
                          : 'bg-white/80 hover:bg-stone-50 text-stone-600 border-stone-200 shadow-2xs'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                          isActive
                            ? 'bg-[#FFE600] text-black'
                            : isPassed
                            ? 'bg-stone-800 text-white'
                            : 'bg-stone-200 text-stone-700'
                        }`}
                      >
                        {stepNum}
                      </span>
                      <span className="text-xs font-bold whitespace-nowrap">
                        {shortLabels[idx] || step.title}
                      </span>
                    </button>

                    {idx < dyeingSteps.length - 1 && (
                      <ArrowRight className="w-3.5 h-3.5 text-stone-300 shrink-0 hidden md:block" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Stage Progress & Previous / Next Controls */}
            <div className="flex items-center justify-between mt-3 px-1">
              <span className="text-xs font-mono font-bold text-stone-500 uppercase tracking-wider">
                Stage {currentIndex + 1} of {dyeingSteps.length}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                    currentIndex === 0
                      ? 'opacity-40 cursor-not-allowed border-stone-200 text-stone-400 bg-stone-50'
                      : 'border-stone-300 hover:border-stone-800 bg-white text-stone-800 hover:bg-stone-50 shadow-2xs'
                  }`}
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                <button
                  onClick={handleNext}
                  disabled={currentIndex === dyeingSteps.length - 1}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                    currentIndex === dyeingSteps.length - 1
                      ? 'opacity-40 cursor-not-allowed border-stone-200 text-stone-400 bg-stone-50'
                      : 'border-[#171513] bg-[#171513] text-[#FAF8F5] hover:bg-stone-800 shadow-2xs'
                  }`}
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Stage Detail Showcase Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto bg-white border border-stone-300 rounded-2xl p-6 sm:p-8 shadow-sm relative group/step"
            >
              {/* Change stage photo button */}
              <div className={`absolute top-4 right-4 z-20 transition-opacity ${isEditModeActive ? 'opacity-100' : 'opacity-0 group-step:opacity-100'}`}>
                <ImageChangeButton
                  imageKey={`dyeing-step-${currentStep.id}`}
                  label="CHANGE STAGE PHOTO"
                  variant="compact"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                
                {/* Visual Craft Diagram Column */}
                <div className="md:col-span-5 flex flex-col space-y-4">
                  {customImages[`dyeing-step-${currentStep.id}`] ? (
                    <div className="w-full h-56 sm:h-64 rounded-xl overflow-hidden shadow-md border border-stone-300">
                      <img
                        src={customImages[`dyeing-step-${currentStep.id}`]}
                        alt={currentStep.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <DyeingStageCraftVisual stageId={currentStep.id} order={currentOrder} />
                  )}

                  {/* Stage Header & Bodo Title */}
                  <div className="text-center sm:text-left pt-1">
                    <span className="text-[11px] font-mono uppercase font-bold tracking-wider text-[#A64B2A] block">
                      {currentStep.stage}
                    </span>
                    <h4 className="text-xl sm:text-2xl font-editorial font-bold text-stone-900 mt-0.5">
                      {currentStep.title}
                    </h4>
                    {currentStep.bodoTitle && (
                      <p className="text-xs text-stone-500 font-medium mt-0.5">
                        {currentStep.bodoTitle}
                      </p>
                    )}
                  </div>
                </div>

                {/* Technical Craft Documentation & Process Flow */}
                <div className="md:col-span-7 space-y-4">
                  {/* Detailed Description from Source */}
                  <p className="text-sm sm:text-base text-stone-700 leading-relaxed font-editorial">
                    {currentStep.description}
                  </p>

                  {/* Documented 4-Step Process Flow for this stage */}
                  {currentStep.processFlow && currentStep.processFlow.length > 0 && (
                    <div className="bg-[#FAF8F5] p-3.5 rounded-lg border border-stone-200">
                      <p className="font-bold text-stone-800 uppercase tracking-wider text-[10px] mb-2">
                        Documented Stage Sequence
                      </p>
                      <ol className="space-y-1.5 text-xs text-stone-700">
                        {currentStep.processFlow.map((flowItem, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="w-4 h-4 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">
                              {i + 1}
                            </span>
                            <span>{flowItem}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {/* Materials & Tools Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                    <div className="bg-[#F8F5EE] p-3 rounded-lg border border-stone-200/80">
                      <p className="font-bold text-stone-800 uppercase tracking-wider text-[10px] mb-1.5">
                        Materials & Ingredients
                      </p>
                      <ul className="space-y-1 text-stone-600">
                        {currentStep.ingredients.map((ing, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#A64B2A]" />
                            {ing}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-[#F8F5EE] p-3 rounded-lg border border-stone-200/80">
                      <p className="font-bold text-stone-800 uppercase tracking-wider text-[10px] mb-1.5">
                        Tools & Vessels
                      </p>
                      <ul className="space-y-1 text-stone-600">
                        {currentStep.toolsUsed.map((tool, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#185ADB]" />
                            {tool}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Traditional Wisdom Note */}
                  <div className="p-3 bg-amber-50 border border-amber-200/90 rounded-lg flex items-start gap-2.5 text-xs text-amber-950">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Craft Principle: </span>
                      <span className="italic">{currentStep.traditionalWisdom}</span>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      {/* Lightbox / Enlarged Photograph Preview Modal */}
      <AnimatePresence>
        {selectedPreviewImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6"
            onClick={() => setSelectedPreviewImage(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#FAF8F5] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-stone-200 shadow-2xl relative flex flex-col"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedPreviewImage(null)}
                className="absolute top-3.5 right-3.5 z-20 p-2 rounded-full bg-black/75 hover:bg-black text-white hover:text-[#FFE600] transition-colors cursor-pointer border border-white/20 shadow-md"
                title="Close preview"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Image Preview Container */}
              <div className="relative aspect-4/3 w-full bg-stone-900 rounded-t-2xl overflow-hidden flex items-center justify-center">
                <HeritageImage
                  src={selectedPreviewImage.url}
                  alt={selectedPreviewImage.title}
                  imageKey={selectedPreviewImage.id}
                  showChangeButton={false}
                  fallbackText={`${selectedPreviewImage.title} photo coming soon`}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Image Details */}
              <div className="p-6 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold uppercase tracking-wider">
                    {selectedPreviewImage.category}
                  </span>
                  <span className="text-[11px] font-mono text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                    public/assets/images/dyeing/{selectedPreviewImage.filename}
                  </span>
                </div>

                <h3 className="text-xl font-bold font-editorial text-[#171513]">
                  {selectedPreviewImage.title}
                </h3>

                {selectedPreviewImage.caption && (
                  <p className="text-sm font-editorial font-semibold text-stone-700 italic">
                    &ldquo;{selectedPreviewImage.caption}&rdquo;
                  </p>
                )}

                {selectedPreviewImage.culturalDescription && (
                  <p className="text-xs sm:text-sm text-stone-600 font-editorial leading-relaxed">
                    {selectedPreviewImage.culturalDescription}
                  </p>
                )}

                {selectedPreviewImage.tags && selectedPreviewImage.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {selectedPreviewImage.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200 text-[10px] font-semibold text-stone-700"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
