import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Award,
  Film,
  Sparkles,
  Edit2,
  Plus,
  Play,
  Settings,
  Star,
  User,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from 'lucide-react';
import { DocumentaryImage } from './CulturalVisuals';
import { useContentStore } from '../store/contentStore';
import { ImageChangeButton } from './ImageChangeButton';
import { WeaverVideoInterview } from './weaver/WeaverVideoInterview';
import { AddEditWeaverModal } from './weaver/AddEditWeaverModal';
import { DeleteWeaverModal } from './weaver/DeleteWeaverModal';
import { AddEditDocumentaryModal } from './weaver/AddEditDocumentaryModal';
import { DocumentaryDashboardModal } from './weaver/DocumentaryDashboardModal';
import { DocumentaryPlayerModal } from './weaver/DocumentaryPlayerModal';
import { DocumentaryVideo, WeaverProfile } from '../types';
import { INITIAL_WEAVERS } from '../data/weavers';

export const WeaverSection: React.FC = () => {
  const {
    siteContent,
    weavers,
    documentaries,
    updateWeaver,
    addWeaver,
    deleteWeaver,
    addDocumentary,
    updateDocumentary,
    deleteDocumentary,
    toggleDocumentaryPublished,
    toggleDocumentaryFeatured,
    isEditModeActive,
  } = useContentStore();

  const weaverContent = siteContent.weaverSection;
  const safeWeaverList = weavers && weavers.length > 0 ? weavers : INITIAL_WEAVERS;

  // Active slide index
  const [activeWeaverIndex, setActiveWeaverIndex] = useState(0);

  // Clamp index within bounds
  const currentIndex = Math.max(0, Math.min(activeWeaverIndex, safeWeaverList.length - 1));
  const currentWeaver = safeWeaverList[currentIndex];

  // Modals state
  const [isAddWeaverOpen, setIsAddWeaverOpen] = useState(false);
  const [isEditWeaverOpen, setIsEditWeaverOpen] = useState(false);
  const [isDeleteWeaverOpen, setIsDeleteWeaverOpen] = useState(false);

  const [isAddDocOpen, setIsAddDocOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<DocumentaryVideo | null>(null);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [activePlayerDoc, setActivePlayerDoc] = useState<DocumentaryVideo | null>(null);

  // Active documentary category filter on the public grid
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Carousel Navigation Handlers
  const handlePrevWeaver = () => {
    setActiveWeaverIndex((prev) => (prev > 0 ? prev - 1 : safeWeaverList.length - 1));
  };

  const handleNextWeaver = () => {
    setActiveWeaverIndex((prev) => (prev < safeWeaverList.length - 1 ? prev + 1 : 0));
  };

  // Touch Swiping Handlers for Mobile Devices
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchDeltaX, setTouchDeltaX] = useState<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchDeltaX(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const currentX = e.touches[0].clientX;
    setTouchDeltaX(currentX - touchStartX);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null) return;
    const swipeThreshold = 45; // 45px swipe
    if (touchDeltaX < -swipeThreshold) {
      handleNextWeaver();
    } else if (touchDeltaX > swipeThreshold) {
      handlePrevWeaver();
    }
    setTouchStartX(null);
    setTouchDeltaX(0);
  };

  // Keyboard navigation when viewing weaver slider
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        isAddWeaverOpen ||
        isEditWeaverOpen ||
        isDeleteWeaverOpen ||
        isAddDocOpen ||
        isDashboardOpen ||
        activePlayerDoc
      ) {
        return;
      }
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'ArrowLeft') {
        handlePrevWeaver();
      } else if (e.key === 'ArrowRight') {
        handleNextWeaver();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    safeWeaverList.length,
    isAddWeaverOpen,
    isEditWeaverOpen,
    isDeleteWeaverOpen,
    isAddDocOpen,
    isDashboardOpen,
    activePlayerDoc,
  ]);

  // Save new weaver or update existing
  const handleSaveWeaver = (savedWeaver: WeaverProfile) => {
    const exists = safeWeaverList.some((w) => w.id === savedWeaver.id);
    if (exists) {
      updateWeaver(savedWeaver.id, savedWeaver);
    } else {
      addWeaver(savedWeaver);
      // Automatically jump to the newly added weaver slide
      setActiveWeaverIndex(safeWeaverList.length);
    }
  };

  const handleDeleteCurrentWeaver = () => {
    if (safeWeaverList.length <= 1) return;
    const targetId = currentWeaver.id;
    deleteWeaver(targetId);
    setActiveWeaverIndex((prev) => Math.max(0, prev - 1));
  };

  // Filter public documentaries (only published ones for public view)
  const publicDocs = (documentaries || []).filter((d) => d.published);
  const categoriesList = ['All', ...Array.from(new Set(publicDocs.map((d) => d.category)))];
  const displayedDocs =
    selectedCategory === 'All'
      ? publicDocs
      : publicDocs.filter((d) => d.category === selectedCategory);

  const handleSaveDocumentary = (doc: DocumentaryVideo) => {
    const exists = documentaries.some((d) => d.id === doc.id);
    if (exists) {
      updateDocumentary(doc.id, doc);
    } else {
      addDocumentary(doc);
    }
  };

  return (
    <section id="weaver" className="relative py-20 md:py-28 bg-[#FAF8F5] text-[#171513] overflow-hidden">
      {/* Main Content Container: Width 93%, Max-Width capped around 1400-1440px, centered */}
      <div className="w-[93%] max-w-[1400px] 2xl:max-w-[1440px] mx-auto">
        
        {/* Section Header with Yellow Marker Highlight & Admin Actions */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 sm:mb-10">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-editorial font-bold text-[#171513] tracking-tight">
              {weaverContent.heading || 'Meet the'}{' '}
              <span className="yellow-highlight">{weaverContent.highlightWord || 'weaver'}</span>
            </h2>
            <p className="text-xs uppercase tracking-widest text-stone-500 font-semibold mt-2">
              {weaverContent.subtitle || 'ORAL HERITAGE & MASTER ARTISAN ARCHIVE'}
            </p>
          </div>

          {/* Admin & Management Actions */}
          <div className="flex items-center gap-2 flex-wrap self-start lg:self-auto">
            {/* + Add Weaver Button */}
            <button
              type="button"
              onClick={() => setIsAddWeaverOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFE600] hover:bg-[#fff04d] text-black text-xs font-bold uppercase tracking-wider shadow-sm transition-transform hover:scale-105 active:scale-95 cursor-pointer font-editorial"
              title="Add a new master weaver profile slide to the carousel"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Weaver</span>
            </button>

            {/* Edit Current Weaver Info */}
            <button
              type="button"
              onClick={() => setIsEditWeaverOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-900 text-xs font-semibold border border-stone-300 transition-colors shadow-2xs cursor-pointer"
              title={`Edit information for ${currentWeaver.name}`}
            >
              <Edit2 className="w-3.5 h-3.5 text-[#8B2635]" />
              <span>Edit Weaver Info</span>
            </button>

            {/* Delete Weaver (if multiple exist) */}
            {safeWeaverList.length > 1 && (
              <button
                type="button"
                onClick={() => setIsDeleteWeaverOpen(true)}
                className="inline-flex items-center gap-1 p-1.5 rounded-full bg-stone-100 hover:bg-rose-100 text-stone-500 hover:text-rose-700 border border-stone-300 transition-colors cursor-pointer"
                title={`Delete ${currentWeaver.name} profile`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Manage Documentaries Button */}
            <button
              type="button"
              onClick={() => setIsDashboardOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#171513] hover:bg-[#3A2415] text-[#FFE600] text-xs font-semibold border border-stone-800 transition-colors shadow-2xs cursor-pointer"
              title="Open Documentary Management Dashboard (Admin)"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Manage Documentaries</span>
            </button>
          </div>
        </div>

        {/* 
          SLIDER CONTROLS BAR:
          Slide counter (e.g. "1 / 2"), Previous/Next arrows, Pagination dots, and Quick artisan tabs
        */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-5 px-1">
          {/* Quick Tabs for Each Weaver */}
          <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 scrollbar-none">
            {safeWeaverList.map((w, idx) => (
              <button
                key={w.id}
                type="button"
                onClick={() => setActiveWeaverIndex(idx)}
                className={`px-3 py-1 rounded-full text-xs font-editorial transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  currentIndex === idx
                    ? 'bg-[#171513] text-[#FFE600] font-bold shadow-xs'
                    : 'bg-white hover:bg-stone-100 text-stone-600 border border-stone-200'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                <span>{w.name}</span>
              </button>
            ))}
          </div>

          {/* Navigation Controls: Slide Indicator, Prev/Next Arrows & Dots */}
          <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
            {/* Slide Indicator Badge */}
            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-stone-200/80 text-stone-800 border border-stone-300/60">
              {currentIndex + 1} / {safeWeaverList.length}
            </span>

            {/* Small Pagination Dots */}
            <div className="flex items-center gap-1.5">
              {safeWeaverList.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={() => setActiveWeaverIndex(dotIdx)}
                  aria-label={`Go to weaver slide ${dotIdx + 1}`}
                  className={`h-2 transition-all rounded-full cursor-pointer ${
                    currentIndex === dotIdx
                      ? 'w-6 bg-[#8B2635]'
                      : 'w-2 bg-stone-300 hover:bg-stone-400'
                  }`}
                />
              ))}
            </div>

            {/* Previous Arrow Button */}
            <button
              type="button"
              onClick={handlePrevWeaver}
              aria-label="Previous weaver profile"
              className="w-8 h-8 rounded-full bg-white hover:bg-[#171513] hover:text-[#FFE600] text-stone-800 border border-stone-300 flex items-center justify-center transition-colors shadow-2xs cursor-pointer active:scale-95"
              title="Previous Weaver (Left Arrow)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Next Arrow Button */}
            <button
              type="button"
              onClick={handleNextWeaver}
              aria-label="Next weaver profile"
              className="w-8 h-8 rounded-full bg-white hover:bg-[#171513] hover:text-[#FFE600] text-stone-800 border border-stone-300 flex items-center justify-center transition-colors shadow-2xs cursor-pointer active:scale-95"
              title="Next Weaver (Right Arrow)"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 
          MASTER WEAVER CARD:
          Container with smooth horizontal slide transition and touch support for mobile
        */}
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="bg-white border border-stone-300 rounded-xl p-6 sm:p-8 lg:p-12 xl:p-14 shadow-sm relative group/weaver overflow-hidden"
        >
          {/* Change Portrait Button for Editor */}
          <div
            className={`absolute top-4 right-4 z-20 transition-opacity ${
              isEditModeActive ? 'opacity-100' : 'opacity-0 group-hover/weaver:opacity-100'
            }`}
          >
            <ImageChangeButton
              imageKey={`weaver-portrait-${currentWeaver.id}`}
              label="CHANGE PORTRAIT"
              variant="floating"
            />
          </div>

          {/* 
            SLIDER TRACK:
            Smooth horizontal translation container. Only this profile content glides horizontally.
          */}
          <div className="overflow-hidden w-full">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {safeWeaverList.map((weaver, slideIdx) => {
                const masterpiecesList =
                  weaver.masterpieces && weaver.masterpieces.length >= 4
                    ? weaver.masterpieces.slice(0, 4)
                    : [
                        ...(weaver.masterpieces || []),
                        'Traditional Dokhona Thaosi',
                        'Eri Silk Chador',
                      ].slice(0, 4);

                return (
                  <div key={weaver.id} className="w-full shrink-0">
                    {/* Desktop Layout: Left Column ~38%, Right Column ~62% */}
                    <div className="grid grid-cols-1 lg:grid-cols-[38%_1fr] gap-8 lg:gap-14 xl:gap-16 items-start">
                      
                      {/* LEFT COLUMN: ~38% (Photo, Masterpieces, Bio, Badges) */}
                      <div className="flex flex-col space-y-6">
                        {/* Large Weaver Photo */}
                        <div className="relative w-full aspect-4/5 rounded-lg overflow-hidden border-2 border-stone-200 shadow-md group/portrait">
                          <DocumentaryImage
                            type="master-weaver"
                            imageKey={`weaver-portrait-${weaver.id}`}
                            customSrc={weaver.photo || weaver.image}
                            altText={`Portrait of Bodo master weaver ${weaver.name}`}
                          />

                          {/* Archival Badge */}
                          <div className="absolute top-3 left-3 z-10">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-[#FFE600] text-[10px] font-bold tracking-wider uppercase border border-white/20 shadow-md">
                              <Film className="w-3 h-3 text-[#FFE600]" />
                              <span>MASTER WEAVER ARCHIVE</span>
                            </span>
                          </div>

                          {/* Gradient Name Overlay */}
                          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 sm:p-5 text-white">
                            <p className="text-xl font-bold font-editorial">{weaver.name}</p>
                            <p className="text-xs text-[#FFE600] font-medium">{weaver.bodoTitle}</p>
                          </div>
                        </div>

                        {/* Masterpieces [1] [2] [3] [4] */}
                        <div className="space-y-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 font-editorial block">
                            Preserved Masterpieces
                          </span>
                          <div className="flex flex-wrap gap-2 text-xs">
                            {masterpiecesList.map((item, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#FAF8F5] border border-stone-200 text-stone-700 font-editorial"
                              >
                                <span className="font-mono font-bold text-[#A64B2A]">[{idx + 1}]</span>
                                <span>{item}</span>
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Artisan Identity & Short Biography */}
                        <div className="space-y-2 pt-2 border-t border-stone-200">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold font-editorial text-stone-900 tracking-tight">
                              {weaver.name}
                            </h3>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveWeaverIndex(slideIdx);
                                setIsEditWeaverOpen(true);
                              }}
                              className="p-1 rounded text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                              title="Quick edit profile details"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-xs text-[#8B2635] font-semibold uppercase tracking-wider">
                            Master Weaver & Living Heritage Bearer
                          </p>
                          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-editorial">
                            {weaver.traditionalKnowledge}
                          </p>
                        </div>

                        {/* Badges: Location, Experience, Specialization */}
                        <div className="space-y-2.5 pt-2 border-t border-stone-200 text-xs">
                          <div className="flex items-center gap-2 text-stone-700 font-medium">
                            <MapPin className="w-4 h-4 text-[#8B2635] shrink-0" />
                            <span>
                              {weaver.location}, {weaver.district}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-stone-700 font-medium">
                            <Award className="w-4 h-4 text-[#A64B2A] shrink-0" />
                            <span>{weaver.experience}</span>
                          </div>
                          <div className="flex items-center gap-2 text-stone-700 font-medium">
                            <Sparkles className="w-4 h-4 text-[#0F4C81] shrink-0" />
                            <span>Natural Dyeing & {weaver.specialization}</span>
                          </div>
                        </div>
                      </div>

                      {/* RIGHT COLUMN: ~62% (Location/Craftsmanship, Quote, Intro, Large Video) */}
                      <div className="flex flex-col space-y-6">
                        
                        {/* Location / Craftsmanship Badges */}
                        <div className="flex flex-wrap items-center gap-2.5 text-xs">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-700 font-medium">
                            <MapPin className="w-3.5 h-3.5 text-[#8B2635]" />
                            {weaver.location}
                          </span>
                          <span className="px-3 py-1 rounded-full bg-[#FFE600]/20 text-stone-800 font-semibold border border-[#FFE600]/40">
                            {weaver.experience}
                          </span>
                          <span className="px-3 py-1 rounded-full bg-[#F4EFE6] text-stone-700 font-medium border border-stone-200">
                            Oral Testimony Archive
                          </span>
                        </div>

                        {/* Weaver Quote */}
                        <blockquote className="text-xl sm:text-2xl font-editorial italic text-stone-800 border-l-4 border-[#8B2635] pl-5 leading-relaxed">
                          &ldquo;{weaver.interviewQuote}&rdquo;
                        </blockquote>

                        {/* Short Introduction */}
                        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-editorial">
                          Recorded in {weaver.location}, this archival conversation documents living indigenous loom traditions, sacred motif geometry, and heirloom weaving knowledge preserved by master artisan {weaver.name}.
                        </p>

                        {/* MASTER WEAVER INTERVIEW Header */}
                        <div className="pt-2 border-t border-stone-200">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#8B2635]/10 text-[#8B2635]">
                                <Film className="w-3 h-3" />
                              </span>
                              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 font-editorial">
                                MASTER WEAVER INTERVIEW &bull; {weaver.name}
                              </h4>
                            </div>
                            <span className="text-[11px] font-mono text-stone-500 font-medium">
                              16:9 Archival Recording
                            </span>
                          </div>

                          {/* Large 16:9 Interview Video Player (Independent per Weaver, auto-pauses when slide is inactive) */}
                          <WeaverVideoInterview
                            profile={weaver}
                            isActive={slideIdx === currentIndex}
                          />
                        </div>

                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 
            SUBSECTION: BODO HANDLOOM DOCUMENTARY ARCHIVE 
            Placed directly below the Master Weaver Slider within the same section.
          */}
          <div className="mt-14 pt-10 border-t border-stone-300">
            {/* Header Row with Title, Categories, and '+ Add Documentary' button */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <Film className="w-4 h-4 text-[#A64B2A]" />
                  <h3 className="text-xl sm:text-2xl font-editorial font-bold text-[#171513]">
                    Bodo Handloom Documentaries
                  </h3>
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  Living visual records of loom mechanics, yarn preparation, natural dyes, and sacred motifs
                </p>
              </div>

              {/* Actions & Add Documentary Button */}
              <div className="flex items-center gap-2.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    setEditingDoc(null);
                    setIsAddDocOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FFE600] hover:bg-[#fff04d] text-black text-xs font-bold uppercase tracking-wider shadow-sm transition-transform hover:scale-105 active:scale-95 cursor-pointer font-editorial"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Documentary</span>
                </button>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-6 scrollbar-none text-xs">
              {categoriesList.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full transition-colors shrink-0 font-medium cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#171513] text-[#FFE600] font-semibold shadow-xs'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Documentaries Responsive Grid (2 cols on tablet, 3 on desktop) */}
            {displayedDocs.length === 0 ? (
              <div className="p-10 text-center bg-[#FAF8F5] rounded-xl border border-dashed border-stone-300 text-stone-500">
                <Film className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                <p className="text-sm font-semibold">No documentaries published in this category yet.</p>
                <p className="text-xs text-stone-400 mt-1">
                  Click "+ Add Documentary" to upload your first video.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="group/card flex flex-col bg-[#FAF8F5] border border-stone-200 hover:border-stone-400 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md"
                  >
                    {/* 16:9 Thumbnail with Overlay Play Button */}
                    <div
                      onClick={() => setActivePlayerDoc(doc)}
                      className="relative w-full aspect-video bg-stone-900 cursor-pointer overflow-hidden"
                    >
                      <img
                        src={doc.thumbnailUrl || '/assets/images/weaving/weaving-process.jpg'}
                        alt={doc.title}
                        className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent flex items-center justify-center group-hover/card:bg-black/45 transition-colors">
                        <div className="w-12 h-12 rounded-full bg-[#FFE600] text-black flex items-center justify-center shadow-lg transition-transform group-hover/card:scale-110 border border-white">
                          <Play className="w-5 h-5 fill-black ml-0.5" />
                        </div>
                      </div>

                      {/* Top Badges */}
                      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider border border-white/20">
                          {doc.category}
                        </span>
                        {doc.featured && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FFE600] text-black text-[10px] font-bold">
                            <Star className="w-2.5 h-2.5 fill-black" />
                            Featured
                          </span>
                        )}
                      </div>

                      {/* Duration */}
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/85 text-[10px] font-mono text-white font-medium">
                        {doc.durationFormatted}
                      </span>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-1.5">
                        <h4
                          onClick={() => setActivePlayerDoc(doc)}
                          className="text-base font-bold font-editorial text-stone-900 line-clamp-1 hover:text-[#8B2635] cursor-pointer transition-colors"
                        >
                          {doc.title}
                        </h4>
                        <p className="text-xs text-stone-600 font-editorial line-clamp-2 leading-relaxed">
                          {doc.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-stone-200/80 flex items-center justify-between text-[11px] text-stone-500">
                        <span className="truncate">
                          Artisan: <strong className="text-stone-700">{doc.artisanName || 'Bodo Artisan'}</strong>
                        </span>
                        <button
                          type="button"
                          onClick={() => setActivePlayerDoc(doc)}
                          className="font-bold text-[#185ADB] hover:underline flex items-center gap-1 cursor-pointer shrink-0"
                        >
                          <span>Watch</span>
                          <Play className="w-2.5 h-2.5 fill-[#185ADB]" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* MODAL 1: Add or Edit Weaver Profile */}
      <AddEditWeaverModal
        isOpen={isAddWeaverOpen || isEditWeaverOpen}
        weaver={isEditWeaverOpen ? currentWeaver : null}
        onClose={() => {
          setIsAddWeaverOpen(false);
          setIsEditWeaverOpen(false);
        }}
        onSave={handleSaveWeaver}
      />

      {/* MODAL 2: Delete Weaver Profile Confirmation Dialog */}
      <DeleteWeaverModal
        isOpen={isDeleteWeaverOpen}
        weaver={currentWeaver}
        canDelete={safeWeaverList.length > 1}
        onClose={() => setIsDeleteWeaverOpen(false)}
        onConfirm={handleDeleteCurrentWeaver}
      />

      {/* MODAL 3: Add or Edit Documentary Video */}
      <AddEditDocumentaryModal
        isOpen={isAddDocOpen}
        documentary={editingDoc}
        onClose={() => {
          setIsAddDocOpen(false);
          setEditingDoc(null);
        }}
        onSave={handleSaveDocumentary}
      />

      {/* MODAL 4: Admin Documentary Management Dashboard */}
      <DocumentaryDashboardModal
        isOpen={isDashboardOpen}
        documentaries={documentaries || []}
        onClose={() => setIsDashboardOpen(false)}
        onAddNew={() => {
          setEditingDoc(null);
          setIsAddDocOpen(true);
        }}
        onEdit={(doc) => {
          setEditingDoc(doc);
          setIsAddDocOpen(true);
        }}
        onDelete={(id) => deleteDocumentary(id)}
        onTogglePublish={(id) => toggleDocumentaryPublished(id)}
        onToggleFeature={(id) => toggleDocumentaryFeatured(id)}
        onPlayPreview={(doc) => setActivePlayerDoc(doc)}
      />

      {/* MODAL 5: Documentary 16:9 Video Player */}
      <DocumentaryPlayerModal
        documentary={activePlayerDoc}
        onClose={() => setActivePlayerDoc(null)}
      />
    </section>
  );
};
