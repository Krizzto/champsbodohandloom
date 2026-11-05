import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {
  RotateCcw,
  Play,
  Pause,
  Maximize2,
  Minimize2,
  Sparkles,
  X,
  SunMedium,
  Compass,
  AlertCircle,
  CheckCircle,
  Box,
} from 'lucide-react';
import { Artifact, Model3D } from '../../types';
import { useMuseumStore } from '../../store/museumStore';
import { useContentStore } from '../../store/contentStore';
import { resolveModelUrl } from '../../services/modelStorage';

interface ArtifactViewerProps {
  artifact: Artifact;
  modelType?: 'bobbin' | 'loom' | 'shuttle' | 'spindle' | 'textile';
  onClose?: () => void;
}

export const ArtifactViewer: React.FC<ArtifactViewerProps> = ({
  artifact,
  modelType = 'textile',
  onClose,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lightingMode, setLightingMode] = useState<'studio' | 'gallery'>('studio');
  const [isRealGLB, setIsRealGLB] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const { openAR, openAIPanelWithContext } = useMuseumStore();
  const { models } = useContentStore();

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const autoRotateRef = useRef(autoRotate);

  // Find linked Model3D metadata if available
  const linkedModel = models.find(
    (m) => m.artifactId === artifact.id || m.id === artifact.modelId
  );

  const isARAvailable = artifact.arAvailable || linkedModel?.arEnabled;

  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    if (!containerRef.current) return;

    setIsLoading(true);
    setLoadingProgress(0);
    setLoadError(null);
    setIsRealGLB(false);

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(lightingMode === 'gallery' ? '#171513' : '#FAF8F5');
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 3.2);
    cameraRef.current = camera;

    // 3. Renderer with antialias and tone mapping
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    rendererRef.current = renderer;

    containerRef.current.replaceChildren(renderer.domElement);

    // 4. Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff5e6, 2.0);
    keyLight.position.set(3, 4, 3);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe6f0ff, 0.8);
    fillLight.position.set(-3, 2, -2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffe600, 0.9);
    rimLight.position.set(0, -3, -2);
    scene.add(rimLight);

    // Floor shadow catcher
    const floorGeo = new THREE.PlaneGeometry(10, 10);
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.15 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.2;
    floor.receiveShadow = true;
    scene.add(floor);

    // 5. Container Group
    const modelGroup = new THREE.Group();
    modelGroupRef.current = modelGroup;
    scene.add(modelGroup);

    // Helper: Build procedural fallback model
    const buildProceduralFallback = () => {
      modelGroup.clear();

      let effectiveType = modelType;
      if (artifact.id.includes('maku') || artifact.id.includes('shuttle')) effectiveType = 'shuttle';
      else if (artifact.id.includes('khabang') || artifact.id.includes('bobbin')) effectiveType = 'bobbin';
      else if (artifact.id.includes('loom')) effectiveType = 'loom';
      else if (artifact.id.includes('spindle')) effectiveType = 'spindle';

      if (effectiveType === 'shuttle') {
        const shuttleGeo = new THREE.CylinderGeometry(0.12, 0.08, 2.2, 16);
        shuttleGeo.scale(1, 0.35, 1);
        shuttleGeo.rotateZ(Math.PI / 2);
        const woodMat = new THREE.MeshStandardMaterial({ color: 0x5a3d28, roughness: 0.35, metalness: 0.1 });
        const shuttleMesh = new THREE.Mesh(shuttleGeo, woodMat);
        shuttleMesh.castShadow = true;
        modelGroup.add(shuttleMesh);

        const tipGeo = new THREE.ConeGeometry(0.13, 0.3, 16);
        const brassMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.25, metalness: 0.8 });
        const leftTip = new THREE.Mesh(tipGeo, brassMat);
        leftTip.rotation.z = Math.PI / 2;
        leftTip.position.x = -1.15;
        modelGroup.add(leftTip);

        const rightTip = new THREE.Mesh(tipGeo, brassMat);
        rightTip.rotation.z = -Math.PI / 2;
        rightTip.position.x = 1.15;
        modelGroup.add(rightTip);

        const spoolGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.9, 16);
        spoolGeo.rotateZ(Math.PI / 2);
        const silkMat = new THREE.MeshStandardMaterial({ color: 0xffe600, roughness: 0.7 });
        const spoolMesh = new THREE.Mesh(spoolGeo, silkMat);
        spoolMesh.position.y = 0.03;
        modelGroup.add(spoolMesh);
      } else if (effectiveType === 'bobbin') {
        const centralShaftGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.8, 16);
        const woodMat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.5 });
        const shaft = new THREE.Mesh(centralShaftGeo, woodMat);
        modelGroup.add(shaft);

        for (let i = 0; i < 4; i++) {
          const ribGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.2, 12);
          ribGeo.rotateZ(Math.PI / 3);
          const rib = new THREE.Mesh(ribGeo, woodMat);
          rib.rotation.y = (i * Math.PI) / 2;
          modelGroup.add(rib);
        }

        const skeinGeo = new THREE.TorusGeometry(0.5, 0.12, 16, 32);
        const yarnMat = new THREE.MeshStandardMaterial({ color: 0xffe600, roughness: 0.8 });
        const yarn = new THREE.Mesh(skeinGeo, yarnMat);
        yarn.rotation.x = Math.PI / 2;
        modelGroup.add(yarn);
      } else if (effectiveType === 'loom') {
        const woodMat = new THREE.MeshStandardMaterial({ color: 0x4a3423, roughness: 0.6 });
        const postGeo = new THREE.BoxGeometry(0.1, 1.8, 0.1);
        const p1 = new THREE.Mesh(postGeo, woodMat); p1.position.set(-0.8, 0, -0.6);
        const p2 = new THREE.Mesh(postGeo, woodMat); p2.position.set(0.8, 0, -0.6);
        const p3 = new THREE.Mesh(postGeo, woodMat); p3.position.set(-0.8, 0, 0.6);
        const p4 = new THREE.Mesh(postGeo, woodMat); p4.position.set(0.8, 0, 0.6);
        modelGroup.add(p1, p2, p3, p4);

        const beamGeo = new THREE.BoxGeometry(0.08, 0.08, 1.3);
        const b1 = new THREE.Mesh(beamGeo, woodMat); b1.position.set(-0.8, 0.4, 0);
        const b2 = new THREE.Mesh(beamGeo, woodMat); b2.position.set(0.8, 0.4, 0);
        modelGroup.add(b1, b2);

        const clothGeo = new THREE.PlaneGeometry(1.4, 1.2, 16, 16);
        const clothMat = new THREE.MeshStandardMaterial({ color: 0x8b1e3f, roughness: 0.75, side: THREE.DoubleSide });
        const cloth = new THREE.Mesh(clothGeo, clothMat);
        cloth.rotation.x = Math.PI / 2.3;
        cloth.position.set(0, 0.1, 0);
        modelGroup.add(cloth);

        const reedGeo = new THREE.BoxGeometry(1.5, 0.25, 0.05);
        const reedMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.4 });
        const reed = new THREE.Mesh(reedGeo, reedMat);
        reed.position.set(0, 0.35, 0.1);
        modelGroup.add(reed);
      } else if (effectiveType === 'spindle') {
        const spindleGeo = new THREE.CylinderGeometry(0.015, 0.015, 1.6, 16);
        const shaftMat = new THREE.MeshStandardMaterial({ color: 0x3d291d, roughness: 0.4 });
        const shaft = new THREE.Mesh(spindleGeo, shaftMat);
        modelGroup.add(shaft);

        const whorlGeo = new THREE.CylinderGeometry(0.2, 0.22, 0.08, 24);
        const clayMat = new THREE.MeshStandardMaterial({ color: 0xa64b2a, roughness: 0.8 });
        const whorl = new THREE.Mesh(whorlGeo, clayMat);
        whorl.position.y = -0.4;
        modelGroup.add(whorl);

        const coneGeo = new THREE.ConeGeometry(0.16, 0.45, 16);
        const silkMat = new THREE.MeshStandardMaterial({ color: 0xf5eedc, roughness: 0.9 });
        const cone = new THREE.Mesh(coneGeo, silkMat);
        cone.position.y = -0.15;
        modelGroup.add(cone);
      } else {
        // High-Fidelity 3D Dokhona / Textile Drape
        const clothGeo = new THREE.PlaneGeometry(1.4, 2.2, 32, 32);
        const pos = clothGeo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          const x = pos.getX(i);
          const y = pos.getY(i);
          const z = Math.sin(x * 4) * 0.08 + Math.cos(y * 3) * 0.06;
          pos.setZ(i, z);
        }
        clothGeo.computeVertexNormals();

        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#8B1E3F';
          ctx.fillRect(0, 0, 512, 1024);
          ctx.fillStyle = '#FFE600';
          ctx.fillRect(180, 0, 152, 1024);
          ctx.fillStyle = '#8B1E3F';
          for (let y = 50; y < 1000; y += 120) {
            ctx.beginPath();
            ctx.moveTo(256, y - 40);
            ctx.lineTo(296, y);
            ctx.lineTo(256, y + 40);
            ctx.lineTo(216, y);
            ctx.closePath();
            ctx.fill();
          }
        }
        const tex = new THREE.CanvasTexture(canvas);
        const clothMat = new THREE.MeshStandardMaterial({
          map: tex,
          roughness: 0.75,
          side: THREE.DoubleSide,
        });
        const drape = new THREE.Mesh(clothGeo, clothMat);
        drape.castShadow = true;
        modelGroup.add(drape);
      }
    };

    // Load actual GLB/GLTF model or fallback to procedural
    let isCancelled = false;

    const loadModel = async () => {
      // Find candidate model URL
      let candidateUrl = artifact.modelUrl || artifact.model;
      if (linkedModel) {
        candidateUrl = await resolveModelUrl(linkedModel);
      } else if (candidateUrl && candidateUrl.startsWith('indexeddb://')) {
        const id = candidateUrl.replace('indexeddb://', '');
        const found = models.find((m) => m.id === id);
        if (found) candidateUrl = await resolveModelUrl(found);
      }

      if (!candidateUrl) {
        // No explicit 3D URL -> build procedural
        buildProceduralFallback();
        setIsLoading(false);
        return;
      }

      const loader = new GLTFLoader();

      loader.load(
        candidateUrl,
        (gltf) => {
          if (isCancelled) return;

          modelGroup.clear();
          const sceneObj = gltf.scene;

          // Compute bounding box to normalize scale and center
          const box = new THREE.Box3().setFromObject(sceneObj);
          const size = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());

          // Center the model at origin
          sceneObj.position.x = -center.x;
          sceneObj.position.y = -center.y;
          sceneObj.position.z = -center.z;

          // Scale so max dimension fits within approx 1.8 units in viewport
          const maxDim = Math.max(size.x, size.y, size.z) || 1;
          const targetScale = 1.8 / maxDim;
          sceneObj.scale.setScalar(targetScale);

          // Enable shadows
          sceneObj.traverse((child: any) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });

          modelGroup.add(sceneObj);
          setIsRealGLB(true);
          setIsLoading(false);
        },
        (progress) => {
          if (progress.total > 0) {
            setLoadingProgress(Math.round((progress.loaded / progress.total) * 100));
          }
        },
        (err) => {
          if (isCancelled) return;
          console.warn('[ArtifactViewer] GLTF model load error:', err);
          // Gracefully fallback to procedural model
          buildProceduralFallback();
          setLoadError(
            `Model file "${candidateUrl}" not found or still being created. Showing procedural heritage visualization.`
          );
          setIsLoading(false);
        }
      );
    };

    loadModel();

    // 6. Interactive Controls (Mouse & Touch)
    const dom = renderer.domElement;
    let isDragging = false;
    let previousX = 0;
    let previousY = 0;
    let initialPinchDistance = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousX = e.clientX;
      previousY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousX;
      const deltaY = e.clientY - previousY;
      modelGroup.rotation.y += deltaX * 0.01;
      modelGroup.rotation.x += deltaY * 0.01;
      previousX = e.clientX;
      previousY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z = Math.min(Math.max(camera.position.z + e.deltaY * 0.003, 1.2), 6.5);
    };

    // Touch events for mobile phones & tablets
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousX = e.touches[0].clientX;
        previousY = e.touches[0].clientY;
      } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        initialPinchDistance = Math.hypot(dx, dy);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && isDragging) {
        const deltaX = e.touches[0].clientX - previousX;
        const deltaY = e.touches[0].clientY - previousY;
        modelGroup.rotation.y += deltaX * 0.01;
        modelGroup.rotation.x += deltaY * 0.01;
        previousX = e.touches[0].clientX;
        previousY = e.touches[0].clientY;
      } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const currentDist = Math.hypot(dx, dy);
        if (initialPinchDistance > 0) {
          const pinchDelta = initialPinchDistance - currentDist;
          camera.position.z = Math.min(Math.max(camera.position.z + pinchDelta * 0.005, 1.2), 6.5);
          initialPinchDistance = currentDist;
        }
      }
    };

    const onTouchEnd = () => {
      isDragging = false;
      initialPinchDistance = 0;
    };

    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    dom.addEventListener('wheel', onWheel, { passive: false });
    dom.addEventListener('touchstart', onTouchStart, { passive: true });
    dom.addEventListener('touchmove', onTouchMove, { passive: true });
    dom.addEventListener('touchend', onTouchEnd, { passive: true });

    // 7. Render Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (autoRotateRef.current && !isDragging) {
        modelGroup.rotation.y += 0.004;
      }
      renderer.render(scene, camera);
    };

    animate();

    // 8. Resize Handler
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const newW = containerRef.current.clientWidth;
      const newH = containerRef.current.clientHeight;
      cameraRef.current.aspect = newW / newH;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      isCancelled = true;
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('wheel', onWheel);
      dom.removeEventListener('touchstart', onTouchStart);
      dom.removeEventListener('touchmove', onTouchMove);
      dom.removeEventListener('touchend', onTouchEnd);

      // Clean Three.js memory resources
      renderer.dispose();
      scene.clear();
    };
  }, [modelType, artifact.id, artifact.modelUrl, artifact.model, artifact.modelId, lightingMode, models]);

  const handleReset = () => {
    if (modelGroupRef.current && cameraRef.current) {
      modelGroupRef.current.rotation.set(0, 0, 0);
      cameraRef.current.position.set(0, 0.5, 3.2);
    }
  };

  const toggleLighting = () => {
    if (lightingMode === 'studio') {
      setLightingMode('gallery');
    } else {
      setLightingMode('studio');
    }
  };

  return (
    <div
      className={`relative flex flex-col bg-[#FAF8F5] text-stone-900 ${
        isFullscreen
          ? 'fixed inset-0 z-50'
          : 'w-full h-full min-h-[480px] rounded-xl overflow-hidden border border-stone-300'
      }`}
    >
      {/* Top HUD Controls Bar */}
      <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between p-4 bg-gradient-to-b from-stone-900/60 to-transparent pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2">
          <div className="bg-white/95 backdrop-blur-md px-3 py-1 rounded-full shadow-xs text-xs font-bold text-stone-900 border border-stone-200 flex items-center gap-1.5">
            <Box className="w-3.5 h-3.5 text-[#8B2635]" />
            <span>{artifact.name}</span>
          </div>

          {isRealGLB ? (
            <span className="flex items-center gap-1 bg-[#171513] text-[#FFE600] px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase shadow-xs">
              <CheckCircle className="w-3 h-3 text-emerald-400" />
              GLB Model Loaded
            </span>
          ) : (
            <span className="hidden sm:inline bg-black/60 text-stone-300 px-2 py-0.5 rounded text-[10px] font-mono">
              Procedural Heritage Preview
            </span>
          )}
        </div>

        <div className="pointer-events-auto flex items-center gap-2">
          {/* VIEW IN AR BUTTON */}
          {isARAvailable && (
            <button
              onClick={() => openAR(artifact)}
              title="Launch WebXR Augmented Reality"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#171513] hover:bg-[#3A2415] text-[#FFE600] text-xs font-bold shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer border border-[#FFE600]/40"
            >
              <Compass className="w-3.5 h-3.5 text-[#FFE600]" />
              <span className="hidden xs:inline">VIEW IN AR</span>
            </button>
          )}

          <button
            onClick={() => setAutoRotate(!autoRotate)}
            title={autoRotate ? 'Pause Rotation' : 'Auto Rotate'}
            className="p-2 rounded-full bg-white/90 hover:bg-white text-stone-800 shadow-md backdrop-blur-xs transition-colors cursor-pointer"
          >
            {autoRotate ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            onClick={handleReset}
            title="Reset Viewport"
            className="p-2 rounded-full bg-white/90 hover:bg-white text-stone-800 shadow-md backdrop-blur-xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={toggleLighting}
            title="Toggle Backdrop Theme"
            className="p-2 rounded-full bg-white/90 hover:bg-white text-stone-800 shadow-md backdrop-blur-xs transition-colors cursor-pointer"
          >
            <SunMedium className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title="Toggle Fullscreen"
            className="p-2 rounded-full bg-white/90 hover:bg-white text-stone-800 shadow-md backdrop-blur-xs transition-colors cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {onClose && (
            <button
              onClick={onClose}
              title="Close Viewer"
              className="p-2 rounded-full bg-black/80 hover:bg-black text-white shadow-md transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 3D Canvas Mount */}
      <div ref={containerRef} className="w-full flex-1 cursor-grab active:cursor-grabbing relative" />

      {/* Loading state indicator */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#FAF8F5]/90 backdrop-blur-xs">
          <div className="w-10 h-10 rounded-full border-3 border-stone-300 border-t-[#8B1E3F] animate-spin mb-3" />
          <p className="text-xs font-editorial font-bold text-stone-800">
            Loading 3D Cultural Artifact...
          </p>
          {loadingProgress > 0 && (
            <span className="text-[11px] text-stone-500 font-mono mt-1">
              {loadingProgress}%
            </span>
          )}
        </div>
      )}

      {/* Optional fallback notice */}
      {loadError && (
        <div className="absolute top-16 left-4 right-4 z-20 pointer-events-none flex justify-center">
          <div className="pointer-events-auto max-w-lg bg-amber-50/95 border border-amber-300 rounded-lg p-2.5 text-xs text-amber-900 shadow-md flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold">{loadError}</span>
            </div>
            <button
              onClick={() => setLoadError(null)}
              className="text-amber-700 hover:text-black p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Bottom Floating Information & AR Trigger Strip */}
      <div className="absolute bottom-4 inset-x-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl border border-stone-200 shadow-md max-w-md">
          <div className="flex items-center gap-2">
            <p className="text-[11px] text-stone-500 font-bold uppercase tracking-wider">
              Spatial 3D Inspection Mode
            </p>
            {linkedModel?.physicalDimensions && (
              <span className="text-[10px] px-2 py-0.2 rounded bg-stone-100 text-stone-700 font-mono">
                1:1 Scale: {linkedModel.physicalDimensions.width} × {linkedModel.physicalDimensions.height} {linkedModel.physicalDimensions.unit}
              </span>
            )}
          </div>
          <p className="text-xs text-stone-800 font-editorial line-clamp-1 mt-0.5">
            Drag to rotate · Pinch or scroll to zoom · Double click to reset
          </p>
        </div>

        <div className="pointer-events-auto flex items-center gap-2">
          {isARAvailable && (
            <button
              onClick={() => openAR(artifact)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#171513] hover:bg-[#3A2415] text-[#FFE600] text-xs font-bold shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer border border-[#FFE600]/40"
            >
              <Compass className="w-3.5 h-3.5 text-[#FFE600]" />
              <span>VIEW IN AR</span>
            </button>
          )}

          <button
            onClick={() =>
              openAIPanelWithContext(
                artifact,
                `Explain the 3D structure and craftsmanship of the ${artifact.name}.`
              )
            }
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-stone-50 text-stone-900 text-xs font-semibold border border-stone-300 shadow-md transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>ASK AI</span>
          </button>
        </div>
      </div>
    </div>
  );
};
