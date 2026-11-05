import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Box, Sparkles, ArrowRight } from 'lucide-react';
import { useMuseumStore } from '../store/museumStore';
import { ARTIFACTS_DATA, MOTIFS_DATA, PROCESS_STAGES } from '../data/museumData';

export interface SearchResultItem {
  id: string;
  type: 'artifact' | 'motif' | 'process' | 'cultural';
  title: string;
  bodoTitle?: string;
  category: string;
  description: string;
  actionPayload?: string;
}

export const SearchModal: React.FC = () => {
  const {
    isSearchOpen,
    searchQuery,
    setSearchOpen,
    setSearchQuery,
    open3DViewer,
    openAIPanelWithContext,
    setSelectedMotifId,
    setSelectedProcessId,
  } = useMuseumStore();

  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q.length > 1) {
      setLoading(true);
      const res: SearchResultItem[] = [];

      // Filter artifacts
      for (const a of ARTIFACTS_DATA) {
        if (
          a.name.toLowerCase().includes(q) ||
          a.bodoName?.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q)
        ) {
          res.push({
            id: a.id,
            type: 'artifact',
            title: a.name,
            bodoTitle: a.bodoName,
            category: a.category,
            description: a.description,
            actionPayload: a.id,
          });
        }
      }

      // Filter motifs
      for (const m of MOTIFS_DATA) {
        if (
          m.name.toLowerCase().includes(q) ||
          m.bodoName.toLowerCase().includes(q) ||
          m.meaning.toLowerCase().includes(q) ||
          m.culturalSignificance.toLowerCase().includes(q)
        ) {
          res.push({
            id: m.id,
            type: 'motif',
            title: m.name,
            bodoTitle: m.bodoName,
            category: 'Motif (Agor)',
            description: m.meaning,
            actionPayload: m.id,
          });
        }
      }

      // Filter processes
      for (const p of PROCESS_STAGES) {
        if (
          p.name.toLowerCase().includes(q) ||
          p.bodoName.toLowerCase().includes(q) ||
          p.shortDesc.toLowerCase().includes(q)
        ) {
          res.push({
            id: p.id,
            type: 'process',
            title: `${p.stepNumber}. ${p.name}`,
            bodoTitle: p.bodoName,
            category: 'Process Stage',
            description: p.shortDesc,
            actionPayload: p.id,
          });
        }
      }

      setResults(res);
      setLoading(false);
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [searchQuery]);

  if (!isSearchOpen) return null;

  const handleAction = (item: SearchResultItem, action: 'view' | '3d' | 'ai') => {
    setSearchOpen(false);

    if (action === '3d') {
      const art = ARTIFACTS_DATA.find((a) => a.id === item.actionPayload) || ARTIFACTS_DATA[0];
      open3DViewer(art);
      return;
    }

    if (action === 'ai') {
      openAIPanelWithContext(null, `Tell me more about ${item.title} in Bodo handloom culture.`);
      return;
    }

    if (item.type === 'motif' && item.actionPayload) {
      setSelectedMotifId(item.actionPayload);
      const el = document.getElementById('agor');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (item.type === 'process' && item.actionPayload) {
      setSelectedProcessId(item.actionPayload);
      const el = document.getElementById('process');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else {
      const el = document.getElementById('museum');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-xs">
      <div
        className="fixed inset-0"
        onClick={() => setSearchOpen(false)}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-2xl bg-[#FAF8F5] text-stone-900 rounded-2xl shadow-2xl border border-stone-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center gap-3 bg-white">
          <Search className="w-5 h-5 text-stone-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Bodo handloom, Agor motifs, tools, dyeing..."
            autoFocus
            className="flex-1 bg-transparent text-stone-900 placeholder-stone-400 text-base sm:text-lg focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-stone-400 hover:text-stone-600 text-xs px-2 py-1 bg-stone-100 rounded-md cursor-pointer"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setSearchOpen(false)}
            className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2">
          {loading && (
            <div className="text-center py-8 text-stone-500 text-sm">
              Searching cultural repository...
            </div>
          )}

          {!loading && searchQuery.trim().length > 1 && results.length === 0 && (
            <div className="text-center py-10 space-y-2">
              <p className="text-sm font-medium text-stone-700">No matching cultural items found.</p>
              <p className="text-xs text-stone-500">
                Try searching for &quot;Maku&quot;, &quot;Dokhona&quot;, &quot;Hajw Agor&quot;, &quot;Zenther&quot;, or &quot;Ginning&quot;.
              </p>
            </div>
          )}

          {!loading && searchQuery.trim().length <= 1 && (
            <div className="py-6 px-2 text-stone-500 text-xs space-y-4">
              <p className="font-semibold uppercase tracking-wider text-[11px] text-stone-600">
                Suggested Searches:
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  'Maku Shuttle',
                  'Dokhona Thaosi',
                  'Hajw Agor (Mountain)',
                  'Daorai Agor (Peacock)',
                  'Zenther Cotton Gin',
                  'Ahimsa Eri Silk',
                  'Turmeric Natural Dye',
                ].map((term) => (
                  <button
                    key={term}
                    onClick={() => setSearchQuery(term)}
                    className="px-3 py-1.5 rounded-full bg-white hover:bg-stone-100 border border-stone-200 text-stone-800 text-xs transition-colors cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!loading &&
            results.map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                className="group p-3 sm:p-4 rounded-xl bg-white hover:bg-[#FAF8F5] border border-stone-200 hover:border-stone-300 transition-all flex items-start justify-between gap-4 cursor-pointer"
                onClick={() => handleAction(item, 'view')}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 uppercase tracking-wider">
                      {item.category}
                    </span>
                    {item.bodoTitle && (
                      <span className="text-xs text-stone-500 font-editorial">
                        {item.bodoTitle}
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-base text-stone-900 group-hover:text-[#A64B2A] transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 pt-1">
                  {item.type === 'artifact' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAction(item, '3d');
                      }}
                      className="p-2 rounded-lg bg-stone-100 hover:bg-[#171513] hover:text-[#FFE600] text-stone-700 transition-colors"
                      title="Inspect 3D Model"
                    >
                      <Box className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAction(item, 'ai');
                    }}
                    className="p-2 rounded-lg bg-stone-100 hover:bg-[#185ADB] hover:text-white text-stone-700 transition-colors"
                    title="Inquire in AI Assistant"
                  >
                    <Sparkles className="w-4 h-4" />
                  </button>
                  <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-stone-800 transition-colors" />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
