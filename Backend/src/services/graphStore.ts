import type { GraphNode, GraphEdge, NodeType, RelationshipType, VerificationStatus } from '../types/graph.ts';
import { MUSEUM_EXHIBITS } from '../data/museumData.ts';

export class GraphStore {
  private nodes: Map<string, GraphNode> = new Map();
  private edges: Map<string, GraphEdge> = new Map();

  // Adjacency lists for fast parameterized queries
  private outgoingEdges: Map<string, string[]> = new Map();
  private incomingEdges: Map<string, string[]> = new Map();

  constructor() {
    this.seedAuthoritativeBodoGraph();
  }

  public addNode(node: GraphNode): void {
    this.nodes.set(node.id, node);
    if (!this.outgoingEdges.has(node.id)) this.outgoingEdges.set(node.id, []);
    if (!this.incomingEdges.has(node.id)) this.incomingEdges.set(node.id, []);
  }

  public addEdge(edge: GraphEdge): void {
    this.edges.set(edge.id, edge);

    if (!this.outgoingEdges.has(edge.sourceNodeId)) {
      this.outgoingEdges.set(edge.sourceNodeId, []);
    }
    this.outgoingEdges.get(edge.sourceNodeId)!.push(edge.id);

    if (!this.incomingEdges.has(edge.targetNodeId)) {
      this.incomingEdges.set(edge.targetNodeId, []);
    }
    this.incomingEdges.get(edge.targetNodeId)!.push(edge.id);
  }

  public getNode(id: string): GraphNode | undefined {
    return this.nodes.get(id);
  }

  public getAllNodes(): GraphNode[] {
    return Array.from(this.nodes.values());
  }

  public getAllEdges(): GraphEdge[] {
    return Array.from(this.edges.values());
  }

  /**
   * Seed the source-grounded graph with the 9 verified Bodo handloom processes,
   * traditional tools, materials, sequential FOLLOWED_BY links, and museum exhibits.
   */
  private seedAuthoritativeBodoGraph(): void {
    const docId = '8652f0b1-d4d3-4e98-9483-69faa013f739';

    // 1. Process Nodes
    const processDefs = [
      { id: 'proc_ginning', name: 'Ginning', nativeName: 'Khun Saynay / Neotha hwnai', order: 1, desc: 'Cotton seed separation' },
      { id: 'proc_spinning', name: 'Spinning', nativeName: 'Khun Bangnay / Takhri', order: 2, desc: 'Drafting fiber into yarn' },
      { id: 'proc_reeling', name: 'Reeling', nativeName: 'Khou Saynay', order: 3, desc: 'Silk filament extraction' },
      { id: 'proc_sizing', name: 'Sizing', nativeName: 'Jang Honay', order: 4, desc: 'Rice starch strengthening' },
      { id: 'proc_winding', name: 'Winding', nativeName: 'Khabang Honay', order: 5, desc: 'Pirn and bobbin packaging' },
      { id: 'proc_warping', name: 'Warping', nativeName: 'Jang Dinay', order: 6, desc: 'Longitudinal thread arrangement' },
      { id: 'proc_beaming', name: 'Beaming', nativeName: 'Jang Khunthiyaw Bonay / Phannai', order: 7, desc: 'Warp sheet beam mounting' },
      { id: 'proc_looming', name: 'Looming & Drafting', nativeName: 'Serskiyaw Sohonay / Nw khonnai', order: 8, desc: 'Heddle drafting & denting' },
      { id: 'proc_weaving', name: 'Weaving', nativeName: 'Dirnay / Daonai', order: 9, desc: 'Loom interlacing of warp and weft' },
    ];

    processDefs.forEach(p => {
      this.addNode({
        id: p.id,
        type: 'Process',
        name: p.name,
        nativeName: p.nativeName,
        properties: { order: p.order, description: p.desc },
        verificationStatus: 'human_verified',
        sourceDocumentId: docId,
        sourceChunkId: `${p.id.replace('proc_', '')}_chunk_01`,
        evidenceText: `Verified Bodo handloom process step ${p.order}: ${p.name} (${p.nativeName}).`,
        createdAt: 1730000000000,
      });
    });

    // 2. Sequential Process Links: FOLLOWED_BY
    for (let i = 0; i < processDefs.length - 1; i++) {
      const src = processDefs[i];
      const tgt = processDefs[i + 1];
      this.addEdge({
        id: `seq_${src.id}_${tgt.id}`,
        sourceNodeId: src.id,
        targetNodeId: tgt.id,
        relationship: 'FOLLOWED_BY',
        verificationStatus: 'human_verified',
        sourceDocumentId: docId,
        evidenceText: `In traditional Bodo lineage, ${src.name} is sequentially followed by ${tgt.name}.`,
        createdAt: 1730000000000,
      });
    }

    // 3. Tool Nodes & USES_TOOL Relationships
    const tools = [
      { id: 'tool_zenther', name: 'Zenther', nativeName: 'Neotha', proc: 'proc_ginning', desc: 'Hand roller cotton gin with dual revolving rollers' },
      { id: 'tool_takhri', name: 'Takhri', nativeName: 'Drop Spindle', proc: 'proc_spinning', desc: 'Weighted clay whorl spindle for hand drafting' },
      { id: 'tool_chwrkhi', name: 'Chwrkhi', nativeName: 'Spinning Wheel', proc: 'proc_spinning', desc: 'Traditional wooden spinning wheel' },
      { id: 'tool_tharai', name: 'Tharai', nativeName: 'Reeling Swift', proc: 'proc_reeling', desc: 'Cross-reel swift for steaming silk filaments' },
      { id: 'tool_sizing_brush', name: 'Natural Bristle Sizing Brush', nativeName: 'Jang Brush', proc: 'proc_sizing', desc: 'Palm fiber brush for applying Maad starch' },
      { id: 'tool_swrkhi', name: 'Swrkhi', nativeName: 'Khabang Winder', proc: 'proc_winding', desc: 'Winding drum wheel for packaging pirns' },
      { id: 'tool_gandwi', name: 'Gandwi', nativeName: 'Warping Swift / Creel', proc: 'proc_warping', desc: 'Revolving reel for warp lease cross creation' },
      { id: 'tool_jang_khunti', name: 'Jang Khunti', nativeName: 'Warping Stakes', proc: 'proc_warping', desc: 'Courtyard wooden pegs anchoring warp threads' },
      { id: 'tool_weavers_beam', name: "Weaver's Beam", nativeName: 'Phannai Beam', proc: 'proc_beaming', desc: 'Timber beam with longitudinal groove for warp sheet' },
      { id: 'tool_phannai_rope', name: 'Phannai Rope', nativeName: 'Binding Cord', proc: 'proc_beaming', desc: 'Secure binding cord locking bamboo stick in beam groove' },
      { id: 'tool_baleb', name: 'Baleb', nativeName: 'Lease Rods', proc: 'proc_looming', desc: 'Flat bamboo lease-rods opening the warp shed upward' },
      { id: 'tool_nw_hasung', name: 'Nw Hasung', nativeName: 'Cylindrical Bamboo Pipe', proc: 'proc_looming', desc: 'Guiding pipe for right-to-left heald thread passing' },
      { id: 'tool_rashw', name: 'Rashw', nativeName: 'Loom Reed (Serski)', proc: 'proc_looming', desc: 'Fine bamboo comb regulating warp thread spacing' },
      { id: 'tool_sal', name: 'Sal Loom', nativeName: 'Throw-Shuttle Loom', proc: 'proc_weaving', desc: 'Traditional four-post Bodo throw-shuttle loom' },
      { id: 'tool_thati_sal', name: 'Thati Sal', nativeName: 'Fly-Shuttle Loom', proc: 'proc_weaving', desc: 'Assamese fly-shuttle frame loom with wooden batten' },
      { id: 'tool_maku', name: 'Maku', nativeName: 'Weaving Shuttle Boat', proc: 'proc_weaving', desc: 'Curved wooden shuttle vessel carrying weft pirns' },
      { id: 'tool_sword', name: 'Weaving Sword', nativeName: 'Beater Blade', proc: 'proc_weaving', desc: 'Hardwood sword used to beat weft firmly into the fell' },
    ];

    tools.forEach(t => {
      this.addNode({
        id: t.id,
        type: 'Tool',
        name: t.name,
        nativeName: t.nativeName,
        properties: { description: t.desc },
        verificationStatus: 'human_verified',
        sourceDocumentId: docId,
        evidenceText: `Traditional implement: ${t.name} (${t.nativeName}) used in ${t.proc}.`,
        createdAt: 1730000000000,
      });

      this.addEdge({
        id: `rel_${t.proc}_${t.id}`,
        sourceNodeId: t.proc,
        targetNodeId: t.id,
        relationship: 'USES_TOOL',
        verificationStatus: 'human_verified',
        sourceDocumentId: docId,
        evidenceText: `The ${t.proc.replace('proc_', '')} process requires ${t.name}.`,
        createdAt: 1730000000000,
      });
    });

    // 4. Material Nodes & USES_MATERIAL Relationships
    const materials = [
      { id: 'mat_seed_cotton', name: 'Raw Seed Cotton', nativeName: 'Khun', proc: 'proc_ginning', desc: 'Harvested organic cotton bolls' },
      { id: 'mat_cotton_sliver', name: 'Carded Cotton Sliver', nativeName: 'Sliver', proc: 'proc_spinning', desc: 'Cleaned, seedless cotton lint ready for spinning' },
      { id: 'mat_eri_cocoons', name: 'Eri Silk Cocoons', nativeName: 'Kwfwnai Cocoons', proc: 'proc_reeling', desc: 'Ahimsa open-ended silk cocoons boiled in plant ash' },
      { id: 'mat_rice_starch', name: 'Rice Starch Paste', nativeName: 'Maad / Maidi', proc: 'proc_sizing', desc: 'Boiled rice gruel with wheat flour boosting yarn tensile strength' },
      { id: 'mat_pirn_yarn', name: 'Wound Pirn Bobbins', nativeName: 'Pirn Reeds', proc: 'proc_winding', desc: 'Compact yarn wound onto reeds nesting inside Maku' },
      { id: 'mat_warp_sheet', name: 'Warp Thread Array', nativeName: 'Jang Warp', proc: 'proc_warping', desc: 'Hundreds of parallel threads aligned with cross lease' },
    ];

    materials.forEach(m => {
      this.addNode({
        id: m.id,
        type: 'Material',
        name: m.name,
        nativeName: m.nativeName,
        properties: { description: m.desc },
        verificationStatus: 'human_verified',
        sourceDocumentId: docId,
        evidenceText: `Material ${m.name} (${m.nativeName}) utilized in handloom operations.`,
        createdAt: 1730000000000,
      });

      this.addEdge({
        id: `mat_${m.proc}_${m.id}`,
        sourceNodeId: m.proc,
        targetNodeId: m.id,
        relationship: 'USES_MATERIAL',
        verificationStatus: 'human_verified',
        sourceDocumentId: docId,
        evidenceText: `The process relies on ${m.name}.`,
        createdAt: 1730000000000,
      });
    });

    // 5. Sacred Agor Motif Nodes & Relationships
    const motifs = [
      {
        id: 'motif_hajw_agor',
        name: 'Hajw Agor',
        nativeName: 'हाजो आगोर',
        desc: 'Sacred mountain range triangular motif symbolizing Himalayan foothills, fortitude, and honor, woven on the ceremonial Aronai scarf borders',
      },
      {
        id: 'motif_daorai_mwkhrwb',
        name: 'Daorai Mwkhrwb',
        nativeName: 'दाउराय मोख्रोब',
        desc: 'Peacock eye geometric diamond motif symbolizing royal elegance, dignity, and beauty',
      },
      {
        id: 'motif_phul_agor',
        name: 'Phul Agor',
        nativeName: 'फुल आगोर',
        desc: 'Floral blossom geometric motif symbolizing nature, fertility, and renewal',
      },
    ];

    motifs.forEach(m => {
      this.addNode({
        id: m.id,
        type: 'Motif',
        name: m.name,
        nativeName: m.nativeName,
        properties: { description: m.desc },
        verificationStatus: 'human_verified',
        sourceDocumentId: docId,
        evidenceText: `Traditional Bodo Agor motif: ${m.name} (${m.nativeName}). ${m.desc}.`,
        createdAt: 1730000000000,
      });

      this.addEdge({
        id: `rel_weav_${m.id}`,
        sourceNodeId: 'proc_weaving',
        targetNodeId: m.id,
        relationship: 'PRODUCES',
        verificationStatus: 'human_verified',
        sourceDocumentId: docId,
        evidenceText: `Weaving produces supplementary weft motif ${m.name}.`,
        createdAt: 1730000000000,
      });
    });

    // 6. Connect 3D Museum Exhibits to Process Nodes
    MUSEUM_EXHIBITS.forEach(ex => {
      let procId: string | null = null;
      if (ex.id.includes('ginning')) procId = 'proc_ginning';
      else if (ex.id.includes('spinning')) procId = 'proc_spinning';
      else if (ex.id.includes('reeling')) procId = 'proc_reeling';
      else if (ex.id.includes('sizing')) procId = 'proc_sizing';
      else if (ex.id.includes('winding')) procId = 'proc_winding';
      else if (ex.id.includes('warp')) procId = 'proc_warping';
      else if (ex.id.includes('beaming')) procId = 'proc_beaming';
      else if (ex.id.includes('looming')) procId = 'proc_looming';
      else if (ex.id.includes('loom') || ex.id.includes('textile')) procId = 'proc_weaving';

      this.addNode({
        id: `exhibit_${ex.id}`,
        type: 'Exhibit',
        name: ex.name,
        nativeName: ex.nativeName,
        properties: {
          galleryId: ex.galleryId,
          position: ex.position,
          modelType: ex.modelType,
          culturalSignificance: ex.culturalSignificance,
        },
        verificationStatus: 'human_verified',
        sourceDocumentId: docId,
        evidenceText: `3D Museum physical exhibit: ${ex.name} at coordinates [${ex.position.join(', ')}].`,
        createdAt: 1730000000000,
      });

      if (procId) {
        this.addEdge({
          id: `exrel_${procId}_${ex.id}`,
          sourceNodeId: procId,
          targetNodeId: `exhibit_${ex.id}`,
          relationship: 'REPRESENTED_BY_EXHIBIT',
          verificationStatus: 'human_verified',
          sourceDocumentId: docId,
          evidenceText: `${procId} is represented in the 3D VR gallery by ${ex.name}.`,
          createdAt: 1730000000000,
        });
      }
    });
  }

  /**
   * Multi-hop entity graph traversal
   */
  public getNeighborhood(nodeId: string, maxHops = 1): { nodes: GraphNode[]; edges: GraphEdge[] } {
    const visitedNodes = new Set<string>();
    const collectedEdges = new Set<string>();
    const queue: { id: string; depth: number }[] = [{ id: nodeId, depth: 0 }];

    visitedNodes.add(nodeId);

    while (queue.length > 0) {
      const { id, depth } = queue.shift()!;
      if (depth >= maxHops) continue;

      const outEdgeIds = this.outgoingEdges.get(id) || [];
      const inEdgeIds = this.incomingEdges.get(id) || [];

      for (const eId of [...outEdgeIds, ...inEdgeIds]) {
        collectedEdges.add(eId);
        const edge = this.edges.get(eId);
        if (!edge) continue;

        const neighborId = edge.sourceNodeId === id ? edge.targetNodeId : edge.sourceNodeId;
        if (!visitedNodes.has(neighborId)) {
          visitedNodes.add(neighborId);
          queue.push({ id: neighborId, depth: depth + 1 });
        }
      }
    }

    const resultNodes = Array.from(visitedNodes).map(id => this.nodes.get(id)!).filter(Boolean);
    const resultEdges = Array.from(collectedEdges).map(id => this.edges.get(id)!).filter(Boolean);

    return { nodes: resultNodes, edges: resultEdges };
  }

  /**
   * Parameterized search: find tools and materials by process ID
   */
  public getProcessDetails(processId: string): {
    process?: GraphNode;
    tools: GraphNode[];
    materials: GraphNode[];
    nextProcess?: GraphNode;
    previousProcess?: GraphNode;
    exhibit?: GraphNode;
  } {
    const pNodeId = processId.startsWith('proc_') ? processId : `proc_${processId}`;
    const process = this.nodes.get(pNodeId);
    if (!process) {
      return { tools: [], materials: [] };
    }

    const tools: GraphNode[] = [];
    const materials: GraphNode[] = [];
    let nextProcess: GraphNode | undefined;
    let previousProcess: GraphNode | undefined;
    let exhibit: GraphNode | undefined;

    const outEdgeIds = this.outgoingEdges.get(pNodeId) || [];
    for (const eId of outEdgeIds) {
      const edge = this.edges.get(eId);
      if (!edge) continue;
      const target = this.nodes.get(edge.targetNodeId);
      if (!target) continue;

      if (edge.relationship === 'USES_TOOL') tools.push(target);
      if (edge.relationship === 'USES_MATERIAL') materials.push(target);
      if (edge.relationship === 'FOLLOWED_BY') nextProcess = target;
      if (edge.relationship === 'REPRESENTED_BY_EXHIBIT') exhibit = target;
    }

    const inEdgeIds = this.incomingEdges.get(pNodeId) || [];
    for (const eId of inEdgeIds) {
      const edge = this.edges.get(eId);
      if (!edge) continue;
      if (edge.relationship === 'FOLLOWED_BY') {
        previousProcess = this.nodes.get(edge.sourceNodeId);
      }
    }

    return { process, tools, materials, nextProcess, previousProcess, exhibit };
  }

  /**
   * Graph entity keyword search with multi-hop retrieval
   */
  public queryGraph(query: string): { nodes: GraphNode[]; edges: GraphEdge[]; relevanceScore: number } {
    const lower = query.toLowerCase();
    const matchedNodeIds = new Set<string>();

    for (const [id, node] of this.nodes.entries()) {
      const nameLower = node.name.toLowerCase();
      const nativeLower = (node.nativeName || '').toLowerCase();

      if (lower.includes(nameLower) || (nativeLower && lower.includes(nativeLower))) {
        matchedNodeIds.add(id);
      }

      // Synonyms and domain mapping
      if (id === 'proc_ginning' && (lower.includes('seed') || lower.includes('dirt') || lower.includes('roller'))) {
        matchedNodeIds.add(id);
      }
      if (id === 'proc_spinning' && (lower.includes('yarn') || lower.includes('takhri') || lower.includes('spindle'))) {
        matchedNodeIds.add(id);
      }
      if (id === 'proc_reeling' && (lower.includes('cocoon') || lower.includes('steamed') || lower.includes('tharai'))) {
        matchedNodeIds.add(id);
      }
      if (id === 'proc_sizing' && (lower.includes('rice powder') || lower.includes('wheat flour') || lower.includes('maidi') || lower.includes('starch'))) {
        matchedNodeIds.add(id);
      }
      if (id === 'proc_looming' && (lower.includes('baleb') || lower.includes('drafting') || lower.includes('denting') || lower.includes('posts on the floor'))) {
        matchedNodeIds.add(id);
      }
      if (id === 'proc_weaving' && (lower.includes('sal') || lower.includes('shuttle') || lower.includes('long does it take') || lower.includes('days'))) {
        matchedNodeIds.add(id);
      }
      if (id === 'proc_warping' && (lower.includes('warp') || lower.includes('length') || lower.includes('order'))) {
        matchedNodeIds.add(id);
      }
      if (id === 'proc_beaming' && (lower.includes('beam') || lower.includes('gandwi') || lower.includes('tension'))) {
        matchedNodeIds.add(id);
      }
      if (id === 'proc_winding' && (lower.includes('wind') || lower.includes('bobbin') || lower.includes('pirn'))) {
        matchedNodeIds.add(id);
      }
    }

    // Direct multi-concept domain triggers
    if (lower.includes('motif') || lower.includes('agor') || lower.includes('pattern') || lower.includes('design')) {
      matchedNodeIds.add('motif_hajw_agor');
      matchedNodeIds.add('motif_daorai_mwkhrwb');
      matchedNodeIds.add('motif_phul_agor');
      matchedNodeIds.add('proc_weaving');
    }

    if (
      lower.includes('stage') ||
      lower.includes('stages') ||
      lower.includes('connected') ||
      lower.includes('connection') ||
      lower.includes('order') ||
      lower.includes('sequence') ||
      lower.includes('lineage')
    ) {
      matchedNodeIds.add('proc_ginning');
      matchedNodeIds.add('proc_spinning');
      matchedNodeIds.add('proc_reeling');
      matchedNodeIds.add('proc_sizing');
      matchedNodeIds.add('proc_winding');
      matchedNodeIds.add('proc_warping');
      matchedNodeIds.add('proc_beaming');
      matchedNodeIds.add('proc_looming');
      matchedNodeIds.add('proc_weaving');
    }

    if (lower.includes('tools are used in weaving') || (lower.includes('tool') && lower.includes('weaving'))) {
      matchedNodeIds.add('proc_weaving');
      matchedNodeIds.add('tool_sal');
      matchedNodeIds.add('tool_thati_sal');
      matchedNodeIds.add('tool_maku');
      matchedNodeIds.add('tool_baleb');
      matchedNodeIds.add('tool_rashw');
      matchedNodeIds.add('tool_chontha');
    }

    const allResultNodes = new Map<string, GraphNode>();
    const allResultEdges = new Map<string, GraphEdge>();

    for (const startId of matchedNodeIds) {
      const { nodes, edges } = this.getNeighborhood(startId, 1);
      nodes.forEach(n => allResultNodes.set(n.id, n));
      edges.forEach(e => allResultEdges.set(e.id, e));
    }

    const relevanceScore = matchedNodeIds.size > 0 ? Math.min(matchedNodeIds.size * 2.5, 10) : 0;

    return {
      nodes: Array.from(allResultNodes.values()),
      edges: Array.from(allResultEdges.values()),
      relevanceScore,
    };
  }
}

export const graphStore = new GraphStore();
