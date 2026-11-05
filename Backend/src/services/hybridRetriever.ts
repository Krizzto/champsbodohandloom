import type { HybridEvidence, SourceCitation, KnowledgeChunk, GraphNode, GraphEdge } from '../types/graph.ts';
import { knowledgeBaseService } from './knowledgeBase.ts';
import { graphStore } from './graphStore.ts';

export class HybridRetriever {
  /**
   * Execute Hybrid GraphRAG retrieval:
   * Merges document text chunks with entity graph relationships,
   * dedupes evidence, and constructs verifiable provenance citations.
   */
  public retrieve(query: string, topK = 4): HybridEvidence {
    // 1. Document / Chunk level retrieval
    const chunkResults = knowledgeBaseService.queryDocumentChunks(query, topK);

    // 2. Graph level entity & relationship retrieval
    const graphResults = graphStore.queryGraph(query);

    // 3. Assemble verified source citations
    const citations: SourceCitation[] = chunkResults.map(({ chunk, score }) => ({
      documentId: chunk.documentId,
      documentName: chunk.documentName,
      chunkId: chunk.chunkId,
      heading: chunk.sectionHeading,
      excerpt: chunk.text.length > 220 ? chunk.text.slice(0, 220) + '...' : chunk.text,
      processName: chunk.processName,
      relevanceScore: score,
    }));

    // If graph found extra entities with sourceDocumentId not yet in citations, augment
    for (const gNode of graphResults.nodes) {
      if (gNode.sourceDocumentId && !citations.some(c => c.documentId === gNode.sourceDocumentId && c.heading === gNode.name)) {
        if (citations.length < topK + 2) {
          citations.push({
            documentId: gNode.sourceDocumentId,
            documentName: `${gNode.name.toLowerCase().replace(/\s+/g, '_')}.md`,
            chunkId: gNode.sourceChunkId || `${gNode.id}_fact`,
            heading: `${gNode.name} (${gNode.type})`,
            excerpt: gNode.evidenceText || `${gNode.name}: ${gNode.properties.description || ''}`,
            relevanceScore: 6.0,
          });
        }
      }
    }

    // 4. Combined scoring
    const topChunkScore = chunkResults[0]?.score || 0;
    const combinedScore = Math.max(topChunkScore, graphResults.relevanceScore);

    return {
      documentChunks: chunkResults.map(r => r.chunk),
      graphEntities: graphResults.nodes,
      graphRelationships: graphResults.edges,
      relevanceScore: combinedScore,
      citations: citations.slice(0, 5),
    };
  }

  /**
   * Evaluate if retrieved evidence is sufficient to ground a factual cultural answer
   */
  public evaluateSufficiency(evidence: HybridEvidence, query?: string): { sufficient: boolean; reason: string } {
    if (evidence.documentChunks.length === 0 && evidence.graphEntities.length === 0) {
      return {
        sufficient: false,
        reason: 'No matching records found in the verified Bodo handloom knowledge base.',
      };
    }

    if (evidence.relevanceScore < 2.5) {
      return {
        sufficient: false,
        reason: 'Retrieved evidence has low semantic confidence below threshold.',
      };
    }

    // Check for ungrounded / out-of-archive terms in query
    if (query) {
      const allEvidenceText = (
        evidence.documentChunks.map(c => c.text).join(' ') +
        ' ' +
        evidence.graphEntities.map(e => `${e.name} ${e.evidenceText || ''}`).join(' ')
      ).toLowerCase();

      const outOfDomainWords = [
        'microchip',
        'processor',
        'computer',
        'electronics',
        'bluetooth',
        'laser',
        'diesel',
        'synthetic',
        'polyester',
        'nylon',
        'satellite',
        'motor',
        'robot',
        'automation',
      ];

      const foundOutOfDomain = outOfDomainWords.find(w => query.toLowerCase().includes(w));
      if (foundOutOfDomain && !allEvidenceText.includes(foundOutOfDomain)) {
        return {
          sufficient: false,
          reason: `Query inquires about '${foundOutOfDomain}', which is absent from verified Bodo handloom archival documentation.`,
        };
      }
    }

    return {
      sufficient: true,
      reason: 'Evidence meets verified provenance and relevance requirements.',
    };
  }
}

export const hybridRetriever = new HybridRetriever();
