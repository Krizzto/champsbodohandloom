import React, { useState } from 'react';
import { DOCUMENT_MANIFEST_DATA } from '../data/museumData';
import { Database, FileCheck, Layers, GitBranch, ArrowRight, ShieldCheck, Hash, Terminal } from 'lucide-react';

export const IngestionPipelineViewer: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number>(0);

  const pipelineStages = [
    {
      step: 1,
      title: "Discovery & Registry",
      script: "ingestion/discovery.py & manifest.py",
      desc: "Scans raw directories, calculates SHA-256 hashes, tracks document versions in document_manifest.json, detects new or modified files.",
      badge: "Registry Active"
    },
    {
      step: 2,
      title: "Content Extraction",
      script: "extraction.py (PyMuPDF)",
      desc: "Extracts textual content, page streams, and embedded metadata from PDF monographs and artifact records into structured UTF-8 text.",
      badge: "Multi-format"
    },
    {
      step: 3,
      title: "Cleaning & Normalization",
      script: "cleaning.py",
      desc: "Normalizes zero-width spaces (U+200B), non-breaking spaces (U+00A0), resolves CRLF/CR to Unix LF, collapses redundant blank lines.",
      badge: "Pure Clean"
    },
    {
      step: 4,
      title: "Section Heading Parse",
      script: "knowledge/section.py",
      desc: "Applies regex pattern ^\\d+\\.\\s+.+$ to identify numbered traditional process boundaries (Ginning, Spinning, Reeling, etc.).",
      badge: "Hierarchical"
    },
    {
      step: 5,
      title: "OKF Concept Generation",
      script: "knowledge/okf.py",
      desc: "Transforms extracted document sections into standardized Open Knowledge Framework markdown with YAML frontmatter and index links.",
      badge: "OKF Schema"
    },
    {
      step: 6,
      title: "Recursive Chunking",
      script: "knowledge/chunking.py (LangChain)",
      desc: "Splits concept bodies into overlapping semantic chunks tagged with document_id, chunk_index, concept, and modality for vector retrieval.",
      badge: "Retrieval Ready"
    }
  ];

  return (
    <div className="bg-stone-900/90 rounded-2xl border border-stone-800 shadow-2xl p-4 md:p-6 space-y-6">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-stone-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Database className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-wide">
              Document Ingestion & OKF Knowledge Pipeline
            </h2>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Visual architecture of the Python ingestion pipeline, document manifest registry, and chunking system.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-950 border border-stone-800 text-xs font-mono text-emerald-400">
          <ShieldCheck className="w-4 h-4" />
          <span>Registry: 5 Documents Synced</span>
        </div>
      </div>

      {/* Interactive 6-Stage Pipeline Stepper */}
      <div className="space-y-3">
        <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider block">
          Execution Pipeline Stages
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {pipelineStages.map((stage, idx) => {
            const isSelected = activeStage === idx;
            return (
              <button
                key={stage.step}
                onClick={() => setActiveStage(idx)}
                className={`p-3 rounded-xl border text-left transition-all relative ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-500 shadow-lg text-white'
                    : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200 hover:bg-stone-850'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-stone-800 text-amber-400 font-bold">
                    0{stage.step}
                  </span>
                  <span className="text-[9px] text-stone-500 font-mono">{stage.badge}</span>
                </div>
                <h4 className="text-xs font-bold leading-tight">{stage.title}</h4>
              </button>
            );
          })}
        </div>

        {/* Selected Stage Detail Card */}
        <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 text-xs space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800 pb-2">
            <span className="font-bold text-amber-300 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-amber-400" />
              Stage 0{pipelineStages[activeStage].step}: {pipelineStages[activeStage].title}
            </span>
            <code className="text-stone-400 font-mono text-[11px] bg-stone-900 px-2 py-0.5 rounded border border-stone-800">
              script_ingestion/{pipelineStages[activeStage].script}
            </code>
          </div>
          <p className="text-stone-300 leading-relaxed">
            {pipelineStages[activeStage].desc}
          </p>
        </div>
      </div>

      {/* Document Manifest Registry (from document_manifest.json) */}
      <div className="space-y-3">
        <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider block flex items-center gap-1.5">
          <FileCheck className="w-3.5 h-3.5 text-amber-400" />
          Active Document Manifest Registry (<code className="text-amber-400 font-mono">document_manifest.json</code>)
        </span>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-300 border-collapse">
            <thead>
              <tr className="border-b border-stone-800 text-stone-400 font-mono text-[11px]">
                <th className="py-2.5 px-3">Document Source</th>
                <th className="py-2.5 px-3">Document UUID</th>
                <th className="py-2.5 px-3">SHA-256 Hash</th>
                <th className="py-2.5 px-3">Modality</th>
                <th className="py-2.5 px-3">Version</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-850">
              {Object.entries(DOCUMENT_MANIFEST_DATA).map(([key, doc]) => (
                <tr key={key} className="hover:bg-stone-950/60 transition-colors">
                  <td className="py-3 px-3 font-medium text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>{doc.source}</span>
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-stone-400">
                    {doc.document_id.slice(0, 14)}...
                  </td>
                  <td className="py-3 px-3 font-mono text-[10px] text-amber-400">
                    {doc.content_hash.slice(0, 16)}...
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-stone-800 text-stone-300 font-mono uppercase text-[10px]">
                      {doc.modality}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-stone-300 font-bold">
                    v{doc.version}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
