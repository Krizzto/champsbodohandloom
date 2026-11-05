import React, { useState } from 'react';
import {
  Smartphone,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Box,
  Scan,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { ARCapabilityResult } from './arTypes';

interface ARCompatibilityCardProps {
  capability: ARCapabilityResult;
  onLaunchRealAR: () => void;
  onOpen3DViewer: () => void;
  onOpenSimulator: () => void;
  isLaunching: boolean;
  launchError: string | null;
}

export const ARCompatibilityCard: React.FC<ARCompatibilityCardProps> = ({
  capability,
  onLaunchRealAR,
  onOpen3DViewer,
  onOpenSimulator,
  isLaunching,
  launchError,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (capability.isChecking) {
    return (
      <div className="p-8 text-center bg-stone-50 rounded-xl border border-stone-200 space-y-2">
        <RefreshCw className="w-5 h-5 animate-spin mx-auto text-[#0F4C81]" />
        <p className="text-xs text-stone-600 font-medium">
          Checking device WebXR capabilities and camera permissions...
        </p>
      </div>
    );
  }

  // 1. DEVICE SUPPORTS IMMERSIVE-AR (Compatible Mobile Device)
  if (capability.isSupported) {
    return (
      <div className="bg-emerald-50/90 border border-emerald-200 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>WebXR Immersive-AR Ready on this Device!</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
            ARCore / WebXR
          </span>
        </div>

        <p className="text-xs text-emerald-800 leading-relaxed font-editorial">
          Your browser supports native camera passthrough with surface hit-testing. When you press{' '}
          <strong>Launch AR</strong>, the browser will request native camera permission if not already granted. Move your phone slowly towards the floor or a table to project the traditional Bodo artifact at 1:1 true physical scale.
        </p>

        {launchError && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">AR Session Notice:</p>
              <p className="text-[11px] mt-0.5">{launchError}</p>
            </div>
          </div>
        )}

        <div className="pt-2">
          <button
            onClick={onLaunchRealAR}
            disabled={isLaunching}
            className="w-full py-3.5 px-4 rounded-xl bg-[#171513] hover:bg-[#3A2415] active:scale-[0.99] text-[#FFE600] font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLaunching ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-[#FFE600]" />
                <span>STARTING AR SESSION...</span>
              </>
            ) : (
              <>
                <Smartphone className="w-4 h-4 text-[#FFE600]" />
                <span>LAUNCH MOBILE WEBXR AR</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // 2. UNSUPPORTED BROWSER OR DESKTOP ENVIRONMENT
  return (
    <div className="space-y-4">
      <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
            <Smartphone className="w-5 h-5 text-[#8B1E3F]" />
            <span>AR Not Supported on this Device / Browser</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-200 text-stone-700 font-bold">
            {capability.unsupportedReason || 'DESKTOP / NO WEBXR'}
          </span>
        </div>

        <p className="text-xs text-stone-600 leading-relaxed font-editorial">
          {capability.userMessage ||
            'Real camera-based Augmented Reality requires a mobile device with WebXR and camera passthrough support (such as Google Chrome on Android with Google Play Services for AR, or WebXR Viewer on iOS).'}
        </p>

        {/* Feature diagnostic breakdown */}
        <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] font-mono">
          <div className="flex items-center gap-1.5 p-2 rounded bg-white border border-stone-200">
            {capability.isSecureContext ? (
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            )}
            <span className="text-stone-700">HTTPS Context</span>
          </div>

          <div className="flex items-center gap-1.5 p-2 rounded bg-white border border-stone-200">
            {capability.hasWebXR ? (
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            )}
            <span className="text-stone-700">WebXR Device API</span>
          </div>

          <div className="flex items-center gap-1.5 p-2 rounded bg-white border border-stone-200">
            {capability.hasImmersiveAR ? (
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            )}
            <span className="text-stone-700">Immersive-AR</span>
          </div>

          <div className="flex items-center gap-1.5 p-2 rounded bg-white border border-stone-200">
            {capability.hasSpatialTrackingPermission ? (
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            )}
            <span className="text-stone-700">Spatial Tracking</span>
          </div>
        </div>

        {/* Mobile link copy action */}
        <div className="pt-2 flex items-center justify-between text-xs bg-white p-3 rounded-lg border border-stone-200">
          <span className="text-stone-600 text-[11px]">
            Open this page on your Android or iOS phone to experience real AR:
          </span>
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1 px-3 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold cursor-pointer shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-stone-500" />
                <span>Copy URL</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Primary Actions for Unsupported Device */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={onOpen3DViewer}
          className="py-3 px-4 rounded-xl bg-[#171513] hover:bg-[#3A2415] text-[#FFE600] text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Box className="w-4 h-4 text-[#FFE600]" />
          <span>Inspect in Interactive 3D</span>
        </button>

        <button
          onClick={onOpenSimulator}
          className="py-3 px-4 rounded-xl bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Scan className="w-4 h-4 text-[#0F4C81]" />
          <span>Launch Desktop AR Simulator</span>
        </button>
      </div>
    </div>
  );
};
