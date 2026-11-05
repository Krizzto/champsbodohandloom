import { RETRIEVAL_BENCHMARK_QUESTIONS } from '../data/museumData.ts';
import type { BenchmarkResult } from '../types/museum.ts';
import { hybridRetriever } from './hybridRetriever.ts';

export interface BenchmarkReport {
  timestamp: string;
  totalQuestions: number;
  passedCount: number;
  failedCount: number;
  accuracyPercentage: number;
  meanReciprocalRank: number;
  averageLatencyMs: number;
  results: BenchmarkResult[];
}

export class BenchmarkService {
  /**
   * Run the authoritative 15-question Bodo Heritage retrieval benchmark
   */
  public async runBenchmark(): Promise<BenchmarkReport> {
    const startTime = Date.now();
    const results: BenchmarkResult[] = [];
    let reciprocalRankSum = 0;

    for (const item of RETRIEVAL_BENCHMARK_QUESTIONS) {
      const qStart = Date.now();
      const evidence = hybridRetriever.retrieve(item.question, 4);

      const topChunk = evidence.documentChunks[0];
      const topEntity = evidence.graphEntities[0];

      // Predict concept from top retrieved chunk's processId
      const predictedConcept = topChunk?.processId
        ? topChunk.processId.charAt(0).toUpperCase() + topChunk.processId.slice(1)
        : topEntity?.name || 'Unknown';
      const isCorrect = predictedConcept.toLowerCase() === item.expectedConcept.toLowerCase();

      // Calculate rank of expected concept in results
      let rank = 0;
      evidence.documentChunks.forEach((c, idx) => {
        if (c.processId.toLowerCase() === item.expectedConcept.toLowerCase() && rank === 0) {
          rank = idx + 1;
        }
      });
      if (rank === 0 && isCorrect) rank = 1;

      if (rank > 0) {
        reciprocalRankSum += 1 / rank;
      }

      results.push({
        questionId: item.id,
        question: item.question,
        expectedConcept: item.expectedConcept,
        predictedConcept,
        score: evidence.relevanceScore,
        isCorrect,
        topChunks: evidence.documentChunks.slice(0, 3).map(c => ({
          concept: c.processName,
          text: c.text.slice(0, 150) + '...',
          similarity: evidence.relevanceScore,
        })),
      });
    }

    const duration = Date.now() - startTime;
    const passedCount = results.filter(r => r.isCorrect).length;
    const total = results.length;

    return {
      timestamp: new Date().toISOString(),
      totalQuestions: total,
      passedCount,
      failedCount: total - passedCount,
      accuracyPercentage: Math.round((passedCount / total) * 1000) / 10,
      meanReciprocalRank: Math.round((reciprocalRankSum / total) * 100) / 100,
      averageLatencyMs: Math.round(duration / total),
      results,
    };
  }
}

export const benchmarkService = new BenchmarkService();
