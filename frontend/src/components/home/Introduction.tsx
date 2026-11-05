import React from 'react';
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

export interface IntroductionProps {
  onNavigate: (path: string) => void;
}

export const Introduction: React.FC<IntroductionProps> = ({ onNavigate }) => {
  return (
    <section className="py-20 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest font-semibold text-stone-500">
                Living Ethnographic Archive
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-editorial font-bold text-stone-900 mt-2 leading-tight">
                More Than a Craft: <br />
                <span className="yellow-highlight">A Civilizational Memory</span>
              </h2>
            </div>

            <p className="text-base sm:text-lg text-stone-700 font-editorial leading-relaxed">
              Bodo handloom is one of the most sophisticated indigenous textile traditions of South Asia. Centered across the fertile Brahmaputra plains and Bhutanese foothills of Assam, it represents centuries of botanical chemistry, mechanical ingenuity in bamboo craftsmanship, and matrilineal transmission of sacred motifs.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-editorial pt-2">
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-stone-200 space-y-1">
                <span className="font-bold text-stone-900 block text-sm">Ahimsa Peace Silk</span>
                <p className="text-stone-600">
                  Endi/Eri silkworms are reared on castor leaves, allowing the moth to exit naturally before spinning non-violent yarn.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-stone-200 space-y-1">
                <span className="font-bold text-stone-900 block text-sm">Sacred Agor Geometries</span>
                <p className="text-stone-600">
                  Over 40 traditional motifs encode natural topography, hills (Hajw), peacocks (Daorai), and protective totemic shields.
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={() => onNavigate('/explore')}
                icon={<BookOpen className="w-4 h-4 text-[#8B2635]" />}
              >
                Read Cultural Story
              </Button>

              <Button
                variant="ghost"
                size="md"
                onClick={() => onNavigate('/ai')}
                icon={<Sparkles className="w-4 h-4 text-[#185ADB]" />}
              >
                Ask Knowledge Assistant
              </Button>
            </div>
          </div>

          {/* Right Column: Cultural Highlight Box */}
          <div className="lg:col-span-5 bg-[#FAF8F5] rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Ethno-Botanical Formula
              </span>
              <span className="text-[10px] font-mono text-[#8B2635] bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                100% Organic
              </span>
            </div>

            <blockquote className="font-editorial text-sm sm:text-base italic text-stone-800 border-l-3 border-[#8B2635] pl-4 leading-relaxed">
              &ldquo;When my shuttle glides across the loom, I am carrying the voices of our ancestors, the rivers of Bodoland, and the sacred beauty of our hills into every golden motif.&rdquo;
            </blockquote>

            <div className="space-y-3 pt-2 text-xs text-stone-600">
              <div className="flex items-center justify-between py-1 border-b border-stone-200/80">
                <span className="font-semibold text-stone-800">Primary Loom Type:</span>
                <span>Sal (Traditional Throw-shuttle Frame)</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-stone-200/80">
                <span className="font-semibold text-stone-800">Key Fiber:</span>
                <span>Samia cynthia ricini (Eri Ahimsa Silk)</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-stone-200/80">
                <span className="font-semibold text-stone-800">Natural Yellow Mordant:</span>
                <span>Wild Turmeric (Haldhi) + Banana Stem Ash</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="font-semibold text-stone-800">Regional Clusters:</span>
                <span>Kokrajhar, Chirang, Baksa, Udalguri</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
