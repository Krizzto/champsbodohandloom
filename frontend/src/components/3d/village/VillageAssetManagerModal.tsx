import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Box,
  RotateCcw,
  Sliders,
  Check,
  AlertTriangle,
  Eye,
  Trash2,
  Plus,
  Compass,
  Home,
  Sparkles,
  Layers,
  Search,
  Filter,
  Maximize2,
} from 'lucide-react';
import {
  useVillageAssetStore,
  VillageAssetCategory,
  VillageAssetSlotConfig,
} from '../../../store/villageAssetStore';
import { useContentStore } from '../../../store/contentStore';
import {
  validate3DFile,
  saveModelBlob,
  resolveModelUrl,
} from '../../../services/modelStorage';
import { ArtifactViewer } from '../ArtifactViewer';

const CATEGORY_TABS: { id: VillageAssetCategory | 'ALL'; label: string; icon: any }[] = [
  { id: 'ALL', label: 'All Village Objects', icon: Box },
  { id: 'HOUSES', label: 'Houses & Homesteads', icon: Home },
  { id: 'STRUCTURES', label: 'Gates & Fences', icon: Compass },
  { id: 'TREES', label: 'Trees & Palms', icon: Sparkles },
  { id: 'VEGETATION', label: 'Vegetation & Grass', icon: Layers },
  { id: 'ENVIRONMENT_PROPS', label: 'Props & Decor', icon: Box },
  { id: 'LOOMS', label: 'Looms & Equipment', icon: Sparkles },
  { id: 'TEXTILES', label: 'Textile Displays', icon: Layers },
  { id: 'TOOLS', label: 'Tools & Silk Materials', icon: Box },
  { id: 'MOTIFS', label: 'Motifs & Cauldrons', icon: Eye },
  { id: 'PEDESTALS', label: 'Exhibit Pedestals', icon: Box },
  { id: 'CUSTOM', label: 'Custom 3D Props', icon: Plus },
];

export const VillageAssetManagerModal: React.FC = () => {
  const {
    assets,
    isManagerOpen,
    activeCategory,
    selectedSlotId,
    closeManager,
    setActiveCategory,
    selectSlot,
    replaceWithModel,
    updateTransform,
    toggleSlotEnabled,
    resetSlotToDefault,
    resetAllToDefaults,
    addCustomPropSlot,
    removeCustomPropSlot,
  } = useVillageAssetStore();

  const { models } = useContentStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [uploadingSlotId, setUploadingSlotId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Quick 3D preview
  const [previewSlotId, setPreviewSlotId] = useState<string | null>(null);

  // New Custom Prop Form state
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customDesc, setCustomDesc] = useState('');
  const [customX, setCustomX] = useState<number>(0);
  const [customY, setCustomY] = useState<number>(0);
  const [customZ, setCustomZ] = useState<number>(0);

  if (!isManagerOpen) return null;

  const assetList = Object.values(assets);
  const totalAssets = assetList.length;
  const customCount = assetList.filter((a) => a.isCustom).length;

  const filteredAssets = assetList.filter((item) => {
    const matchesCat = activeCategory === 'ALL' || item.category === activeCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.bodoName && item.bodoName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.customFileName && item.customFileName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const selectedSlot = selectedSlotId ? assets[selectedSlotId] : null;

  // Handle uploading a .glb/.gltf file for a specific slot
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, slotId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setUploadSuccess(null);
    setUploadingSlotId(slotId);

    const validation = validate3DFile(file);
    if (!validation.valid) {
      setUploadError(validation.error || 'Invalid 3D file format');
      setUploadingSlotId(null);
      return;
    }

    try {
      const modelId = `model-slot-${slotId}-${Date.now()}`;
      await saveModelBlob(modelId, file, file.name);

      replaceWithModel(slotId, {
        modelId,
        modelUrl: `indexeddb://${modelId}`,
        fileName: file.name,
        modelName: file.name.replace(/\.(glb|gltf)$/i, ''),
        fileSize: file.size,
      });

      setUploadSuccess(`Model "${file.name}" successfully assigned!`);
      setTimeout(() => setUploadSuccess(null), 3500);
    } catch (err: any) {
      console.error('Failed to replace slot model:', err);
      setUploadError(`Failed to save model: ${err.message || 'Storage error'}`);
    } finally {
      setUploadingSlotId(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Handle assigning an already uploaded model from the library
  const handleAssignExistingModel = (slotId: string, modelId: string) => {
    const found = models.find((m) => m.id === modelId);
    if (!found) return;

    replaceWithModel(slotId, {
      modelId: found.id,
      modelUrl: found.url,
      fileName: found.fileName || `${found.name}.glb`,
      modelName: found.name,
      fileSize: found.fileSize,
    });
    setUploadSuccess(`Assigned "${found.name}" to slot.`);
    setTimeout(() => setUploadSuccess(null), 3000);
  };

  const handleCreateCustomProp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const slotId = addCustomPropSlot({
      name: customName.trim(),
      description: customDesc.trim() || 'Custom 3D object added to the village.',
      position: [Number(customX) || 0, Number(customY) || 0, Number(customZ) || 0],
    });

    setIsAddingCustom(false);
    setCustomName('');
    setCustomDesc('');
    selectSlot(slotId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md select-none overflow-hidden font-sans">
      <div className="relative w-full max-w-6xl max-h-[92vh] flex flex-col bg-[#141210] border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden text-stone-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-800 bg-[#1C1814]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-700/10 border border-amber-500/30 text-[#FFE600]">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-base sm:text-lg font-bold tracking-wide text-white font-editorial">
                  VILLAGE 3D ASSET MANAGER
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {customCount} Custom / {totalAssets} Slots
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Replace any procedural house, tree, loom, or prop with your custom .glb 3D models in real-time.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => {
                if (window.confirm('Reset ALL village objects back to procedural defaults? Custom assignments will be cleared.')) {
                  resetAllToDefaults();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white text-xs border border-stone-700 cursor-pointer transition-colors"
              title="Reset all village objects to authentic procedural defaults"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Reset All to Procedural Defaults</span>
            </button>

            <button
              onClick={closeManager}
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Feedback Banner */}
        {uploadError && (
          <div className="px-5 py-2.5 bg-red-950/80 border-b border-red-800/60 flex items-center justify-between text-xs text-red-200">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{uploadError}</span>
            </div>
            <button onClick={() => setUploadError(null)} className="text-red-300 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
        {uploadSuccess && (
          <div className="px-5 py-2.5 bg-emerald-950/80 border-b border-emerald-800/60 flex items-center justify-between text-xs text-emerald-200">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{uploadSuccess}</span>
            </div>
            <button onClick={() => setUploadSuccess(null)} className="text-emerald-300 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Categories Bar & Search */}
        <div className="px-5 py-3 border-b border-stone-800 bg-[#171411] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Scrollable category pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {CATEGORY_TABS.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeCategory === tab.id;
              const count =
                tab.id === 'ALL'
                  ? totalAssets
                  : assetList.filter((a) => a.category === tab.id).length;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap cursor-pointer transition-all ${
                    isActive
                      ? 'bg-[#FFE600] text-black font-bold shadow-md shadow-amber-500/20'
                      : 'bg-stone-800/70 text-stone-400 hover:text-white hover:bg-stone-800'
                  }`}
                >
                  <TabIcon className={`w-3.5 h-3.5 ${isActive ? 'text-black' : 'text-amber-400'}`} />
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-black/20 text-black' : 'bg-stone-900 text-stone-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search bar & Add prop */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
              <input
                type="text"
                placeholder="Filter objects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-stone-900 border border-stone-700 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              onClick={() => setIsAddingCustom(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold whitespace-nowrap cursor-pointer"
              title="Add a custom 3D prop slot anywhere in the village"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add Custom Prop</span>
            </button>
          </div>
        </div>

        {/* Main Body: Grid of slots + Detail Transform panel */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col lg:flex-row gap-5">
          
          {/* Left: Cards List */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3.5 content-start">
            {filteredAssets.length === 0 ? (
              <div className="col-span-full py-12 text-center text-stone-500">
                <Box className="w-10 h-10 mx-auto mb-2 opacity-30 text-amber-400" />
                <p className="text-sm font-medium">No village objects found matching criteria.</p>
              </div>
            ) : (
              filteredAssets.map((slot) => {
                const isSelected = selectedSlotId === slot.id;
                return (
                  <div
                    key={slot.id}
                    onClick={() => selectSlot(slot.id)}
                    className={`relative p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#221C16] border-[#FFE600] ring-1 ring-[#FFE600]/40 shadow-lg'
                        : slot.isCustom
                        ? 'bg-[#181D17] border-emerald-500/30 hover:border-emerald-500/60'
                        : 'bg-stone-900/60 border-stone-800 hover:border-stone-700 hover:bg-stone-900'
                    }`}
                  >
                    <div>
                      {/* Top Bar of card */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-white tracking-wide">
                              {slot.name}
                            </h3>
                            {slot.isCustom ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                CUSTOM GLB
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-stone-800 text-stone-400 border border-stone-700">
                                PROCEDURAL
                              </span>
                            )}
                          </div>
                          {slot.bodoName && (
                            <span className="text-[11px] text-amber-400 font-medium">
                              {slot.bodoName}
                            </span>
                          )}
                        </div>

                        {/* Visibility toggle */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSlotEnabled(slot.id);
                          }}
                          className={`p-1.5 rounded-md border text-xs cursor-pointer ${
                            slot.enabled
                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                              : 'bg-stone-800 border-stone-700 text-stone-500'
                          }`}
                          title={slot.enabled ? 'Slot is visible' : 'Slot is hidden'}
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-xs text-stone-400 line-clamp-2 mb-3">
                        {slot.description}
                      </p>

                      {/* If custom model is assigned */}
                      {slot.isCustom && (
                        <div className="mb-3 p-2 rounded-lg bg-black/40 border border-emerald-900/40 flex items-center justify-between text-xs">
                          <div className="truncate">
                            <span className="text-stone-400 text-[10px] block">Active 3D Model:</span>
                            <span className="font-semibold text-emerald-300 truncate">
                              {slot.customFileName || slot.customModelName || 'custom.glb'}
                            </span>
                          </div>
                          {slot.customFileSize && (
                            <span className="text-[10px] text-stone-500 ml-2">
                              {(slot.customFileSize / (1024 * 1024)).toFixed(1)} MB
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions on card */}
                    <div className="pt-2 border-t border-stone-800 flex items-center justify-between gap-2 mt-auto">
                      <div className="flex items-center gap-1.5">
                        {/* Hidden file input */}
                        <label
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold border border-amber-500/30 cursor-pointer transition-colors"
                        >
                          <Upload className="w-3 h-3" />
                          <span>{slot.isCustom ? 'Replace GLB' : 'Upload GLB'}</span>
                          <input
                            type="file"
                            accept=".glb,.gltf"
                            onChange={(e) => handleFileUpload(e, slot.id)}
                            className="hidden"
                            disabled={uploadingSlotId === slot.id}
                          />
                        </label>

                        {slot.isCustom && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              resetSlotToDefault(slot.id);
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs border border-stone-700 cursor-pointer"
                            title="Revert back to procedural version"
                          >
                            <RotateCcw className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          selectSlot(slot.id);
                        }}
                        className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold text-stone-300 hover:text-white hover:bg-stone-800 cursor-pointer"
                      >
                        <Sliders className="w-3 h-3 text-amber-400" />
                        <span>Adjust</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Panel: Transform & Detailed Settings for Selected Slot */}
          {selectedSlot ? (
            <div className="w-full lg:w-96 flex flex-col bg-[#1A1612] border border-amber-500/30 rounded-xl p-4 shadow-xl">
              <div className="flex items-start justify-between pb-3 border-b border-stone-800">
                <div>
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                    {selectedSlot.category}
                  </span>
                  <h3 className="text-base font-bold text-white">{selectedSlot.name}</h3>
                  <p className="text-xs text-stone-400">{selectedSlot.description}</p>
                </div>
                {selectedSlot.id.startsWith('custom-prop-') && (
                  <button
                    onClick={() => removeCustomPropSlot(selectedSlot.id)}
                    className="p-1 text-red-400 hover:text-red-300 cursor-pointer"
                    title="Delete custom prop"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Status & Model Assignment */}
              <div className="py-3 border-b border-stone-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-stone-300">Model Source</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      selectedSlot.isCustom
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {selectedSlot.isCustom ? 'Custom GLB Model' : 'Procedural Default'}
                  </span>
                </div>

                {/* Upload or assign from existing */}
                <div className="space-y-2">
                  <label className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#FFE600] hover:bg-[#FFF04D] text-black font-bold text-xs cursor-pointer shadow-md transition-transform hover:scale-[1.01]">
                    <Upload className="w-4 h-4" />
                    <span>Upload Custom .glb / .gltf</span>
                    <input
                      type="file"
                      accept=".glb,.gltf"
                      onChange={(e) => handleFileUpload(e, selectedSlot.id)}
                      className="hidden"
                    />
                  </label>

                  {/* Pick from library */}
                  {models.length > 0 && (
                    <div className="text-xs">
                      <label className="text-[11px] text-stone-400 block mb-1">
                        Or pick from uploaded library:
                      </label>
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            handleAssignExistingModel(selectedSlot.id, e.target.value);
                          }
                        }}
                        defaultValue=""
                        className="w-full p-2 rounded-lg bg-stone-900 border border-stone-700 text-xs text-white focus:outline-none focus:border-amber-400"
                      >
                        <option value="" disabled>
                          Select uploaded model...
                        </option>
                        {models.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name} ({m.fileName})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {selectedSlot.isCustom && (
                    <button
                      onClick={() => resetSlotToDefault(selectedSlot.id)}
                      className="w-full py-1.5 px-3 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs border border-stone-700 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                      <span>Reset to Procedural Geometry</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Transform Controls */}
              <div className="py-3 space-y-3.5 flex-1 overflow-y-auto">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5" />
                    Transform Controls (Live)
                  </span>
                  <button
                    onClick={() => {
                      updateTransform(selectedSlot.id, {
                        position: [0, 0, 0],
                        rotation: [0, 0, 0],
                        scale: [1, 1, 1],
                      });
                    }}
                    className="text-[10px] text-stone-400 hover:text-amber-300 cursor-pointer"
                  >
                    Reset Offsets
                  </button>
                </div>

                {/* Scale Multiplier */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-stone-300">Uniform Scale</span>
                    <span className="font-mono text-amber-400 font-bold">
                      {selectedSlot.transform.scale[0]}x
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="5.0"
                    step="0.05"
                    value={selectedSlot.transform.scale[0]}
                    onChange={(e) => {
                      const s = Number(e.target.value);
                      updateTransform(selectedSlot.id, { scale: [s, s, s] });
                    }}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                  <div className="flex gap-1.5 mt-1">
                    {[0.5, 0.8, 1.0, 1.5, 2.0].map((preset) => (
                      <button
                        key={preset}
                        onClick={() =>
                          updateTransform(selectedSlot.id, { scale: [preset, preset, preset] })
                        }
                        className={`flex-1 py-0.5 rounded text-[10px] font-mono border ${
                          selectedSlot.transform.scale[0] === preset
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                            : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-white'
                        }`}
                      >
                        {preset}x
                      </button>
                    ))}
                  </div>
                </div>

                {/* Position Offset [X, Y, Z] */}
                <div>
                  <span className="text-xs text-stone-300 block mb-1 font-medium">
                    Position Offset (X, Y, Z meters)
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] text-stone-500 block">X (West-East)</label>
                      <input
                        type="number"
                        step="0.2"
                        value={selectedSlot.transform.position[0]}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          const cur = selectedSlot.transform.position;
                          updateTransform(selectedSlot.id, {
                            position: [val, cur[1], cur[2]],
                          });
                        }}
                        className="w-full p-1.5 rounded bg-stone-900 border border-stone-700 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-stone-500 block">Y (Height)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={selectedSlot.transform.position[1]}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          const cur = selectedSlot.transform.position;
                          updateTransform(selectedSlot.id, {
                            position: [cur[0], val, cur[2]],
                          });
                        }}
                        className="w-full p-1.5 rounded bg-stone-900 border border-stone-700 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-stone-500 block">Z (North-South)</label>
                      <input
                        type="number"
                        step="0.2"
                        value={selectedSlot.transform.position[2]}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          const cur = selectedSlot.transform.position;
                          updateTransform(selectedSlot.id, {
                            position: [cur[0], cur[1], val],
                          });
                        }}
                        className="w-full p-1.5 rounded bg-stone-900 border border-stone-700 text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Rotation Degrees [X, Y, Z] */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-stone-300">Y Rotation (Facing Angle)</span>
                    <span className="font-mono text-amber-400 font-bold">
                      {selectedSlot.transform.rotation[1]}°
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    step="5"
                    value={selectedSlot.transform.rotation[1]}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      const cur = selectedSlot.transform.rotation;
                      updateTransform(selectedSlot.id, {
                        rotation: [cur[0], val, cur[2]],
                      });
                    }}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                  <div className="flex gap-1.5 mt-1">
                    {[0, 90, 180, 270].map((deg) => (
                      <button
                        key={deg}
                        onClick={() => {
                          const cur = selectedSlot.transform.rotation;
                          updateTransform(selectedSlot.id, {
                            rotation: [cur[0], deg, cur[2]],
                          });
                        }}
                        className={`flex-1 py-0.5 rounded text-[10px] font-mono border ${
                          selectedSlot.transform.rotation[1] === deg
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                            : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-white'
                        }`}
                      >
                        {deg}°
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full lg:w-96 flex flex-col items-center justify-center p-6 bg-[#1A1612] border border-stone-800 rounded-xl text-center text-stone-500">
              <Sliders className="w-8 h-8 mb-2 opacity-40 text-amber-400" />
              <h4 className="text-sm font-semibold text-stone-300">Select an Object Slot</h4>
              <p className="text-xs text-stone-500 max-w-xs mt-1">
                Click any village card to inspect details, upload a custom .glb, or adjust its transform and orientation.
              </p>
            </div>
          )}
        </div>

        {/* Modal footer */}
        <div className="px-5 py-3 border-t border-stone-800 bg-[#171411] flex items-center justify-between text-xs text-stone-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Changes reflect instantly in the 3D Village without page reload.</span>
          </div>
          <button
            onClick={closeManager}
            className="px-4 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-white font-medium cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>

      {/* Add Custom Prop Modal Overlay */}
      {isAddingCustom && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#1C1814] border border-amber-500/40 rounded-xl p-5 shadow-2xl text-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-400" />
                Add Custom 3D Prop Slot
              </h3>
              <button
                onClick={() => setIsAddingCustom(false)}
                className="p-1 rounded text-stone-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomProp} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  Prop Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Ceremonial Drum (Kham), Bathou Temple..."
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full p-2 rounded-lg bg-stone-900 border border-stone-700 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Cultural significance or notes..."
                  value={customDesc}
                  onChange={(e) => setCustomDesc(e.target.value)}
                  className="w-full p-2 rounded-lg bg-stone-900 border border-stone-700 text-xs text-white focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  Initial Coordinates (X, Y, Z)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="number"
                    step="0.5"
                    value={customX}
                    onChange={(e) => setCustomX(Number(e.target.value))}
                    placeholder="X"
                    className="p-1.5 rounded bg-stone-900 border border-stone-700 text-xs text-white"
                  />
                  <input
                    type="number"
                    step="0.5"
                    value={customY}
                    onChange={(e) => setCustomY(Number(e.target.value))}
                    placeholder="Y"
                    className="p-1.5 rounded bg-stone-900 border border-stone-700 text-xs text-white"
                  />
                  <input
                    type="number"
                    step="0.5"
                    value={customZ}
                    onChange={(e) => setCustomZ(Number(e.target.value))}
                    placeholder="Z"
                    className="p-1.5 rounded bg-stone-900 border border-stone-700 text-xs text-white"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-stone-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingCustom(false)}
                  className="px-3 py-1.5 rounded-lg bg-stone-800 text-stone-300 text-xs hover:bg-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#FFE600] text-black font-bold text-xs hover:bg-[#FFF04D]"
                >
                  Create Prop Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
