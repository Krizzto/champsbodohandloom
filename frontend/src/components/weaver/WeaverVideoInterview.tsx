import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Film,
  Upload,
  Link as LinkIcon,
  Check,
  AlertCircle,
  Trash2,
  RotateCcw,
} from 'lucide-react';
import { WeaverProfile } from '../../types';
import { useContentStore } from '../../store/contentStore';
import { validateVideoFile, saveVideoBlob, parseVideoUrl } from '../../services/videoStorage';

interface WeaverVideoInterviewProps {
  profile: WeaverProfile;
  isActive?: boolean;
}

export const WeaverVideoInterview: React.FC<WeaverVideoInterviewProps> = ({ profile, isActive = true }) => {
  const { customImages, setCustomImage, removeCustomImage, updateWeaver } = useContentStore();

  // Storage key for master weaver video
  const customVideoKey = `weaver-video-${profile.id}`;
  const customVideoSrc = customImages[customVideoKey];
  const activeVideoSrc = customVideoSrc || profile.videoData?.videoSrc || '';

  const posterSrc =
    customImages[`weaver-portrait-${profile.id}`] ||
    profile.videoData?.posterImage ||
    profile.photo ||
    profile.image ||
    '/assets/images/people/weavers/anjali-swargiary.jpg';

  const videoData = profile.videoData;

  // Media Element Refs
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const progressBarRef = React.useRef<HTMLDivElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Playback States
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(videoData?.duration || 282);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [videoError, setVideoError] = useState<string | null>(null);

  // Auto-pause and reset playback when switching slides or when profile changes
  useEffect(() => {
    if (!isActive) {
      if (videoRef.current && !videoRef.current.paused) {
        videoRef.current.pause();
      }
      setIsPlaying(false);
    }
  }, [isActive]);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(profile.videoData?.duration || 282);
    setVideoError(null);
  }, [profile.id]);

  // Upload progress & URL modal states
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccessNotice, setUploadSuccessNotice] = useState<string | null>(null);
  const [showUrlDialog, setShowUrlDialog] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [urlError, setUrlError] = useState<string | null>(null);

  // Check if active video is an embed (YouTube or Vimeo)
  const isEmbed =
    activeVideoSrc.includes('youtube.com') ||
    activeVideoSrc.includes('youtube-nocookie.com') ||
    activeVideoSrc.includes('youtu.be') ||
    activeVideoSrc.includes('player.vimeo.com') ||
    activeVideoSrc.includes('vimeo.com');

  // Format seconds to MM:SS
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Sync Video Duration once metadata loads
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const vidDur = videoRef.current.duration;
      if (!isNaN(vidDur) && vidDur > 0) {
        setDuration(vidDur);
      }
      setVideoError(null);
    }
  };

  // Sync Video Time Updates
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  // Play / Pause Toggle
  const togglePlay = React.useCallback(() => {
    if (!videoRef.current || !activeVideoSrc || isEmbed) return;

    if (videoRef.current.paused || videoRef.current.ended) {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn('Playback error:', err);
          setIsPlaying(false);
        });
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [activeVideoSrc, isEmbed]);

  // Seek Video
  const handleSeek = (newTime: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(newTime, duration));
      setCurrentTime(videoRef.current.currentTime);
      if (videoRef.current.paused) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    } else {
      setCurrentTime(newTime);
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

  // Real Persistent File Upload Handler (IndexedDB storage)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateVideoFile(file);
    if (!validation.valid) {
      setVideoError(validation.error || 'Invalid video format.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);
    setVideoError(null);

    try {
      const progressTimer = setInterval(() => {
        setUploadProgress((p) => (p < 85 ? p + 25 : p));
      }, 100);

      // Save to persistent IndexedDB
      const persistentUrl = await saveVideoBlob(customVideoKey, file, file.name);
      clearInterval(progressTimer);
      setUploadProgress(100);

      // Update store customImages and weaver videoData
      setCustomImage(customVideoKey, persistentUrl);
      updateWeaver(profile.id, {
        videoData: {
          ...(profile.videoData || {}),
          videoSrc: persistentUrl,
        },
      });

      setUploadSuccessNotice(`Video "${file.name}" uploaded and saved permanently!`);
      setTimeout(() => setUploadSuccessNotice(null), 4000);
    } catch (err: any) {
      console.error('Failed to save interview video:', err);
      setVideoError(err?.message || 'Could not save video to persistent browser storage.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  // URL Submission Handler (YouTube, Vimeo, or direct video link)
  const handleCustomUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUrlError(null);

    const parsed = parseVideoUrl(customUrlInput);
    if (!parsed) {
      setUrlError('Please enter a valid YouTube, Vimeo, or direct video URL (.mp4 / .webm).');
      return;
    }

    setCustomImage(customVideoKey, parsed.embedUrl);
    updateWeaver(profile.id, {
      videoData: {
        ...(profile.videoData || {}),
        videoSrc: parsed.embedUrl,
      },
    });

    setShowUrlDialog(false);
    setCustomUrlInput('');
    setVideoError(null);
    setUploadSuccessNotice('Video URL updated successfully!');
    setTimeout(() => setUploadSuccessNotice(null), 3500);
  };

  // Remove uploaded/custom video
  const handleRemoveVideo = () => {
    removeCustomImage(customVideoKey);
    updateWeaver(profile.id, {
      videoData: {
        ...(profile.videoData || {}),
        videoSrc: '',
      },
    });
    setVideoError(null);
  };

  // Autohide controls on inactivity
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isPlaying) {
      timer = setTimeout(() => setIsControlsVisible(false), 2800);
    } else {
      setIsControlsVisible(true);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentTime]);

  return (
    <div
      id="weaver-video-player"
      tabIndex={0}
      className="w-full focus:outline-none"
      aria-label="Oral Heritage Video Interview Player"
    >
      {/* 16:9 VIDEO CONTAINER: Responsive, Wide, Archival Aesthetic */}
      <div
        ref={containerRef}
        onMouseMove={() => setIsControlsVisible(true)}
        onMouseLeave={() => isPlaying && setIsControlsVisible(false)}
        className="group relative w-full aspect-video rounded-xl overflow-hidden bg-[#171513] border border-stone-300 shadow-md flex items-center justify-center select-none"
      >
        {/* Active playback status indicator */}
        {isPlaying && !isEmbed && (
          <div className="absolute top-4 left-4 z-30 pointer-events-none transition-opacity duration-300">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-[#FFE600] text-[11px] font-bold tracking-wider uppercase border border-[#FFE600]/40 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#FFE600] animate-pulse" />
              PLAYING ARCHIVAL INTERVIEW
            </span>
          </div>
        )}

        {/* Change / Upload Video Button for Content Administrator */}
        <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
          {activeVideoSrc && (
            <button
              type="button"
              onClick={handleRemoveVideo}
              className="inline-flex items-center gap-1 p-1.5 rounded-full bg-black/80 hover:bg-rose-700 text-stone-300 hover:text-white text-xs border border-white/20 backdrop-blur-md transition-colors cursor-pointer"
              title="Remove custom video (restore placeholder)"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/80 hover:bg-black text-white hover:text-[#FFE600] text-xs font-semibold border border-white/20 backdrop-blur-md transition-all shadow-md cursor-pointer disabled:opacity-50"
            title="Upload MP4 or WebM video file from computer"
          >
            <Upload className="w-3.5 h-3.5 text-[#FFE600]" />
            <span>{isUploading ? `Uploading ${uploadProgress}%` : activeVideoSrc ? 'REPLACE VIDEO' : 'UPLOAD INTERVIEW VIDEO'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setShowUrlDialog(true);
              setUrlError(null);
            }}
            className="inline-flex items-center justify-center px-3 py-1.5 rounded-full bg-black/80 hover:bg-black text-white hover:text-[#FFE600] text-xs font-semibold border border-white/20 backdrop-blur-md transition-all shadow-md cursor-pointer"
            title="Enter video URL directly (YouTube, Vimeo, direct link)"
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline ml-1">URL</span>
          </button>
        </div>

        {/* Hidden File Input for video upload */}
        <input
          ref={fileInputRef}
          type="file"
          accept="video/mp4,video/webm,video/ogg"
          className="hidden"
          onChange={handleFileUpload}
        />

        {/* Success Notice Toast */}
        {uploadSuccessNotice && (
          <div className="absolute bottom-16 left-4 right-4 z-40 p-3 bg-emerald-950/90 border border-emerald-500 text-emerald-200 text-xs rounded-xl flex items-center gap-2 shadow-lg backdrop-blur-md animate-fade-in">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium">{uploadSuccessNotice}</span>
          </div>
        )}

        {/* Uploading Spinner Overlay */}
        {isUploading && (
          <div className="absolute inset-0 z-40 bg-black/80 flex flex-col items-center justify-center p-6 space-y-3">
            <div className="w-10 h-10 border-3 border-stone-600 border-t-[#FFE600] rounded-full animate-spin" />
            <p className="text-xs font-bold text-stone-200">Saving video to persistent storage...</p>
            <div className="w-48 h-2 bg-stone-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#FFE600] transition-all duration-200"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <span className="text-[11px] font-mono text-stone-400">{uploadProgress}%</span>
          </div>
        )}

        {/* IF A VIDEO SOURCE EXISTS: Render HTML5 video or Embed */}
        {activeVideoSrc ? (
          isEmbed ? (
            <iframe
              src={activeVideoSrc}
              title="Master Weaver Interview"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          ) : (
            <>
              <video
                ref={videoRef}
                src={activeVideoSrc}
                poster={posterSrc}
                onLoadedMetadata={handleLoadedMetadata}
                onTimeUpdate={handleTimeUpdate}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
                onError={() =>
                  setVideoError('Unable to load video format. Click Replace to upload an MP4 or WebM file.')
                }
                onClick={togglePlay}
                className="w-full h-full object-cover cursor-pointer"
                playsInline
              />

              {/* Error Message if file failed to load */}
              {videoError && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/85 text-white p-6 text-center space-y-3">
                  <Film className="w-10 h-10 text-rose-400" />
                  <p className="text-xs text-rose-200 font-mono max-w-sm">{videoError}</p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 text-xs font-bold rounded-lg bg-[#FFE600] text-black hover:bg-[#ebd300] cursor-pointer"
                  >
                    Upload New Video File (.mp4 / .webm)
                  </button>
                </div>
              )}

              {/* Big Centered Play Button when paused */}
              {!isPlaying && !videoError && (
                <div
                  onClick={togglePlay}
                  className="absolute inset-0 flex items-center justify-center bg-black/35 backdrop-blur-[1px] cursor-pointer z-20 transition-all hover:bg-black/25"
                >
                  <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-full bg-[#FFE600] hover:bg-[#fff04d] text-[#171513] flex items-center justify-center shadow-2xl transition-transform hover:scale-110 active:scale-95 border-3 border-white">
                    <Play className="w-9 h-9 sm:w-11 sm:h-11 fill-[#171513] ml-1.5" />
                  </div>
                </div>
              )}

              {/* CUSTOM CLEAN VIDEO CONTROLS BAR (Appears on hover or when paused) */}
              <div
                className={`absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-black/95 via-black/75 to-transparent pt-10 pb-4 px-4 sm:px-6 transition-opacity duration-200 ${
                  isControlsVisible || !isPlaying ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {/* Scrub bar */}
                <div
                  ref={progressBarRef}
                  onClick={handleProgressClick}
                  className="group/scrub relative w-full h-1.5 hover:h-2.5 bg-white/30 hover:bg-white/40 rounded-full cursor-pointer transition-all mb-3 flex items-center"
                  title="Click or drag to seek"
                >
                  <div
                    className="h-full bg-[#FFE600] rounded-full relative"
                    style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-md border border-[#171513] scale-0 group-hover/scrub:scale-100 transition-transform" />
                  </div>
                </div>

                {/* Controls Row */}
                <div className="flex items-center justify-between text-white text-xs gap-3">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={togglePlay}
                      aria-label={isPlaying ? 'Pause video interview' : 'Play video interview'}
                      className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer"
                    >
                      {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={toggleMute}
                        aria-label={isMuted ? 'Unmute' : 'Mute'}
                        className="p-1.5 text-white/80 hover:text-white transition-colors cursor-pointer"
                      >
                        {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={isMuted ? 0 : volume}
                        onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                        aria-label="Volume slider"
                        className="w-16 sm:w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-[#FFE600]"
                      />
                    </div>

                    <div className="font-mono text-xs text-stone-300">
                      <span>{formatTime(currentTime)}</span>
                      <span className="mx-1.5 text-white/40">/</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={toggleFullscreen}
                      aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                      className="p-2 text-white/80 hover:text-white transition-colors cursor-pointer"
                      title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                    >
                      {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )
        ) : (
          /* VIDEO PLACEHOLDER (when no video uploaded yet) */
          <div className="relative w-full h-full flex flex-col items-center justify-center p-8 text-center overflow-hidden">
            {posterSrc && (
              <img
                src={posterSrc}
                alt={profile.name}
                className="absolute inset-0 w-full h-full object-cover filter blur-[2px] opacity-25 scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/55 to-black/70 pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center space-y-4 max-w-md">
              <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-[#FFE600] shadow-md">
                <Film className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[11px] font-mono font-bold tracking-widest text-[#FFE600] uppercase block">
                  INTERVIEW VIDEO
                </span>
                <p className="text-base sm:text-lg font-bold font-editorial text-white mt-1">
                  Upload the recorded conversation with the master weaver
                </p>
                <p className="text-xs text-stone-300 mt-1.5">
                  Supports MP4, WebM formats, or YouTube/Vimeo URLs.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FFE600] hover:bg-[#ebd300] text-stone-900 text-xs font-bold shadow-md transition-transform hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Interview Video</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowUrlDialog(true);
                    setUrlError(null);
                  }}
                  className="px-4 py-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-medium border border-white/30 cursor-pointer transition-colors"
                >
                  Enter URL
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enter URL Modal Dialog */}
      {showUrlDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-xl p-5 max-w-md w-full border border-stone-300 shadow-2xl space-y-3">
            <h4 className="text-sm font-bold font-editorial text-stone-900">
              Enter Interview Video URL
            </h4>
            <p className="text-xs text-stone-500">
              Paste a YouTube link, Vimeo URL, or direct video file address (.mp4 / .webm).
            </p>
            {urlError && (
              <p className="text-xs text-rose-700 bg-rose-50 border border-rose-200 p-2 rounded">
                {urlError}
              </p>
            )}
            <form onSubmit={handleCustomUrlSubmit} className="space-y-3">
              <input
                type="text"
                required
                value={customUrlInput}
                onChange={(e) => setCustomUrlInput(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... or /assets/video/..."
                className="w-full px-3 py-2 text-xs rounded border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-800 font-mono"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUrlDialog(false)}
                  className="px-3 py-1.5 rounded text-xs text-stone-600 hover:bg-stone-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-[#171513] text-white hover:bg-stone-800 text-xs font-semibold cursor-pointer"
                >
                  Save URL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
