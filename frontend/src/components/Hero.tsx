import React from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Compass, Box, Scan, ChevronDown, Sparkles } from 'lucide-react';
import { useMuseumStore } from '../store/museumStore';
import { useContentStore } from '../store/contentStore';

interface HeroProps {
  onExploreClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick }) => {
  const { toggleAIPanel, openVRMuseum, openAR, open3DViewer } = useMuseumStore();
  const { siteContent, artifacts, customImages } = useContentStore();
  const heroContent = siteContent.hero;
  const heroImagePath = heroContent.imageUrl || '/assets/images/hero/hero-main.JPG';

  // Check if user uploaded a custom hero image via editor or modal
  const customHeroImage = customImages['hero-loom'];
  const [heroFileExists, setHeroFileExists] = React.useState(false);
  const [detectedHeroSrc, setDetectedHeroSrc] = React.useState<string | null>(null);

  // Auto-detect if physical file exists in public/assets/images/hero/hero-main.jpg (or .JPG/.png/.webp)
  React.useEffect(() => {
    if (customHeroImage) return;
    const base = heroImagePath.replace(/\.[^/.]+$/, '');
    const testExtensions = [
      heroImagePath,
      `${base}.JPG`,
      `${base}.jpeg`,
      `${base}.JPEG`,
      `${base}.png`,
      `${base}.PNG`,
      `${base}.webp`,
      `${base}.WEBP`,
    ];

    let found = false;
    let index = 0;

    const testNext = () => {
      if (index >= testExtensions.length) {
        if (!found) {
          setHeroFileExists(false);
          setDetectedHeroSrc(null);
        }
        return;
      }
      const targetSrc = testExtensions[index];
      const img = new Image();
      img.src = targetSrc;
      img.onload = () => {
        setHeroFileExists(true);
        setDetectedHeroSrc(targetSrc);
        found = true;
      };
      img.onerror = () => {
        index++;
        testNext();
      };
    };

    testNext();
  }, [heroImagePath, customHeroImage]);

  const isCustomDirect = Boolean(
    customHeroImage ||
    (heroContent.imageUrl && (heroContent.imageUrl.startsWith('data:') || heroContent.imageUrl.startsWith('http')))
  );
  const hasHeroImage = isCustomDirect || heroFileExists;
  const activeHeroSrc = customHeroImage || (isCustomDirect ? heroContent.imageUrl : (detectedHeroSrc || heroImagePath));

  // Primary artifacts for quick AR / 3D launch from hero
  const defaultTextile = artifacts.find((a) => a.id === 'dokhona-thaosi') || artifacts[0];
  const defaultTool = artifacts.find((a) => a.id === 'maku-shuttle') || artifacts[0];

  const handleExplore = () => {
    if (onExploreClick) {
      onExploreClick();
    } else {
      const el = document.getElementById('about');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section
      id="hero"
      className={`relative w-full min-h-screen overflow-hidden select-none group/hero transition-colors duration-300 ${
        hasHeroImage ? 'bg-[#3A2415]' : 'bg-[#FAF8F5]'
      }`}
    >
      {/* Hero Visual Container */}
      <div className="relative w-full min-h-screen flex items-center justify-center py-12 md:py-16">
        
        {/* If a hero image exists in public/assets/images/hero/hero-main.jpg or custom upload, render it */}
        {hasHeroImage ? (
          <div className="absolute inset-0">
            <img
              src={activeHeroSrc}
              alt="Bodo handloom cultural hero visual"
              className="w-full h-full object-cover"
            />
            {/* Scrim for custom photo readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/70 pointer-events-none" />
          </div>
        ) : (
          /* Clean editorial background with subtle fine woven geometric grid */
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Subtle paper grain texture */}
            <div className="absolute inset-0 bg-[#FAF8F5]" />
            {/* Minimal cultural Agor diamond dot pattern */}
            <div
              className="absolute inset-0 opacity-[0.035]"
              style={{
                backgroundImage: `radial-gradient(#171513 1px, transparent 1px)`,
                backgroundSize: '24px 24px',
              }}
            />
            {/* Soft decorative ambient glow */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[320px] bg-[#FFE600]/12 blur-3xl rounded-full" />
            <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-[#8B2635]/5 blur-3xl rounded-full" />
          </div>
        )}

        {/* Centered Typography & AR / VR Launchpad matching reference */}
        <div className="relative z-10 text-center flex flex-col items-center px-4 max-w-4xl mx-auto">
          {/* "Welcome to" title */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className={`hero-title-prefix font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight font-bold ${
              hasHeroImage
                ? 'text-[#FAF8F5] drop-shadow-md'
                : 'text-[#171513]'
            }`}
            style={hasHeroImage ? { textShadow: '0 2px 8px rgba(0,0,0,0.6)' } : undefined}
          >
            {heroContent.titlePrefix || 'Welcome to'}
          </motion.div>

          {/* "Bodo handloom" */}
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className={`hero-title font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mt-0.5 sm:mt-1 ${
              hasHeroImage
                ? 'text-[#FAF8F5] drop-shadow-lg'
                : 'text-[#171513]'
            }`}
            style={hasHeroImage ? { textShadow: '0 2px 10px rgba(0,0,0,0.7)' } : undefined}
          >
            {heroContent.titleMain || 'Bodo handloom'}
          </motion.h1>

          {/* "heritage" title word without yellow background */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-0.5 sm:mt-1"
          >
            <span
              className={`hero-title-highlight font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight inline-block ${
                hasHeroImage
                  ? 'text-[#FAF8F5] drop-shadow-lg'
                  : 'text-[#171513]'
              }`}
              style={hasHeroImage ? { textShadow: '0 2px 10px rgba(0,0,0,0.7)' } : undefined}
            >
              {heroContent.highlightWord || 'heritage'}
            </span>
          </motion.div>

          {/* Editorial Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className={`mt-4 sm:mt-6 text-sm sm:text-base md:text-lg max-w-xl font-editorial tracking-wide font-light leading-relaxed ${
              hasHeroImage
                ? 'text-[#FAF8F5]/90 drop-shadow-md'
                : 'text-stone-700'
            }`}
          >
            {heroContent.tagline}
          </motion.p>

          {/* ============================================================ */}
          {/* THE AR & VR MUSEUM PART - PLACED DIRECTLY IN THE HERO SECTION */}
          {/* ============================================================ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className={`mt-6 sm:mt-8 w-full max-w-2xl rounded-2xl p-4 sm:p-5 shadow-xl transition-colors ${
              hasHeroImage
                ? 'bg-black/45 backdrop-blur-md border border-white/20 text-white'
                : 'bg-white/90 backdrop-blur-md border border-stone-200/90 text-stone-900'
            }`}
          >
            <div className={`flex items-center justify-between gap-2 pb-3 mb-3 border-b ${
              hasHeroImage ? 'border-white/15' : 'border-stone-200'
            }`}>
              <div className="flex items-center gap-2 text-left">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFE600] animate-pulse" />
                <span className={`text-xs sm:text-sm font-semibold tracking-wider uppercase font-editorial ${
                  hasHeroImage ? 'text-white' : 'text-stone-900'
                }`}>
                  Interactive Spatial Museum Experience
                </span>
              </div>
              <div className={`hidden sm:flex items-center gap-1.5 text-[11px] ${
                hasHeroImage ? 'text-white/70' : 'text-stone-500'
              }`}>
                <Sparkles className="w-3.5 h-3.5 text-[#FFE600]" />
                <span>WebXR Ready</span>
              </div>
            </div>

            {/* Quick Experience Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
              {/* 1. Enter VR Museum */}
              <button
                type="button"
                onClick={openVRMuseum}
                className="group relative flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#FFE600] hover:bg-[#FFF04D] text-[#171513] font-bold text-xs sm:text-sm tracking-wider uppercase transition-all transform hover:scale-[1.03] active:scale-95 shadow-md cursor-pointer border border-[#E6CF00]"
              >
                <Compass className="w-4 h-4 text-[#171513] group-hover:rotate-45 transition-transform" />
                <span>{heroContent.vrButtonText || 'ENTER VR MUSEUM'}</span>
              </button>

              {/* 2. View in AR */}
              <button
                type="button"
                onClick={() => defaultTextile && openAR(defaultTextile)}
                className={`group flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-xs sm:text-sm tracking-wider uppercase transition-all transform hover:scale-[1.03] active:scale-95 shadow-xs cursor-pointer border ${
                  hasHeroImage
                    ? 'bg-white/95 hover:bg-white text-[#8B2635] border-white'
                    : 'bg-white hover:bg-stone-50 text-[#8B2635] hover:text-[#6A1A26] border-stone-300'
                }`}
              >
                <Scan className="w-4 h-4 text-[#8B2635]" />
                <span>{heroContent.arButtonText || 'VIEW IN AR'}</span>
              </button>

              {/* 3. 3D Artifacts */}
              <button
                type="button"
                onClick={() => defaultTool && open3DViewer(defaultTool, 'textile')}
                className={`group flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-xs sm:text-sm tracking-wider uppercase transition-all transform hover:scale-[1.03] active:scale-95 shadow-xs cursor-pointer border ${
                  hasHeroImage
                    ? 'bg-black/60 hover:bg-black/80 text-white border-white/20'
                    : 'bg-[#171513] hover:bg-[#3A2415] text-white border-[#171513]'
                }`}
              >
                <Box className="w-4 h-4 text-[#FFE600]" />
                <span>{heroContent.models3DButtonText || '3D ARTIFACTS'}</span>
              </button>
            </div>

            {/* Feature pills below buttons */}
            <div className={`mt-3 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-[11px] ${
              hasHeroImage ? 'text-white/80' : 'text-stone-600'
            }`}>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                3D Exhibition Walkthrough
              </span>
              <span className="hidden sm:inline opacity-40">•</span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Real-world AR Placement
              </span>
              <span className="hidden sm:inline opacity-40">•</span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-600" />
                Laser Photogrammetry
              </span>
            </div>
          </motion.div>

          {/* Large pill-shaped EXPLORE button with red accent underline */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 flex flex-col items-center"
          >
            <button
              onClick={handleExplore}
              className="flex items-center gap-2 px-8 sm:px-12 py-2 sm:py-2.5 rounded-full bg-white hover:bg-stone-50 text-[#8B2635] hover:text-[#6A1A26] font-bold text-xs sm:text-sm tracking-widest border border-stone-300 shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer uppercase font-editorial"
            >
              <span>{heroContent.buttonText || 'EXPLORE'}</span>
              <ChevronDown className="w-4 h-4 text-[#8B2635]" />
            </button>
            {/* Subtle red dashed accent line as seen in reference */}
            <div className="w-16 h-0.5 mt-1 border-b border-dashed border-[#8B2635]/60" />
          </motion.div>
        </div>

        {/* Floating AI Assistant pill near lower-left of hero matching reference */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="absolute left-4 sm:left-8 bottom-4 sm:bottom-6 z-20 flex flex-col items-start gap-1"
        >
          <span className={`text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full shadow-xs ${
            hasHeroImage
              ? 'bg-black/50 text-white/90 backdrop-blur-xs'
              : 'bg-white/95 text-stone-700 border border-stone-200'
          }`}>
            {heroContent.aiButtonText || 'chat with assistant'}
          </span>
          <button
            onClick={toggleAIPanel}
            aria-label="Chat with cultural AI assistant"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#185ADB] hover:bg-[#11409C] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95 cursor-pointer border-2 border-white"
          >
            <MessageSquare className="w-5 h-5 fill-white" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};
