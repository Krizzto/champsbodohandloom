import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Save,
  Plus,
  Trash2,
  Award,
  Sparkles,
  MapPin,
  User,
  Image as ImageIcon,
  Upload,
  Link as LinkIcon,
  Eye,
  Film,
  Check,
  AlertCircle,
} from 'lucide-react';
import { WeaverProfile } from '../../types';
import { validateVideoFile, saveVideoBlob, parseVideoUrl } from '../../services/videoStorage';
import { useContentStore } from '../../store/contentStore';

interface AddEditWeaverModalProps {
  isOpen: boolean;
  weaver: WeaverProfile | null; // null for Add, profile for Edit
  onClose: () => void;
  onSave: (weaverData: WeaverProfile) => void;
}

export const AddEditWeaverModal: React.FC<AddEditWeaverModalProps> = ({
  isOpen,
  weaver,
  onClose,
  onSave,
}) => {
  const { setCustomImage } = useContentStore();

  const isEditing = Boolean(weaver);

  // Form Fields
  const [name, setName] = useState('');
  const [bodoTitle, setBodoTitle] = useState('');
  const [location, setLocation] = useState('');
  const [district, setDistrict] = useState('');
  const [experience, setExperience] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [traditionalKnowledge, setTraditionalKnowledge] = useState('');
  const [interviewQuote, setInterviewQuote] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoUploadName, setVideoUploadName] = useState<string | null>(null);

  // Arrays for masterpieces, achievements, and techniques
  const [masterpieces, setMasterpieces] = useState<string[]>([]);
  const [newMasterpiece, setNewMasterpiece] = useState('');

  const [achievements, setAchievements] = useState<string[]>([]);
  const [newAchievement, setNewAchievement] = useState('');

  const [techniques, setTechniques] = useState<string[]>([]);
  const [newTechnique, setNewTechnique] = useState('');

  // Media upload & preview states
  const [isPreviewActive, setIsPreviewActive] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [videoUploadProgress, setVideoUploadProgress] = useState(0);
  const [formError, setFormError] = useState<string | null>(null);
  const [videoSuccessNotice, setVideoSuccessNotice] = useState<string | null>(null);

  const photoFileInputRef = useRef<HTMLInputElement>(null);
  const videoFileInputRef = useRef<HTMLInputElement>(null);

  // Populate form on open or weaver change
  useEffect(() => {
    if (weaver) {
      setName(weaver.name || '');
      setBodoTitle(weaver.bodoTitle || 'माष्टार दिरगिरि');
      setLocation(weaver.location || '');
      setDistrict(weaver.district || 'Bodoland Territorial Region, Assam');
      setExperience(weaver.experience || '');
      setSpecialization(weaver.specialization || '');
      setTraditionalKnowledge(weaver.traditionalKnowledge || '');
      setInterviewQuote(weaver.interviewQuote || '');
      setPhotoUrl(weaver.photo || weaver.image || '');
      setVideoUrl(weaver.videoData?.videoSrc || '');
      setMasterpieces(weaver.masterpieces && weaver.masterpieces.length > 0 ? [...weaver.masterpieces] : []);
      setAchievements(weaver.achievements && weaver.achievements.length > 0 ? [...weaver.achievements] : []);
      setTechniques(weaver.techniques && weaver.techniques.length > 0 ? [...weaver.techniques] : []);
      setVideoUploadName(null);
    } else {
      // Defaults for brand new weaver
      setName('');
      setBodoTitle('माष्टार दिरगिरि (Master Weaver)');
      setLocation('Dotma Village, Kokrajhar District');
      setDistrict('Bodoland Territorial Region, Assam');
      setExperience('25 Years of Living Craftsmanship');
      setSpecialization('Traditional Dokhona & Rare Botanical Dyeing');
      setTraditionalKnowledge('Practices indigenous loom techniques learned through maternal lineage.');
      setInterviewQuote('Every motif carries the living memory of our ancestors.');
      setPhotoUrl('/assets/images/people/weavers/interview-elder.jpg');
      setVideoUrl('');
      setMasterpieces(['Heirloom Dokhona Thaosi', 'Sacred Forest Fern Aronai']);
      setAchievements(['Bodoland Traditional Weaver Honor']);
      setTechniques(['Handloom Sal Weaving', 'Natural Forest Mordanting']);
      setVideoUploadName(null);
    }
    setIsPreviewActive(false);
    setFormError(null);
    setVideoSuccessNotice(null);
  }, [weaver, isOpen]);

  if (!isOpen) return null;

  // Masterpieces helpers
  const handleAddMasterpiece = () => {
    if (newMasterpiece.trim()) {
      setMasterpieces([...masterpieces, newMasterpiece.trim()]);
      setNewMasterpiece('');
    }
  };
  const handleRemoveMasterpiece = (idx: number) => {
    setMasterpieces(masterpieces.filter((_, i) => i !== idx));
  };

  // Achievements helpers
  const handleAddAchievement = () => {
    if (newAchievement.trim()) {
      setAchievements([...achievements, newAchievement.trim()]);
      setNewAchievement('');
    }
  };
  const handleRemoveAchievement = (idx: number) => {
    setAchievements(achievements.filter((_, i) => i !== idx));
  };

  // Techniques helpers
  const handleAddTechnique = () => {
    if (newTechnique.trim()) {
      setTechniques([...techniques, newTechnique.trim()]);
      setNewTechnique('');
    }
  };
  const handleRemoveTechnique = (idx: number) => {
    setTechniques(techniques.filter((_, i) => i !== idx));
  };

  // Handle local photo upload via file reader
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFormError('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setPhotoUrl(result);
        const tempKey = weaver?.id ? `weaver-portrait-${weaver.id}` : `temp-weaver-portrait-${Date.now()}`;
        setCustomImage(tempKey, result);
        setFormError(null);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Handle local video upload via IndexedDB
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateVideoFile(file);
    if (!validation.valid) {
      setFormError(validation.error || 'Invalid video file format.');
      return;
    }

    setIsUploadingVideo(true);
    setVideoUploadProgress(15);
    setFormError(null);

    try {
      const progressTimer = setInterval(() => {
        setVideoUploadProgress((p) => (p < 85 ? p + 25 : p));
      }, 100);

      const targetId = weaver?.id || `weaver-${Date.now()}`;
      const videoStorageKey = `weaver-video-${targetId}`;
      const persistentUrl = await saveVideoBlob(videoStorageKey, file, file.name);

      clearInterval(progressTimer);
      setVideoUploadProgress(100);
      setVideoUrl(persistentUrl);
      setVideoUploadName(file.name);
      setCustomImage(videoStorageKey, persistentUrl);
      setVideoSuccessNotice(`Video "${file.name}" saved to persistent storage!`);
      setTimeout(() => setVideoSuccessNotice(null), 4000);
    } catch (err: any) {
      console.error('Failed to upload video:', err);
      setFormError(err?.message || 'Could not save video to persistent storage.');
    } finally {
      setIsUploadingVideo(false);
      e.target.value = '';
    }
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError('Weaver name is required.');
      return;
    }
    if (!location.trim()) {
      setFormError('Village and district are required.');
      return;
    }
    if (!traditionalKnowledge.trim()) {
      setFormError('Biography & traditional knowledge description is required.');
      return;
    }

    // Generate or preserve ID
    const id =
      weaver?.id ||
      `weaver-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || Date.now()}`;

    // If an external URL was entered, check if YouTube/Vimeo embed needed
    let finalVideoSrc = videoUrl.trim();
    if (finalVideoSrc && (finalVideoSrc.includes('youtube.com') || finalVideoSrc.includes('youtu.be') || finalVideoSrc.includes('vimeo.com'))) {
      const parsed = parseVideoUrl(finalVideoSrc);
      if (parsed) {
        finalVideoSrc = parsed.embedUrl;
      }
    }

    // If custom photo was uploaded, ensure it's saved in customImages under weaver-portrait-ID
    if (photoUrl.startsWith('data:image/')) {
      setCustomImage(`weaver-portrait-${id}`, photoUrl);
    }
    if (finalVideoSrc) {
      setCustomImage(`weaver-video-${id}`, finalVideoSrc);
    }

    const payload: WeaverProfile = {
      id,
      name: name.trim(),
      bodoTitle: bodoTitle.trim() || 'माष्टार दिरगिरि',
      location: location.trim(),
      district: district.trim() || 'Bodoland Territorial Region, Assam',
      experience: experience.trim() || 'Living Craftsmanship',
      specialization: specialization.trim() || 'Traditional Bodo Weaving',
      traditionalKnowledge: traditionalKnowledge.trim(),
      interviewQuote: interviewQuote.trim() || 'Preserving the sacred threads of Bodoland.',
      audioDuration: weaver?.audioDuration || '04:00',
      masterpieces: masterpieces.length > 0 ? masterpieces : ['Heirloom Dokhona', 'Golden Aronai'],
      achievements: achievements,
      techniques: techniques,
      photo: photoUrl || '/assets/images/people/weavers/anjali-swargiary.jpg',
      image: photoUrl || '/assets/images/people/weavers/anjali-swargiary.jpg',
      videoData: {
        ...(weaver?.videoData || {}),
        videoSrc: finalVideoSrc,
        posterImage: photoUrl || '/assets/images/people/weavers/anjali-swargiary.jpg',
        title: `Oral Heritage Interview with ${name.trim()}`,
        subtitle: `Living Traditions of ${specialization.trim() || 'Bodo Handloom'}`,
        location: location.trim(),
      },
    };

    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#FAF8F5] border border-stone-300 rounded-2xl shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col animate-fade-in">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#171513] text-white border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <User className="w-5 h-5 text-[#FFE600]" />
            <div>
              <h3 className="text-base font-bold font-editorial text-white">
                {isEditing ? `Edit Master Weaver: ${weaver?.name}` : '+ Add New Master Weaver Profile'}
              </h3>
              <p className="text-[11px] text-stone-300">
                {isEditing
                  ? 'Update biography, achievements, and archival interview recording'
                  : 'Add a new traditional artisan slide to the Meet the Weaver carousel'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Preview Toggle Button */}
            <button
              type="button"
              onClick={() => setIsPreviewActive(!isPreviewActive)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${
                isPreviewActive
                  ? 'bg-[#FFE600] text-black border-[#FFE600]'
                  : 'bg-stone-800 hover:bg-stone-700 text-stone-300 border-stone-700'
              }`}
              title="Preview how this profile will look on the slider"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{isPreviewActive ? 'Back to Edit' : 'Live Preview'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Error Banner */}
        {formError && (
          <div className="px-6 py-2.5 bg-rose-50 border-b border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-medium">{formError}</span>
          </div>
        )}

        {/* Live Preview Mode */}
        {isPreviewActive ? (
          <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-white">
            <div className="bg-[#FAF8F5] p-3 rounded-lg border border-stone-200 text-xs text-stone-600 flex items-center justify-between">
              <span>Preview Mode: This is how the weaver card will look in the slider.</span>
              <button
                type="button"
                onClick={() => setIsPreviewActive(false)}
                className="font-bold text-[#8B2635] hover:underline"
              >
                Return to form
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[38%_1fr] gap-6 items-start border border-stone-300 p-6 rounded-xl bg-white shadow-sm">
              {/* Left Column Preview */}
              <div className="space-y-4">
                <div className="relative aspect-4/5 rounded-lg overflow-hidden border border-stone-300 bg-stone-900">
                  <img
                    src={photoUrl || '/assets/images/people/weavers/anjali-swargiary.jpg'}
                    alt={name || 'Weaver preview'}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3 text-white">
                    <p className="text-lg font-bold font-editorial">{name || 'Artisan Name'}</p>
                    <p className="text-xs text-[#FFE600]">{bodoTitle || 'माष्टार दिरगिरि'}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 font-editorial block">
                    Preserved Masterpieces
                  </span>
                  <div className="flex flex-wrap gap-1.5 text-xs">
                    {masterpieces.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded bg-[#FAF8F5] border border-stone-200 text-stone-700 text-[11px]"
                      >
                        <span className="font-mono text-[#A64B2A] font-bold mr-1">[{idx + 1}]</span>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 text-xs border-t border-stone-200 pt-2">
                  <p className="text-stone-700 font-medium flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#8B2635]" />
                    <span>{location || 'Village, District'}</span>
                  </p>
                  <p className="text-stone-700 font-medium flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-[#A64B2A]" />
                    <span>{experience || 'Years of experience'}</span>
                  </p>
                </div>
              </div>

              {/* Right Column Preview */}
              <div className="space-y-4">
                <blockquote className="text-lg font-editorial italic text-stone-800 border-l-4 border-[#8B2635] pl-4">
                  &ldquo;{interviewQuote || 'Archival quote here...'}&rdquo;
                </blockquote>
                <p className="text-xs text-stone-600 font-editorial leading-relaxed">
                  {traditionalKnowledge || 'Biographical information and traditional knowledge.'}
                </p>
                <div className="aspect-video bg-stone-900 rounded-lg flex items-center justify-center text-white text-xs border border-stone-300">
                  {videoUrl ? (
                    <span className="text-[#FFE600] font-mono">Video Configured: {videoUploadName || videoUrl.slice(0, 40)}...</span>
                  ) : (
                    <span className="text-stone-400">No interview video configured (Placeholder will show)</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Form Content */
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs text-stone-800 flex-1">
            {/* Row 1: Name & Bodo Title */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Master Weaver Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Bimala Basumatary"
                  className="w-full px-3 py-2 bg-white rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-800 font-editorial text-sm font-semibold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Bodo Honorific Title
                </label>
                <input
                  type="text"
                  value={bodoTitle}
                  onChange={(e) => setBodoTitle(e.target.value)}
                  placeholder="e.g. माष्टार दिरगिरि गाहाय (Master Artisan)"
                  className="w-full px-3 py-2 bg-white rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-800 text-sm font-medium"
                />
              </div>
            </div>

            {/* Row 2: Location & Region */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Village & District *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Bijni, Chirang District"
                    className="w-full pl-8 pr-3 py-2 bg-white rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-800 text-xs"
                  />
                  <MapPin className="w-3.5 h-3.5 text-[#8B2635] absolute left-2.5 top-2.5" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                  State / Region
                </label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="e.g. Bodoland Territorial Region, Assam"
                  className="w-full px-3 py-2 bg-white rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-800 text-xs"
                />
              </div>
            </div>

            {/* Row 3: Experience & Specialization */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Years of Living Craftsmanship *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="e.g. 29 Years of Handloom Mastery"
                    className="w-full pl-8 pr-3 py-2 bg-white rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-800 text-xs font-semibold"
                  />
                  <Award className="w-3.5 h-3.5 text-[#A64B2A] absolute left-2.5 top-2.5" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Specialization
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    placeholder="e.g. Fine Cotton Aronai, Dingkhia Agor"
                    className="w-full pl-8 pr-3 py-2 bg-white rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-800 text-xs"
                  />
                  <Sparkles className="w-3.5 h-3.5 text-[#0F4C81] absolute left-2.5 top-2.5" />
                </div>
              </div>
            </div>

            {/* Row 4: Profile Photograph (Upload or Enter URL) */}
            <div className="p-3.5 bg-white rounded-xl border border-stone-200 space-y-2.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700">
                Weaver Profile Photograph
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                {photoUrl && (
                  <div className="w-14 h-16 rounded-md overflow-hidden border border-stone-300 shrink-0 bg-stone-100">
                    <img src={photoUrl} alt="Thumbnail preview" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 w-full space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={photoUrl}
                      onChange={(e) => setPhotoUrl(e.target.value)}
                      placeholder="/assets/images/people/weavers/... or https://..."
                      className="flex-1 px-3 py-1.5 bg-[#FAF8F5] rounded border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-800 font-mono text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => photoFileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold border border-stone-300 flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <Upload className="w-3.5 h-3.5 text-stone-600" />
                      <span>Upload Photo</span>
                    </button>
                  </div>
                  <input
                    ref={photoFileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </div>
              </div>
            </div>

            {/* Row 5: Biography & Traditional Knowledge */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                Biography & Traditional Knowledge *
              </label>
              <textarea
                required
                rows={3}
                value={traditionalKnowledge}
                onChange={(e) => setTraditionalKnowledge(e.target.value)}
                placeholder="Describe her loom lineage, teachers, rare motifs mastered, and community teaching..."
                className="w-full px-3 py-2 bg-white rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-800 text-xs font-editorial leading-relaxed"
              />
            </div>

            {/* Row 6: Archival Interview Quote */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                Archival Interview Quote *
              </label>
              <textarea
                required
                rows={2}
                value={interviewQuote}
                onChange={(e) => setInterviewQuote(e.target.value)}
                placeholder="The loom teaches patience that no modern classroom can provide..."
                className="w-full px-3 py-2 bg-white rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-800 text-xs font-editorial italic leading-relaxed"
              />
            </div>

            {/* Row 7: Interview Video System (Upload MP4/WebM to IndexedDB or Enter URL) */}
            <div className="p-3.5 bg-white rounded-xl border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5 text-[#8B2635]" />
                  <span>Master Weaver Interview Video</span>
                </label>
                {videoUrl && (
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono">
                    Video Linked
                  </span>
                )}
              </div>

              {videoSuccessNotice && (
                <div className="p-2 bg-emerald-50 border border-emerald-300 text-emerald-800 text-[11px] rounded flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{videoSuccessNotice}</span>
                </div>
              )}

              {isUploadingVideo && (
                <div className="p-3 bg-stone-100 rounded-lg space-y-2">
                  <div className="flex justify-between text-xs text-stone-600">
                    <span>Uploading video to persistent IndexedDB...</span>
                    <span>{videoUploadProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#FFE600] transition-all duration-200"
                      style={{ width: `${videoUploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2">
                <div className="relative">
                  <input
                    type="text"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="Enter YouTube URL, Vimeo URL, or direct MP4/WebM address"
                    className="w-full pl-8 pr-3 py-2 bg-[#FAF8F5] rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-800 font-mono text-xs"
                  />
                  <LinkIcon className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => videoFileInputRef.current?.click()}
                    disabled={isUploadingVideo}
                    className="px-3.5 py-2 rounded-lg bg-[#171513] hover:bg-stone-800 text-[#FFE600] text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Video File</span>
                  </button>
                  <input
                    ref={videoFileInputRef}
                    type="file"
                    accept="video/mp4,video/webm"
                    className="hidden"
                    onChange={handleVideoUpload}
                  />
                </div>
              </div>
              <p className="text-[11px] text-stone-500">
                You can upload MP4/WebM files directly into browser storage, or link any YouTube/Vimeo video.
              </p>
            </div>

            {/* Row 8: Preserved Masterpieces */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                Preserved Masterpieces
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {masterpieces.map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-stone-100 border border-stone-300 text-stone-800 text-xs"
                  >
                    <span className="font-mono text-[#A64B2A] font-bold">[{idx + 1}]</span>
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveMasterpiece(idx)}
                      className="p-0.5 text-stone-400 hover:text-rose-600 ml-1 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMasterpiece}
                  onChange={(e) => setNewMasterpiece(e.target.value)}
                  placeholder="e.g. Rare Dingkhia Dokhona (2023)"
                  className="flex-1 px-3 py-1.5 bg-white rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-800 text-xs"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddMasterpiece();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddMasterpiece}
                  className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Masterpiece</span>
                </button>
              </div>
            </div>

            {/* Row 9: Achievements */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                Achievements & Honors (Optional)
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {achievements.map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#FFE600]/20 border border-[#FFE600]/40 text-stone-800 text-xs"
                  >
                    <Award className="w-3 h-3 text-[#A64B2A]" />
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAchievement(idx)}
                      className="p-0.5 text-stone-400 hover:text-rose-600 ml-1 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newAchievement}
                  onChange={(e) => setNewAchievement(e.target.value)}
                  placeholder="e.g. State Master Craftsperson Honor (2019)"
                  className="flex-1 px-3 py-1.5 bg-white rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-800 text-xs"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddAchievement();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddAchievement}
                  className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Achievement</span>
                </button>
              </div>
            </div>

            {/* Row 10: Weaving Techniques */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                Traditional Weaving Techniques (Optional)
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {techniques.map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#F4EFE6] border border-stone-300 text-stone-800 text-xs"
                  >
                    <Sparkles className="w-3 h-3 text-[#0F4C81]" />
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTechnique(idx)}
                      className="p-0.5 text-stone-400 hover:text-rose-600 ml-1 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTechnique}
                  onChange={(e) => setNewTechnique(e.target.value)}
                  placeholder="e.g. Double-weft supplementary Agor drafting"
                  className="flex-1 px-3 py-1.5 bg-white rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-800 text-xs"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTechnique();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddTechnique}
                  className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Technique</span>
                </button>
              </div>
            </div>

            {/* Footer Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setIsPreviewActive(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold border border-stone-300 transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview Slide</span>
              </button>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg text-stone-600 hover:bg-stone-200 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploadingVideo}
                  className="px-5 py-2 rounded-lg bg-[#171513] hover:bg-[#3A2415] text-[#FFE600] text-xs font-bold tracking-wider uppercase flex items-center gap-2 shadow-md cursor-pointer transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isEditing ? 'Save Changes' : 'Save Weaver'}</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
