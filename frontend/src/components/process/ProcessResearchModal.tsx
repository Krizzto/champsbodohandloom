import React, { useEffect, useState } from 'react';
import { X, FileText, CheckCircle, BookOpen, Layers, Wrench, Clock, Hash, ExternalLink } from 'lucide-react';

interface ProcessResearchModalProps {
  isOpen: boolean;
  processId: string;
  onClose: () => void;
}

export const ProcessResearchModal: React.FC<ProcessResearchModalProps> = ({
  isOpen,
  processId,
  onClose,
}) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !processId) return;

    setLoading(true);
    setError(null);

    fetch(`/api/knowledge/processes/${processId}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to load research document`);
        return res.json();
      })
      .then(resData => {
        setData(resData.process);
        setLoading(false);
      })
      .catch(err => {
        console.error('[ProcessResearchModal] Error:', err);
        setError(err.message || 'Failed to load research document');
        setLoading(false);
      });
  }, [isOpen, processId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-3xl bg-[#FAF8F5] border border-stone-300 rounded-2xl shadow-2xl overflow-hidden my-6 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#171513] text-white border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FFE600]/20 text-[#FFE600] flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold font-editorial text-white">
                {data ? `${data.title} — Archival Research Dossier` : 'Bodo Handloom Research Document'}
              </h3>
              <p className="text-[11px] text-stone-300">
                Open Knowledge Framework (OKF) Authoritative Ethnographic Source
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-stone-800 flex-1 bg-white">
          {loading ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-8 h-8 border-2 border-stone-400 border-t-[#8B2635] rounded-full animate-spin mx-auto" />
              <p className="text-xs text-stone-500 font-mono">Retrieving verified OKF markdown document...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl space-y-2">
              <p className="font-semibold">Unable to fetch research document</p>
              <p className="text-[11px]">{error}</p>
            </div>
          ) : data ? (
            <div className="space-y-6">
              {/* Provenance Metadata Card */}
              <div className="bg-[#FAF8F5] border border-stone-200 rounded-xl p-4 space-y-2.5 text-[11px]">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-2">
                  <span className="font-bold uppercase tracking-wider text-stone-500 font-editorial">
                    Document Provenance
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    Human-Verified Cultural Heritage
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-600">
                  <p>
                    <strong>Process ID:</strong> <span className="font-mono text-stone-800">{data.id}</span>
                  </p>
                  <p>
                    <strong>Indigenous Term:</strong> <span className="font-medium text-[#8B2635]">{data.nativeTerm || 'N/A'}</span>
                  </p>
                  <p>
                    <strong>Document UUID:</strong> <span className="font-mono text-[10px] text-stone-500">{data.documentId}</span>
                  </p>
                  <p>
                    <strong>Content SHA-256:</strong> <span className="font-mono text-[10px] text-stone-500">{data.sha256?.slice(0, 16)}...</span>
                  </p>
                </div>
              </div>

              {/* Formatted Markdown Content */}
              <div className="prose prose-stone max-w-none text-xs sm:text-sm font-editorial leading-relaxed space-y-4">
                <div className="border-l-4 border-[#8B2635] pl-4 py-1">
                  <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-editorial">
                    {data.title} ({data.nativeTerm})
                  </h2>
                  <p className="text-xs text-stone-500 font-mono mt-0.5">
                    Source: Traditional Weaving Process of the Bodos (Field Ethnography)
                  </p>
                </div>

                <p className="text-stone-800 text-justify whitespace-pre-line leading-relaxed">
                  {data.bodyText}
                </p>
              </div>

              {/* Tools and Key Steps Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-200">
                {data.toolsUsed && data.toolsUsed.length > 0 && (
                  <div className="bg-[#FAF8F5] p-4 rounded-xl border border-stone-200 space-y-2">
                    <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-stone-700 text-[11px]">
                      <Wrench className="w-3.5 h-3.5 text-[#A64B2A]" />
                      <span>Traditional Tools</span>
                    </div>
                    <ul className="space-y-1 text-xs text-stone-700 pl-1">
                      {data.toolsUsed.map((tool: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-[#A64B2A] font-bold">•</span>
                          <span>{tool}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {data.keySteps && data.keySteps.length > 0 && (
                  <div className="bg-[#FAF8F5] p-4 rounded-xl border border-stone-200 space-y-2">
                    <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-stone-700 text-[11px]">
                      <Layers className="w-3.5 h-3.5 text-[#185ADB]" />
                      <span>Sequential Steps</span>
                    </div>
                    <ul className="space-y-1 text-xs text-stone-700 pl-1">
                      {data.keySteps.map((step: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="font-mono text-[#185ADB] font-bold text-[10px]">[{idx + 1}]</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-stone-100 border-t border-stone-200">
          <span className="text-[11px] text-stone-500 font-mono">
            Verified Source Archive &bull; Central Institute of Technology Kokrajhar
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#171513] hover:bg-stone-800 text-white text-xs font-semibold cursor-pointer transition-colors"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
