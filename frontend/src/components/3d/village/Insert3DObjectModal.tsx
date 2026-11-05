import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {
  X,
  Upload,
  Box,
  Check,
  AlertTriangle,
  Compass,
  Home,
  Sparkles,
  Layers,
  Eye,
  Plus,
  Maximize2,
  RotateCw,
} from 'lucide-react';
import { useVillageObjectStore, VillageCustomObject } from '../../../store/villageObjectStore';
import { useContentStore } from '../../../store/contentStore';
import { validate3DFile, saveModelBlob, resolveModelUrl } from '../../../services/modelStorage';
import { VILLAGE_AREAS } from './VillageBuilder';

interface Insert3DObjectModalProps {
  currentCameraPosition?: [number, number, number];
  currentCameraLookAt?: [number, number, number];
  onObjectInserted?: (newObj: VillageCustomObject) => void;
}

export const Insert3DObjectModal: React.FC<Insert3DObjectModalProps> = ({
  currentCameraPosition,
  currentCameraLookAt,
  onObjectInserted,
}) => {
  const { isAddModalOpen, closeAddModal, addObject } = useVillageObjectStore();
  const { models } = useContentStore();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedExistingModelId, setSelectedExistingModelId] = useState<string>('');
  const [objectName, setObjectName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedAreaId, setSelectedAreaId] = useState<string>('WORKSHOP');

  // Coordinates
  const [posX, setPosX] = useState<number>(-10.5);
  const [posY, setPosY] = useState<number>(0);
  const [posZ, setPosZ] = useState<number>(-8.5);
  const [rotY, setRotY] = useState<number>(0);
  const [scale, setScale] = useState<number>(1.0);
  const [isCollidable, setIsCollidable] = useState<boolean>(false);

  // Status
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 3D Preview Canvas
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  // Reset form when modal closes/opens
  useEffect(() => {
    if (isAddModalOpen) {
      setUploadError(null);
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [isAddModalOpen]);

  // Set default coordinates when target area changes
  const handleAreaChange = (areaId: string) => {
    setSelectedAreaId(areaId);
    if (areaId === 'ENTRANCE') {
      setPosX(0);
      setPosY(0);
      setPosZ(15);
      setRotY(0);
    } else if (areaId === 'HOUSE') {
      setPosX(-11.5);
      setPosY(0);
      setPosZ(4.5);
      setRotY(0);
    } else if (areaId === 'WORKSHOP') {
      setPosX(-10.5);
      setPosY(0);
      setPosZ(-8.5);
      setRotY(0);
    } else if (areaId === 'TEXTILES') {
      setPosX(0);
      setPosY(0);
      setPosZ(-14.5);
      setRotY(0);
    } else if (areaId === 'TOOLS') {
      setPosX(11.5);
      setPosY(0);
      setPosZ(-7.5);
      setRotY(0);
    } else if (areaId === 'MOTIFS') {
      setPosX(12.5);
      setPosY(0);
      setPosZ(5.5);
      setRotY(0);
    } else if (areaId === 'VISITOR' && currentCameraPosition) {
      // Place 2.5 meters in front of the visitor at ground level
      const lookDirX = currentCameraLookAt ? currentCameraLookAt[0] - currentCameraPosition[0] : 0;
      const lookDirZ = currentCameraLookAt ? currentCameraLookAt[2] - currentCameraPosition[2] : -1;
      const len = Math.sqrt(lookDirX * lookDirX + lookDirZ * lookDirZ) || 1;
      setPosX(Math.round((currentCameraPosition[0] + (lookDirX / len) * 2.8) * 10) / 10);
      setPosY(0);
      setPosZ(Math.round((currentCameraPosition[2] + (lookDirZ / len) * 2.8) * 10) / 10);
      setRotY(0);
    }
  };

  // Handle local file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validate3DFile(file);
    if (!validation.valid) {
      setUploadError(validation.error || 'Invalid 3D file format');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setSelectedExistingModelId('');

    // Auto-fill object name if empty
    if (!objectName.trim()) {
      const cleanName = file.name
        .replace(/\.(glb|gltf)$/i, '')
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
      setObjectName(cleanName);
    }

    // Create temporary blob URL for instant 3D preview
    const tempUrl = URL.createObjectURL(file);
    setPreviewBlobUrl(tempUrl);
  };

  // Handle selecting an existing model
  const handleSelectExisting = async (modelId: string) => {
    setSelectedExistingModelId(modelId);
    setSelectedFile(null);
    setUploadError(null);

    const found = models.find((m) => m.id === modelId);
    if (found) {
      if (!objectName.trim()) {
        setObjectName(found.name);
      }
      setIsPreviewLoading(true);
      try {
        const resolved = await resolveModelUrl(found);
        setPreviewBlobUrl(resolved);
      } catch (err) {
        console.warn('Preview resolve error:', err);
      } finally {
        setIsPreviewLoading(false);
      }
    }
  };

  // Render 3D Preview inside preview canvas
  useEffect(() => {
    if (!previewBlobUrl || !previewCanvasRef.current) return;

    const canvas = previewCanvasRef.current;
    const width = canvas.clientWidth || 280;
    const height = canvas.clientHeight || 200;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(2, 1.5, 2.5);
    camera.lookAt(0, 0.4, 0);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xfff5e6, 0.9);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.4);
    dirLight.position.set(3, 5, 4);
    scene.add(dirLight);

    // Display plinth
    const plinth = new THREE.Mesh(
      new THREE.CylinderGeometry(0.8, 0.9, 0.15, 24),
      new THREE.MeshStandardMaterial({ color: 0x3d2817, roughness: 0.8 })
    );
    plinth.position.y = -0.075;
    scene.add(plinth);

    // Grid helper on plinth
    const grid = new THREE.GridHelper(1.8, 6, 0xd4af37, 0x5a3e20);
    grid.position.y = 0.01;
    scene.add(grid);

    let modelGroup: THREE.Group | null = null;
    let animId: number;

    const loader = new GLTFLoader();
    loader.load(
      previewBlobUrl,
      (gltf) => {
        modelGroup = gltf.scene;

        // Auto-scale model to fit preview
        const bbox = new THREE.Box3().setFromObject(modelGroup);
        const size = new THREE.Vector3();
        bbox.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        const normScale = 1.0 / maxDim;
        modelGroup.scale.setScalar(normScale);

        // Center bottom at ground level
        const center = new THREE.Vector3();
        bbox.getCenter(center);
        modelGroup.position.set(-center.x * normScale, (size.y / 2) * normScale, -center.z * normScale);

        scene.add(modelGroup);
      },
      undefined,
      (err) => {
        console.warn('Preview 3D load error:', err);
      }
    );

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (modelGroup) {
        modelGroup.rotation.y += 0.01;
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
      scene.clear();
    };
  }, [previewBlobUrl]);

  // Form submission: save model and insert object
  const handleInsert = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!objectName.trim()) {
      setUploadError('Please provide a display name for the 3D object.');
      return;
    }

    if (!selectedFile && !selectedExistingModelId) {
      setUploadError('Please select a 3D model file (.glb / .gltf) or choose an existing model.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadProgress(20);

    try {
      let finalModelId = selectedExistingModelId;
      let finalModelUrl = '';
      let finalFileName = '';
      let finalFileSize = 0;

      if (selectedFile) {
        setUploadProgress(40);
        finalModelId = `model-user-${Date.now()}`;
        finalFileName = selectedFile.name;
        finalFileSize = selectedFile.size;
        finalModelUrl = `indexeddb://${finalModelId}`;

        // Save binary blob to IndexedDB
        await saveModelBlob(finalModelId, selectedFile, selectedFile.name);
        setUploadProgress(80);
      } else if (selectedExistingModelId) {
        const existing = models.find((m) => m.id === selectedExistingModelId);
        if (existing) {
          finalModelId = existing.id;
          finalModelUrl = existing.url;
          finalFileName = existing.fileName || `${existing.name}.glb`;
          finalFileSize = existing.fileSize || 0;
        }
      }

      const areaObj = VILLAGE_AREAS.find((a) => a.id === selectedAreaId);
      const areaName =
        selectedAreaId === 'VISITOR'
          ? 'Near Visitor Location'
          : areaObj
          ? areaObj.name
          : 'Custom Grounds';

      const inserted = addObject({
        id: `obj-custom-${Date.now()}`,
        name: objectName.trim(),
        description: description.trim() || undefined,
        areaId: selectedAreaId,
        areaName,
        modelId: finalModelId,
        modelUrl: finalModelUrl,
        fileName: finalFileName,
        fileSize: finalFileSize,
        visible: true,
        isCollidable,
        transform: {
          position: [Number(posX), Number(posY), Number(posZ)],
          rotation: [0, Number(rotY), 0],
          scale: [Number(scale), Number(scale), Number(scale)],
          uniformScale: true,
        },
      });

      setUploadProgress(100);

      if (onObjectInserted) {
        onObjectInserted(inserted);
      }

      // Close modal
      closeAddModal();
    } catch (err: any) {
      console.error('Failed to insert 3D object:', err);
      setUploadError(err.message || 'Failed to save and insert 3D model');
    } finally {
      setIsUploading(false);
    }
  };

  if (!isAddModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md select-none overflow-y-auto font-sans">
      <div className="relative w-full max-w-2xl bg-[#161310] border border-amber-500/35 rounded-2xl shadow-2xl overflow-hidden text-stone-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-800 bg-[#1C1814]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-700/10 border border-amber-500/30 text-[#FFE600]">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide font-editorial">
                INSERT 3D OBJECT INTO VILLAGE
              </h2>
              <p className="text-xs text-stone-400">
                Upload your own .glb/.gltf model, preview it in 3D, and place it anywhere in the village.
              </p>
            </div>
          </div>

          <button
            onClick={closeAddModal}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error message */}
        {uploadError && (
          <div className="px-5 py-2.5 bg-red-950/80 border-b border-red-800/60 flex items-center justify-between text-xs text-red-200">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{uploadError}</span>
            </div>
            <button onClick={() => setUploadError(null)} className="text-red-300 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleInsert} className="p-5 space-y-4 max-h-[78vh] overflow-y-auto">
          
          {/* 3D Model Selection (File Upload or Pick from Library) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Upload File Box */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-300 block">
                1. Choose 3D Model (.glb / .gltf) *
              </label>

              <div
                onClick={() => fileInputRef.current?.click()}
                className={`p-4 rounded-xl border-2 border-dashed cursor-pointer transition-all flex flex-col items-center justify-center text-center gap-2 ${
                  selectedFile
                    ? 'border-emerald-500/60 bg-emerald-950/20'
                    : 'border-stone-700 hover:border-amber-400/60 bg-stone-900/50 hover:bg-stone-900'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".glb,.gltf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Upload
                  className={`w-6 h-6 ${
                    selectedFile ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                />
                <div className="text-xs">
                  {selectedFile ? (
                    <div>
                      <span className="font-bold text-emerald-300 block truncate max-w-[200px]">
                        {selectedFile.name}
                      </span>
                      <span className="text-[10px] text-stone-400">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                    </div>
                  ) : (
                    <div>
                      <span className="font-semibold text-white block">Click to upload .GLB</span>
                      <span className="text-[10px] text-stone-400">From your computer</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Or Select from existing library */}
              {models.length > 0 && (
                <div className="pt-1">
                  <span className="text-[10px] text-stone-400 block mb-1">
                    Or pick from uploaded library:
                  </span>
                  <select
                    value={selectedExistingModelId}
                    onChange={(e) => handleSelectExisting(e.target.value)}
                    className="w-full p-2 rounded-lg bg-stone-900 border border-stone-700 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="">-- Pick from existing models --</option>
                    {models.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.fileName || 'model.glb'})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Live 3D Preview */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-stone-300 block mb-2 flex items-center justify-between">
                <span>Model Preview</span>
                <span className="text-[10px] text-stone-400 font-normal">Auto-rotating</span>
              </label>

              <div className="flex-1 min-h-[160px] rounded-xl bg-black/60 border border-stone-800 relative flex items-center justify-center overflow-hidden">
                {previewBlobUrl ? (
                  <canvas
                    ref={previewCanvasRef}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-center p-4 text-stone-500">
                    <Box className="w-8 h-8 mx-auto mb-1 opacity-30 text-amber-400" />
                    <span className="text-xs">Select or upload a model to preview in 3D</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Object Name & Description */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-stone-800">
            <div>
              <label className="text-xs font-semibold text-stone-300 block mb-1">
                Object Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Master Loom, Sifung Flute, Bathou Pillar..."
                value={objectName}
                onChange={(e) => setObjectName(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-stone-900 border border-stone-700 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-300 block mb-1">
                Description (Optional)
              </label>
              <input
                type="text"
                placeholder="Short cultural explanation..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-stone-900 border border-stone-700 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Target Village Area */}
          <div className="space-y-1.5 pt-2 border-t border-stone-800">
            <label className="text-xs font-bold text-stone-300 block">
              2. Target Village Area
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleAreaChange('VISITOR')}
                className={`p-2 rounded-lg text-xs font-medium border text-left transition-all ${
                  selectedAreaId === 'VISITOR'
                    ? 'bg-[#FFE600] text-black font-bold border-[#FFE600] shadow-sm'
                    : 'bg-stone-900 text-stone-300 border-stone-700 hover:border-stone-600'
                }`}
              >
                In Front of Visitor
              </button>

              <button
                type="button"
                onClick={() => handleAreaChange('ENTRANCE')}
                className={`p-2 rounded-lg text-xs font-medium border text-left transition-all ${
                  selectedAreaId === 'ENTRANCE'
                    ? 'bg-[#FFE600] text-black font-bold border-[#FFE600] shadow-sm'
                    : 'bg-stone-900 text-stone-300 border-stone-700 hover:border-stone-600'
                }`}
              >
                Entrance Gate
              </button>

              <button
                type="button"
                onClick={() => handleAreaChange('HOUSE')}
                className={`p-2 rounded-lg text-xs font-medium border text-left transition-all ${
                  selectedAreaId === 'HOUSE'
                    ? 'bg-[#FFE600] text-black font-bold border-[#FFE600] shadow-sm'
                    : 'bg-stone-900 text-stone-300 border-stone-700 hover:border-stone-600'
                }`}
              >
                Homestead (No-Mano)
              </button>

              <button
                type="button"
                onClick={() => handleAreaChange('WORKSHOP')}
                className={`p-2 rounded-lg text-xs font-medium border text-left transition-all ${
                  selectedAreaId === 'WORKSHOP'
                    ? 'bg-[#FFE600] text-black font-bold border-[#FFE600] shadow-sm'
                    : 'bg-stone-900 text-stone-300 border-stone-700 hover:border-stone-600'
                }`}
              >
                Loom Workshop
              </button>

              <button
                type="button"
                onClick={() => handleAreaChange('TEXTILES')}
                className={`p-2 rounded-lg text-xs font-medium border text-left transition-all ${
                  selectedAreaId === 'TEXTILES'
                    ? 'bg-[#FFE600] text-black font-bold border-[#FFE600] shadow-sm'
                    : 'bg-stone-900 text-stone-300 border-stone-700 hover:border-stone-600'
                }`}
              >
                Textile Gallery
              </button>

              <button
                type="button"
                onClick={() => handleAreaChange('TOOLS')}
                className={`p-2 rounded-lg text-xs font-medium border text-left transition-all ${
                  selectedAreaId === 'TOOLS'
                    ? 'bg-[#FFE600] text-black font-bold border-[#FFE600] shadow-sm'
                    : 'bg-stone-900 text-stone-300 border-stone-700 hover:border-stone-600'
                }`}
              >
                Tools Compound
              </button>

              <button
                type="button"
                onClick={() => handleAreaChange('MOTIFS')}
                className={`p-2 rounded-lg text-xs font-medium border text-left transition-all ${
                  selectedAreaId === 'MOTIFS'
                    ? 'bg-[#FFE600] text-black font-bold border-[#FFE600] shadow-sm'
                    : 'bg-stone-900 text-stone-300 border-stone-700 hover:border-stone-600'
                }`}
              >
                Motifs & Dyeing
              </button>

              <button
                type="button"
                onClick={() => handleAreaChange('CUSTOM')}
                className={`p-2 rounded-lg text-xs font-medium border text-left transition-all ${
                  selectedAreaId === 'CUSTOM'
                    ? 'bg-[#FFE600] text-black font-bold border-[#FFE600] shadow-sm'
                    : 'bg-stone-900 text-stone-300 border-stone-700 hover:border-stone-600'
                }`}
              >
                Custom Coordinates
              </button>
            </div>
          </div>

          {/* Initial Transforms & Coordinates */}
          <div className="pt-2 border-t border-stone-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-stone-300">3. Initial Position & Scale</span>
              <button
                type="button"
                onClick={() => setPosY(0)}
                className="text-[10px] text-amber-400 hover:underline"
              >
                Snap Y to Ground (0m)
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2 text-xs">
              <div>
                <label className="text-[10px] text-stone-500 block">X (West-East)</label>
                <input
                  type="number"
                  step="0.5"
                  value={posX}
                  onChange={(e) => setPosX(Number(e.target.value))}
                  className="w-full p-2 rounded bg-stone-900 border border-stone-700 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] text-stone-500 block">Y (Height)</label>
                <input
                  type="number"
                  step="0.1"
                  value={posY}
                  onChange={(e) => setPosY(Number(e.target.value))}
                  className="w-full p-2 rounded bg-stone-900 border border-stone-700 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] text-stone-500 block">Z (North-South)</label>
                <input
                  type="number"
                  step="0.5"
                  value={posZ}
                  onChange={(e) => setPosZ(Number(e.target.value))}
                  className="w-full p-2 rounded bg-stone-900 border border-stone-700 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] text-stone-500 block">Initial Scale</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="10"
                  value={scale}
                  onChange={(e) => setScale(Math.max(0.1, Number(e.target.value)))}
                  className="w-full p-2 rounded bg-stone-900 border border-stone-700 text-white font-mono"
                />
              </div>
            </div>

            {/* Quick scale presets */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-stone-400">Scale Presets:</span>
              {[
                { label: 'Small (0.5x)', val: 0.5 },
                { label: 'Normal (1.0x)', val: 1.0 },
                { label: 'Large (2.0x)', val: 2.0 },
                { label: 'Extra Large (3.5x)', val: 3.5 },
              ].map((p) => (
                <button
                  key={p.val}
                  type="button"
                  onClick={() => setScale(p.val)}
                  className={`px-2 py-0.5 rounded text-[10px] border ${
                    scale === p.val
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                      : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Progress bar if uploading */}
          {isUploading && (
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-stone-400">
                <span>Saving to browser database & injecting into village...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-stone-800 overflow-hidden">
                <div
                  className="h-full bg-[#FFE600] transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Footer action buttons */}
          <div className="pt-3 border-t border-stone-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={closeAddModal}
              className="px-4 py-2 text-xs rounded-lg text-stone-400 hover:text-white cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isUploading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#FFE600] hover:bg-[#FFF04D] text-black font-bold text-xs shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer font-editorial disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{isUploading ? 'Inserting into Village...' : 'Insert Object'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
