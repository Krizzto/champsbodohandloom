import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import {
  Box,
  RotateCw,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Layers,
  X,
  Compass,
  CheckCircle,
  Eye,
} from 'lucide-react';
import { Artifact, Model3D } from '../../../types';
import { BuiltArtifactModel, loadOrBuildArtifact3DModel } from './artifact3DBuilder';
import { GarmentOrientation } from './arTypes';

interface DesktopARSimulatorProps {
  artifact: Artifact;
  linkedModel?: Model3D;
  onClose: () => void;
}

export const DesktopARSimulator: React.FC<DesktopARSimulatorProps> = ({
  artifact,
  linkedModel,
  onClose,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaced, setIsPlaced] = useState(false);
  const [scale, setScale] = useState(1);
  const [rotationY, setRotationY] = useState(0);
  const [orientation, setOrientation] = useState<GarmentOrientation>('draped-vertical');
  const [builtModel, setBuiltModel] = useState<BuiltArtifactModel | null>(null);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const reticleRef = useRef<THREE.Mesh | null>(null);
  const placedGroupRef = useRef<THREE.Group | null>(null);
  const groundPlaneRef = useRef<THREE.Plane>(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());

  const isGarment = artifact.category === 'TEXTILES' || artifact.id.includes('dokhona');

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x131110);
    sceneRef.current = scene;

    // 2. Camera (Room perspective looking at floor)
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50);
    camera.position.set(0, 2.2, 3.6);
    camera.lookAt(0, 0.4, 0);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    containerRef.current.replaceChildren(renderer.domElement);

    // 4. Studio & Room Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xfff5e6, 2.0);
    mainLight.position.set(2, 4, 3);
    mainLight.castShadow = true;
    scene.add(mainLight);

    // 5. Simulated Room Floor with Grid
    const floorGeo = new THREE.PlaneGeometry(10, 10);
    floorGeo.rotateX(-Math.PI / 2);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x1f1c1a,
      roughness: 0.8,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.receiveShadow = true;
    scene.add(floor);

    const grid = new THREE.GridHelper(10, 20, 0xffe600, 0x3d352e);
    grid.position.y = 0.001;
    scene.add(grid);

    // 6. Simulator Reticle
    const reticleGeo = new THREE.RingGeometry(0.15, 0.18, 32).rotateX(-Math.PI / 2);
    const reticleMat = new THREE.MeshBasicMaterial({
      color: 0xffe600,
      side: THREE.DoubleSide,
    });
    const reticle = new THREE.Mesh(reticleGeo, reticleMat);
    reticle.position.set(0, 0.005, 0);
    scene.add(reticle);
    reticleRef.current = reticle;

    // Center dot
    const dot = new THREE.Mesh(
      new THREE.CircleGeometry(0.02, 16).rotateX(-Math.PI / 2),
      reticleMat
    );
    reticle.add(dot);

    // 7. Placed Model Container
    const placedGroup = new THREE.Group();
    placedGroup.visible = false;
    scene.add(placedGroup);
    placedGroupRef.current = placedGroup;

    // 8. Load or Build 3D Artifact
    let activeModel: BuiltArtifactModel | null = null;
    loadOrBuildArtifact3DModel(artifact, linkedModel, orientation).then((built) => {
      activeModel = built;
      setBuiltModel(built);
      placedGroup.add(built.group);
    });

    // 9. Animation loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (reticleRef.current && !placedGroup.visible) {
        // gentle pulse
        const s = 1 + Math.sin(Date.now() * 0.005) * 0.05;
        reticleRef.current.scale.set(s, 1, s);
      }
      renderer.render(scene, camera);
    };
    animate();

    // 10. Mouse interaction for reticle
    const handlePointerMove = (e: MouseEvent) => {
      if (placedGroupRef.current?.visible) return;
      const rect = renderer.domElement.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const intersection = new THREE.Vector3();
      raycasterRef.current.ray.intersectPlane(groundPlaneRef.current, intersection);

      if (reticleRef.current && intersection) {
        reticleRef.current.position.set(intersection.x, 0.005, intersection.z);
      }
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('pointermove', handlePointerMove);

    return () => {
      cancelAnimationFrame(animId);
      domElement.removeEventListener('pointermove', handlePointerMove);
      renderer.dispose();
      if (activeModel) activeModel.dispose();
    };
  }, [artifact]);

  // Click on floor to anchor
  const handleAnchor = () => {
    if (!placedGroupRef.current || !reticleRef.current) return;
    placedGroupRef.current.position.copy(reticleRef.current.position);
    placedGroupRef.current.visible = true;
    reticleRef.current.visible = false;
    setIsPlaced(true);
  };

  // Reposition
  const handleReposition = () => {
    if (!placedGroupRef.current || !reticleRef.current) return;
    placedGroupRef.current.visible = false;
    reticleRef.current.visible = true;
    setIsPlaced(false);
  };

  // Rotate
  const handleRotate = (delta: number) => {
    setRotationY((prev) => {
      const next = (prev + delta) % 360;
      if (placedGroupRef.current) {
        placedGroupRef.current.rotation.y = (next * Math.PI) / 180;
      }
      return next;
    });
  };

  // Scale
  const handleScaleChange = (val: number) => {
    setScale(val);
    if (placedGroupRef.current) {
      placedGroupRef.current.scale.setScalar(val);
    }
  };

  // Reset to 1:1 real physical scale
  const handleResetScale = () => {
    setScale(1);
    if (placedGroupRef.current) {
      placedGroupRef.current.scale.setScalar(1);
    }
  };

  // Toggle garment orientation
  const handleToggleOrientation = () => {
    const next: GarmentOrientation =
      orientation === 'draped-vertical' ? 'flat-horizontal' : 'draped-vertical';
    setOrientation(next);
    if (builtModel) {
      builtModel.setOrientation(next);
    }
  };

  const dims = builtModel?.physicalDimensions;

  return (
    <div className="mt-4 border border-stone-800 rounded-xl overflow-hidden bg-stone-950 p-4 text-white shadow-xl space-y-3">
      {/* Simulator Banner */}
      <div className="flex items-center justify-between border-b border-stone-800 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold uppercase tracking-wider">
            Interactive Desktop AR Simulator
          </span>
          <span className="text-[11px] text-stone-400">
            (Virtual Floor & Lighting Camera Simulation)
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-stone-400 hover:text-white text-xs cursor-pointer"
        >
          Close Simulator
        </button>
      </div>

      {/* Simulator 3D Canvas */}
      <div
        ref={containerRef}
        onClick={() => {
          if (!isPlaced) handleAnchor();
        }}
        className="relative aspect-16/10 rounded-lg overflow-hidden bg-stone-900 border border-stone-800 cursor-crosshair"
      >
        {/* Reticle Placement Guidance */}
        {!isPlaced && (
          <div className="absolute top-3 inset-x-3 flex justify-center pointer-events-none">
            <span className="bg-black/75 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#FFE600]/40 text-xs text-[#FFE600] font-bold shadow-lg">
              Move cursor over simulated room floor · Click to anchor artifact
            </span>
          </div>
        )}

        {isPlaced && (
          <div className="absolute top-3 inset-x-3 flex justify-center pointer-events-none">
            <span className="bg-black/75 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-emerald-500/40 text-xs text-emerald-400 font-bold shadow-lg flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" />
              Artifact Anchored to Simulated Floor
            </span>
          </div>
        )}
      </div>

      {/* Simulator Control Dock */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Scale Controls */}
        <div className="flex items-center gap-2">
          <span className="text-stone-400 font-mono text-[11px]">Scale:</span>
          <input
            type="range"
            min="0.4"
            max="2.5"
            step="0.05"
            value={scale}
            onChange={(e) => handleScaleChange(parseFloat(e.target.value))}
            className="w-24 accent-[#FFE600]"
          />
          <span className="text-[11px] font-mono w-10">{(scale * 100).toFixed(0)}%</span>
          <button
            onClick={handleResetScale}
            className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[10px] font-mono text-[#FFE600] cursor-pointer"
            title="Reset to verified 1:1 real dimensions"
          >
            Reset 1:1
          </button>
        </div>

        {/* Rotation & Orientation */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleRotate(45)}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-xs font-semibold cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5 text-[#FFE600]" />
            <span>Rotate 45°</span>
          </button>

          {isGarment && (
            <button
              onClick={handleToggleOrientation}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-xs font-semibold cursor-pointer"
              title="Toggle vertical drape vs flat floor spread"
            >
              <Layers className="w-3.5 h-3.5 text-sky-400" />
              <span>{orientation === 'draped-vertical' ? 'Draped' : 'Flat Spread'}</span>
            </button>
          )}

          <button
            onClick={isPlaced ? handleReposition : handleAnchor}
            className="px-3 py-1 rounded bg-[#FFE600] text-stone-900 font-bold text-xs shadow-sm hover:brightness-110 cursor-pointer"
          >
            {isPlaced ? 'Reposition' : 'Anchor Here'}
          </button>
        </div>
      </div>

      {/* Dimensions & Calibration Footer */}
      {dims && (
        <div className="flex items-center justify-between text-[11px] text-stone-400 px-1 font-mono">
          <span>
            Verified Physical Scale: {dims.width} × {dims.height} × {dims.depth} {dims.unit}
          </span>
          <span className="text-amber-400/90">
            {orientation === 'draped-vertical' ? 'Exhibition Stand Mode' : 'Ceremonial Floor Mode'}
          </span>
        </div>
      )}
    </div>
  );
};
