import React, { useState } from 'react';
import {
  X,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Star,
  Film,
  Calendar,
  Clock,
  Play,
  CheckCircle2,
} from 'lucide-react';
import { DocumentaryVideo } from '../../types';
import { DOCUMENTARY_CATEGORIES } from '../../data/documentaries';

interface DocumentaryDashboardModalProps {
  isOpen: boolean;
  documentaries: DocumentaryVideo[];
  onClose: () => void;
  onAddNew: () => void;
  onEdit: (doc: DocumentaryVideo) => void;
  onDelete: (id: string) => void;
  onTogglePublish: (id: string) => void;
  onToggleFeature: (id: string) => void;
  onPlayPreview: (doc: DocumentaryVideo) => void;
}

export const DocumentaryDashboardModal: React.FC<DocumentaryDashboardModalProps> = ({
  isOpen,
  documentaries,
  onClose,
  onAddNew,
  onEdit,
  onDelete,
  onTogglePublish,
  onToggleFeature,
  onPlayPreview,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Documentaries');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'title'>('newest');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  if (!isOpen) return null;

  // Filter & Search
  const filtered = documentaries
    .filter((doc) => {
      const matchesCategory =
        selectedCategory === 'All Documentaries' || doc.category === selectedCategory;
      const matchesSearch =
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doc.artisanName && doc.artisanName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (doc.tags && doc.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
      } else if (sortOrder === 'oldest') {
        return new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime();
      } else {
        return a.title.localeCompare(b.title);
      }
    });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#FAF8F5] border border-stone-300 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#171513] text-white border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#FFE600] flex items-center justify-center text-black shadow-xs">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold font-editorial">Documentary Management Dashboard</h3>
                <span className="px-2 py-0.5 rounded-full bg-[#FFE600] text-black text-[10px] font-bold uppercase">
                  Admin Only
                </span>
              </div>
              <p className="text-[11px] text-stone-300">
                Manage, publish, feature, replace, and organize Bodo handloom documentaries
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onAddNew}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFE600] hover:bg-[#fff04d] text-black text-xs font-bold shadow-xs transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Documentary</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search, Filter & Sort Controls */}
        <div className="p-4 bg-white border-b border-stone-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search documentaries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-800"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-800"
            >
              {DOCUMENTARY_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-800"
            >
              <option value="newest">Sort by: Newest First</option>
              <option value="oldest">Sort by: Oldest First</option>
              <option value="title">Sort by: Title (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Documentaries List Table */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-stone-300 text-stone-500">
              <Film className="w-8 h-8 text-stone-400 mx-auto mb-2" />
              <p className="text-sm font-semibold">No documentaries found</p>
              <p className="text-xs text-stone-400 mt-1">Try adjusting your search query or add a new documentary.</p>
              <button
                onClick={onAddNew}
                className="mt-3 px-4 py-1.5 rounded-lg bg-[#171513] text-[#FFE600] text-xs font-bold"
              >
                + Add Documentary
              </button>
            </div>
          ) : (
            filtered.map((doc) => (
              <div
                key={doc.id}
                className={`p-4 rounded-xl border transition-all bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs ${
                  doc.featured ? 'border-[#FFE600] bg-amber-50/20' : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                {/* Left: Thumbnail & Info */}
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <div
                    onClick={() => onPlayPreview(doc)}
                    className="relative w-24 h-16 sm:w-28 sm:h-18 rounded-lg overflow-hidden bg-stone-900 shrink-0 cursor-pointer group/thumb border border-stone-200"
                    title="Click to play preview"
                  >
                    <img
                      src={doc.thumbnailUrl || '/assets/images/weaving/weaving-process.jpg'}
                      alt={doc.title}
                      className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                      <Play className="w-5 h-5 fill-white text-white" />
                    </div>
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-white font-medium">
                      {doc.durationFormatted}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 text-[10px] font-bold uppercase tracking-wider">
                        {doc.category}
                      </span>
                      {doc.featured && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FFE600] text-black text-[10px] font-bold">
                          <Star className="w-2.5 h-2.5 fill-black" />
                          Featured
                        </span>
                      )}
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          doc.published
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-200 text-stone-600'
                        }`}
                      >
                        {doc.published ? 'Published' : 'Hidden'}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold font-editorial text-stone-900 truncate">
                      {doc.title}
                    </h4>

                    <p className="text-xs text-stone-500 line-clamp-1">{doc.description}</p>

                    <div className="flex items-center gap-3 text-[11px] text-stone-400 font-medium">
                      <span>Artisan: <strong className="text-stone-700">{doc.artisanName || 'Bodo Weaver'}</strong></span>
                      <span>•</span>
                      <span>{doc.uploadDate}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                  {/* Feature Toggle */}
                  <button
                    onClick={() => onToggleFeature(doc.id)}
                    className={`p-2 rounded-lg border text-xs transition-colors cursor-pointer ${
                      doc.featured
                        ? 'bg-[#FFE600] text-black border-[#FFE600]'
                        : 'bg-white hover:bg-stone-100 text-stone-600 border-stone-200'
                    }`}
                    title={doc.featured ? 'Unfeature' : 'Mark as Featured'}
                  >
                    <Star className={`w-3.5 h-3.5 ${doc.featured ? 'fill-black' : ''}`} />
                  </button>

                  {/* Publish / Unpublish Toggle */}
                  <button
                    onClick={() => onTogglePublish(doc.id)}
                    className={`p-2 rounded-lg border text-xs transition-colors cursor-pointer ${
                      doc.published
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-stone-100 text-stone-500 border-stone-200'
                    }`}
                    title={doc.published ? 'Unpublish from public view' : 'Publish to archive'}
                  >
                    {doc.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => onEdit(doc)}
                    className="p-2 rounded-lg bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 transition-colors cursor-pointer"
                    title="Edit documentary details"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete */}
                  {confirmDeleteId === doc.id ? (
                    <div className="flex items-center gap-1 bg-rose-50 border border-rose-200 p-1 rounded-lg">
                      <span className="text-[10px] text-rose-800 font-bold px-1">Delete?</span>
                      <button
                        onClick={() => {
                          onDelete(doc.id);
                          setConfirmDeleteId(null);
                        }}
                        className="px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-bold"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-1.5 py-0.5 rounded text-stone-600 text-[10px]"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteId(doc.id)}
                      className="p-2 rounded-lg bg-white hover:bg-rose-50 text-stone-400 hover:text-rose-600 border border-stone-200 transition-colors cursor-pointer"
                      title="Delete documentary"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#FAF8F5] border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <span>
            Total Documentaries: <strong>{documentaries.length}</strong> ({filtered.length} shown)
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold cursor-pointer"
          >
            Close Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
