import React, { useState } from 'react';
import { X, Save, Plus, Trash2, Award, Sparkles, MapPin, User, Image as ImageIcon } from 'lucide-react';
import { WeaverProfile } from '../../types';

interface EditWeaverModalProps {
  isOpen: boolean;
  profile: WeaverProfile;
  onClose: () => void;
  onSave: (updated: Partial<WeaverProfile>) => void;
}

export const EditWeaverModal: React.FC<EditWeaverModalProps> = ({
  isOpen,
  profile,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(profile.name || 'Anjali Swargiary');
  const [bodoTitle, setBodoTitle] = useState(profile.bodoTitle || 'माष्टार दिरगिरि');
  const [location, setLocation] = useState(profile.location || 'Dotma Village, Kokrajhar District');
  const [district, setDistrict] = useState(profile.district || 'Bodoland Territorial Region, Assam');
  const [experience, setExperience] = useState(profile.experience || '38 Years of Living Craftsmanship');
  const [specialization, setSpecialization] = useState(
    profile.specialization || 'Eri Silk Dokhona Thaosi, Traditional Natural Indigo Dyeing'
  );
  const [traditionalKnowledge, setTraditionalKnowledge] = useState(profile.traditionalKnowledge || '');
  const [interviewQuote, setInterviewQuote] = useState(profile.interviewQuote || '');
  const [masterpieces, setMasterpieces] = useState<string[]>(
    profile.masterpieces && profile.masterpieces.length > 0
      ? [...profile.masterpieces]
      : ['Heirloom Wedding Dokhona', 'Golden Muga Aronai', 'Traditional Dokhona Thaosi', 'Eri Silk Chador']
  );
  const [newMasterpiece, setNewMasterpiece] = useState('');
  const [photoUrl, setPhotoUrl] = useState(profile.photo || profile.image || '');

  if (!isOpen) return null;

  const handleAddMasterpiece = () => {
    if (newMasterpiece.trim()) {
      setMasterpieces([...masterpieces, newMasterpiece.trim()]);
      setNewMasterpiece('');
    }
  };

  const handleRemoveMasterpiece = (idx: number) => {
    setMasterpieces(masterpieces.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      bodoTitle,
      location,
      district,
      experience,
      specialization,
      traditionalKnowledge,
      interviewQuote,
      masterpieces,
      photo: photoUrl,
      image: photoUrl,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#FAF8F5] border border-stone-300 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#171513] text-white border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <User className="w-5 h-5 text-[#FFE600]" />
            <div>
              <h3 className="text-base font-bold font-editorial">Edit Master Weaver Profile</h3>
              <p className="text-[11px] text-stone-300">Update biographical facts, craft lineage & preserved masterpieces</p>
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
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs text-stone-800 flex-1">
          {/* Name & Honorific Title */}
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
                placeholder="e.g. Anjali Swargiary"
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
                placeholder="e.g. माष्टार दिरगिरि"
                className="w-full px-3 py-2 bg-white rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-800 text-sm font-medium"
              />
            </div>
          </div>

          {/* Location & District */}
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
                  placeholder="e.g. Dotma Village, Kokrajhar District"
                  className="w-full pl-8 pr-3 py-2 bg-white rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-800 text-xs"
                />
                <MapPin className="w-3.5 h-3.5 text-[#8B2635] absolute left-2.5 top-2.5" />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                Region / State
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

          {/* Experience & Specialization */}
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
                  placeholder="e.g. 38 Years of Living Craftsmanship"
                  className="w-full pl-8 pr-3 py-2 bg-white rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-800 text-xs font-semibold"
                />
                <Award className="w-3.5 h-3.5 text-[#A64B2A] absolute left-2.5 top-2.5" />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                Specialization & Techniques
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  placeholder="e.g. Eri Silk Dokhona Thaosi, Natural Dyes"
                  className="w-full pl-8 pr-3 py-2 bg-white rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-800 text-xs"
                />
                <Sparkles className="w-3.5 h-3.5 text-[#0F4C81] absolute left-2.5 top-2.5" />
              </div>
            </div>
          </div>

          {/* Profile Photo Path or URL */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
              Profile Photograph URL or Path
            </label>
            <div className="relative">
              <input
                type="text"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="/assets/images/people/weavers/anjali-swargiary.jpg or https://..."
                className="w-full pl-8 pr-3 py-2 bg-white rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-800 font-mono text-xs"
              />
              <ImageIcon className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Biography & Traditional Knowledge */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
              Biography & Traditional Knowledge *
            </label>
            <textarea
              required
              rows={3}
              value={traditionalKnowledge}
              onChange={(e) => setTraditionalKnowledge(e.target.value)}
              placeholder="Learned the art of the loom from maternal grandmother at age 9..."
              className="w-full px-3 py-2 bg-white rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-800 text-xs font-editorial leading-relaxed"
            />
          </div>

          {/* Interview Quote */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
              Archival Interview Quote *
            </label>
            <textarea
              required
              rows={2}
              value={interviewQuote}
              onChange={(e) => setInterviewQuote(e.target.value)}
              placeholder="When my shuttle glides across the loom, I am carrying the voices of our ancestors..."
              className="w-full px-3 py-2 bg-white rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-800 text-xs font-editorial italic leading-relaxed"
            />
          </div>

          {/* Preserved Masterpieces */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
              Preserved Masterpieces
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {masterpieces.map((item, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-stone-100 border border-stone-300 text-stone-800 text-xs"
                >
                  <span className="font-mono font-bold text-[#A64B2A]">[{idx + 1}]</span>
                  <span>{item}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveMasterpiece(idx)}
                    className="p-0.5 text-stone-400 hover:text-rose-600 ml-1 cursor-pointer"
                    title="Remove item"
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
                placeholder="Add masterpiece (e.g. Rare Hajw Agor Dokhona)"
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
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-stone-600 hover:bg-stone-200 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#171513] hover:bg-[#3A2415] text-[#FFE600] text-xs font-bold tracking-wider uppercase flex items-center gap-2 shadow-md cursor-pointer transition-transform hover:scale-105 active:scale-95"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
