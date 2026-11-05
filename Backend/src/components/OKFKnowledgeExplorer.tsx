import React, { useState } from 'react';
import { OKF_PROCESSES, MUSEUM_EXHIBITS } from '../data/museumData';
import { OKFProcess, ExhibitItem } from '../types/museum';
import { BookOpen, Tag, FileText, CheckCircle, Clock, Wrench, ExternalLink, Sparkles, Search, Compass } from 'lucide-react';

interface OKFKnowledgeExplorerProps {
  onNavigateToExhibit: (exhibit: ExhibitItem) => void;
}

export const OKFKnowledgeExplorer: React.FC<OKFKnowledgeExplorerProps> = ({
  onNavigateToExhibit
}) => {
  const [selectedProcessId, setSelectedProcessId] = useState<string>('weaving');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'structured' | 'raw_markdown'>('structured');

  const currentProcess = OKF_PROCESSES.find(p => p.id === selectedProcessId) || OKF_PROCESSES[0];

  // All unique tags
  const allTags = Array.from(new Set(OKF_PROCESSES.flatMap(p => p.tags)));

  // Filter processes
  const filteredProcesses = OKF_PROCESSES.filter(proc => {
    const matchesSearch =
      proc.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (proc.nativeTerm && proc.nativeTerm.toLowerCase().includes(searchFilter.toLowerCase())) ||
      proc.description.toLowerCase().includes(searchFilter.toLowerCase());

    const matchesTag = selectedTag === 'all' || proc.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const handleJumpTo3D = () => {
    const exhibit = MUSEUM_EXHIBITS.find(e => e.id === currentProcess.exhibitId);
    if (exhibit) {
      onNavigateToExhibit(exhibit);
    }
  };

  return (
    <div className="bg-stone-900/90 rounded-2xl border border-stone-800 shadow-2xl overflow-hidden p-4 md:p-6 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <BookOpen className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-wide">
              Open Knowledge Framework (OKF) Repository
            </h2>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Systematic semantic knowledge bundle of 9 traditional Bodo handloom, sericulture, and pre-weaving techniques.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 bg-stone-950 p-1 rounded-xl border border-stone-800">
          <button
            onClick={() => setViewMode('structured')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'structured'
                ? 'bg-amber-500 text-stone-950 font-bold shadow'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            Structured View
          </button>
          <button
            onClick={() => setViewMode('raw_markdown')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'raw_markdown'
                ? 'bg-amber-500 text-stone-950 font-bold shadow'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            Raw OKF Markdown
          </button>
        </div>
      </div>

      {/* Search & Tag filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-500" />
          <input
            type="text"
            value={searchFilter}
            onChange={e => setSearchFilter(e.target.value)}
            placeholder="Search Bodo terms, tools, or techniques (e.g. Neotha, Baleb, Rice powder)..."
            className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-10 pr-4 py-2 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedTag('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              selectedTag === 'all'
                ? 'bg-amber-600 text-white'
                : 'bg-stone-950 text-stone-400 border border-stone-800 hover:text-white'
            }`}
          >
            All Concepts
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap capitalize transition-all ${
                selectedTag === tag
                  ? 'bg-amber-600 text-white'
                  : 'bg-stone-950 text-stone-400 border border-stone-800 hover:text-white'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Main 2-Column OKF Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Process List */}
        <div className="lg:col-span-4 space-y-2">
          <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider block px-1">
            Knowledge Bundle Index ({filteredProcesses.length})
          </span>
          <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
            {filteredProcesses.map(proc => {
              const isSelected = proc.id === currentProcess.id;
              return (
                <button
                  key={proc.id}
                  onClick={() => setSelectedProcessId(proc.id)}
                  className={`w-full p-3 rounded-xl border text-left transition-all duration-200 flex items-start justify-between gap-2 ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500/50 shadow-md text-amber-200'
                      : 'bg-stone-950/60 border-stone-800/80 text-stone-300 hover:bg-stone-800 hover:text-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white">{proc.title}</h4>
                      {proc.nativeTerm && (
                        <span className="text-[10px] text-amber-400 font-mono">
                          ({proc.nativeTerm})
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-stone-400 line-clamp-1 mt-0.5">
                      {proc.description}
                    </p>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-800 text-stone-400 font-mono">
                    .md
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Process Inspector */}
        <div className="lg:col-span-8 bg-stone-950 rounded-xl border border-stone-800 p-5 space-y-5">
          {viewMode === 'structured' ? (
            <>
              {/* Header with Title and 3D Jump */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-lg font-bold text-white font-serif-title">
                      {currentProcess.title}
                    </h3>
                    {currentProcess.nativeTerm && (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono">
                        {currentProcess.nativeTerm}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-400 mt-1">{currentProcess.description}</p>
                </div>

                <button
                  onClick={handleJumpTo3D}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl transition-all shadow shrink-0"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>View in 3D Gallery</span>
                </button>
              </div>

              {/* Verified Text Content */}
              <div className="bg-stone-900/60 p-4 rounded-xl border border-stone-800/80">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" /> Verified Knowledge Content
                </span>
                <p className="text-xs text-stone-200 leading-relaxed whitespace-pre-line font-normal">
                  {currentProcess.content}
                </p>
              </div>

              {/* Key Steps & Implements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-stone-900/40 p-3.5 rounded-xl border border-stone-800 space-y-2">
                  <span className="text-xs font-bold text-stone-200 flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Key Procedural Steps
                  </span>
                  <ul className="space-y-1.5">
                    {currentProcess.keySteps.map((step, idx) => (
                      <li key={idx} className="text-xs text-stone-300 flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-stone-800 text-amber-400 flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-stone-900/40 p-3.5 rounded-xl border border-stone-800 space-y-3">
                  <div>
                    <span className="text-xs font-bold text-stone-200 flex items-center gap-1.5 mb-2">
                      <Wrench className="w-3.5 h-3.5 text-amber-400" /> Tools & Implements
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {currentProcess.toolsUsed.map((tool, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-stone-800 text-stone-300 text-[11px] border border-stone-700/60"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                  {currentProcess.duration && (
                    <div className="pt-2 border-t border-stone-800/80 flex items-center gap-2 text-xs text-stone-400">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Duration: <strong className="text-stone-200">{currentProcess.duration}</strong></span>
                    </div>
                  )}
                </div>
              </div>

              {/* Source Document Traceability */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-stone-400 bg-stone-900/70 p-3 rounded-xl border border-stone-800">
                <div className="flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-stone-500" />
                  <span>Document ID: <code className="text-stone-300 text-[11px] font-mono">{currentProcess.documentId}</code></span>
                </div>
                <div className="flex items-center gap-1.5 text-amber-400 font-mono text-[11px]">
                  <span>Source: {currentProcess.source.resource.split('/').pop()}</span>
                </div>
              </div>
            </>
          ) : (
            /* Raw OKF Markdown View */
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-stone-400">
                <span>File: <code className="text-amber-400 font-mono">knowledge_base/04_okf/processes/{currentProcess.id}.md</code></span>
                <span className="text-emerald-400 font-mono">OKF Validated: OK</span>
              </div>
              <pre className="p-4 bg-stone-900 text-stone-300 font-mono text-xs rounded-xl overflow-x-auto border border-stone-800 leading-relaxed max-h-[440px]">
{`---
type: ${currentProcess.type}
title: ${currentProcess.title}
document_id: ${currentProcess.documentId}
description: ${currentProcess.description}
tags:
${currentProcess.tags.map(t => `  - ${t}`).join('\n')}
status: ${currentProcess.status}
sources:
  - id: ${currentProcess.source.id}
    resource: ../../01_raw_data/processes/Traditionalweaving_Process.pdf
    title: ${currentProcess.source.title}
---

# ${currentProcess.title}

${currentProcess.content}`}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
