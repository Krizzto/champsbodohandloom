import React, { useState } from 'react';
import { RETRIEVAL_BENCHMARK_QUESTIONS, queryKnowledgeBase } from '../data/museumData';
import { BenchmarkResult } from '../types/museum';
import { X, Play, CheckCircle, AlertCircle, BarChart3, RotateCw, Sparkles, Filter } from 'lucide-react';

interface RetrievalBenchmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RetrievalBenchmarkModal: React.FC<RetrievalBenchmarkModalProps> = ({
  isOpen,
  onClose
}) => {
  const [results, setResults] = useState<BenchmarkResult[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [filterMode, setFilterMode] = useState<'all' | 'passed' | 'failed'>('all');
  const [customTestQuery, setCustomTestQuery] = useState<string>('');
  const [customResult, setCustomResult] = useState<{ concept: string; score: number }[] | null>(null);

  if (!isOpen) return null;

  const runBenchmark = () => {
    setIsRunning(true);
    setResults([]);

    setTimeout(() => {
      const benchmarkResults: BenchmarkResult[] = RETRIEVAL_BENCHMARK_QUESTIONS.map(item => {
        const matches = queryKnowledgeBase(item.question);
        const topMatch = matches[0];
        const isCorrect = topMatch.concept.toLowerCase() === item.expectedConcept.toLowerCase();

        return {
          questionId: item.id,
          question: item.question,
          expectedConcept: item.expectedConcept,
          predictedConcept: topMatch.concept,
          score: topMatch.score,
          isCorrect,
          topChunks: matches.slice(0, 3).map(m => ({
            concept: m.concept,
            text: m.snippet,
            similarity: m.score
          }))
        };
      });

      setResults(benchmarkResults);
      setIsRunning(false);
    }, 400);
  };

  const handleTestCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTestQuery.trim()) return;
    const matches = queryKnowledgeBase(customTestQuery);
    setCustomResult(matches.slice(0, 3));
  };

  const total = results.length;
  const passed = results.filter(r => r.isCorrect).length;
  const accuracy = total > 0 ? Math.round((passed / total) * 100) : 0;
  const meanScore = total > 0 ? (results.reduce((acc, r) => acc + r.score, 0) / total).toFixed(1) : 0;

  const filteredResults = results.filter(r => {
    if (filterMode === 'passed') return r.isCorrect;
    if (filterMode === 'failed') return !r.isCorrect;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl">
              <BarChart3 className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-white">OKF Retrieval & Embedding Benchmark</h3>
              <p className="text-xs text-stone-400">
                Evaluation benchmark from <code className="text-amber-400 font-mono">script_ingestion/evaluation/retrieval_questions.py</code>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action & Stats Bar */}
        <div className="px-6 py-4 bg-stone-950/50 border-b border-stone-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={runBenchmark}
              disabled={isRunning}
              className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:bg-stone-800 text-stone-950 font-bold text-xs rounded-xl transition-all shadow"
            >
              {isRunning ? <RotateCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-stone-950" />}
              <span>{results.length > 0 ? "Re-Run Benchmark" : "Execute 15 Benchmark Tests"}</span>
            </button>

            {results.length > 0 && (
              <div className="flex items-center gap-1 bg-stone-900 p-1 rounded-xl border border-stone-800 text-xs">
                <button
                  onClick={() => setFilterMode('all')}
                  className={`px-2.5 py-1 rounded-lg ${filterMode === 'all' ? 'bg-stone-800 text-white font-medium' : 'text-stone-400'}`}
                >
                  All ({total})
                </button>
                <button
                  onClick={() => setFilterMode('passed')}
                  className={`px-2.5 py-1 rounded-lg ${filterMode === 'passed' ? 'bg-emerald-950 text-emerald-300 font-medium' : 'text-stone-400'}`}
                >
                  Passed ({passed})
                </button>
                <button
                  onClick={() => setFilterMode('failed')}
                  className={`px-2.5 py-1 rounded-lg ${filterMode === 'failed' ? 'bg-rose-950 text-rose-300 font-medium' : 'text-stone-400'}`}
                >
                  Failed ({total - passed})
                </button>
              </div>
            )}
          </div>

          {/* Metric cards */}
          {results.length > 0 && (
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-2 bg-stone-900 px-3 py-1.5 rounded-xl border border-stone-800">
                <span className="text-stone-400">Top-1 Accuracy:</span>
                <span className="font-bold text-emerald-400 text-sm">{accuracy}%</span>
              </div>
              <div className="flex items-center gap-2 bg-stone-900 px-3 py-1.5 rounded-xl border border-stone-800">
                <span className="text-stone-400">Mean Score:</span>
                <span className="font-bold text-amber-400 text-sm">{meanScore}</span>
              </div>
            </div>
          )}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {results.length === 0 && !isRunning && (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-stone-800 flex items-center justify-center mx-auto text-amber-400">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white">Benchmark Ready to Run</h4>
              <p className="text-xs text-stone-400 max-w-md mx-auto">
                Click "Execute 15 Benchmark Tests" to simulate query retrieval accuracy against the 9 OKF processes as implemented in the Python evaluation scripts.
              </p>
            </div>
          )}

          {isRunning && (
            <div className="text-center py-12 space-y-3">
              <RotateCw className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
              <p className="text-xs text-stone-300 font-mono">
                Calculating cosine similarity and token overlaps across all 15 retrieval questions...
              </p>
            </div>
          )}

          {filteredResults.map(res => (
            <div
              key={res.questionId}
              className={`p-3.5 rounded-xl border transition-all text-xs flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                res.isCorrect
                  ? 'bg-emerald-950/20 border-emerald-900/40 text-stone-200'
                  : 'bg-rose-950/20 border-rose-900/40 text-stone-200'
              }`}
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-stone-500 font-bold">#{res.questionId}</span>
                  <span className="font-medium text-white">{res.question}</span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-stone-400">
                  <span>Expected: <strong className="text-amber-300">{res.expectedConcept}</strong></span>
                  <span>•</span>
                  <span>Predicted: <strong className={res.isCorrect ? 'text-emerald-400' : 'text-rose-400'}>{res.predictedConcept}</strong></span>
                  <span>•</span>
                  <span>Score: <code className="font-mono text-stone-300">{res.score}</code></span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {res.isCorrect ? (
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold flex items-center gap-1.5 text-[11px]">
                    <CheckCircle className="w-3.5 h-3.5" /> Pass
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-300 font-bold flex items-center gap-1.5 text-[11px]">
                    <AlertCircle className="w-3.5 h-3.5" /> Fail
                  </span>
                )}
              </div>
            </div>
          ))}

          {/* Interactive Custom Query Sandbox */}
          <div className="mt-6 pt-5 border-t border-stone-800 space-y-3">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Test Any Custom Query Against the Knowledge Base
            </span>
            <form onSubmit={handleTestCustom} className="flex gap-2">
              <input
                type="text"
                value={customTestQuery}
                onChange={e => setCustomTestQuery(e.target.value)}
                placeholder="e.g. How is the back strap adjusted for tension?"
                className="flex-1 bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-medium border border-stone-700 transition-colors"
              >
                Score
              </button>
            </form>

            {customResult && (
              <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 space-y-1.5">
                <span className="text-[11px] font-mono text-stone-400">Top Ranked Concept Matches:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {customResult.map((match, idx) => (
                    <div key={idx} className="bg-stone-900 p-2 rounded-lg border border-stone-800 flex justify-between text-xs">
                      <span className="font-semibold text-amber-300">{match.concept}</span>
                      <span className="font-mono text-stone-400">Score: {match.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-stone-950 border-t border-stone-800 flex justify-between items-center text-xs text-stone-500">
          <span>Benchmarked against 9 OKF Concepts</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
