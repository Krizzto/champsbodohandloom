import React from 'react';
import { useContentStore } from '../store/contentStore';
import { HeritageImage } from './ui/HeritageImage';

/**
 * High-fidelity authentic cultural visuals for Bodo VR Museum.
 * Designed with warm documentary aesthetic, authentic Agor geometry, and zero broken image vulnerability.
 */

export const BodoLogo: React.FC<{ className?: string }> = ({ className = 'w-9 h-9' }) => (
  <div className={`relative rounded-full overflow-hidden border border-[#171513]/20 shadow-xs flex items-center justify-center bg-[#FAF8F5] ${className}`}>
    <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none">
      <circle cx="50" cy="50" r="46" fill="#F4EFE6" stroke="#171513" strokeWidth="2.5" />
      {/* Outer Agor ring */}
      <circle cx="50" cy="50" r="41" stroke="#FFE600" strokeWidth="3" />
      {/* Traditional Bodo Diamond / Mountain Motifs */}
      <polygon points="50,15 65,40 35,40" fill="#8B1E3F" />
      <polygon points="65,40 85,65 50,65" fill="#2B6E44" />
      <polygon points="35,40 50,65 15,65" fill="#2B6E44" />
      <polygon points="50,38 72,72 28,72" stroke="#FFE600" strokeWidth="2.5" />
      <circle cx="50" cy="52" r="7" fill="#FFE600" />
      {/* Bottom warp threads */}
      <line x1="20" y1="82" x2="80" y2="82" stroke="#171513" strokeWidth="2" strokeDasharray="3 3" />
    </svg>
  </div>
);

export const AgorMotifSVG: React.FC<{
  motifId: string;
  className?: string;
  fillColor?: string;
  bgColor?: string;
}> = ({ motifId, className = 'w-full h-full', fillColor = '#FFE600', bgColor = '#8B1E3F' }) => {
  switch (motifId) {
    case 'hajw-agor':
      // Mountain motif (triangular layered peaks with internal hatchings)
      return (
        <svg viewBox="0 0 200 200" className={className} style={{ backgroundColor: bgColor }}>
          <pattern id="grid-weave" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          </pattern>
          <rect width="200" height="200" fill="url(#grid-weave)" />
          {/* Main Hajw peaks */}
          <polygon points="100,25 170,140 30,140" fill="none" stroke={fillColor} strokeWidth="7" />
          <polygon points="100,55 150,135 50,135" fill="none" stroke={fillColor} strokeWidth="4" />
          <polygon points="100,85 130,130 70,130" fill={fillColor} />
          {/* Flanking mountains */}
          <polygon points="40,90 85,165 -5,165" fill="none" stroke={fillColor} strokeWidth="5" />
          <polygon points="160,90 205,165 115,165" fill="none" stroke={fillColor} strokeWidth="5" />
          {/* Horizontal traditional base stripes */}
          <line x1="0" y1="175" x2="200" y2="175" stroke={fillColor} strokeWidth="4" />
          <line x1="0" y1="185" x2="200" y2="185" stroke={fillColor} strokeWidth="2" strokeDasharray="4 4" />
        </svg>
      );

    case 'daorai-agor':
      // Peacock feather motif (curving ocelli with radiating plumes)
      return (
        <svg viewBox="0 0 200 200" className={className} style={{ backgroundColor: bgColor }}>
          <circle cx="100" cy="80" r="45" fill="none" stroke={fillColor} strokeWidth="6" />
          <circle cx="100" cy="80" r="28" fill="#2B6E44" stroke={fillColor} strokeWidth="4" />
          <circle cx="100" cy="80" r="14" fill="#0A369D" />
          <circle cx="100" cy="80" r="6" fill={fillColor} />
          {/* Radiating plumes */}
          {[-60, -40, -20, 0, 20, 40, 60].map((angle, i) => (
            <line
              key={i}
              x1="100"
              y1="35"
              x2={100 + Math.sin((angle * Math.PI) / 180) * 45}
              y2={35 - Math.cos((angle * Math.PI) / 180) * 25}
              stroke={fillColor}
              strokeWidth="3"
            />
          ))}
          {/* Lower feather spine */}
          <path d="M 100,125 Q 100,165 90,195" fill="none" stroke={fillColor} strokeWidth="5" />
          <path d="M 100,140 L 80,130" stroke={fillColor} strokeWidth="3" />
          <path d="M 100,155 L 120,145" stroke={fillColor} strokeWidth="3" />
          <path d="M 98,170 L 78,160" stroke={fillColor} strokeWidth="3" />
        </svg>
      );

    case 'dingkhia-agor':
      // Wild Fern Motif (Dhekia)
      return (
        <svg viewBox="0 0 200 200" className={className} style={{ backgroundColor: bgColor }}>
          <path d="M 40,180 Q 80,120 100,30" fill="none" stroke={fillColor} strokeWidth="6" strokeLinecap="round" />
          {/* Fern fronds */}
          {[50, 75, 100, 125, 150].map((y, i) => (
            <g key={i}>
              <path
                d={`M ${85 + i * 2},${y} Q ${130 + i * 4},${y - 15} ${150 + i * 5},${y - 5}`}
                fill="none"
                stroke={fillColor}
                strokeWidth="4"
              />
              <path
                d={`M ${75 - i * 2},${y + 10} Q ${40 - i * 2},${y - 5} ${20 - i * 2},${y + 5}`}
                fill="none"
                stroke={fillColor}
                strokeWidth="4"
              />
            </g>
          ))}
          {/* Top coiled fiddlehead */}
          <circle cx="102" cy="30" r="10" fill="none" stroke={fillColor} strokeWidth="4" />
          <circle cx="102" cy="30" r="4" fill={fillColor} />
        </svg>
      );

    case 'muphur-apha':
      // Bear paw totemic footprint
      return (
        <svg viewBox="0 0 200 200" className={className} style={{ backgroundColor: bgColor }}>
          {/* Central main pad */}
          <ellipse cx="100" cy="120" rx="38" ry="30" fill={fillColor} />
          {/* 5 claws/toes */}
          <circle cx="60" cy="65" r="14" fill={fillColor} />
          <circle cx="82" cy="50" r="15" fill={fillColor} />
          <circle cx="105" cy="46" r="15" fill={fillColor} />
          <circle cx="128" cy="52" r="15" fill={fillColor} />
          <circle cx="146" cy="68" r="13" fill={fillColor} />
          {/* Decorative tribal geometric frame */}
          <rect x="25" y="20" width="150" height="160" fill="none" stroke={fillColor} strokeWidth="3" strokeDasharray="6 4" />
        </svg>
      );

    case 'phul-agor':
      // Floral motif
      return (
        <svg viewBox="0 0 200 200" className={className} style={{ backgroundColor: bgColor }}>
          <circle cx="100" cy="100" r="18" fill="#FFE600" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <g key={i} transform={`rotate(${angle} 100 100)`}>
              <ellipse cx="100" cy="58" rx="14" ry="24" fill={fillColor} opacity={i % 2 === 0 ? 0.95 : 0.8} />
              <line x1="100" y1="40" x2="100" y2="78" stroke="#171513" strokeWidth="2" />
            </g>
          ))}
          <circle cx="100" cy="100" r="6" fill="#8B1E3F" />
        </svg>
      );

    case 'gongar-agor':
      // Spider web geometric motif
      return (
        <svg viewBox="0 0 200 200" className={className} style={{ backgroundColor: bgColor }}>
          <polygon points="100,20 180,100 100,180 20,100" fill="none" stroke={fillColor} strokeWidth="4" />
          <polygon points="100,45 155,100 100,155 45,100" fill="none" stroke={fillColor} strokeWidth="3" />
          <polygon points="100,70 130,100 100,130 70,100" fill="none" stroke={fillColor} strokeWidth="3" />
          <line x1="100" y1="20" x2="100" y2="180" stroke={fillColor} strokeWidth="3" />
          <line x1="20" y1="100" x2="180" y2="100" stroke={fillColor} strokeWidth="3" />
          <line x1="43" y1="43" x2="157" y2="157" stroke={fillColor} strokeWidth="2" strokeDasharray="3 3" />
          <line x1="157" y1="43" x2="43" y2="157" stroke={fillColor} strokeWidth="2" strokeDasharray="3 3" />
        </svg>
      );

    case 'thaigir-bibar':
      // Elephant Apple blossom
      return (
        <svg viewBox="0 0 200 200" className={className} style={{ backgroundColor: bgColor }}>
          {[0, 72, 144, 216, 288].map((angle, i) => (
            <g key={i} transform={`rotate(${angle} 100 100)`}>
              <path d="M 100,100 Q 80,40 100,25 Q 120,40 100,100" fill={fillColor} stroke="#F4EFE6" strokeWidth="2" />
            </g>
          ))}
          <circle cx="100" cy="100" r="16" fill="#FFE600" stroke="#171513" strokeWidth="2" />
          <circle cx="100" cy="100" r="5" fill="#8B1E3F" />
        </svg>
      );

    case 'singri-agor':
    default:
      // Diamond shield motif
      return (
        <svg viewBox="0 0 200 200" className={className} style={{ backgroundColor: bgColor }}>
          <polygon points="100,20 180,100 100,180 20,100" fill="none" stroke={fillColor} strokeWidth="6" />
          <polygon points="100,45 155,100 100,155 45,100" fill="none" stroke={fillColor} strokeWidth="4" />
          <polygon points="100,70 130,100 100,130 70,100" fill={fillColor} />
          {/* Corner traditional chevrons */}
          <polyline points="35,35 60,35 60,60" fill="none" stroke={fillColor} strokeWidth="3" />
          <polyline points="165,35 140,35 140,60" fill="none" stroke={fillColor} strokeWidth="3" />
          <polyline points="35,165 60,165 60,140" fill="none" stroke={fillColor} strokeWidth="3" />
          <polyline points="165,165 140,165 140,140" fill="none" stroke={fillColor} strokeWidth="3" />
        </svg>
      );
  }
};

/**
 * Mapping of each documentary photo subject to its dedicated folder path under public/assets/images/
 */
export const DOCUMENTARY_IMAGE_MAP: Record<string, string> = {
  'hero-loom': '/assets/images/hero/hero-main.jpg',
  'interview': '/assets/images/people/weavers/interview-elder.jpg',
  'weaver-loom': '/assets/images/weaving/weaving-main.jpg',
  'elder-spinning': '/assets/images/process/spinning.jpg',
  'outdoor-group': '/assets/images/process/warping.jpg',
  'bobbins-basket': '/assets/images/tools/bobbin.jpg',
  'warp-court': '/assets/images/handloom/handloom-process.jpg',
  'dye-basket': '/assets/images/cultural/cultural-practices/dye-basket.jpg',
  'mustard-yarn': '/assets/images/weaving/yarn.jpg',
  'yellow-yarn': '/assets/images/weaving/weaving-detail.jpg',
  'wooden-bobbin': '/assets/images/tools/other-tools/wooden-bobbin.jpg',
  'terracotta-yarn': '/assets/images/cultural/heritage/terracotta-yarn.jpg',
  'master-weaver': '/assets/images/people/weavers/anjali-swargiary.jpg',
};

/**
 * Editorial documentary photo representations:
 * - Directly links each documentary photo to its dedicated folder in public/assets/images/
 * - Automatic format support (.jpg, .jpeg, .png, .webp)
 * - Immediate live display when user places file in folder or uploads via Content Editor
 * - Shows clean editorial "Image coming soon" state if file has not yet been placed
 */
export const DocumentaryImage: React.FC<{
  type: 'hero-loom' | 'interview' | 'weaver-loom' | 'elder-spinning' | 'outdoor-group' | 'bobbins-basket' | 'warp-court' | 'dye-basket' | 'mustard-yarn' | 'yellow-yarn' | 'wooden-bobbin' | 'terracotta-yarn' | 'master-weaver';
  className?: string;
  altText: string;
  imageKey?: string;
  customSrc?: string;
}> = ({ type, className = 'w-full h-full', altText, imageKey, customSrc }) => {
  const targetPath = customSrc || DOCUMENTARY_IMAGE_MAP[type] || '/assets/images/handloom/handloom-main.jpg';

  return (
    <HeritageImage
      src={targetPath}
      alt={altText}
      className={className}
      imageKey={imageKey}
      showChangeButton={false}
      fallbackText="Photograph coming soon"
    />
  );
};
