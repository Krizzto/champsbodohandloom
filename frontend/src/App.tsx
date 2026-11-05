/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { MotifCollection } from './components/MotifCollection';
import { DyeingSection } from './components/DyeingSection';
import { WeaverSection } from './components/WeaverSection';
import { ProcessExplorer } from './components/ProcessExplorer';
import { MuseumSection } from './components/MuseumSection';
import { VRMuseumSection } from './components/VRMuseumSection';
import { Footer } from './components/Footer';
import { ArtifactViewer } from './components/3d/ArtifactViewer';
import { ARViewerModal } from './components/3d/ARViewerModal';
import { VRMuseumModal } from './components/3d/VRMuseumModal';
import { AIChatDrawer } from './components/AIChatDrawer';
import { SearchModal } from './components/SearchModal';
import { useMuseumStore } from './store/museumStore';
import { useContentStore } from './store/contentStore';

export default function App() {
  const {
    isViewer3DOpen,
    selected3DArtifact,
    viewerModelType,
    close3DViewer,
    isAROpen,
    arArtifact,
    closeAR,
    isVRMuseumOpen,
    closeVRMuseum,
  } = useMuseumStore();

  const { hydrateAsync } = useContentStore();

  // Asynchronously hydrate authoritative content and 3D models from IndexedDB on startup
  useEffect(() => {
    hydrateAsync();
  }, [hydrateAsync]);

  // If a user previously had /editor in their address bar, cleanly sanitize it to /
  useEffect(() => {
    if (window.location.pathname.startsWith('/editor')) {
      window.history.replaceState(null, '', '/');
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#171513] flex flex-col font-body">
      {/* Main Cultural Architecture */}
      <main className="flex-1">
        {/* Phase 1: Hero with Welcome to Bodo handloom heritage + AR & VR Museum integration */}
        <Hero />

        {/* Phase 1: About the Project with live image replacement */}
        <AboutSection />

        {/* Phase 2 & 7 & 8: Agor / Motif Collection */}
        <MotifCollection />

        {/* Phase 3 & 10: Collection of Dyeing Technique & Interactive Story */}
        <DyeingSection />

        {/* Phase 4: Meet the Weaver with Traditional Pattern Borders */}
        <WeaverSection />

        {/* Phase 5: Handloom Process Explorer (Journey of a Thread) */}
        <ProcessExplorer />

        {/* Phase 6: Digital Museum Artifacts */}
        <MuseumSection />

        {/* Phase 9: VR Museum Gateway */}
        <VRMuseumSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Standalone 3D Artifact Viewer Modal */}
      {isViewer3DOpen && selected3DArtifact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6">
          <div className="w-full max-w-4xl h-[80vh] bg-[#FAF8F5] rounded-2xl overflow-hidden shadow-2xl relative">
            <ArtifactViewer
              artifact={selected3DArtifact}
              modelType={viewerModelType}
              onClose={close3DViewer}
            />
          </div>
        </div>
      )}

      {/* WebXR / AR Experience Modal */}
      {isAROpen && arArtifact && (
        <ARViewerModal artifact={arArtifact} onClose={closeAR} />
      )}

      {/* WebXR Fullscreen VR Museum Space */}
      {isVRMuseumOpen && (
        <VRMuseumModal onClose={closeVRMuseum} />
      )}

      {/* Persistent Bodo AI Cultural Assistant Drawer */}
      <AIChatDrawer />

      {/* Global Cultural Search Modal */}
      <SearchModal />
    </div>
  );
}
