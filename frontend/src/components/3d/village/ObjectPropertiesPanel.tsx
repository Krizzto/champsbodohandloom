import React, { useState } from 'react';
import {
  X,
  Sliders,
  Move,
  RotateCw,
  Maximize2,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  RotateCcw,
  Compass,
  Check,
  Edit2,
  Layers,
  ArrowDownToLine,
  Focus,
} from 'lucide-react';
import {
  useVillageObjectStore,
  VillageCustomObject,
  TransformGizmoMode,
} from '../../../store/villageObjectStore';

interface ObjectPropertiesPanelProps {
  onFocusObject?: (obj: VillageCustomObject) => void;
}

export const ObjectPropertiesPanel: React.FC<ObjectPropertiesPanelProps> = ({ onFocusObject }) => {
  const {
    objects,
    selectedObjectId,
    gizmoMode,
    selectObject,
    setGizmoMode,
    updateObject,
    updateTransform,
    duplicateObject,
    deleteObject,
    toggleObjectVisibility,
    resetObjectTransform,
    snapObjectToGround,
  } = useVillageObjectStore();

  const [activeTab, setActiveTab] = useState<'scale' | 'position' | 'rotation'>('scale');
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const selectedObject = objects.find((o) => o.id === selectedObjectId);

  if (!selectedObject) return null;

  const { transform } = selectedObject;
  const uniformScale = transform.uniformScale !== false;

  // Scale handlers with safe clamping
  const handleUniformScale = (val: number) => {
    const clamped = Math.max(0.05, Math.min(25, Number(val) || 1));
    updateTransform(selectedObject.id, {
      scale: [clamped, clamped, clamped],
      uniformScale: true,
    });
  };

  const handleAxisScale = (axisIdx: 0 | 1 | 2, val: number) => {
    const clamped = Math.max(0.05, Math.min(25, Number(val) || 1));
    const nextScale: [number, number, number] = [...transform.scale];
    nextScale[axisIdx] = clamped;
    updateTransform(selectedObject.id, {
      scale: nextScale,
      uniformScale: false,
    });
  };

  const handleResetScale = () => {
    updateTransform(selectedObject.id, {
      scale: [1, 1, 1],
      uniformScale: true,
    });
  };

  // Position handlers
  const handlePosition = (axisIdx: 0 | 1 | 2, val: number) => {
    const nextPos: [number, number, number] = [...transform.position];
    nextPos[axisIdx] = Math.round(Number(val) * 100) / 100;
    // Don't let Y drop below ground level (clamp min -0.1)
    if (axisIdx === 1) {
      nextPos[1] = Math.max(-0.2, nextPos[1]);
    }
    updateTransform(selectedObject.id, { position: nextPos });
  };

  // Rotation handlers
  const handleRotation = (axisIdx: 0 | 1 | 2, deg: number) => {
    const nextRot: [number, number, number] = [...transform.rotation];
    nextRot[axisIdx] = Math.round(Number(deg));
    updateTransform(selectedObject.id, { rotation: nextRot });
  };

  const handleNameSave = () => {
    if (nameInput.trim()) {
      updateObject(selectedObject.id, { name: nameInput.trim() });
    }
    setIsEditingName(false);
  };

  return (
    <div className="absolute right-3 sm:right-5 top-16 sm:top-20 z-30 w-80 sm:w-96 max-h-[85vh] flex flex-col bg-[#14120F]/95 backdrop-blur-md border border-amber-500/40 rounded-2xl shadow-2xl text-stone-200 overflow-hidden font-sans select-none">
      
      {/* Panel Header */}
      <div className="p-3.5 border-b border-stone-800 bg-[#1A1612] flex items-center justify-between">
        <div className="flex-1 mr-2 truncate">
          <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-amber-400">
            <span>{selectedObject.areaName}</span>
            <span aria-hidden="true">·</span>
            <span>3D CUSTOM PROP</span>
          </div>

          {isEditingName ? (
            <div className="flex items-center gap-1 mt-0.5">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full px-2 py-0.5 text-xs rounded bg-stone-900 border border-amber-400 text-white font-bold"
                autoFocus
              />
              <button
                onClick={handleNameSave}
                className="p-1 rounded bg-[#FFE600] text-black hover:bg-yellow-300"
              >
                <Check className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 mt-0.5 group">
              <h3 className="text-sm font-bold text-white tracking-wide truncate">
                {selectedObject.name}
              </h3>
              <button
                onClick={() => {
                  setNameInput(selectedObject.name);
                  setIsEditingName(true);
                }}
                className="opacity-60 hover:opacity-100 text-stone-400 hover:text-amber-300"
                title="Rename object"
              >
                <Edit2 className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          {/* Focus button */}
          {onFocusObject && (
            <button
              onClick={() => onFocusObject(selectedObject)}
              className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 hover:text-white"
              title="Focus camera on object"
            >
              <Focus className="w-4 h-4" />
            </button>
          )}

          {/* Deselect */}
          <button
            onClick={() => selectObject(null)}
            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white cursor-pointer"
            title="Deselect object"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3D Transform Gizmo Mode Selector */}
      <div className="px-3.5 py-2 border-b border-stone-800 bg-[#161310] flex items-center justify-between">
        <span className="text-[10px] font-bold tracking-wider uppercase text-stone-400">
          3D Gizmo:
        </span>
        <div className="flex items-center gap-1 bg-stone-900 p-0.5 rounded-lg border border-stone-800">
          {[
            { id: 'translate', label: 'Move', icon: Move },
            { id: 'rotate', label: 'Rotate', icon: RotateCw },
            { id: 'scale', label: 'Scale', icon: Maximize2 },
            { id: 'none', label: 'Off', icon: X },
          ].map((mode) => {
            const Icon = mode.icon;
            const active = gizmoMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setGizmoMode(mode.id as TransformGizmoMode)}
                className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                  active
                    ? 'bg-[#FFE600] text-black shadow-xs'
                    : 'text-stone-400 hover:text-white hover:bg-stone-800'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Navigation (Scale / Position / Rotation) */}
      <div className="flex border-b border-stone-800 bg-[#120F0D]">
        <button
          onClick={() => setActiveTab('scale')}
          className={`flex-1 py-2 text-xs font-bold border-b-2 flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'scale'
              ? 'border-[#FFE600] text-[#FFE600] bg-amber-500/10'
              : 'border-transparent text-stone-400 hover:text-white hover:bg-stone-900'
          }`}
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>Scale</span>
        </button>

        <button
          onClick={() => setActiveTab('position')}
          className={`flex-1 py-2 text-xs font-bold border-b-2 flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'position'
              ? 'border-[#FFE600] text-[#FFE600] bg-amber-500/10'
              : 'border-transparent text-stone-400 hover:text-white hover:bg-stone-900'
          }`}
        >
          <Move className="w-3.5 h-3.5" />
          <span>Position</span>
        </button>

        <button
          onClick={() => setActiveTab('rotation')}
          className={`flex-1 py-2 text-xs font-bold border-b-2 flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'rotation'
              ? 'border-[#FFE600] text-[#FFE600] bg-amber-500/10'
              : 'border-transparent text-stone-400 hover:text-white hover:bg-stone-900'
          }`}
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Rotation</span>
        </button>
      </div>

      {/* Panel Scrollable Controls */}
      <div className="p-4 space-y-4 overflow-y-auto flex-1">
        
        {/* ================= TAB 1: SCALE CONTROLS ================= */}
        {activeTab === 'scale' && (
          <div className="space-y-4">
            {/* Uniform scale toggle */}
            <div className="flex items-center justify-between pb-2 border-b border-stone-800">
              <label className="flex items-center gap-2 text-xs font-semibold text-stone-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={uniformScale}
                  onChange={(e) =>
                    updateTransform(selectedObject.id, { uniformScale: e.target.checked })
                  }
                  className="rounded text-amber-400 accent-[#FFE600] cursor-pointer"
                />
                <span>Uniform Scale (Preserve Proportions)</span>
              </label>

              <button
                onClick={handleResetScale}
                className="flex items-center gap-1 text-[11px] text-stone-400 hover:text-amber-300 cursor-pointer"
                title="Reset scale to 1.0x"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset (1.0x)</span>
              </button>
            </div>

            {/* Scale Presets */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-stone-400 block font-semibold uppercase tracking-wider">
                Preset Sizes:
              </span>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { label: 'Small', val: 0.5 },
                  { label: 'Medium', val: 1.0 },
                  { label: 'Large', val: 2.0 },
                  { label: 'X-Large', val: 3.5 },
                ].map((p) => {
                  const isActive =
                    uniformScale && Math.abs(transform.scale[0] - p.val) < 0.05;
                  return (
                    <button
                      key={p.label}
                      onClick={() => handleUniformScale(p.val)}
                      className={`py-1.5 rounded-lg text-xs font-bold border transition-all ${
                        isActive
                          ? 'bg-[#FFE600] text-black border-[#FFE600] shadow-sm'
                          : 'bg-stone-900 text-stone-300 border-stone-700 hover:border-amber-400/50'
                      }`}
                    >
                      {p.label}
                      <span className="block text-[9px] font-mono opacity-80">{p.val}x</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Uniform Scale Slider & Input */}
            {uniformScale ? (
              <div className="space-y-2 p-3 rounded-xl bg-stone-900/60 border border-stone-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">Overall Scale</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      step="0.05"
                      min="0.05"
                      max="20"
                      value={transform.scale[0]}
                      onChange={(e) => handleUniformScale(Number(e.target.value))}
                      className="w-16 p-1 text-right rounded bg-black border border-stone-700 font-mono text-xs text-amber-300 font-bold"
                    />
                    <span className="text-stone-400 font-mono">x</span>
                  </div>
                </div>

                <input
                  type="range"
                  min="0.1"
                  max="5.0"
                  step="0.05"
                  value={transform.scale[0]}
                  onChange={(e) => handleUniformScale(Number(e.target.value))}
                  className="w-full accent-[#FFE600] cursor-pointer"
                />

                <div className="flex justify-between text-[9px] font-mono text-stone-500">
                  <span>0.1x</span>
                  <span>1.0x</span>
                  <span>2.5x</span>
                  <span>5.0x</span>
                </div>
              </div>
            ) : (
              /* Independent Axis Scale (X, Y, Z) */
              <div className="space-y-3">
                <span className="text-[10px] text-amber-400 block font-semibold uppercase tracking-wider">
                  Independent Axis Scaling (Width, Height, Depth)
                </span>

                {/* Scale X */}
                <div className="space-y-1 p-2.5 rounded-lg bg-stone-900/60 border border-stone-800">
                  <div className="flex justify-between text-xs">
                    <span className="text-red-400 font-bold">Scale X (Width)</span>
                    <input
                      type="number"
                      step="0.05"
                      min="0.05"
                      max="20"
                      value={transform.scale[0]}
                      onChange={(e) => handleAxisScale(0, Number(e.target.value))}
                      className="w-14 p-0.5 text-right rounded bg-black border border-stone-700 font-mono text-xs text-white"
                    />
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="5.0"
                    step="0.05"
                    value={transform.scale[0]}
                    onChange={(e) => handleAxisScale(0, Number(e.target.value))}
                    className="w-full accent-red-400 cursor-pointer"
                  />
                </div>

                {/* Scale Y */}
                <div className="space-y-1 p-2.5 rounded-lg bg-stone-900/60 border border-stone-800">
                  <div className="flex justify-between text-xs">
                    <span className="text-emerald-400 font-bold">Scale Y (Height)</span>
                    <input
                      type="number"
                      step="0.05"
                      min="0.05"
                      max="20"
                      value={transform.scale[1]}
                      onChange={(e) => handleAxisScale(1, Number(e.target.value))}
                      className="w-14 p-0.5 text-right rounded bg-black border border-stone-700 font-mono text-xs text-white"
                    />
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="5.0"
                    step="0.05"
                    value={transform.scale[1]}
                    onChange={(e) => handleAxisScale(1, Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                </div>

                {/* Scale Z */}
                <div className="space-y-1 p-2.5 rounded-lg bg-stone-900/60 border border-stone-800">
                  <div className="flex justify-between text-xs">
                    <span className="text-blue-400 font-bold">Scale Z (Depth)</span>
                    <input
                      type="number"
                      step="0.05"
                      min="0.05"
                      max="20"
                      value={transform.scale[2]}
                      onChange={(e) => handleAxisScale(2, Number(e.target.value))}
                      className="w-14 p-0.5 text-right rounded bg-black border border-stone-700 font-mono text-xs text-white"
                    />
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="5.0"
                    step="0.05"
                    value={transform.scale[2]}
                    onChange={(e) => handleAxisScale(2, Number(e.target.value))}
                    className="w-full accent-blue-400 cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: POSITION CONTROLS ================= */}
        {activeTab === 'position' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-800">
              <span className="text-xs font-semibold text-stone-300">
                Ground & World Position (Meters)
              </span>
              <button
                onClick={() => snapObjectToGround(selectedObject.id, 0)}
                className="flex items-center gap-1 text-[11px] font-bold text-amber-300 hover:text-white px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30"
              >
                <ArrowDownToLine className="w-3 h-3" />
                <span>Snap Base to Ground</span>
              </button>
            </div>

            {/* Position X */}
            <div className="space-y-1 p-2.5 rounded-lg bg-stone-900/60 border border-stone-800">
              <div className="flex justify-between text-xs">
                <span className="text-red-400 font-bold">Position X (West - East)</span>
                <input
                  type="number"
                  step="0.2"
                  value={transform.position[0]}
                  onChange={(e) => handlePosition(0, Number(e.target.value))}
                  className="w-16 p-0.5 text-right rounded bg-black border border-stone-700 font-mono text-xs text-white"
                />
              </div>
              <input
                type="range"
                min="-30"
                max="30"
                step="0.2"
                value={transform.position[0]}
                onChange={(e) => handlePosition(0, Number(e.target.value))}
                className="w-full accent-red-400 cursor-pointer"
              />
            </div>

            {/* Position Y (Height) */}
            <div className="space-y-1 p-2.5 rounded-lg bg-stone-900/60 border border-stone-800">
              <div className="flex justify-between text-xs">
                <span className="text-emerald-400 font-bold">Position Y (Elevation / Height)</span>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={transform.position[1]}
                  onChange={(e) => handlePosition(1, Number(e.target.value))}
                  className="w-16 p-0.5 text-right rounded bg-black border border-stone-700 font-mono text-xs text-white"
                />
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={transform.position[1]}
                onChange={(e) => handlePosition(1, Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>

            {/* Position Z */}
            <div className="space-y-1 p-2.5 rounded-lg bg-stone-900/60 border border-stone-800">
              <div className="flex justify-between text-xs">
                <span className="text-blue-400 font-bold">Position Z (North - South)</span>
                <input
                  type="number"
                  step="0.2"
                  value={transform.position[2]}
                  onChange={(e) => handlePosition(2, Number(e.target.value))}
                  className="w-16 p-0.5 text-right rounded bg-black border border-stone-700 font-mono text-xs text-white"
                />
              </div>
              <input
                type="range"
                min="-30"
                max="30"
                step="0.2"
                value={transform.position[2]}
                onChange={(e) => handlePosition(2, Number(e.target.value))}
                className="w-full accent-blue-400 cursor-pointer"
              />
            </div>

            {/* Nudge Increments */}
            <div className="flex items-center justify-between text-[11px] pt-1">
              <span className="text-stone-400">Step increments:</span>
              <div className="flex gap-1">
                {[
                  { label: '0.1m', step: 0.1 },
                  { label: '0.5m', step: 0.5 },
                  { label: '1.0m', step: 1.0 },
                ].map((s) => (
                  <button
                    key={s.label}
                    onClick={() => handlePosition(0, transform.position[0] + s.step)}
                    className="px-2 py-0.5 rounded bg-stone-800 text-stone-300 hover:text-white border border-stone-700"
                  >
                    +{s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: ROTATION CONTROLS ================= */}
        {activeTab === 'rotation' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-800">
              <span className="text-xs font-semibold text-stone-300">
                Rotation Angles (Degrees)
              </span>
              <button
                onClick={() =>
                  updateTransform(selectedObject.id, {
                    rotation: [0, 0, 0],
                  })
                }
                className="text-[11px] text-stone-400 hover:text-amber-300"
              >
                Reset (0°)
              </button>
            </div>

            {/* Rotation Y (Yaw / Facing) */}
            <div className="space-y-1 p-2.5 rounded-lg bg-stone-900/60 border border-stone-800">
              <div className="flex justify-between text-xs">
                <span className="text-amber-400 font-bold">Rotation Y (Facing Angle)</span>
                <span className="font-mono text-amber-300">{transform.rotation[1]}°</span>
              </div>
              <input
                type="range"
                min="-180"
                max="180"
                step="5"
                value={transform.rotation[1]}
                onChange={(e) => handleRotation(1, Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <div className="flex gap-1 mt-1">
                {[0, 45, 90, 180, -90].map((deg) => (
                  <button
                    key={deg}
                    onClick={() => handleRotation(1, deg)}
                    className={`flex-1 py-0.5 rounded text-[10px] font-mono border ${
                      transform.rotation[1] === deg
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                        : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-white'
                    }`}
                  >
                    {deg}°
                  </button>
                ))}
              </div>
            </div>

            {/* Rotation X (Pitch) */}
            <div className="space-y-1 p-2.5 rounded-lg bg-stone-900/60 border border-stone-800">
              <div className="flex justify-between text-xs">
                <span className="text-stone-300 font-semibold">Rotation X (Pitch / Tilt)</span>
                <span className="font-mono text-stone-300">{transform.rotation[0]}°</span>
              </div>
              <input
                type="range"
                min="-180"
                max="180"
                step="5"
                value={transform.rotation[0]}
                onChange={(e) => handleRotation(0, Number(e.target.value))}
                className="w-full accent-stone-400 cursor-pointer"
              />
            </div>

            {/* Rotation Z (Roll) */}
            <div className="space-y-1 p-2.5 rounded-lg bg-stone-900/60 border border-stone-800">
              <div className="flex justify-between text-xs">
                <span className="text-stone-300 font-semibold">Rotation Z (Roll / Bank)</span>
                <span className="font-mono text-stone-300">{transform.rotation[2]}°</span>
              </div>
              <input
                type="range"
                min="-180"
                max="180"
                step="5"
                value={transform.rotation[2]}
                onChange={(e) => handleRotation(2, Number(e.target.value))}
                className="w-full accent-stone-400 cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer Action Buttons (Duplicate, Hide, Delete) */}
      <div className="p-3 border-t border-stone-800 bg-[#171411] flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {/* Duplicate Button */}
          <button
            onClick={() => duplicateObject(selectedObject.id)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white text-xs font-semibold border border-stone-700 cursor-pointer transition-colors"
            title="Duplicate this object as an independent instance"
          >
            <Copy className="w-3.5 h-3.5 text-amber-400" />
            <span>Duplicate</span>
          </button>

          {/* Visibility Toggle */}
          <button
            onClick={() => toggleObjectVisibility(selectedObject.id)}
            className={`p-1.5 rounded-lg border text-xs cursor-pointer ${
              selectedObject.visible
                ? 'bg-stone-800 border-stone-700 text-stone-300 hover:text-white'
                : 'bg-stone-900 border-amber-500/30 text-amber-400'
            }`}
            title={selectedObject.visible ? 'Hide object' : 'Show object'}
          >
            {selectedObject.visible ? (
              <Eye className="w-4 h-4" />
            ) : (
              <EyeOff className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Delete with Confirmation */}
        {showDeleteConfirm ? (
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-red-300">Delete?</span>
            <button
              onClick={() => {
                deleteObject(selectedObject.id);
                setShowDeleteConfirm(false);
              }}
              className="px-2.5 py-1 rounded bg-red-600 hover:bg-red-500 text-white font-bold text-xs cursor-pointer"
            >
              Yes
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-2 py-1 rounded bg-stone-800 text-stone-300 text-xs"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 hover:text-red-100 border border-red-800/40 text-xs font-semibold cursor-pointer transition-colors"
            title="Permanently remove object"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        )}
      </div>
    </div>
  );
};
