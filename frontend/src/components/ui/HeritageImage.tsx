import React, { useState, useEffect } from 'react';
import { Camera, Image as ImageIcon } from 'lucide-react';
import { useContentStore } from '../../store/contentStore';
import { ImageChangeButton } from '../ImageChangeButton';

export interface HeritageImageProps {
  src: string;
  alt: string;
  className?: string;
  imageKey?: string;
  aspectRatio?: string;
  objectFit?: 'cover' | 'contain' | 'fill';
  fallbackText?: string;
  showChangeButton?: boolean;
}

/**
 * Universal cultural image component for Bodo Handloom Museum:
 * - Direct mapping to public/assets/images/<category>/<filename>
 * - Seamless support for .jpg, .jpeg, .png, and .webp extensions
 * - Priority to user-uploaded images in Content Editor
 * - Clean "Image coming soon" editorial placeholder if physical file is not yet placed
 * - Never invents dummy/fake photographs
 */
export const HeritageImage: React.FC<HeritageImageProps> = ({
  src,
  alt,
  className = 'w-full h-full',
  imageKey,
  aspectRatio,
  objectFit = 'cover',
  fallbackText,
  showChangeButton = true,
}) => {
  const storeImage = useContentStore((s) => (imageKey ? s.customImages[imageKey] : undefined));
  const isEditModeActive = useContentStore((s) => s.isEditModeActive);

  // Candidate extensions to support .jpg, .jpeg, .png, .webp automatically
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [hasError, setHasError] = useState(false);

  // Generate candidate list based on the base path
  const candidates = React.useMemo(() => {
    if (!src) return [];
    const cleanSrc = src.trim();
    const dotIndex = cleanSrc.lastIndexOf('.');
    if (dotIndex === -1) {
      return [
        cleanSrc,
        `${cleanSrc}.jpg`,
        `${cleanSrc}.webp`,
        `${cleanSrc}.png`,
        `${cleanSrc}.jpeg`,
      ];
    }
    const base = cleanSrc.slice(0, dotIndex);
    const ext = cleanSrc.slice(dotIndex);
    const allExts = ['.jpg', '.JPG', '.webp', '.WEBP', '.png', '.PNG', '.jpeg', '.JPEG'];
    const otherExts = allExts.filter((e) => e.toLowerCase() !== ext.toLowerCase());
    return [cleanSrc, ...otherExts.map((e) => `${base}${e}`)];
  }, [src]);

  // Reset when source or store image changes
  useEffect(() => {
    setCandidateIndex(0);
    setHasError(false);
  }, [src, storeImage]);

  const activeSrc = storeImage || candidates[candidateIndex];

  const handleImageError = () => {
    if (storeImage) {
      // User data URL failed
      setHasError(true);
      return;
    }

    if (candidateIndex < candidates.length - 1) {
      // Try next supported image format
      setCandidateIndex((prev) => prev + 1);
    } else {
      // All format variations failed; file is not yet deposited in public/assets/images/
      setHasError(true);
    }
  };

  return (
    <div
      className={`relative overflow-hidden group/himg ${className}`}
      style={aspectRatio ? { aspectRatio } : undefined}
      title={alt}
    >
      {/* Optional In-Place Image Replacement Button */}
      {showChangeButton && imageKey && (
        <div
          className={`absolute top-2 right-2 z-20 transition-opacity ${
            isEditModeActive ? 'opacity-100' : 'opacity-0 group-hover/himg:opacity-100'
          }`}
        >
          <ImageChangeButton imageKey={imageKey} variant="compact" label="CHANGE IMAGE" />
        </div>
      )}

      {!hasError && activeSrc ? (
        <img
          src={activeSrc}
          alt={alt}
          onError={handleImageError}
          className={`w-full h-full ${
            objectFit === 'contain'
              ? 'object-contain'
              : objectFit === 'fill'
              ? 'object-fill'
              : 'object-cover'
          } transition-transform duration-500 ease-out`}
          loading="lazy"
        />
      ) : (
        /* Clean Editorial Placeholder State (Rule 9: No fake images, clear coming-soon state) */
        <div className="w-full h-full min-h-[140px] flex flex-col items-center justify-center bg-[#F4EFE6] border border-stone-200/90 p-4 text-center select-none text-stone-600">
          <div className="w-9 h-9 rounded-full bg-stone-200/70 border border-stone-300/80 flex items-center justify-center mb-2 text-stone-500 shadow-2xs">
            <ImageIcon className="w-4 h-4" />
          </div>
          <span className="text-xs font-editorial font-bold text-stone-800 tracking-wide uppercase">
            {fallbackText || 'Image coming soon'}
          </span>
          <span
            className="text-[10px] font-mono text-stone-500 mt-1 max-w-[220px] truncate bg-white/70 px-2 py-0.5 rounded border border-stone-200"
            title={`Deposit photograph in: public${src}`}
          >
            {src.startsWith('/') ? `public${src}` : src}
          </span>
          {imageKey && (
            <div className="mt-2.5">
              <ImageChangeButton
                imageKey={imageKey}
                variant="compact"
                label="UPLOAD PHOTO"
                className="scale-90"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
