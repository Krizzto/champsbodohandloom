import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ExhibitItem, MuseumGallery } from '../types/museum';
import { MUSEUM_GALLERIES, MUSEUM_EXHIBITS } from '../data/museumData';
import { Eye, Compass, Navigation, Maximize2, Move, HelpCircle } from 'lucide-react';

interface VRMuseumCanvasProps {
  currentGalleryId: string;
  selectedExhibit: ExhibitItem | null;
  onSelectExhibit: (exhibit: ExhibitItem) => void;
  onSelectGallery: (galleryId: string) => void;
}

export const VRMuseumCanvas: React.FC<VRMuseumCanvasProps> = ({
  currentGalleryId,
  selectedExhibit,
  onSelectExhibit,
  onSelectGallery
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isVRMode, setIsVRMode] = useState<boolean>(false);
  const [cameraMode, setCameraMode] = useState<'orbit' | 'free_walk'>('orbit');
  const [controlsHelp, setControlsHelp] = useState<boolean>(false);

  // References to three objects for runtime updates
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const targetCameraPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 3.5, 9));
  const targetLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.2, 0));
  const currentLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.2, 0));
  const exhibitMeshes = useRef<Map<string, THREE.Group>>(new Map());
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());

  // Handle gallery/exhibit focus change
  useEffect(() => {
    if (selectedExhibit) {
      const [x, y, z] = selectedExhibit.position;
      targetCameraPos.current.set(x, y + 2.4, z + 4.8);
      targetLookAt.current.set(x, y + 1.2, z);
    } else {
      const gal = MUSEUM_GALLERIES.find(g => g.id === currentGalleryId);
      if (gal) {
        const [cx, cy, cz] = gal.cameraWaypoint;
        const [lx, ly, lz] = gal.centerPosition;
        targetCameraPos.current.set(cx, cy, cz);
        targetLookAt.current.set(lx, ly + 1.0, lz);
      }
    }
  }, [currentGalleryId, selectedExhibit]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0c0a09);
    scene.fog = new THREE.FogExp2(0x0c0a09, 0.022);

    // 2. Camera setup
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;
    const camera = new THREE.PerspectiveCamera(58, width / height, 0.1, 100);
    camera.position.set(0, 4, 10);
    cameraRef.current = camera;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Museum Architecture Floor & Ceilings
    const floorGeo = new THREE.PlaneGeometry(80, 50);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x1c1917,
      roughness: 0.45,
      metalness: 0.15
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Gallery floor inlays for each zone
    MUSEUM_GALLERIES.forEach(gal => {
      const [gx, , gz] = gal.centerPosition;
      const ringGeo = new THREE.RingGeometry(5.8, 6.1, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(gal.ambientColor),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.35
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(gx, 0.02, gz);
      scene.add(ring);
    });

    // Ceiling trusses & architectural rafters
    for (let x = -30; x <= 30; x += 10) {
      const pillarGeo = new THREE.CylinderGeometry(0.35, 0.4, 8, 12);
      const pillarMat = new THREE.MeshStandardMaterial({ color: 0x292524, roughness: 0.8 });
      const pillarLeft = new THREE.Mesh(pillarGeo, pillarMat);
      pillarLeft.position.set(x, 4, -12);
      scene.add(pillarLeft);

      const pillarRight = new THREE.Mesh(pillarGeo, pillarMat);
      pillarRight.position.set(x, 4, 12);
      scene.add(pillarRight);

      // Overhead timber truss
      const beamGeo = new THREE.BoxGeometry(0.4, 0.4, 24);
      const beamMat = new THREE.MeshStandardMaterial({ color: 0x3f3f46, roughness: 0.7 });
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.position.set(x, 7.8, 0);
      scene.add(beam);
    }

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xfff7ed, 0.85);
    scene.add(ambientLight);

    const mainCenterLight = new THREE.PointLight(0xfef3c7, 1.2, 35);
    mainCenterLight.position.set(0, 7, 0);
    scene.add(mainCenterLight);

    // Gallery colored spotlights
    MUSEUM_GALLERIES.forEach(gal => {
      const [gx, , gz] = gal.centerPosition;
      const spot = new THREE.SpotLight(new THREE.Color(gal.ambientColor), 2.2, 25, Math.PI / 3, 0.4, 1.2);
      spot.position.set(gx, 6.5, gz + 2);
      spot.target.position.set(gx, 0.8, gz);
      scene.add(spot);
      scene.add(spot.target);
    });

    // 6. Build 3D exhibits & pedestals
    exhibitMeshes.current.clear();

    MUSEUM_EXHIBITS.forEach(exhibit => {
      const group = new THREE.Group();
      const [ex, ey, ez] = exhibit.position;
      group.position.set(ex, ey, ez);

      // Pedestal Base
      const pedestalGeo = new THREE.CylinderGeometry(1.4, 1.6, 0.9, 24);
      const pedestalMat = new THREE.MeshStandardMaterial({
        color: 0x262626,
        roughness: 0.3,
        metalness: 0.2
      });
      const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
      pedestal.position.y = 0.45;
      pedestal.castShadow = true;
      pedestal.receiveShadow = true;
      group.add(pedestal);

      // Glass trim ring
      const ringGeo = new THREE.TorusGeometry(1.42, 0.04, 8, 32);
      const ringMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(exhibit.color),
        emissive: new THREE.Color(exhibit.color),
        emissiveIntensity: 0.6
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.9;
      group.add(ring);

      // 3D Procedural representation based on modelType
      const artifactGroup = new THREE.Group();
      artifactGroup.position.y = 0.92;

      if (exhibit.modelType === 'loom') {
        // Traditional wooden loom frame
        const frameMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.7 });
        const postGeo = new THREE.BoxGeometry(0.12, 1.6, 0.12);

        // 4 posts
        [-0.7, 0.7].forEach(px => {
          [-0.6, 0.6].forEach(pz => {
            const post = new THREE.Mesh(postGeo, frameMat);
            post.position.set(px, 0.8, pz);
            artifactGroup.add(post);
          });
        });

        // Top horizontal beams
        const beamXGeo = new THREE.BoxGeometry(1.5, 0.08, 0.1);
        const beamZGeo = new THREE.BoxGeometry(0.1, 0.08, 1.3);
        const topX1 = new THREE.Mesh(beamXGeo, frameMat);
        topX1.position.set(0, 1.55, -0.6);
        const topX2 = new THREE.Mesh(beamXGeo, frameMat);
        topX2.position.set(0, 1.55, 0.6);
        const topZ1 = new THREE.Mesh(beamZGeo, frameMat);
        topZ1.position.set(-0.7, 1.55, 0);
        const topZ2 = new THREE.Mesh(beamZGeo, frameMat);
        topZ2.position.set(0.7, 1.55, 0);
        artifactGroup.add(topX1, topX2, topZ1, topZ2);

        // Warp thread plane
        const warpGeo = new THREE.PlaneGeometry(1.2, 1.1);
        const warpMat = new THREE.MeshStandardMaterial({
          color: exhibit.id.includes('traditional') ? 0xfef08a : 0xf43f5e,
          roughness: 0.6,
          side: THREE.DoubleSide
        });
        const warpPlane = new THREE.Mesh(warpGeo, warpMat);
        warpPlane.rotation.x = Math.PI / 2.2;
        warpPlane.position.set(0, 0.8, 0);
        artifactGroup.add(warpPlane);

        // Weaving sword & heald
        const swordGeo = new THREE.BoxGeometry(1.3, 0.04, 0.14);
        const swordMat = new THREE.MeshStandardMaterial({ color: 0x451a03 });
        const sword = new THREE.Mesh(swordGeo, swordMat);
        sword.position.set(0, 0.85, 0.1);
        artifactGroup.add(sword);
      } else if (exhibit.modelType === 'spinning_wheel') {
        // Zenther spinning wheel
        const woodMat = new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.6 });
        const baseBox = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.12, 0.5), woodMat);
        baseBox.position.set(0, 0.06, 0);
        artifactGroup.add(baseBox);

        // Wheel disc
        const wheelGeo = new THREE.TorusGeometry(0.55, 0.03, 8, 24);
        const wheelMesh = new THREE.Mesh(wheelGeo, woodMat);
        wheelMesh.position.set(-0.35, 0.7, 0);
        wheelMesh.rotation.y = Math.PI / 2;
        wheelMesh.name = 'spinning_wheel_rotor';
        artifactGroup.add(wheelMesh);

        // Spokes
        for (let i = 0; i < 6; i++) {
          const spokeGeo = new THREE.CylinderGeometry(0.015, 0.015, 1.05);
          const spoke = new THREE.Mesh(spokeGeo, woodMat);
          spoke.position.set(-0.35, 0.7, 0);
          spoke.rotation.x = (i * Math.PI) / 3;
          artifactGroup.add(spoke);
        }

        // Spindle tip on other side
        const spindleGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.45);
        const spindle = new THREE.Mesh(spindleGeo, new THREE.MeshStandardMaterial({ color: 0xd97706 }));
        spindle.rotation.z = Math.PI / 2;
        spindle.position.set(0.4, 0.65, 0);
        artifactGroup.add(spindle);
      } else if (exhibit.modelType === 'ginning_roller') {
        // Neotha roller device
        const postMat = new THREE.MeshStandardMaterial({ color: 0x713f12 });
        const p1 = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.9, 0.15), postMat);
        p1.position.set(-0.4, 0.45, 0);
        const p2 = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.9, 0.15), postMat);
        p2.position.set(0.4, 0.45, 0);

        // Rollers
        const rollerMat = new THREE.MeshStandardMaterial({ color: 0xca8a04, roughness: 0.5 });
        const r1 = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.8), rollerMat);
        r1.rotation.z = Math.PI / 2;
        r1.position.set(0, 0.4, 0);
        const r2 = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.8), rollerMat);
        r2.rotation.z = Math.PI / 2;
        r2.position.set(0, 0.6, 0);

        // Raw cotton fluff tufts
        const cottonGeo = new THREE.DodecahedronGeometry(0.16);
        const cottonMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 });
        for (let c = 0; c < 5; c++) {
          const fluff = new THREE.Mesh(cottonGeo, cottonMat);
          fluff.position.set(-0.25 + c * 0.12, 0.5, 0.18);
          artifactGroup.add(fluff);
        }

        artifactGroup.add(p1, p2, r1, r2);
      } else if (exhibit.modelType === 'reeling_basin') {
        // Terracotta cauldron with floating cocoons & leaves
        const potGeo = new THREE.CylinderGeometry(0.65, 0.45, 0.55, 20);
        const potMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.8 });
        const pot = new THREE.Mesh(potGeo, potMat);
        pot.position.set(0, 0.28, 0);
        artifactGroup.add(pot);

        // Water surface
        const waterGeo = new THREE.CircleGeometry(0.6, 16);
        const waterMat = new THREE.MeshStandardMaterial({
          color: 0x0284c7,
          roughness: 0.1,
          metalness: 0.6,
          transparent: true,
          opacity: 0.8
        });
        const water = new THREE.Mesh(waterGeo, waterMat);
        water.rotation.x = -Math.PI / 2;
        water.position.set(0, 0.54, 0);
        artifactGroup.add(water);

        // Cocoons floating
        const cocoonMat = new THREE.MeshStandardMaterial({ color: 0xfef9c3 });
        for (let i = 0; i < 6; i++) {
          const cMesh = new THREE.Mesh(new THREE.CapsuleGeometry(0.05, 0.08, 4, 8), cocoonMat);
          cMesh.position.set(
            Math.cos((i * Math.PI) / 3) * 0.3,
            0.57,
            Math.sin((i * Math.PI) / 3) * 0.3
          );
          cMesh.rotation.z = Math.PI / 3;
          artifactGroup.add(cMesh);
        }
      } else if (exhibit.modelType === 'textile_display') {
        // Mannequin or draped tapestry banner
        const rodGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.6);
        const rodMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.8 });
        const rod = new THREE.Mesh(rodGeo, rodMat);
        rod.rotation.z = Math.PI / 2;
        rod.position.set(0, 1.7, 0);
        artifactGroup.add(rod);

        // Tapestry banner plane with rich Bodo Agor pattern styling
        const clothGeo = new THREE.PlaneGeometry(1.3, 1.4);
        const clothMat = new THREE.MeshStandardMaterial({
          color: exhibit.id.includes('aronai') ? 0xd97706 : 0xbe123c,
          roughness: 0.55,
          side: THREE.DoubleSide
        });
        const cloth = new THREE.Mesh(clothGeo, clothMat);
        cloth.position.set(0, 0.95, 0);
        artifactGroup.add(cloth);

        // Fringe tassels at bottom
        for (let f = -0.55; f <= 0.55; f += 0.1) {
          const fringe = new THREE.Mesh(
            new THREE.CylinderGeometry(0.015, 0.015, 0.2),
            new THREE.MeshBasicMaterial({ color: 0xfef08a })
          );
          fringe.position.set(f, 0.15, 0);
          artifactGroup.add(fringe);
        }
      } else {
        // Generic apparatus (warp creel, beaming frame, cocoon tray)
        const frame = new THREE.Mesh(
          new THREE.BoxGeometry(1.2, 1.3, 0.8),
          new THREE.MeshStandardMaterial({ color: 0x57534e, roughness: 0.6 })
        );
        frame.position.y = 0.65;
        artifactGroup.add(frame);
      }

      group.add(artifactGroup);

      // Floating holographic label / pulsing halo
      const haloGeo = new THREE.RingGeometry(0.4, 0.5, 20);
      const haloMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(exhibit.color),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.position.set(0, 2.5, 0);
      halo.rotation.x = Math.PI / 2;
      group.add(halo);

      // Click hit-box volume
      const hitBoxGeo = new THREE.CylinderGeometry(1.6, 1.6, 2.8, 12);
      const hitBoxMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitBox = new THREE.Mesh(hitBoxGeo, hitBoxMat);
      hitBox.position.y = 1.4;
      hitBox.userData = { exhibitId: exhibit.id };
      group.add(hitBox);

      scene.add(group);
      exhibitMeshes.current.set(exhibit.id, group);
    });

    // 7. Click raycasting for selecting exhibit
    const handleCanvasClick = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.current.setFromCamera(mouse.current, camera);
      const intersects = raycaster.current.intersectObjects(scene.children, true);

      for (const hit of intersects) {
        if (hit.object.userData?.exhibitId) {
          const ex = MUSEUM_EXHIBITS.find(e => e.id === hit.object.userData.exhibitId);
          if (ex) {
            onSelectExhibit(ex);
            break;
          }
        }
      }
    };

    renderer.domElement.addEventListener('click', handleCanvasClick);

    // 8. Mouse drag to pan / orbit
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      targetCameraPos.current.x -= deltaX * 0.02;
      targetCameraPos.current.y = Math.max(1.5, Math.min(8.0, targetCameraPos.current.y + deltaY * 0.02));
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // 9. Resize listener
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 10. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera interpolation
      camera.position.lerp(targetCameraPos.current, 0.05);
      currentLookAt.current.lerp(targetLookAt.current, 0.05);
      camera.lookAt(currentLookAt.current);

      // Gentle floating animation for pedestals & rotor spin
      exhibitMeshes.current.forEach((group, exhibitId) => {
        const rotor = group.getObjectByName('spinning_wheel_rotor');
        if (rotor) {
          rotor.rotation.z += delta * 1.5;
        }

        const isCurrentSelected = selectedExhibit?.id === exhibitId;
        const ring = group.children[1] as THREE.Mesh;
        if (ring && isCurrentSelected) {
          ring.scale.setScalar(1 + Math.sin(elapsedTime * 4) * 0.06);
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      renderer.domElement.removeEventListener('click', handleCanvasClick);
      renderer.domElement.removeEventListener('mousedown', handleMouseDown);
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [onSelectExhibit]);

  // Gallery fast navigation teleport
  const handleTeleport = (gallery: MuseumGallery) => {
    onSelectGallery(gallery.id);
  };

  return (
    <div className="relative w-full h-[520px] md:h-[620px] bg-stone-950 rounded-2xl overflow-hidden border border-stone-800 shadow-2xl group">
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Overlay: Museum Gallery Compass Bar */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="flex items-center gap-2 bg-stone-900/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-stone-700/60 pointer-events-auto shadow-lg">
          <Compass className="w-4 h-4 text-amber-400 animate-spin-slow" />
          <span className="text-xs font-semibold text-stone-200 uppercase tracking-wider">VR Museum Floor</span>
          <span className="text-xs text-stone-500">|</span>
          <span className="text-xs font-medium text-amber-300">
            {MUSEUM_GALLERIES.find(g => g.id === currentGalleryId)?.name || 'Central Hall'}
          </span>
        </div>

        {/* Gallery Jump Tabs */}
        <div className="hidden lg:flex items-center gap-1.5 bg-stone-900/85 backdrop-blur-md p-1 rounded-xl border border-stone-700/60 pointer-events-auto">
          {MUSEUM_GALLERIES.map(gal => {
            const isActive = gal.id === currentGalleryId;
            return (
              <button
                key={gal.id}
                onClick={() => handleTeleport(gal)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-amber-500 text-stone-950 shadow font-semibold'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: gal.ambientColor }}
                />
                <span>G{gal.number}: {gal.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Controls toggles */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setIsVRMode(!isVRMode)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
              isVRMode
                ? 'bg-rose-600 text-white border-rose-500 shadow-rose-900/50 shadow-md'
                : 'bg-stone-900/80 text-stone-300 border-stone-700 hover:bg-stone-800 hover:text-white'
            }`}
            title="Toggle VR Dual-Eye Stereoscopic Mode"
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">{isVRMode ? 'Exit VR Mode' : 'VR View'}</span>
          </button>

          <button
            onClick={() => setControlsHelp(!controlsHelp)}
            className="p-2 bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-white rounded-xl border border-stone-700 transition-colors"
            title="Navigation Help"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* VR Stereoscopic Overlay when enabled */}
      {isVRMode && (
        <div className="absolute inset-0 pointer-events-none grid grid-cols-2 gap-2 p-2 bg-black/40 backdrop-blur-[2px]">
          <div className="relative border-2 border-dashed border-amber-500/40 rounded-2xl flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-amber-400/80" />
            <span className="absolute bottom-4 left-4 text-[10px] text-stone-400 font-mono tracking-widest uppercase">Left Eye Lens</span>
          </div>
          <div className="relative border-2 border-dashed border-amber-500/40 rounded-2xl flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-amber-400/80" />
            <span className="absolute bottom-4 right-4 text-[10px] text-stone-400 font-mono tracking-widest uppercase">Right Eye Lens</span>
          </div>
        </div>
      )}

      {/* Controls Guide Drawer */}
      {controlsHelp && (
        <div className="absolute bottom-16 right-4 max-w-xs bg-stone-900/95 backdrop-blur-md p-4 rounded-xl border border-stone-700 text-xs text-stone-300 space-y-2 shadow-2xl z-20">
          <div className="flex items-center justify-between border-b border-stone-800 pb-2">
            <span className="font-semibold text-white flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-amber-400" /> VR Navigation Controls
            </span>
            <button onClick={() => setControlsHelp(false)} className="text-stone-400 hover:text-white">✕</button>
          </div>
          <p className="text-stone-400">
            • <strong className="text-stone-200">Click & Drag:</strong> Orbit camera around the hall.
          </p>
          <p className="text-stone-400">
            • <strong className="text-stone-200">Click Pedestals:</strong> Select and inspect artifacts up close.
          </p>
          <p className="text-stone-400">
            • <strong className="text-stone-200">Gallery Tabs:</strong> Teleport camera immediately between the 4 exhibition halls.
          </p>
          <p className="text-stone-400">
            • <strong className="text-stone-200">Agentic Voice Tour:</strong> Ask the AI Guide in the panel to take you to any loom or process.
          </p>
        </div>
      )}

      {/* Bottom Floating Hotspot Info Bar if an exhibit is active */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 pointer-events-none">
        {selectedExhibit ? (
          <div className="bg-stone-900/90 backdrop-blur-md border border-amber-500/50 p-3 rounded-xl pointer-events-auto flex items-center justify-between gap-4 max-w-lg shadow-xl animate-fade-in">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-stone-950 shrink-0 shadow"
                style={{ backgroundColor: selectedExhibit.color }}
              >
                3D
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">{selectedExhibit.name}</h4>
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/40">
                    {selectedExhibit.nativeName}
                  </span>
                </div>
                <p className="text-xs text-stone-300 line-clamp-1">{selectedExhibit.shortDesc}</p>
              </div>
            </div>
            <button
              onClick={() => onSelectExhibit(selectedExhibit)}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg text-xs font-bold transition-all shrink-0 shadow"
            >
              Examine
            </button>
          </div>
        ) : (
          <div className="bg-stone-900/80 backdrop-blur-md border border-stone-800 px-3.5 py-2 rounded-xl text-xs text-stone-400 flex items-center gap-2">
            <Move className="w-3.5 h-3.5 text-amber-400" />
            <span>Click any 3D exhibit pedestal to inspect details & hear narration</span>
          </div>
        )}

        {/* Spatial Coordinates / Waypoint indicator */}
        <div className="hidden sm:flex items-center gap-2 bg-stone-900/80 backdrop-blur-md border border-stone-800 px-3 py-1.5 rounded-xl text-[11px] font-mono text-stone-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          <span>Spatial Guide: Active</span>
        </div>
      </div>
    </div>
  );
};
