import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Box } from 'lucide-react';
import { useMuseumStore } from '../store/museumStore';
import { ChatPanel } from './ai/ChatPanel';

export const AIChatDrawer: React.FC = () => {
  const {
    isAIPanelOpen,
    closeAIPanel,
    currentAIContextArtifact,
    open3DViewer,
  } = useMuseumStore();

  if (!isAIPanelOpen) return null;

  return (
    <AnimatePresence>
      {/* 
        Subtle transparent dark overlay (rgba(0, 0, 0, 0.15)) WITHOUT any backdrop blur
        so the underlying page, 3D village, and background remain razor sharp and clear.
      */}
      <div className="fixed inset-0 z-50 flex justify-end bg-black/15">
        {/* Backdrop click to close */}
        <div
          className="absolute inset-0 cursor-pointer"
          onClick={closeAIPanel}
          aria-label="Close background backdrop"
        />

        {/* 
          Drawer panel: 400-440px wide on desktop, full-width on mobile.
          Smooth sliding spring animation.
        */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 240 }}
          className="relative w-full sm:max-w-[440px] h-full bg-[#FAF8F5] text-[#171513] shadow-2xl flex flex-col z-10 border-l border-stone-200"
        >
          {/* Optional context banner if opened directly from a specific artifact */}
          {currentAIContextArtifact && (
            <div className="px-4 py-2 bg-[#FFFDEB] border-b border-[#FFE600]/80 flex items-center justify-between text-xs text-stone-800">
              <div className="flex items-center gap-1.5 truncate">
                <Box className="w-3.5 h-3.5 text-[#185ADB] shrink-0" />
                <span className="truncate">
                  Artifact: <strong className="font-semibold">{currentAIContextArtifact.name}</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={() => open3DViewer(currentAIContextArtifact)}
                className="text-[11px] underline font-bold text-[#185ADB] shrink-0 hover:text-[#0F4C81] cursor-pointer"
              >
                Inspect in 3D
              </button>
            </div>
          )}

          {/* Clean Bodo Heritage AI Knowledge Assistant Interface */}
          <div className="flex-1 overflow-hidden">
            <ChatPanel
              className="h-full border-0 rounded-none shadow-none"
              onClose={closeAIPanel}
              onQuerySubmit={(payload) => {
                console.info('[Bodo Heritage AI] Query submitted:', payload);
              }}
            />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
