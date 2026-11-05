import React, { useRef, useState } from 'react';
import { Camera, RefreshCw, Upload, Loader2 } from 'lucide-react';
import { useContentStore } from '../store/contentStore';
import { optimizeImageFile } from '../utils/imageOptimizer';

interface ImageChangeButtonProps {
  imageKey: string;
  label?: string;
  className?: string;
  variant?: 'floating' | 'button' | 'compact';
  onImageChanged?: (dataUrl: string) => void;
}

export const ImageChangeButton: React.FC<ImageChangeButtonProps> = ({
  imageKey,
  label = 'CHANGE IMAGE',
  className = '',
  variant = 'floating',
  onImageChanged,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { setCustomImage, removeCustomImage, customImages } = useContentStore();
  const hasCustom = Boolean(customImages[imageKey]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const dataUrl = await optimizeImageFile(file, 1920, 1080, 0.85);
      setCustomImage(imageKey, dataUrl);
      if (onImageChanged) onImageChanged(dataUrl);
    } catch (err) {
      console.error('Error optimizing image', err);
      // Fallback to direct FileReader if canvas optimization encounters issue
      const reader = new FileReader();
      reader.onload = (event) => {
        const fallbackUrl = event.target?.result as string;
        if (fallbackUrl) {
          setCustomImage(imageKey, fallbackUrl);
          if (onImageChanged) onImageChanged(fallbackUrl);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsProcessing(false);
      e.target.value = '';
    }
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeCustomImage(imageKey);
  };

  const triggerUpload = (e: React.MouseEvent) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  return (
    <div className={`inline-flex items-center gap-1.5 z-30 select-none ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {variant === 'button' ? (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={triggerUpload}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-[#171513] text-[#FAF8F5] hover:bg-[#3A2415] transition-colors shadow-xs cursor-pointer border border-[#FAF8F5]/20"
            title="Upload custom image from your computer"
          >
            <Upload className="w-3.5 h-3.5 text-[#FFE600]" />
            <span>{label}</span>
          </button>
          {hasCustom && (
            <button
              type="button"
              onClick={handleReset}
              className="p-1.5 text-xs rounded-md bg-stone-200 hover:bg-stone-300 text-stone-700 transition-colors"
              title="Revert to default cultural artwork"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ) : variant === 'compact' ? (
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={triggerUpload}
            className="p-1.5 rounded-full bg-black/75 hover:bg-black text-white hover:text-[#FFE600] shadow-md backdrop-blur-xs transition-transform hover:scale-105 active:scale-95 cursor-pointer border border-white/40"
            title={label}
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
          {hasCustom && (
            <button
              type="button"
              onClick={handleReset}
              className="p-1.5 rounded-full bg-black/75 hover:bg-black text-stone-300 hover:text-white shadow-md backdrop-blur-xs transition-transform hover:scale-105 active:scale-95 cursor-pointer border border-white/40"
              title="Reset image"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          )}
        </div>
      ) : (
        /* Floating badge style */
        <div className="flex items-center gap-1.5 group/btn">
          <button
            type="button"
            onClick={triggerUpload}
            className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium tracking-wide uppercase rounded-full bg-black/75 hover:bg-black text-white hover:text-[#FFE600] shadow-lg backdrop-blur-sm transition-all hover:scale-105 active:scale-95 cursor-pointer border border-white/30"
          >
            <Camera className="w-3.5 h-3.5 text-[#FFE600]" />
            <span>{label}</span>
          </button>
          {hasCustom && (
            <button
              type="button"
              onClick={handleReset}
              className="p-1 rounded-full bg-black/70 hover:bg-red-600 text-white transition-colors cursor-pointer"
              title="Reset to default artwork"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
