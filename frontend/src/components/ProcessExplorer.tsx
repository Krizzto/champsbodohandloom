import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Box, Sparkles, Layers, Wrench, CheckCircle, FileText } from 'lucide-react';
import { useMuseumStore } from '../store/museumStore';
import { useContentStore } from '../store/contentStore';
import { ImageChangeButton } from './ImageChangeButton';
import { HeritageImage } from './ui/HeritageImage';
import { ProcessResearchModal } from './process/ProcessResearchModal';

export const ProcessExplorer: React.FC = () => {
  const [isResearchModalOpen, setIsResearchModalOpen] = useState(false);
  const {
    selectedProcessId,
    setSelectedProcessId,
    open3DViewer,
    openAIPanelWithContext,
  } = useMuseumStore();

  const { siteContent, processes, artifacts, customImages, isEditModeActive } = useContentStore();
  const processContent = siteContent.processSection;

  const currentProcess = processes.find((p) => p.id === selectedProcessId) || processes[0] || {
    id: 'ginning',
    stepNumber: 1,
    name: 'Ginning',
    bodoName: 'खुन सायनाय',
    shortDesc: 'Separating raw cotton seeds from fluffy lint fibers.',
    detailedProcess: 'Freshly harvested cotton bolls are hand-fed into rollers.',
    tools: ['Janthwr roller gin'],
    materials: ['Raw cotton'],
    culturalImportance: 'Marks the start of the textile cycle.',
    modelType: 'spindle',
  };

  const handleOpen3D = () => {
    const artifact = artifacts.find((a) =>
      a.relatedProcesses?.includes(currentProcess.id)
    ) || artifacts[0];

    if (artifact) {
      open3DViewer(artifact, currentProcess.modelType || 'shuttle');
    }
  };

  const customStagePhoto = customImages[`process-photo-${currentProcess.id}`];

  return (
    <section id="process" className="py-20 md:py-28 bg-[#F4EFE6] text-[#171513]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest font-semibold text-stone-600">
            Handloom Technical Lineage
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-editorial font-bold text-[#171513] mt-2">
            {processContent.heading || 'The Journey of a'}{' '}
            <span className="yellow-highlight">{processContent.highlightWord || 'thread'}</span>
          </h2>
          <p className="text-sm sm:text-base text-stone-700 font-editorial italic mt-3">
            {processContent.subtitle}
          </p>
        </div>

        {/* Visual Editorial Horizontal Timeline Rail */}
        <div className="relative mb-12">
          {/* Subtle connecting thread line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-stone-300 -translate-y-1/2 hidden md:block" />

          <div className="w-full flex items-stretch gap-2 sm:gap-2.5 overflow-x-auto pb-4 pt-2 scrollbar-none">
            {processes.map((stage) => {
              const isSelected = stage.id === currentProcess.id;
              return (
                <button
                  key={stage.id}
                  onClick={() => setSelectedProcessId(stage.id)}
                  className={`relative flex-1 min-w-[96px] sm:min-w-[105px] flex flex-col items-center justify-center px-2 sm:px-3 py-3 rounded-xl border transition-all cursor-pointer text-center ${
                    isSelected
                      ? 'bg-[#171513] text-white border-[#171513] shadow-md -translate-y-1 z-10'
                      : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-300 shadow-xs'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold mb-1.5 ${
                      isSelected
                        ? 'bg-[#FFE600] text-black'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {stage.stepNumber}
                  </span>
                  <span className="text-xs font-bold whitespace-nowrap">
                    {stage.name}
                  </span>
                  <span className="text-[10px] opacity-75 font-editorial truncate max-w-[90px]">
                    {stage.bodoName.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Stage Editorial Deep-Dive Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentProcess.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            className="bg-white border border-stone-300 rounded-xl p-6 sm:p-10 shadow-sm relative group/process"
          >
            {/* Change Stage Photo Button */}
            <div className={`absolute top-4 right-4 z-20 transition-opacity ${isEditModeActive ? 'opacity-100' : 'opacity-0 group-hover/process:opacity-100'}`}>
              <ImageChangeButton
                imageKey={`process-photo-${currentProcess.id}`}
                label="CHANGE STAGE PHOTO"
                variant="floating"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Number, Title, Indigenous Name, Detailed Process */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#171513] text-white text-[11px] font-bold">
                      STAGE {currentProcess.stepNumber} OF {processes.length}
                    </span>
                    <span className="text-xs font-semibold text-[#8B2635]">
                      {currentProcess.bodoName}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-editorial font-bold text-stone-900 mt-2">
                    {currentProcess.name}
                  </h3>
                  <p className="text-sm font-editorial text-stone-600 italic mt-1">
                    {currentProcess.shortDesc}
                  </p>
                </div>

                {/* Process Stage Photograph from public/assets/images/process/ */}
                <div className="h-48 sm:h-56 rounded-lg overflow-hidden border border-stone-200 shadow-xs">
                  <HeritageImage
                    src={currentProcess.image || `/assets/images/process/${currentProcess.id}.jpg`}
                    imageKey={`process-photo-${currentProcess.id}`}
                    alt={`${currentProcess.name} process stage`}
                    className="w-full h-full"
                    fallbackText={`${currentProcess.name} photo coming soon`}
                    showChangeButton={false}
                  />
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    Technical Mechanics
                  </h4>
                  <p className="text-sm sm:text-base text-stone-800 font-editorial leading-relaxed">
                    {currentProcess.detailedProcess}
                  </p>
                </div>

                {/* Cultural Importance */}
                <div className="bg-[#FAF8F5] p-4 rounded-lg border-l-4 border-[#0F4C81]">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-[#0F4C81] mb-1">
                    Social & Cultural Meaning
                  </h5>
                  <p className="text-xs sm:text-sm font-editorial text-stone-700 italic">
                    {currentProcess.culturalImportance}
                  </p>
                </div>
              </div>

              {/* Right Column: Tools, Materials & 3D/AI Actions */}
              <div className="lg:col-span-5 space-y-6 bg-[#FAF8F5] p-6 rounded-lg border border-stone-200">
                {/* Tools Grid */}
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                    <Wrench className="w-3.5 h-3.5 text-[#A64B2A]" />
                    <span>Tools & Implements</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {currentProcess.tools.map((tool, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded bg-white text-xs text-stone-800 border border-stone-300 font-medium"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Materials Grid */}
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                    <Layers className="w-3.5 h-3.5 text-[#185ADB]" />
                    <span>Materials Consumed</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {currentProcess.materials.map((mat, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded bg-white text-xs text-stone-800 border border-stone-300 font-medium"
                      >
                        {mat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 3D Model Explorer Launcher */}
                <div className="pt-4 border-t border-stone-300 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-600 block">
                    Interactive 3D Inspection
                  </span>

                  <button
                    onClick={handleOpen3D}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#171513] text-white hover:bg-stone-800 text-xs font-semibold transition-colors shadow-xs cursor-pointer"
                  >
                    <Box className="w-4 h-4 text-[#FFE600]" />
                    <span>INSPECT 3D TOOL MODEL</span>
                  </button>

                  <button
                    onClick={() => setIsResearchModalOpen(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold border border-stone-300 transition-colors shadow-xs cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#8B2635]" />
                    <span>VIEW FULL RESEARCH DOCUMENT</span>
                  </button>

                  <button
                    onClick={() =>
                      openAIPanelWithContext(
                        null,
                        `Explain the mechanical details, village songs, and technical execution of step ${currentProcess.stepNumber}: ${currentProcess.name} (${currentProcess.bodoName}) in Bodo handloom weaving.`
                      )
                    }
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white hover:bg-stone-50 text-xs font-semibold text-stone-800 border border-stone-300 transition-colors shadow-xs cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#FFE600] fill-[#FFE600]" />
                    <span>Ask AI About this Step</span>
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        </AnimatePresence>

      </div>

      {/* OKF Full Research Document Reader Modal */}
      <ProcessResearchModal
        isOpen={isResearchModalOpen}
        processId={currentProcess.id}
        onClose={() => setIsResearchModalOpen(false)}
      />
    </section>
  );
};
