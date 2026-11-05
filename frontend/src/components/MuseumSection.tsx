import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Box, Compass, Sparkles, Eye, Info } from 'lucide-react';
import { Artifact } from '../types';
import { useMuseumStore } from '../store/museumStore';
import { useContentStore } from '../store/contentStore';
import { AgorMotifSVG, DocumentaryImage } from './CulturalVisuals';
import { ImageChangeButton } from './ImageChangeButton';
import { HeritageImage } from './ui/HeritageImage';

const CATEGORIES = ['ALL', 'TOOLS', 'TEXTILES', 'MOTIFS', 'DYEING', 'LOOMS', 'MATERIALS'] as const;

export const MuseumSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedArtifactForDetail, setSelectedArtifactForDetail] = useState<Artifact | null>(null);

  const { open3DViewer, openAR, openAIPanelWithContext } = useMuseumStore();
  const { siteContent, artifacts, customImages, isEditModeActive } = useContentStore();
  const museumContent = siteContent.museumSection;

  const filteredArtifacts =
    selectedCategory === 'ALL'
      ? artifacts
      : artifacts.filter((a) => a.category === selectedCategory);

  const handleOpen3D = (artifact: Artifact) => {
    let modelType: 'bobbin' | 'loom' | 'shuttle' | 'spindle' | 'textile' = 'textile';
    if (artifact.id.includes('maku') || artifact.id.includes('shuttle')) modelType = 'shuttle';
    else if (artifact.id.includes('khabang') || artifact.id.includes('bobbin')) modelType = 'bobbin';
    else if (artifact.id.includes('loom')) modelType = 'loom';
    else if (artifact.id.includes('silk') || artifact.id.includes('spindle')) modelType = 'spindle';

    open3DViewer(artifact, modelType);
  };

  return (
    <section id="museum" className="py-20 md:py-28 bg-[#FAF8F5] text-[#171513]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-xs uppercase tracking-widest font-semibold text-stone-500">
              Interactive Heritage Repositories
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-editorial font-bold text-[#171513] mt-2">
              {museumContent.heading || 'Enter the'}{' '}
              <span className="yellow-highlight">{museumContent.highlightWord || 'digital museum'}</span>
            </h2>
            <p className="text-sm sm:text-base text-stone-700 font-editorial italic mt-2 max-w-xl">
              {museumContent.subtitle}
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                  selectedCategory === cat
                    ? 'bg-[#171513] text-white border-[#171513] shadow-xs'
                    : 'bg-white hover:bg-stone-100 text-stone-700 border-stone-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Artifacts Catalog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredArtifacts.map((artifact) => {
            const customPhoto = customImages[`artifact-photo-${artifact.id}`];

            return (
              <motion.div
                key={artifact.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="group bg-white border border-stone-300 rounded-lg overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between relative"
              >
                {/* Card Media Area */}
                <div className="relative aspect-4/3 overflow-hidden bg-[#FAF8F5] border-b border-stone-200">
                  {/* Change Image Button */}
                  <div className={`absolute top-3 right-3 z-30 transition-opacity ${isEditModeActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    <ImageChangeButton
                      imageKey={`artifact-photo-${artifact.id}`}
                      label="CHANGE IMAGE"
                      variant="compact"
                    />
                  </div>

                  <HeritageImage
                    src={artifact.image || artifact.imageUrl || `/assets/images/tools/${artifact.id}.jpg`}
                    imageKey={`artifact-photo-${artifact.id}`}
                    alt={artifact.name}
                    className="w-full h-full group-hover:scale-105 transition-transform"
                    showChangeButton={false}
                    fallbackText={`${artifact.name} photo coming soon`}
                  />

                  {/* Category Pill Tag */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider rounded-md bg-white/90 text-stone-800 backdrop-blur-xs border border-stone-200 shadow-xs uppercase">
                      {artifact.category}
                    </span>
                  </div>

                  {/* 3D / AR Indicator */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-1">
                    {artifact.arAvailable && (
                      <span className="p-1.5 rounded-full bg-black/70 text-white backdrop-blur-xs text-[10px]" title="AR Supported">
                        <Compass className="w-3.5 h-3.5 text-[#FFE600]" />
                      </span>
                    )}
                    {artifact.vrAvailable && (
                      <span className="p-1.5 rounded-full bg-black/70 text-white backdrop-blur-xs text-[10px]" title="3D & VR Available">
                        <Box className="w-3.5 h-3.5 text-white" />
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="text-lg font-editorial font-bold text-stone-900 group-hover:text-[#8B2635] transition-colors">
                        {artifact.name}
                      </h3>
                    </div>
                    {artifact.bodoName && (
                      <p className="text-xs text-stone-500 font-medium mt-0.5">
                        {artifact.bodoName}
                      </p>
                    )}

                    <p className="text-xs sm:text-sm text-stone-600 font-editorial line-clamp-3 mt-2">
                      {artifact.description}
                    </p>
                  </div>

                  {/* Interactive Action Row */}
                  <div className="pt-3 border-t border-stone-200 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpen3D(artifact)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#171513] hover:bg-[#3A2415] text-[#FFE600] text-xs font-bold shadow-xs transition-colors cursor-pointer"
                        title="Inspect 3D photogrammetry model"
                      >
                        <Box className="w-3.5 h-3.5 text-[#FFE600]" />
                        <span>VIEW 3D</span>
                      </button>

                      {artifact.arAvailable && (
                        <button
                          onClick={() => openAR(artifact)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white hover:bg-stone-100 text-stone-900 border border-stone-300 text-xs font-bold shadow-xs transition-colors cursor-pointer"
                          title="Place on surface in WebXR Mobile AR"
                        >
                          <Compass className="w-3.5 h-3.5 text-[#0F4C81]" />
                          <span>VIEW IN AR</span>
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setSelectedArtifactForDetail(artifact)}
                        className="p-1.5 text-stone-500 hover:text-black rounded-md hover:bg-stone-100 transition-colors"
                        title="View provenance details"
                      >
                        <Info className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() =>
                          openAIPanelWithContext(
                            artifact,
                            `Tell me about ${artifact.name} (${artifact.bodoName || ''}): its cultural significance, materials used, and historical context.`
                          )
                        }
                        className="p-1.5 text-[#0F4C81] hover:text-[#0a3357] rounded-md hover:bg-blue-50 transition-colors"
                        title="Ask AI assistant about this artifact"
                      >
                        <Sparkles className="w-4 h-4 fill-[#FFE600] text-amber-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Detailed Artifact Modal Drawer */}
        <AnimatePresence>
          {selectedArtifactForDetail && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[85vh] overflow-y-auto space-y-6"
              >
                <div className="flex items-start justify-between border-b border-stone-200 pb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#A64B2A] bg-amber-50 px-2.5 py-0.5 rounded-full">
                      {selectedArtifactForDetail.category}
                    </span>
                    <h3 className="text-2xl font-editorial font-bold text-stone-900 mt-2">
                      {selectedArtifactForDetail.name}
                    </h3>
                    <p className="text-xs text-stone-500">{selectedArtifactForDetail.bodoName}</p>
                  </div>
                  <button
                    onClick={() => setSelectedArtifactForDetail(null)}
                    className="p-1.5 text-stone-400 hover:text-black rounded-full hover:bg-stone-100"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                      Description & Cultural Significance
                    </h4>
                    <p className="text-sm font-editorial text-stone-800 leading-relaxed mt-1">
                      {selectedArtifactForDetail.description}
                    </p>
                    {selectedArtifactForDetail.culturalSignificance && (
                      <p className="text-sm font-editorial text-stone-700 italic mt-2 border-l-3 border-[#8B1E3F] pl-3">
                        {selectedArtifactForDetail.culturalSignificance}
                      </p>
                    )}
                  </div>

                  {selectedArtifactForDetail.materials && (
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                        Materials & Technique
                      </h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedArtifactForDetail.materials.map((m, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 text-xs rounded bg-stone-100 text-stone-800"
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedArtifactForDetail.details && (
                    <div className="bg-[#FAF8F5] p-4 rounded-lg border border-stone-200 text-xs grid grid-cols-2 gap-3">
                      {selectedArtifactForDetail.details.origin && (
                        <div>
                          <span className="font-bold text-stone-500 block">Origin:</span>
                          <span className="text-stone-800 font-medium">{selectedArtifactForDetail.details.origin}</span>
                        </div>
                      )}
                      {selectedArtifactForDetail.details.artisanCommunity && (
                        <div>
                          <span className="font-bold text-stone-500 block">Artisan Guild:</span>
                          <span className="text-stone-800 font-medium">{selectedArtifactForDetail.details.artisanCommunity}</span>
                        </div>
                      )}
                      {selectedArtifactForDetail.details.dimensions && (
                        <div>
                          <span className="font-bold text-stone-500 block">Dimensions:</span>
                          <span className="text-stone-800 font-medium">{selectedArtifactForDetail.details.dimensions}</span>
                        </div>
                      )}
                      {selectedArtifactForDetail.details.period && (
                        <div>
                          <span className="font-bold text-stone-500 block">Period:</span>
                          <span className="text-stone-800 font-medium">{selectedArtifactForDetail.details.period}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
                  <button
                    onClick={() => {
                      handleOpen3D(selectedArtifactForDetail);
                      setSelectedArtifactForDetail(null);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#171513] text-white text-xs font-semibold"
                  >
                    <Box className="w-4 h-4 text-[#FFE600]" />
                    <span>Launch 3D Viewer</span>
                  </button>

                  {selectedArtifactForDetail.arAvailable && (
                    <button
                      onClick={() => {
                        openAR(selectedArtifactForDetail);
                        setSelectedArtifactForDetail(null);
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white border border-stone-300 text-stone-800 text-xs font-semibold"
                    >
                      <Compass className="w-4 h-4 text-[#0F4C81]" />
                      <span>Launch AR Mode</span>
                    </button>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};
