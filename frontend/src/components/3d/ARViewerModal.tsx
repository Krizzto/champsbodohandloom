import React, { useState, useEffect, useRef } from 'react';
import {
  Compass,
  X,
  Sparkles,
  Box,
  Scan,
  Smartphone,
  CheckCircle,
  RefreshCw,
  Info,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Layers,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { Artifact, Model3D } from '../../types';
import { useMuseumStore } from '../../store/museumStore';
import { useContentStore } from '../../store/contentStore';
import { checkARCapability } from './ar/arCapability';
import { ARCapabilityResult, ARSessionState, GarmentOrientation } from './ar/arTypes';
import { BuiltArtifactModel, getArtifactPhysicalDimensions } from './ar/artifact3DBuilder';
import { WebXRARManager } from './ar/WebXRARManager';
import { ARCompatibilityCard } from './ar/ARCompatibilityCard';
import { DesktopARSimulator } from './ar/DesktopARSimulator';

interface ARViewerModalProps {
  artifact: Artifact;
  onClose: () => void;
}

export const ARViewerModal: React.FC<ARViewerModalProps> = ({ artifact, onClose }) => {
  // Capability detection state
  const [capability, setCapability] = useState<ARCapabilityResult>({
    isSupported: false,
    isChecking: true,
    isSecureContext: true,
    hasWebXR: false,
    hasImmersiveAR: false,
    isInIframe: false,
    hasSpatialTrackingPermission: true,
  });

  // Session lifecycle states
  const [sessionState, setSessionState] = useState<ARSessionState>('checking-compatibility');
  const [isARActive, setIsARActive] = useState(false);
  const [surfaceDetected, setSurfaceDetected] = useState(false);
  const [isPlaced, setIsPlaced] = useState(false);
  const [launchError, setLaunchError] = useState<string | null>(null);

  // Model & Display states
  const [builtModel, setBuiltModel] = useState<BuiltArtifactModel | null>(null);
  const [garmentOrientation, setGarmentOrientation] =
    useState<GarmentOrientation>('draped-vertical');
  const [showInfoDrawer, setShowInfoDrawer] = useState(false);
  const [isSimulatingPlacement, setIsSimulatingPlacement] = useState(false);

  // Scale tracking for live AR display
  const [scaleMultiplier, setScaleMultiplier] = useState(1.0);

  const { open3DViewer, openAIPanelWithContext } = useMuseumStore();
  const { models } = useContentStore();

  // Find linked model metadata
  const linkedModel = models.find(
    (m) => m.artifactId === artifact.id || m.id === artifact.modelId
  );

  const physicalDimensions = getArtifactPhysicalDimensions(artifact, linkedModel);
  const isGarment = artifact.category === 'TEXTILES' || artifact.id.includes('dokhona');

  // DOM and WebXR Engine Refs
  const overlayRef = useRef<HTMLDivElement>(null);
  const arCanvasRef = useRef<HTMLCanvasElement>(null);
  const arManagerRef = useRef<WebXRARManager | null>(null);

  // 1. Check capability on mount
  useEffect(() => {
    let isMounted = true;
    checkARCapability().then((res) => {
      if (isMounted) {
        setCapability(res);
        if (res.isSupported) {
          setSessionState('ready');
        } else {
          setSessionState('ar-unavailable');
        }
      }
    });

    return () => {
      isMounted = false;
      if (arManagerRef.current) {
        arManagerRef.current.exitAR();
      }
    };
  }, []);

  // 2. Launch Real WebXR AR Session
  const handleLaunchRealAR = async () => {
    if (!capability.isSupported || typeof navigator === 'undefined' || !(navigator as any).xr) {
      setLaunchError('WebXR immersive-ar is not available on this device.');
      return;
    }

    setLaunchError(null);
    setSessionState('waiting-permission');

    try {
      // Create dedicated WebXR manager instance
      const manager = new WebXRARManager({
        onStateChange: (state) => {
          setSessionState(state);
          if (state === 'artifact-placed') {
            setIsPlaced(true);
          } else if (state === 'scanning-surface') {
            setIsPlaced(false);
          } else if (state === 'session-ended') {
            setIsARActive(false);
            setIsPlaced(false);
            setSurfaceDetected(false);
          }
        },
        onSurfaceDetected: (detected) => {
          setSurfaceDetected(detected);
        },
        onModelLoaded: (built) => {
          setBuiltModel(built);
        },
        onError: (err) => {
          setLaunchError(err);
        },
      });

      arManagerRef.current = manager;

      let canvas = arCanvasRef.current;
      if (!canvas) {
        canvas = document.createElement('canvas');
      }

      const overlay = overlayRef.current || document.body;

      setIsARActive(true);
      await manager.startSession(canvas, overlay, artifact, linkedModel, garmentOrientation);
    } catch (err: any) {
      console.warn('[ARViewerModal] WebXR Session launch exception:', err);
      setIsARActive(false);
      setLaunchError(err?.message || 'Could not launch AR camera session.');
    }
  };

  // Place artifact via screen tap or button
  const handlePlaceArtifact = () => {
    if (arManagerRef.current) {
      const placed = arManagerRef.current.handleScreenTap();
      if (placed) {
        setIsPlaced(true);
      }
    }
  };

  // Reposition
  const handleReposition = () => {
    if (arManagerRef.current) {
      arManagerRef.current.reposition();
      setIsPlaced(false);
    }
  };

  // Adjust Scale
  const handleScaleChange = (multiplier: number) => {
    if (arManagerRef.current) {
      arManagerRef.current.adjustScale(multiplier);
      setScaleMultiplier((prev) => Math.max(0.2, Math.min(3.0, prev * multiplier)));
    }
  };

  // Reset to 1:1 Verified Physical Scale
  const handleResetToRealScale = () => {
    if (arManagerRef.current) {
      arManagerRef.current.resetToRealScale();
      setScaleMultiplier(1.0);
    }
  };

  // Rotate Y
  const handleRotateY = (degrees: number) => {
    if (arManagerRef.current) {
      arManagerRef.current.rotateY(degrees);
    }
  };

  // Toggle Garment Orientation
  const handleToggleGarmentOrientation = () => {
    const next: GarmentOrientation =
      garmentOrientation === 'draped-vertical' ? 'flat-horizontal' : 'draped-vertical';
    setGarmentOrientation(next);
    if (arManagerRef.current) {
      arManagerRef.current.setGarmentOrientation(next);
    }
  };

  // Exit AR Session
  const handleExitAR = async () => {
    if (arManagerRef.current) {
      await arManagerRef.current.exitAR();
    }
    setIsARActive(false);
    setIsPlaced(false);
    setSurfaceDetected(false);
    setSessionState('ready');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 select-text">
      {/* 
        ============================================================
        ACTIVE REAL WEBXR DOM OVERLAY (Rendered directly over Camera)
        ============================================================
      */}
      <div
        ref={overlayRef}
        id="webxr-overlay-container"
        className={`fixed inset-0 z-50 pointer-events-none ${
          isARActive ? 'block' : 'hidden'
        }`}
      >
        {/* Top Header Overlay with Exit Button */}
        <div className="absolute top-4 inset-x-4 flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-2 bg-black/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-white shadow-xl">
            <Compass className="w-4 h-4 text-[#FFE600] animate-pulse" />
            <span className="text-xs font-bold tracking-wide">{artifact.name}</span>
            {artifact.bodoName && (
              <span className="text-[11px] text-stone-400 border-l border-white/20 pl-2">
                {artifact.bodoName}
              </span>
            )}
          </div>

          <button
            onClick={handleExitAR}
            className="p-2.5 rounded-full bg-black/80 text-white hover:bg-black border border-white/25 shadow-xl cursor-pointer transition-transform hover:scale-105 active:scale-95"
            title="Exit AR"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Guidance Banner */}
        {!isPlaced && (
          <div className="absolute top-20 inset-x-4 flex justify-center pointer-events-none">
            <div className="bg-black/85 backdrop-blur-md px-5 py-2.5 rounded-full border border-[#FFE600]/70 text-white shadow-2xl flex items-center gap-2.5 max-w-sm text-center">
              {surfaceDetected ? (
                <>
                  <CheckCircle className="w-4 h-4 text-[#FFE600] shrink-0" />
                  <span className="text-xs font-bold text-[#FFE600]">
                    Surface Detected · Tap screen to place artifact
                  </span>
                </>
              ) : (
                <>
                  <Scan className="w-4 h-4 text-white/90 shrink-0 animate-spin" />
                  <span className="text-xs text-white/90">
                    Scanning environment... Move phone slowly across floor or table
                  </span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Bottom Action & Manipulation Dock */}
        <div className="absolute bottom-6 inset-x-4 flex flex-col items-center gap-3 pointer-events-auto">
          {/* If NOT placed, show prominent Place Button */}
          {!isPlaced && surfaceDetected && (
            <button
              onClick={handlePlaceArtifact}
              className="px-6 py-3.5 rounded-full bg-[#FFE600] text-[#171513] font-bold text-sm shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2 border border-black/20 animate-bounce"
            >
              <Box className="w-4.5 h-4.5" />
              <span>Place Artifact Here</span>
            </button>
          )}

          {/* If PLACED: Show Scale, Rotate, Orientation, Info, and Reposition Controls */}
          {isPlaced && (
            <div className="w-full max-w-md bg-black/90 backdrop-blur-md rounded-2xl border border-white/20 p-4 text-white shadow-2xl space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#FFE600]">1:1 AR Anchored</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 font-mono">
                    {(scaleMultiplier * 100).toFixed(0)}% Scale
                  </span>
                </div>
                <span className="text-[11px] text-stone-300 font-mono">
                  {physicalDimensions.width} × {physicalDimensions.height} × {physicalDimensions.depth} {physicalDimensions.unit}
                </span>
              </div>

              {/* Action Buttons Toolbar */}
              <div className="flex items-center justify-between gap-1.5 flex-wrap">
                {/* Scale adjustments */}
                <div className="flex items-center gap-1 bg-white/10 p-1 rounded-lg">
                  <button
                    onClick={() => handleScaleChange(0.9)}
                    className="p-1.5 rounded hover:bg-white/20 text-white cursor-pointer"
                    title="Scale Down (-10%)"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleResetToRealScale}
                    className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[#FFE600] cursor-pointer"
                    title="Reset to 1:1 real dimensions"
                  >
                    1:1 Reset
                  </button>
                  <button
                    onClick={() => handleScaleChange(1.1)}
                    className="p-1.5 rounded hover:bg-white/20 text-white cursor-pointer"
                    title="Scale Up (+10%)"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>

                {/* Rotate button */}
                <button
                  onClick={() => handleRotateY(45)}
                  className="flex items-center gap-1 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                  title="Rotate 45°"
                >
                  <RotateCw className="w-3.5 h-3.5 text-[#FFE600]" />
                  <span>Rotate</span>
                </button>

                {/* Garment display orientation toggle */}
                {isGarment && (
                  <button
                    onClick={handleToggleGarmentOrientation}
                    className="flex items-center gap-1 bg-white/10 hover:bg-white/20 px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                    title="Toggle stand drape vs flat spread"
                  >
                    <Layers className="w-3.5 h-3.5 text-sky-400" />
                    <span>{garmentOrientation === 'draped-vertical' ? 'Draped' : 'Flat'}</span>
                  </button>
                )}

                {/* Info button */}
                <button
                  onClick={() => setShowInfoDrawer(!showInfoDrawer)}
                  className="flex items-center gap-1 bg-white/10 hover:bg-white/20 px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  <Info className="w-3.5 h-3.5 text-[#FFE600]" />
                  <span>Info</span>
                </button>

                {/* Reposition button */}
                <button
                  onClick={handleReposition}
                  className="p-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold cursor-pointer"
                  title="Pick up and reposition artifact"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {/* Information Drawer Popup inside AR overlay */}
              {showInfoDrawer && (
                <div className="mt-2 pt-2 border-t border-white/10 text-xs space-y-1.5 bg-black/60 p-3 rounded-lg max-h-48 overflow-y-auto">
                  <div className="flex items-baseline justify-between">
                    <h4 className="font-bold text-white text-sm">{artifact.name}</h4>
                    {artifact.bodoName && (
                      <span className="text-[#FFE600] font-medium">{artifact.bodoName}</span>
                    )}
                  </div>
                  <p className="text-stone-300 font-editorial leading-relaxed text-[11px]">
                    {artifact.description}
                  </p>
                  {artifact.culturalSignificance && (
                    <p className="text-stone-400 text-[10px] italic">
                      Cultural Meaning: {artifact.culturalSignificance}
                    </p>
                  )}
                  {artifact.materials && artifact.materials.length > 0 && (
                    <div className="text-[10px] text-stone-300">
                      Materials: <strong>{artifact.materials.join(', ')}</strong>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Hidden WebGL Canvas for WebXR Renderer */}
      <canvas ref={arCanvasRef} className="hidden" />

      {/* 
        ============================================================
        PRE-LAUNCH MODAL VIEW (Typography & Heritage Layout Preserved)
        ============================================================
      */}
      {!isARActive && (
        <div className="relative bg-[#FAF8F5] border border-stone-300 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-white">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#171513] text-[#FFE600] flex items-center justify-center">
                <Compass className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900 font-editorial">
                  Augmented Reality (AR) Surface Placement
                </h3>
                <p className="text-[11px] text-stone-500 font-mono">
                  Real WebXR Immersive Camera & Photogrammetry
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-6 overflow-y-auto">
            {/* Artifact summary card */}
            <div className="p-4 bg-white rounded-xl border border-stone-200 flex items-start gap-4 shadow-xs">
              <div className="w-16 h-16 rounded-lg bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                <img
                  src={
                    artifact.image ||
                    artifact.imageUrl ||
                    `/assets/images/textiles/traditional-textiles/dokhona.jpg`
                  }
                  alt={artifact.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as any).style.display = 'none';
                  }}
                />
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-baseline justify-between">
                  <h4 className="text-sm font-bold text-stone-900 font-editorial">
                    {artifact.name}
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-stone-100 font-bold uppercase text-stone-700">
                    {artifact.category}
                  </span>
                </div>
                {artifact.bodoName && (
                  <p className="text-xs text-stone-500">{artifact.bodoName}</p>
                )}
                <p className="text-[11px] text-emerald-800 font-semibold font-mono flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>
                    1:1 Verified Physical Scale: {physicalDimensions.width} ×{' '}
                    {physicalDimensions.height} × {physicalDimensions.depth}{' '}
                    {physicalDimensions.unit}
                  </span>
                </p>
              </div>
            </div>

            {/* Dynamic Capability & Status Area */}
            <ARCompatibilityCard
              capability={capability}
              onLaunchRealAR={handleLaunchRealAR}
              onOpen3DViewer={() => {
                onClose();
                open3DViewer(artifact);
              }}
              onOpenSimulator={() => setIsSimulatingPlacement(true)}
              isLaunching={sessionState === 'waiting-permission'}
              launchError={launchError}
            />

            {/* Desktop Surface Placement Simulator (When active) */}
            {isSimulatingPlacement && (
              <DesktopARSimulator
                artifact={artifact}
                linkedModel={linkedModel}
                onClose={() => setIsSimulatingPlacement(false)}
              />
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-stone-200 bg-stone-50 flex items-center justify-between text-xs text-stone-500">
            <span>Bodo Cultural Heritage Digital Platform · WebXR Engine</span>
            <button
              onClick={() =>
                openAIPanelWithContext(
                  artifact,
                  `Explain the verified physical scale (${physicalDimensions.width} × ${physicalDimensions.height} m), authentic weaving techniques, and cultural symbolism of ${artifact.name}.`
                )
              }
              className="flex items-center gap-1 text-[#0F4C81] hover:underline font-semibold cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Ask AI About Dimensions</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
