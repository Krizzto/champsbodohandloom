import React, { useState } from 'react';
import { X, Upload, Save, Film, Check, AlertCircle, Sparkles, Image as ImageIcon } from 'lucide-react';
import { DocumentaryVideo } from '../../types';
import { DOCUMENTARY_CATEGORIES } from '../../data/documentaries';
import { validateVideoFile, saveVideoBlob, parseVideoUrl } from '../../services/videoStorage';

interface AddEditDocumentaryModalProps {
  isOpen: boolean;
  documentary?: DocumentaryVideo | null; // If editing existing
  onClose: () => void;
  onSave: (doc: DocumentaryVideo) => void;
}

export const AddEditDocumentaryModal: React.FC<AddEditDocumentaryModalProps> = ({
  isOpen,
  documentary,
  onClose,
  onSave,
}) => {
  const isEditing = Boolean(documentary);

  const [title, setTitle] = useState(documentary?.title || '');
  const [description, setDescription] = useState(documentary?.description || '');
  const [category, setCategory] = useState(documentary?.category || 'Traditional Bodo Weaving');
  const [customCategory, setCustomCategory] = useState('');
  const [durationFormatted, setDurationFormatted] = useState(documentary?.durationFormatted || '05:00');
  const [artisanName, setArtisanName] = useState(documentary?.artisanName || 'Anjali Swargiary');
  const [featured, setFeatured] = useState(documentary?.featured ?? false);
  const [tagsStr, setTagsStr] = useState(documentary?.tags?.join(', ') || '');
  
  // Video Source Choice: 'file' | 'url'
  const [videoSourceType, setVideoSourceType] = useState<'file' | 'url'>(
    documentary?.videoType === 'youtube' || documentary?.videoType === 'vimeo' ? 'url' : 'file'
  );
  const [urlInput, setUrlInput] = useState(documentary?.videoSrc || '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [thumbnailInput, setThumbnailInput] = useState(documentary?.thumbnailUrl || '');
  
  // Progress & Status
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateVideoFile(file);
    if (!validation.valid) {
      setErrorMessage(validation.error || 'Invalid video file format.');
      setSelectedFile(null);
      return;
    }

    setErrorMessage(null);
    setSelectedFile(file);

    // Auto calculate duration from video element if possible
    try {
      const tempUrl = URL.createObjectURL(file);
      const tempVid = document.createElement('video');
      tempVid.src = tempUrl;
      tempVid.onloadedmetadata = () => {
        const secs = Math.round(tempVid.duration);
        if (!isNaN(secs) && secs > 0) {
          const m = Math.floor(secs / 60);
          const s = secs % 60;
          setDurationFormatted(`${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
        }
        URL.revokeObjectURL(tempUrl);
      };
    } catch {}
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!title.trim()) {
      setErrorMessage('Please provide a documentary title.');
      return;
    }

    let finalVideoSrc = documentary?.videoSrc || '';
    let finalVideoType: DocumentaryVideo['videoType'] = documentary?.videoType || 'direct';

    // 1. Process Video Source
    if (videoSourceType === 'file') {
      if (selectedFile) {
        setIsUploading(true);
        setUploadProgress(15);
        try {
          const docId = documentary?.id || `doc-${Date.now()}`;
          const progressInterval = setInterval(() => {
            setUploadProgress((p) => (p < 85 ? p + 20 : p));
          }, 120);

          const storedUrl = await saveVideoBlob(`video-${docId}`, selectedFile, selectedFile.name);
          clearInterval(progressInterval);
          setUploadProgress(100);
          finalVideoSrc = storedUrl;
          finalVideoType = 'file';
        } catch (err: any) {
          setIsUploading(false);
          setErrorMessage(err?.message || 'Failed to save video to persistent storage.');
          return;
        } finally {
          setIsUploading(false);
        }
      } else if (!finalVideoSrc) {
        setErrorMessage('Please select a video file or choose "Enter Video URL".');
        return;
      }
    } else {
      // URL input (YouTube, Vimeo, direct stream)
      const parsed = parseVideoUrl(urlInput);
      if (!parsed) {
        setErrorMessage('Please enter a valid video URL (YouTube, Vimeo, or direct .mp4/.webm URL).');
        return;
      }
      finalVideoSrc = parsed.embedUrl;
      finalVideoType = parsed.type;
    }

    // Parse duration seconds
    const parts = durationFormatted.split(':');
    let durSeconds = 0;
    if (parts.length === 2) {
      durSeconds = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    } else {
      durSeconds = parseInt(durationFormatted, 10) || 180;
    }

    const finalCategory = category === 'Other' && customCategory.trim() ? customCategory.trim() : category;

    const tags = tagsStr
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const docId = documentary?.id || `doc-${Date.now()}`;
    const newDoc: DocumentaryVideo = {
      id: docId,
      title: title.trim(),
      description: description.trim(),
      videoSrc: finalVideoSrc,
      videoType: finalVideoType,
      thumbnailUrl: thumbnailInput.trim() || '/assets/images/weaving/weaving-process.jpg',
      category: finalCategory,
      duration: durSeconds,
      durationFormatted: durationFormatted.trim() || '05:00',
      artisanName: artisanName.trim() || 'Anjali Swargiary',
      featured,
      published: true,
      uploadDate: documentary?.uploadDate || new Date().toISOString().split('T')[0],
      tags: tags.length > 0 ? tags : ['Handloom', 'Bodo Heritage'],
    };

    setSuccessMessage('Documentary saved successfully!');
    setTimeout(() => {
      onSave(newDoc);
      onClose();
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#FAF8F5] border border-stone-300 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#171513] text-white border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <Film className="w-5 h-5 text-[#FFE600]" />
            <div>
              <h3 className="text-base font-bold font-editorial">
                {isEditing ? 'Edit Documentary Video' : 'Add Bodo Handloom Documentary'}
              </h3>
              <p className="text-[11px] text-stone-300">
                Upload video or embed streams into the living documentary archive
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs text-stone-800 flex-1">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Documentary Title */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
              Documentary Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Traditional Bodo Handloom Weaving"
              className="w-full px-3 py-2 bg-white rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-800 font-editorial text-sm font-semibold"
            />
          </div>

          {/* Category & Artisan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-800 text-xs"
              >
                {DOCUMENTARY_CATEGORIES.filter((c) => c !== 'All Documentaries').map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="Other">+ Add Custom Category</option>
              </select>
              {category === 'Other' && (
                <input
                  type="text"
                  placeholder="Enter custom category name"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="w-full mt-2 px-3 py-1.5 bg-white rounded-lg border border-stone-300 text-xs"
                />
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                Master Weaver / Artisan Name
              </label>
              <input
                type="text"
                value={artisanName}
                onChange={(e) => setArtisanName(e.target.value)}
                placeholder="e.g. Anjali Swargiary"
                className="w-full px-3 py-2 bg-white rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-800 text-xs"
              />
            </div>
          </div>

          {/* Video Source Choice: File or URL */}
          <div className="p-4 bg-white rounded-xl border border-stone-300 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold uppercase tracking-wider text-stone-700">
                Video Source *
              </label>
              <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setVideoSourceType('file')}
                  className={`px-3 py-1 rounded-md text-[11px] font-bold cursor-pointer transition-colors ${
                    videoSourceType === 'file'
                      ? 'bg-[#171513] text-[#FFE600] shadow-xs'
                      : 'text-stone-600 hover:text-black'
                  }`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setVideoSourceType('url')}
                  className={`px-3 py-1 rounded-md text-[11px] font-bold cursor-pointer transition-colors ${
                    videoSourceType === 'url'
                      ? 'bg-[#171513] text-[#FFE600] shadow-xs'
                      : 'text-stone-600 hover:text-black'
                  }`}
                >
                  Enter Video URL
                </button>
              </div>
            </div>

            {videoSourceType === 'file' ? (
              <div className="space-y-2">
                <div className="border-2 border-dashed border-stone-300 rounded-lg p-5 text-center bg-[#FAF8F5] hover:bg-stone-100 transition-colors">
                  <input
                    type="file"
                    id="doc-video-file-input"
                    accept="video/mp4,video/webm,video/ogg"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="doc-video-file-input"
                    className="cursor-pointer flex flex-col items-center space-y-1.5"
                  >
                    <Upload className="w-6 h-6 text-[#171513]" />
                    <span className="font-bold text-xs text-stone-900">
                      {selectedFile ? selectedFile.name : 'Click to select MP4 or WebM video file'}
                    </span>
                    <span className="text-[10px] text-stone-500">
                      Supports up to 500MB with persistent browser database storage
                    </span>
                  </label>
                </div>
                {selectedFile && (
                  <p className="text-[11px] text-emerald-700 font-medium">
                    ✓ File selected: {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(1)} MB)
                  </p>
                )}
                {isEditing && !selectedFile && documentary?.videoSrc && (
                  <p className="text-[11px] text-stone-500 font-mono truncate">
                    Current source: {documentary.videoSrc}
                  </p>
                )}
              </div>
            ) : (
              <div>
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... or https://vimeo.com/... or /assets/video/..."
                  className="w-full px-3 py-2 bg-white rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-800 font-mono text-xs"
                />
                <p className="text-[10px] text-stone-500 mt-1">
                  Supports YouTube embeds, Vimeo links, and direct video file URLs (.mp4 / .webm)
                </p>
              </div>
            )}

            {/* Upload Progress Bar */}
            {isUploading && (
              <div className="space-y-1 pt-2">
                <div className="flex justify-between text-[10px] font-bold text-stone-600">
                  <span>Saving to persistent storage...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#FFE600] transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Thumbnail URL & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                Thumbnail Image URL
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={thumbnailInput}
                  onChange={(e) => setThumbnailInput(e.target.value)}
                  placeholder="/assets/images/weaving/weaving-process.jpg"
                  className="w-full pl-8 pr-3 py-2 bg-white rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-800 font-mono text-xs"
                />
                <ImageIcon className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                Duration (MM:SS)
              </label>
              <input
                type="text"
                value={durationFormatted}
                onChange={(e) => setDurationFormatted(e.target.value)}
                placeholder="05:45"
                className="w-full px-3 py-2 bg-white rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-800 text-xs font-mono"
              />
            </div>
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
              Short Description *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Intimate documentation of village pit-loom mechanics and shuttle throwing rhythm..."
              className="w-full px-3 py-2 bg-white rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-800 text-xs font-editorial leading-relaxed"
            />
          </div>

          {/* Tags & Featured Checkbox */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={tagsStr}
                onChange={(e) => setTagsStr(e.target.value)}
                placeholder="Loom, Handloom, Weaving, Aronai"
                className="w-full px-3 py-2 bg-white rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-800 text-xs"
              />
            </div>

            <div className="pt-4">
              <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 rounded border-stone-300 accent-[#171513]"
                />
                <span className="text-xs font-bold text-stone-800 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#FFE600] fill-[#FFE600]" />
                  Mark as Featured Documentary
                </span>
              </label>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="px-4 py-2 rounded-lg text-stone-600 hover:bg-stone-200 text-xs font-semibold cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="px-5 py-2 rounded-lg bg-[#171513] hover:bg-[#3A2415] text-[#FFE600] text-xs font-bold tracking-wider uppercase flex items-center gap-2 shadow-md cursor-pointer transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isUploading ? 'Uploading...' : 'Save Documentary'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
