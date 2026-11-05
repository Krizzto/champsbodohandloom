import React, { useState } from 'react';
import {
  X,
  Box,
  Plus,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Sliders,
  Focus,
  RotateCcw,
  Layers,
  Search,
  Check,
  Compass,
} from 'lucide-react';
import {
  useVillageObjectStore,
  VillageCustomObject,
} from '../../../store/villageObjectStore';

interface VillageObjectListDrawerProps {
  onFocusObject?: (obj: VillageCustomObject) => void;
}

export const VillageObjectListDrawer: React.FC<VillageObjectListDrawerProps> = ({
  onFocusObject,
}) => {
  const {
    objects,
    selectedObjectId,
    isObjectListOpen,
    setObjectListOpen,
    openAddModal,
    selectObject,
    duplicateObject,
    deleteObject,
    toggleObjectVisibility,
    resetObjectTransform,
    resetAllObjects,
  } = useVillageObjectStore();

  const [search, setSearch] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  if (!isObjectListOpen) return null;

  const filtered = objects.filter(
    (o) =>
      o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.areaName.toLowerCase().includes(search.toLowerCase()) ||
      o.fileName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-full max-w-sm sm:max-w-md bg-[#14120F]/95 backdrop-blur-md border-l border-amber-500/30 shadow-2xl flex flex-col text-stone-200 select-none font-sans">
      
      {/* Header */}
      <div className="p-4 border-b border-stone-800 bg-[#1A1612] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/20 text-[#FFE600] border border-amber-500/30">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white tracking-wide font-editorial">
              VILLAGE 3D OBJECTS
            </h2>
            <span className="text-[11px] text-stone-400">
              {objects.length} custom inserted {objects.length === 1 ? 'object' : 'objects'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setObjectListOpen(false);
              openAddModal();
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#FFE600] text-black font-bold text-xs hover:bg-yellow-300 transition-transform active:scale-95 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New</span>
          </button>

          <button
            onClick={() => setObjectListOpen(false)}
            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-3 border-b border-stone-800 bg-[#171411]">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
          <input
            type="text"
            placeholder="Search inserted objects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-stone-900 border border-stone-700 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Objects List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-stone-500">
            <Box className="w-10 h-10 mx-auto mb-2 opacity-30 text-amber-400" />
            <p className="text-xs font-medium">No custom 3D objects found in the village.</p>
            <button
              onClick={() => {
                setObjectListOpen(false);
                openAddModal();
              }}
              className="mt-3 px-4 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-semibold hover:bg-amber-500/30"
            >
              + Insert your first 3D model
            </button>
          </div>
        ) : (
          filtered.map((obj) => {
            const isSelected = selectedObjectId === obj.id;
            return (
              <div
                key={obj.id}
                onClick={() => selectObject(obj.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#221C16] border-[#FFE600] ring-1 ring-[#FFE600]/40 shadow-lg'
                    : 'bg-stone-900/70 border-stone-800 hover:border-stone-700 hover:bg-stone-900'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="truncate flex-1">
                    <span className="text-[10px] uppercase font-bold text-amber-400 block truncate">
                      {obj.areaName}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-white tracking-wide truncate">
                      {obj.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-stone-400 font-mono">
                      <span>Pos: [{obj.transform.position.map((v) => v.toFixed(1)).join(', ')}]</span>
                      <span>·</span>
                      <span>Scale: {obj.transform.scale[0].toFixed(1)}x</span>
                    </div>
                  </div>

                  {/* Eye toggle */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleObjectVisibility(obj.id);
                    }}
                    className={`p-1.5 rounded-lg border text-xs cursor-pointer ${
                      obj.visible
                        ? 'bg-stone-800 border-stone-700 text-stone-300 hover:text-white'
                        : 'bg-stone-950 border-amber-500/30 text-amber-400'
                    }`}
                    title={obj.visible ? 'Hide object' : 'Show object'}
                  >
                    {obj.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Actions row */}
                <div className="mt-2.5 pt-2 border-t border-stone-800/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {/* Focus / Teleport near object */}
                    {onFocusObject && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          selectObject(obj.id);
                          onFocusObject(obj);
                        }}
                        className="flex items-center gap-1 px-2 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-[11px] font-medium"
                        title="Teleport visitor to this object"
                      >
                        <Focus className="w-3 h-3 text-amber-400" />
                        <span>Focus</span>
                      </button>
                    )}

                    {/* Duplicate */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicateObject(obj.id);
                      }}
                      className="flex items-center gap-1 px-2 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-[11px]"
                      title="Duplicate as independent copy"
                    >
                      <Copy className="w-3 h-3 text-stone-400" />
                      <span>Copy</span>
                    </button>
                  </div>

                  {/* Delete with confirmation */}
                  {deleteConfirmId === obj.id ? (
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <span className="text-[10px] text-red-300">Sure?</span>
                      <button
                        onClick={() => {
                          deleteObject(obj.id);
                          setDeleteConfirmId(null);
                        }}
                        className="px-2 py-0.5 rounded bg-red-600 text-white font-bold text-[10px]"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="px-1.5 py-0.5 rounded bg-stone-800 text-stone-300 text-[10px]"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirmId(obj.id);
                      }}
                      className="p-1 rounded text-red-400 hover:text-red-300 hover:bg-red-950/40"
                      title="Delete object"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      {objects.length > 0 && (
        <div className="p-3 border-t border-stone-800 bg-[#1A1612] flex items-center justify-between">
          <button
            onClick={() => {
              if (
                window.confirm(
                  'Are you sure you want to delete ALL custom inserted objects from the village?'
                )
              ) {
                resetAllObjects();
              }
            }}
            className="text-[11px] text-red-400 hover:text-red-300 font-medium"
          >
            Clear All Custom Objects
          </button>

          <span className="text-[10px] text-stone-500 font-mono">
            Auto-saved in browser
          </span>
        </div>
      )}
    </div>
  );
};
