import React, { Suspense, useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Center, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { ModelControls } from './ModelControls';
import { ModelLoader } from './ModelLoader';
import { ModelError } from './ModelError';
import { useModelViewer } from '../../hooks/useModelViewer';
import { getModelBlob } from '../../services/modelStorage';

export interface ModelViewerProps {
  modelUrl?: string;
  artifactName?: string;
  className?: string;
}

// Inner Model renderer using useGLTF
function GLTFModel({
  url,
  wireframe = false,
  onError
}: {
  url: string;
  wireframe?: boolean;
  onError: (err: any) => void;
}) {
  const [resolvedUrl, setResolvedUrl] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let createdBlobUrl: string | null = null;

    const resolveAndVerify = async () => {
      try {
        let finalUrl = url;
        if (url.startsWith('indexeddb://')) {
          const id = url.replace('indexeddb://', '');
          const blob = await getModelBlob(id);
          if (!blob) throw new Error(`Model not found in IndexedDB: ${id}`);
          createdBlobUrl = URL.createObjectURL(blob);
          finalUrl = createdBlobUrl;
        }

        const res = await fetch(finalUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}: File not found at ${url}`);
        await res.blob();

        if (isMounted) setResolvedUrl(finalUrl);
      } catch (err) {
        if (isMounted) onError(err);
      }
    };

    resolveAndVerify();

    return () => {
      isMounted = false;
      if (createdBlobUrl) {
        try {
          URL.revokeObjectURL(createdBlobUrl);
        } catch {}
      }
    };
  }, [url, onError]);

  if (!resolvedUrl) return null;

  return <ActualGLTFComponent url={resolvedUrl} wireframe={wireframe} onError={onError} />;
}

function ActualGLTFComponent({
  url,
  wireframe,
  onError
}: {
  url: string;
  wireframe: boolean;
  onError: (err: any) => void;
}) {
  try {
    const gltf = useGLTF(url);

    useEffect(() => {
      if (gltf.scene) {
        gltf.scene.traverse((child: any) => {
          if (child.isMesh && child.material) {
            child.material.wireframe = wireframe;
          }
        });
      }
    }, [gltf, wireframe]);

    return (
      <Center>
        <primitive object={gltf.scene} scale={1.2} />
      </Center>
    );
  } catch (err) {
    onError(err);
    return null;
  }
}

export const ModelViewer: React.FC<ModelViewerProps> = ({
  modelUrl,
  artifactName,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<any>(null);

  const {
    autoRotate,
    wireframe,
    isFullscreen,
    toggleAutoRotate,
    toggleWireframe,
    toggleFullscreen
  } = useModelViewer();

  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // If modelUrl is not specified or was tested as unavailable
  useEffect(() => {
    setHasError(false);
    setErrorMessage('');
    if (!modelUrl) {
      setHasError(true);
      setErrorMessage('3D model unavailable for this accession');
      return;
    }

    if (modelUrl.startsWith('indexeddb://')) {
      const id = modelUrl.replace('indexeddb://', '');
      getModelBlob(id).then((blob) => {
        if (!blob) {
          setHasError(true);
          setErrorMessage('Uploaded 3D model not found in browser database');
        }
      });
      return;
    }

    if (modelUrl.startsWith('blob:') || modelUrl.startsWith('data:')) {
      return;
    }

    // Verify whether static file exists in public/assets/models/
    fetch(modelUrl, { method: 'HEAD' })
      .then((res) => {
        if (!res.ok) {
          setHasError(true);
          setErrorMessage(`Model file not found at ${modelUrl}`);
        }
      })
      .catch(() => {
        setHasError(true);
        setErrorMessage('3D model unavailable');
      });
  }, [modelUrl]);

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[380px] sm:h-[480px] bg-[#FAF8F5] rounded-2xl overflow-hidden border border-stone-200 shadow-sm ${className}`}
    >
      {/* Name and format badge */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 pointer-events-none">
        {artifactName && (
          <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs text-xs font-bold text-stone-800 border border-stone-200 shadow-xs">
            {artifactName}
          </span>
        )}
        <span className="px-2.5 py-1 rounded-full bg-[#171513] text-[#FFE600] text-[10px] font-mono uppercase tracking-wider font-bold">
          Three.js / WebGL
        </span>
      </div>

      {/* Floating Interactive Controls */}
      {!hasError && (
        <div className="absolute bottom-4 right-4 z-20">
          <ModelControls
            autoRotate={autoRotate}
            onToggleAutoRotate={toggleAutoRotate}
            wireframe={wireframe}
            onToggleWireframe={toggleWireframe}
            isFullscreen={isFullscreen}
            onToggleFullscreen={() => toggleFullscreen(containerRef.current)}
            onResetCamera={handleResetCamera}
          />
        </div>
      )}

      {/* Instructions Overlay */}
      {!hasError && (
        <div className="absolute bottom-4 left-4 z-10 hidden sm:flex items-center gap-3 text-[11px] text-stone-500 bg-white/80 backdrop-blur-xs px-3 py-1 rounded-lg border border-stone-200/80 pointer-events-none">
          <span>Rotate: Drag</span>
          <span>•</span>
          <span>Zoom: Scroll</span>
          <span>•</span>
          <span>Pan: Right-click</span>
        </div>
      )}

      {/* Error State: 3D model unavailable (No substitute fake cube) */}
      {hasError ? (
        <ModelError modelPath={modelUrl} errorMessage={errorMessage} />
      ) : (
        <Suspense fallback={<ModelLoader />}>
          <Canvas
            camera={{ position: [0, 1.2, 3], fov: 45 }}
            className="w-full h-full"
            gl={{ antialias: true, alpha: true }}
          >
            <ambientLight intensity={0.7} />
            <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
            <directionalLight position={[-5, -2, -5]} intensity={0.4} />

            {modelUrl && (
              <GLTFModel
                url={modelUrl}
                wireframe={wireframe}
                onError={(err) => {
                  console.warn('GLTF load failed:', err);
                  setHasError(true);
                  setErrorMessage('3D model unavailable');
                }}
              />
            )}

            <OrbitControls
              ref={controlsRef}
              autoRotate={autoRotate}
              autoRotateSpeed={1.5}
              enableDamping
              dampingFactor={0.05}
              minDistance={1}
              maxDistance={10}
            />
          </Canvas>
        </Suspense>
      )}
    </div>
  );
};
