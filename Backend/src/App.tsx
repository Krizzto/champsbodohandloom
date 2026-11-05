import React, { useState } from 'react';
import { VRMuseumCanvas } from './components/VRMuseumCanvas';
import { AgentDocentChat } from './components/AgentDocentChat';
import { OKFKnowledgeExplorer } from './components/OKFKnowledgeExplorer';
import { RetrievalBenchmarkModal } from './components/RetrievalBenchmarkModal';
import { IngestionPipelineViewer } from './components/IngestionPipelineViewer';
import { ExhibitDetailModal } from './components/ExhibitDetailModal';
import { MUSEUM_GALLERIES, MUSEUM_EXHIBITS } from './data/museumData';
import { ExhibitItem } from './types/museum';
import { Compass, BookOpen, BarChart3, Database, Sparkles, Eye, Info } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'3d_museum' | 'okf_knowledge' | 'ingestion_pipeline'>('3d_museum');
  const [currentGalleryId, setCurrentGalleryId] = useState<string>('gallery_weaving_hall');
  const [selectedExhibit, setSelectedExhibit] = useState<ExhibitItem | null>(null);
  const [inspectingExhibit, setInspectingExhibit] = useState<ExhibitItem | null>(null);
  const [isBenchmarkOpen, setIsBenchmarkOpen] = useState<boolean>(false);

  const handleNavigateToExhibit = (exhibit: ExhibitItem) => {
    setActiveTab('3d_museum');
    setCurrentGalleryId(exhibit.galleryId);
    setSelectedExhibit(exhibit);
  };

  const handleNavigateToGallery = (galleryId: string) => {
    setCurrentGalleryId(galleryId);
    setSelectedExhibit(null);
  };

  const handleViewProcessInExplorer = (processId: string) => {
    setActiveTab('okf_knowledge');
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-600 selection:text-white">
      {/* Top Main Navigation Header */}
      <header className="sticky top-0 z-40 bg-stone-950/90 backdrop-blur-md border-b border-stone-800/80 px-4 sm:px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 flex items-center justify-center text-stone-950 shadow-lg shadow-amber-600/20 font-bold">
              <Compass className="w-5 h-5 text-stone-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold text-white tracking-wide">
                  VR Museum Navigation
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  Agentic AI
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Multimodal Agentic AI Framework for Virtual Reality Museum Navigation • Bodo Handloom Heritage
              </p>
            </div>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center gap-1.5 bg-stone-900/90 p-1.5 rounded-xl border border-stone-800 text-xs font-medium">
            <button
              onClick={() => setActiveTab('3d_museum')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all duration-200 ${
                activeTab === '3d_museum'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>3D VR Museum</span>
            </button>

            <button
              onClick={() => setActiveTab('okf_knowledge')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all duration-200 ${
                activeTab === 'okf_knowledge'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>OKF Repository</span>
            </button>

            <button
              onClick={() => setActiveTab('ingestion_pipeline')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all duration-200 ${
                activeTab === 'ingestion_pipeline'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <Database className="w-4 h-4" />
              <span className="hidden sm:inline">Ingestion & Registry</span>
              <span className="sm:hidden">Ingestion</span>
            </button>

            <button
              onClick={() => setIsBenchmarkOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 border border-transparent hover:border-amber-500/30 transition-all font-mono"
              title="Run 15 Retrieval Benchmark Questions"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden md:inline">Benchmark</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {activeTab === '3d_museum' && (
          <div className="space-y-6">
            {/* Top Quick Gallery Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-stone-900/60 p-3 rounded-2xl border border-stone-800/80">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-xs font-semibold text-stone-300">
                  Select Museum Gallery to Teleport:
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {MUSEUM_GALLERIES.map(gallery => {
                  const isActive = gallery.id === currentGalleryId;
                  return (
                    <button
                      key={gallery.id}
                      onClick={() => handleNavigateToGallery(gallery.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2 border ${
                        isActive
                          ? 'bg-stone-800 text-amber-300 border-amber-500/50 shadow-md font-semibold'
                          : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-white hover:bg-stone-900'
                      }`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: gallery.ambientColor }}
                      />
                      <span>Zone {gallery.number}: {gallery.name.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Split Screen: 3D VR Museum Canvas (Left/Top) + Multimodal AI Docent Guide (Right/Bottom) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* 3D Canvas Viewport */}
              <div className="lg:col-span-7 xl:col-span-8">
                <VRMuseumCanvas
                  currentGalleryId={currentGalleryId}
                  selectedExhibit={selectedExhibit}
                  onSelectExhibit={exhibit => {
                    setSelectedExhibit(exhibit);
                    setInspectingExhibit(exhibit);
                  }}
                  onSelectGallery={handleNavigateToGallery}
                />
              </div>

              {/* Multimodal Agentic AI Docent Guide */}
              <div className="lg:col-span-5 xl:col-span-4">
                <AgentDocentChat
                  onNavigateToExhibit={handleNavigateToExhibit}
                  onNavigateToGallery={handleNavigateToGallery}
                  onOpenBenchmark={() => setIsBenchmarkOpen(true)}
                  currentExhibit={selectedExhibit}
                />
              </div>
            </div>

            {/* Quick Gallery Exhibit Carousel */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Key Artifacts & Process Stations in this Hall ({MUSEUM_EXHIBITS.filter(e => e.galleryId === currentGalleryId).length})
                </h3>
                <span className="text-xs text-stone-500">Click any card to examine or navigate in 3D</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {MUSEUM_EXHIBITS.filter(e => e.galleryId === currentGalleryId).map(exhibit => {
                  const isCurrent = selectedExhibit?.id === exhibit.id;
                  return (
                    <div
                      key={exhibit.id}
                      onClick={() => handleNavigateToExhibit(exhibit)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer group flex flex-col justify-between ${
                        isCurrent
                          ? 'bg-amber-950/20 border-amber-500 shadow-lg'
                          : 'bg-stone-900/60 border-stone-800/80 hover:bg-stone-850 hover:border-stone-700'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: exhibit.color }}
                          />
                          <span className="text-[10px] font-mono text-stone-400 bg-stone-950 px-2 py-0.5 rounded border border-stone-800">
                            {exhibit.nativeName}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                          {exhibit.name}
                        </h4>
                        <p className="text-[11px] text-stone-400 line-clamp-2">
                          {exhibit.shortDesc}
                        </p>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-stone-800/80 flex items-center justify-between">
                        <span className="text-[10px] text-stone-500 uppercase tracking-wider font-mono">
                          {exhibit.category.replace('_', ' ')}
                        </span>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            setInspectingExhibit(exhibit);
                          }}
                          className="text-[11px] text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
                        >
                          <Info className="w-3.5 h-3.5" /> Inspect
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'okf_knowledge' && (
          <OKFKnowledgeExplorer onNavigateToExhibit={handleNavigateToExhibit} />
        )}

        {activeTab === 'ingestion_pipeline' && (
          <IngestionPipelineViewer />
        )}
      </main>

      {/* Detailed Exhibit Inspection Modal */}
      <ExhibitDetailModal
        exhibit={inspectingExhibit}
        onClose={() => setInspectingExhibit(null)}
        onViewProcess={handleViewProcessInExplorer}
      />

      {/* Retrieval Benchmark Modal */}
      <RetrievalBenchmarkModal
        isOpen={isBenchmarkOpen}
        onClose={() => setIsBenchmarkOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-stone-900 bg-stone-950/80 px-4 sm:px-6 py-4 mt-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <p>
            Multimodal Agentic AI Framework for Virtual Reality Museum Navigation • Grounded on Verified Bodo Handloom OKF
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsBenchmarkOpen(true)}
              className="text-amber-400 hover:underline"
            >
              Run Benchmark (15 Questions)
            </button>
            <span>•</span>
            <span className="font-mono text-stone-400">Port 3000 • Vite React 19</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
