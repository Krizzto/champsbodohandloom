import React, { useState } from 'react';
import { ExhibitItem } from '../types/museum';
import { OKF_PROCESSES, MUSEUM_GALLERIES } from '../data/museumData';
import { X, Volume2, VolumeX, Sparkles, BookOpen, Layers, CheckCircle2, Compass } from 'lucide-react';

interface ExhibitDetailModalProps {
  exhibit: ExhibitItem | null;
  onClose: () => void;
  onViewProcess: (processId: string) => void;
}

export const ExhibitDetailModal: React.FC<ExhibitDetailModalProps> = ({
  exhibit,
  onClose,
  onViewProcess
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  if (!exhibit) return null;

  const gallery = MUSEUM_GALLERIES.find(g => g.id === exhibit.galleryId);
  const relatedProcess = OKF_PROCESSES.find(p => p.exhibitId === exhibit.id);

  const toggleAudioGuide = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(exhibit.audioGuideScript);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleClose = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-stone-950 shadow-md"
              style={{ backgroundColor: exhibit.color }}
            >
              3D
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-serif-title">{exhibit.name}</h3>
                <span className="text-xs font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                  {exhibit.nativeName}
                </span>
              </div>
              <p className="text-xs text-stone-400">
                {gallery?.name} • Gallery Zone 0{gallery?.number}
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Audio Docent Player Widget */}
          <div className="bg-gradient-to-r from-amber-950/40 to-stone-900 p-4 rounded-xl border border-amber-500/30 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Spatial Audio Narration</h4>
                <p className="text-[11px] text-stone-400">Listen to the docent commentary for this artifact</p>
              </div>
            </div>

            <button
              onClick={toggleAudioGuide}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow ${
                isPlayingAudio
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-amber-500 hover:bg-amber-400 text-stone-950'
              }`}
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span>Pause Guide</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span>Play Narration</span>
                </>
              )}
            </button>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider">
              Technical Description & Mechanism
            </h4>
            <p className="text-xs text-stone-200 leading-relaxed bg-stone-950 p-4 rounded-xl border border-stone-800">
              {exhibit.fullDescription}
            </p>
          </div>

          {/* Cultural Significance */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Cultural Heritage & Indigenous Context
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed bg-stone-950/60 p-4 rounded-xl border border-stone-800">
              {exhibit.culturalSignificance}
            </p>
          </div>

          {/* Materials & Implements */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-stone-950 p-3.5 rounded-xl border border-stone-800 space-y-2">
              <span className="text-xs font-semibold text-stone-400 block">Natural Materials Used</span>
              <div className="flex flex-wrap gap-1.5">
                {exhibit.materials.map((mat, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-stone-900 text-stone-300 text-[11px] border border-stone-800">
                    {mat}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-stone-950 p-3.5 rounded-xl border border-stone-800 space-y-2">
              <span className="text-xs font-semibold text-stone-400 block">Tools & Components</span>
              <div className="flex flex-wrap gap-1.5">
                {exhibit.toolsInvolved.map((tool, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-stone-900 text-stone-300 text-[11px] border border-stone-800">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Related OKF Process link */}
          {relatedProcess && (
            <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <div>
                  <h5 className="text-xs font-bold text-white">
                    Related OKF Process: {relatedProcess.title}
                  </h5>
                  <p className="text-[11px] text-stone-400">
                    Document ID: <code className="font-mono text-stone-300">{relatedProcess.documentId}</code>
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  handleClose();
                  onViewProcess(relatedProcess.id);
                }}
                className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium border border-stone-700 transition-colors"
              >
                Inspect OKF
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-stone-950 border-t border-stone-800 flex justify-end">
          <button
            onClick={handleClose}
            className="px-4 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
