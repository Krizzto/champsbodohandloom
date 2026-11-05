import React from 'react';
import { motion } from 'motion/react';
import { HeritageImage } from './ui/HeritageImage';
import { useMuseumStore } from '../store/museumStore';
import { useContentStore } from '../store/contentStore';
import { Sparkles, Camera, Info } from 'lucide-react';
import { IMAGE_ASSETS } from '../data/imageAssets';

/**
 * 5 Centralized About Photo Slots
 * Local paths under public/assets/images/about/
 * Replace these files locally to update photos on refresh without editing React code.
 */
export const aboutImages = [
  '/assets/images/about/about-1.JPG',
  '/assets/images/about/about-3.JPG',
  '/assets/images/about/about-4.JPG',
  '/assets/images/about/about-5.JPG',
  '/assets/images/hero/hero-main.JPG',
];

interface AboutPhotoSlot {
  slotNumber: number;
  title: string;
  src: string;
  imageKey: string;
  caption: string;
  colSpan: string;
  aspectRatio: string;
}

const ABOUT_PHOTO_SLOTS: AboutPhotoSlot[] = [
  {
    slotNumber: 1,
    title: 'About Photo 1',
    src: aboutImages[0],
    imageKey: 'about-photo-1',
    caption: 'Master artisan at the traditional Bodo Sal handloom',
    colSpan: 'col-span-12 sm:col-span-7',
    aspectRatio: '16/10',
  },
  {
    slotNumber: 2,
    title: 'About Photo 2',
    src: aboutImages[1],
    imageKey: 'about-photo-2',
    caption: 'Sorting and reeling wild Eri silk filaments',
    colSpan: 'col-span-12 sm:col-span-5',
    aspectRatio: '1/1',
  },
  {
    slotNumber: 3,
    title: 'About Photo 3',
    src: aboutImages[2],
    imageKey: 'about-photo-3',
    caption: 'Community collaborative warp preparation',
    colSpan: 'col-span-12 sm:col-span-4',
    aspectRatio: '4/3',
  },
  {
    slotNumber: 4,
    title: 'About Photo 4',
    src: aboutImages[3],
    imageKey: 'about-photo-4',
    caption: 'Cane basket of naturally dyed yarn spools & bobbins',
    colSpan: 'col-span-12 sm:col-span-4',
    aspectRatio: '4/3',
  },
  {
    slotNumber: 5,
    title: 'About Photo 5',
    src: aboutImages[4],
    imageKey: 'about-photo-5',
    caption: 'Field peg warping court & traditional wooden tools',
    colSpan: 'col-span-12 sm:col-span-4',
    aspectRatio: '4/3',
  },
];

export const AboutSection: React.FC = () => {
  const { openAIPanelWithContext } = useMuseumStore();
  const { siteContent } = useContentStore();
  const about = siteContent.about;

  return (
    <section id="about" className="py-16 md:py-24 bg-[#FAF8F5] text-[#171513]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* LEFT COLUMN: Project Narrative & Cultural Significance */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            <div>
              <p className="text-xs uppercase tracking-widest font-semibold text-stone-600 mb-2">
                {about.kicker || 'About the Project'}
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-editorial font-bold tracking-tight text-[#171513]">
                {about.heading.replace(about.highlightWord, '').trim()}{' '}
                <span className="yellow-highlight">{about.highlightWord || 'Handloom'}</span>
              </h2>
            </div>

            <blockquote className="text-base sm:text-lg text-stone-700 italic font-editorial leading-relaxed border-l-3 border-[#8B2635] pl-4">
              &ldquo;{about.description}&rdquo;
            </blockquote>

            <p className="text-sm text-stone-600 font-editorial leading-relaxed">
              Every Bodo textile represents a sacred geometry woven from memory. From the non-violent Ahimsa Eri silk lineage to the mountain-inspired Hajw Agor, this digital archive preserves living knowledge directly from master weavers across the Bodoland Territorial Region.
            </p>

            {/* Cultural highlights badge info */}
            <div className="p-4 rounded-md bg-[#F4EFE6] border border-stone-200/90 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-800 uppercase tracking-wider">
                <Info className="w-4 h-4 text-[#8B2635]" />
                <span>Living Heritage Archive</span>
              </div>
              <p className="text-xs text-stone-600 font-editorial leading-relaxed">
                Featuring 5 documented ethnographic photo subjects capturing field interviews, loom construction, indigenous yarn preparation, and village master artisans.
              </p>
            </div>

            <div className="pt-1">
              <button
                type="button"
                onClick={() => openAIPanelWithContext(null, 'Explain the cultural significance of Bodo handloom in Northeast India')}
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#0F4C81] hover:text-black underline underline-offset-4 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FFE600] fill-[#FFE600]" />
                <span>Ask AI about this cultural preservation initiative</span>
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Exactly 5 Clearly Defined Uploadable Photo Slots */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-12 gap-3 sm:gap-4">
              {ABOUT_PHOTO_SLOTS.map((slot, index) => (
                <motion.div
                  key={slot.slotNumber}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className={`${slot.colSpan} shadow-xs border border-stone-200/90 overflow-hidden bg-white p-1.5 rounded-xs relative group/slot`}
                >
                  {/* Photo Slot Badge */}
                  <div className="absolute top-2.5 left-2.5 z-20 pointer-events-none">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#171513]/85 text-[#FFE600] backdrop-blur-xs border border-white/20 shadow-xs">
                      {slot.title}
                    </span>
                  </div>

                  {/* Image Container with HeritageImage:
                      - Directly references /assets/images/about/about-N.jpg
                      - Automatically recognizes .jpg, .jpeg, .png, .webp
                      - If missing, displays clean placeholder without breaking layout
                      - In-place upload and replacement available */}
                  <div className="w-full overflow-hidden bg-stone-100 rounded-2xs">
                    <HeritageImage
                      src={slot.src}
                      alt={slot.title}
                      imageKey={slot.imageKey}
                      aspectRatio={slot.aspectRatio}
                      fallbackText={slot.title}
                      showChangeButton={true}
                    />
                  </div>

                  {/* Caption */}
                  <div className="px-1.5 py-1 text-center">
                    <p className="text-[11px] text-stone-500 font-editorial italic truncate" title={slot.caption}>
                      {slot.caption}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
