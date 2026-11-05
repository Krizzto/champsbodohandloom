import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Film,
  Calendar,
  Tag,
  Sparkles,
} from 'lucide-react';
import { DocumentaryVideo } from '../../types';

interface DocumentaryPlayerModalProps {
  documentary: DocumentaryVideo | null;
  onClose: () => void;
}

export const DocumentaryPlayerModal: React.FC<DocumentaryPlayerModalProps> = ({
  documentary,
  onClose,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(documentary?.duration || 300);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isControlsVisible, setIsControlsVisible] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  if (!documentary) return null;

  const isEmbed = documentary.videoType === 'youtube' || documentary.videoType === 'vimeo';

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused || videoRef.current.ended) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (newTime: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(newTime, duration));
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    handleSeek(pos * duration);
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (videoRef.current) {
      videoRef.current.volume = newVol;
      videoRef.current.muted = newVol === 0;
    }
    setIsMuted(newVol === 0);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const nextMuted = !isMuted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    } else {
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#171513] border border-stone-700 rounded-2xl shadow-2xl overflow-hidden my-6 flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-black/80 text-white border-b border-stone-800">
          <div className="flex items-center gap-2 truncate">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFE600] shrink-0" />
            <h3 className="text-sm font-bold font-editorial truncate text-stone-100">
              {documentary.title}
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 font-mono shrink-0">
              {documentary.durationFormatted}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 16:9 Video Canvas */}
        <div
          ref={containerRef}
          onMouseMove={() => setIsControlsVisible(true)}
          className="relative w-full aspect-video bg-black flex items-center justify-center select-none overflow-hidden"
        >
          {isEmbed ? (
            <iframe
              src={documentary.videoSrc}
              title={documentary.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          ) : (
            <>
              <video
                ref={videoRef}
                src={documentary.videoSrc}
                poster={documentary.thumbnailUrl}
                onLoadedMetadata={() => {
                  if (videoRef.current) setDuration(videoRef.current.duration || duration);
                }}
                onTimeUpdate={() => {
                  if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
                }}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
                onClick={togglePlay}
                className="w-full h-full object-contain cursor-pointer"
                playsInline
                autoPlay
              />

              {/* Centered Play Button when paused */}
              {!isPlaying && (
                <div
                  onClick={togglePlay}
                  className="absolute inset-0 flex items-center justify-center bg-black/35 cursor-pointer z-20"
                >
                  <div className="w-16 h-16 rounded-full bg-[#FFE600] text-[#171513] flex items-center justify-center shadow-2xl transition-transform hover:scale-110 border-2 border-white">
                    <Play className="w-8 h-8 fill-[#171513] ml-1" />
                  </div>
                </div>
              )}

              {/* Controls Bar */}
              <div
                className={`absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-black/95 via-black/75 to-transparent pt-8 pb-3 px-4 sm:px-6 transition-opacity duration-200 ${
                  isControlsVisible || !isPlaying ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {/* Progress bar */}
                <div
                  ref={progressBarRef}
                  onClick={handleProgressClick}
                  className="group/scrub relative w-full h-1.5 hover:h-2.5 bg-white/30 rounded-full cursor-pointer transition-all mb-2.5 flex items-center"
                >
                  <div
                    className="h-full bg-[#FFE600] rounded-full relative"
                    style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white scale-0 group-hover/scrub:scale-100 transition-transform" />
                  </div>
                </div>

                {/* Controls Row */}
                <div className="flex items-center justify-between text-white text-xs gap-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={togglePlay}
                      className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center cursor-pointer"
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white ml-0.5" />}
                    </button>
                    <div className="flex items-center gap-1.5">
                      <button onClick={toggleMute} className="p-1 text-white/80 hover:text-white cursor-pointer">
                        {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={isMuted ? 0 : volume}
                        onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                        className="w-16 h-1 bg-white/30 rounded accent-[#FFE600] cursor-pointer"
                      />
                    </div>
                    <div className="font-mono text-[11px] text-stone-300">
                      <span>{formatTime(currentTime)}</span>
                      <span className="mx-1 text-white/40">/</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  <button onClick={toggleFullscreen} className="p-1.5 text-white/80 hover:text-white cursor-pointer">
                    {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Documentary Description & Metadata Footer */}
        <div className="p-5 bg-[#171513] text-stone-300 space-y-2 border-t border-stone-800">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-2.5 py-0.5 rounded-full bg-stone-800 text-[#FFE600] font-bold text-[10px] uppercase tracking-wider">
              {documentary.category}
            </span>
            {documentary.artisanName && (
              <span className="text-xs text-stone-300 font-medium">
                Artisan: <strong className="text-white">{documentary.artisanName}</strong>
              </span>
            )}
            <span className="text-stone-500">•</span>
            <span className="text-xs text-stone-400">{documentary.uploadDate}</span>
          </div>

          <p className="text-xs sm:text-sm text-stone-300 font-editorial leading-relaxed">
            {documentary.description}
          </p>

          {documentary.tags && documentary.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {documentary.tags.map((t) => (
                <span
                  key={t}
                  className="px-2 py-0.5 rounded bg-stone-800/80 text-[10px] text-stone-400 font-medium"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
