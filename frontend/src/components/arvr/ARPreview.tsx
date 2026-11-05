import React, { useState } from 'react';
import { Scan, Smartphone, Compass, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { useMuseumStore } from '../../store/museumStore';
import { INITIAL_ARTIFACTS } from '../../data/artifacts';

export interface ARPreviewProps {
  onLaunchAR?: () => void;
}

export const ARPreview: React.FC<ARPreviewProps> = ({ onLaunchAR }) => {
  const [isLaunched, setIsLaunched] = useState(false);
  const { openAR } = useMuseumStore();

  const handleLaunch = () => {
    setIsLaunched(true);
    if (onLaunchAR) {
      onLaunchAR();
    } else {
      const dokhona =
        INITIAL_ARTIFACTS.find((a) => a.id === 'dokhona-thaosi') || INITIAL_ARTIFACTS[0];
      if (dokhona) {
        openAR(dokhona);
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6 flex flex-col justify-between">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#A64B2A]">
            <Scan className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-mono uppercase bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">
            WebXR Device API
          </span>
        </div>

        <div>
          <h3 className="text-2xl font-bold font-editorial text-stone-900">
            Explore Bodo Handloom in AR
          </h3>
          <p className="text-xs uppercase tracking-wider font-semibold text-stone-500 mt-0.5">
            Augmented Reality Spatial Projection
          </p>
        </div>

        <p className="text-sm text-stone-700 font-editorial leading-relaxed">
          Project 1:1 true-scale photogrammetric 3D reconstructions of traditional Bodo tools—such as the wooden Zenther gin, Maku shuttle, and heirloom Dokhonas—directly into your room, classroom, or museum gallery floor using your mobile camera.
        </p>

        <div className="space-y-2 text-xs text-stone-600 bg-[#FAF8F5] p-4 rounded-xl border border-stone-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Automatic horizontal plane detection (ARCore / ARKit)</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>1:1 physical scale calibration for textile weave density</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>USDZ (iOS Quick Look) and GLTF (Android Scene Viewer)</span>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-stone-200 space-y-3">
        {isLaunched && (
          <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl text-xs text-amber-900 border border-amber-200 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              Clean Integration Point Triggered: Ready for native WebXR camera session integration by the project team.
            </span>
          </div>
        )}

        <Button
          variant="primary"
          size="lg"
          onClick={handleLaunch}
          className="w-full justify-center"
          icon={<Scan className="w-4 h-4 text-[#FFE600]" />}
        >
          Launch AR
        </Button>
      </div>
    </div>
  );
};
