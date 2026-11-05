# Bodo Handloom Cultural Heritage Digital Platform
## Authoritative Engineering Architecture, System Specification & Academic Defense Guide

> **Document Classification**: Master Engineering Specification & Final-Year BTech Thesis Reference  
> **Author Roles**: Senior Software Engineer, Senior AI/LLM Engineer, Research Professor & Technical Mentor  
> **Repository**: `bodo-handloom-museum`  
> **Compiled Artifacts**: Available in `/pdf/` as both Markdown and compiled PDF (`Bodo_Heritage_Platform_Complete_Architecture_and_Research_Defense_Guide.pdf`)

---

## 1. Executive Summary & Codebase Reality Check

### 1.1 The Objective
The project preserves, catalogs, and presents the indigenous handloom heritage of the Bodo community of Bodoland/Assam, Northeast India. This includes:
- **Sacred Agor Motifs**: Geometric mathematical extra-weft patterns (*Hajw*, *Daorai*, *Dingkhia*, *Muphur Apha*).
- **Ahimsa Eri Silk**: Eco-conscious sericulture where the pupa emerges naturally without being boiled alive.
- **Botanical Dye Formulations**: Organic extraction workflows utilizing madder root, wild turmeric, indigo, and alum (*Fitkaari*) mordants.
- **Interactive 3D Virtual Village & AR**: WebGL Three.js spatial gallery allowing walk-through exploration, artifact inspection, and custom 3D model insertion/transformation.

### 1.2 Truthful Reality Check (Crucial for Final-Year Defense)
To prevent disqualification or embarrassment during academic defense, understand the **current implementation state**:
1. **Frontend**: **Fully Implemented and Production-Grade**.
   - Built on React 19, TypeScript, Vite, Tailwind CSS v4, and Three.js.
   - Complete UI components for Agor motifs, botanical dyeing stages, master weaver profiles, 3D artifact viewers, and an in-browser visual CMS (`/editor`).
   - Interactive Three.js virtual village with 6 cultural zones, asset insertion, scale/position/rotation gizmo controls, and LocalStorage/IndexedDB persistence.
2. **AI & Backend Integration**: **Architectural Contract (Stubbed / Pending)**.
   - There are **no Python files, no LangChain/LangGraph pipelines, no vector databases (Chroma/Pinecone), and no running neural models** currently in the repository.
   - `frontend/src/services/api.ts` explicitly defines the `AIQueryRequest` and `AIQueryResponse` TypeScript interfaces and deliberately throws an error: `"Backend integration will be implemented by the project team."`
   - `frontend/src/components/ai/ChatPanel.tsx` captures user queries, expertise levels (Basic, Intermediate, Advanced, Expert), and displays a clean educational card informing the visitor that backend connection is pending.
3. **Implication for Your BTech Project**:
   - The frontend and 3D visual museum represent the completed foundation.
   - Your primary contribution as an AI engineer is to build the Python/FastAPI backend, document ingestion pipeline, hybrid retriever, and LangGraph multi-agent answer generation service.

---

## 2. File-by-File Technical Breakdown

### 2.1 Configuration and Server Entrypoints
- `server.ts`:
  - **Purpose**: Zero-dependency Node.js production HTTP server.
  - **Function**: Binds to `0.0.0.0` and `process.env.PORT || 3000`. Serves static files from `dist/` or `frontend/dist/`, responds to Cloud Run health checks (`/api/health`, `/healthz`), and implements SPA routing fallback to `index.html`.
- `package.json` & `frontend/package.json`:
  - **Purpose**: Workspace dependency manifests.
  - **Scripts**: `"dev"`, `"build"`, `"start"`, `"preview"`, `"lint"`.
- `frontend/vite.config.ts`:
  - **Purpose**: Vite 8 bundler configuration with `@tailwindcss/vite` and React plugin.

### 2.2 Core Application Lifecycle & State Management
- `frontend/src/main.tsx`:
  - **Purpose**: DOM mounting point via `createRoot(document.getElementById('root')!)`.
- `frontend/src/App.tsx`:
  - **Purpose**: Central layout coordinator.
  - **Function**: Coordinates the Hero, About, Motif Collection, Dyeing Section, Weaver Section, Museum Grid, AR/VR Modals, and the AI Chat Drawer.
- `frontend/src/store/museumStore.ts`:
  - **Purpose**: Zustand reactive store managing active modal states, selected 3D artifact, search query, category filters, and active tab navigation.
- `frontend/src/store/contentStore.ts`:
  - **Purpose**: In-browser Content Management System (CMS) store.
  - **Function**: Persists custom-edited text and uploaded images in browser `localStorage`.
- `frontend/src/store/villageObjectStore.ts`:
  - **Purpose**: State manager for user-inserted 3D objects in the virtual village.
  - **Function**: Stores object ID, model URL, name, target area, position `[x,y,z]`, rotation `[x,y,z]`, and scale `[x,y,z]`.

### 2.3 AI & Boundary Layer
- `frontend/src/services/api.ts`:
  - **Purpose**: Strict interface contract between frontend and future AI service.
  - **Interface**:
    ```typescript
    export interface AIQueryRequest {
      query: string;
      expertise: 'basic' | 'intermediate' | 'advanced' | 'expert';
    }
    export interface AIQueryResponse {
      answer: string;
      sources?: string[];
      metadata?: Record<string, unknown>;
    }
    ```
- `frontend/src/components/ai/ChatPanel.tsx`:
  - **Purpose**: Interactive chat panel with expertise selector, suggested questions, and developer contract drawer.

### 2.4 Three.js 3D Virtual Village
- `frontend/src/components/3d/VRMuseumModal.tsx`:
  - **Purpose**: Fullscreen WebGL 3D museum environment.
  - **Features**: First-person WASD walking controls, mouse look, collision detection, mini-map, zone teleportation, and custom object selection.
- `frontend/src/components/3d/village/VillageBuilder.ts`:
  - **Purpose**: Procedural construction of the 6 cultural zones (Entrance Gate, Homestead, Loom Workshop, Textile Gallery, Tools Area, Dyeing Area).
- `frontend/src/components/3d/village/Insert3DObjectModal.tsx`:
  - **Purpose**: In-browser `.glb` and `.gltf` model uploader with live 3D preview, metadata tagging, and area placement.

---

## 3. The Future AI & RAG Pipeline (Design & Implementation Plan)

As the student responsible for the AI/RAG system, here is the complete architectural roadmap for the Python backend:

### 3.1 Document Ingestion & Chunking
1. **Document Corpus**:
   - Academic monographs on Bodo textiles.
   - Field notes on botanical dyeing chemistry.
   - Oral interviews of master weavers.
2. **Chunking Strategy**:
   - **Semantic Chunking**: Instead of naive character chunking (e.g. 500 chars), chunk by cultural entities (e.g., each motif definition or each dye preparation step is preserved as an atomic unit).
   - **Metadata Enrichment**: Tag every chunk with `chunk_id`, `source_document`, `cultural_category` (`motif`, `dye`, `tool`, `weaver`), `bodo_terms_present` (`["Dokhona", "Hajw Agor"]`), and `content_hash`.

### 3.2 Hybrid Retrieval Architecture (BM25 + Dense Vectors)
- **Why Hybrid is Mandatory**:
  - Dense embedding models (e.g. `text-embedding-3`, `bge-base`, `sentence-transformers`) collapse on rare Sino-Tibetan terms like *Dokhona Thaosi*, *Aronai*, *Zenther*, *Maku*, *Siju*.
  - BM25 provides **exact lexical matching** on indigenous terms.
  - Dense retrieval provides **semantic generalization** (e.g., matching "natural yellow coloring" to "turmeric rhizome infusion").
- **Reciprocal Rank Fusion (RRF)**:
  $$RRF\_Score(d) = \frac{1}{k + rank_{BM25}(d)} + \frac{1}{k + rank_{Dense}(d)}$$
  (Typically $k = 60$).

### 3.3 GraphRAG Foundation
- **Knowledge Graph Schema**:
  - `(Weaver:Person)-[:WEAVES]->(Motif:Pattern)`
  - `(Motif:Pattern)-[:ORNAMENTS]->(Textile:Product)`
  - `(Textile:Product)-[:COLORED_WITH]->(Dye:BotanicalPlant)`
  - `(Dye:BotanicalPlant)-[:REQUIRES_MORDANT]->(Chemical:Substance)`
- **Multi-Hop Query Reasoning**:
  - Allows answering complex relational questions that single document chunks cannot solve:
    *"Which botanical dyes used in Dokhona Thaosi are traditionally prepared using alum mordant?"*

---

## 4. Academic Research Gaps & Novelty

To publish a paper or achieve high marks in your final-year project, frame your work around these three clear research contributions:

1. **Research Gap 1: Lexical Preservation in Low-Resource Indigenous Domains**
   - *Problem*: Pretrained transformer embeddings fail on rare Bodo terms due to out-of-vocabulary subword tokenization fragmentation.
   - *Hypothesis*: A hybrid BM25 + Dense pipeline with domain-specific synonym expansion significantly outperforms standard dense retrieval on Bodo heritage QA.
2. **Research Gap 2: Persona-Conditioned RAG Generation**
   - *Problem*: Generic LLM outputs either oversimplify cultural techniques for researchers or overwhelm schoolchildren with academic terminology.
   - *Hypothesis*: Conditioning the generation agent on explicit expertise levels (`basic`, `intermediate`, `advanced`, `expert`) preserves factual faithfulness while tailoring lexical complexity.
3. **Research Gap 3: Multi-Hop Retrieval via Entity-Centric Graph Traversals**
   - *Problem*: Traditional chunk-based RAG retrieves disjoint fragments that miss transitive cultural connections between weavers, motifs, and dyeing plants.
   - *Hypothesis*: Combining dense vector retrieval with knowledge graph path traversal yields higher faithfulness and complete answers on compound cultural queries.

---

## 5. Evaluation Methodology & Metrics

To defend your work quantitatively, employ the **RAG Triad** framework:

| Metric | Definition | How to Measure |
|---|---|---|
| **Context Relevance** | Are the retrieved chunks relevant to the user query? | Precision@K, Recall@K, Mean Reciprocal Rank (MRR) |
| **Groundedness / Faithfulness** | Is every claim in the LLM answer supported by retrieved evidence? | Fraction of answer claims verifiable in retrieved context (0.0 to 1.0) |
| **Answer Relevance** | Does the answer directly address the user's intent? | Embedding cosine similarity between user query and answer |

---

## 6. Viva Voce Defense Q&A Sheet

### Question 1: "Where is the backend currently located?"
**Answer**:
> "The current repository is an authoritative frontend-first digital museum and WebGL 3D cultural platform. The backend service and AI retrieval orchestrator are architecturally decoupled and defined via the `AIQueryRequest` and `AIQueryResponse` contracts in `frontend/src/services/api.ts`. This separation of concerns allowed us to build and validate the user experience, in-browser CMS, and 3D village independently before connecting the compute-intensive Python/FastAPI LangGraph backend."

### Question 2: "Why can't you just use standard ChatGPT or Gemini API directly?"
**Answer**:
> "Commercial general-purpose LLMs have severe hallucination rates and little to no training data on indigenous Bodo handloom heritage, sacred Agor geometric grammar, and oral artisan histories. Direct LLM calls produce fabricated or generic Assamese cultural summaries. Our proposed RAG architecture grounds all generation strictly in verified field documentation, recorded weaver transcripts, and botanical dye extraction records."

### Question 3: "Why did you build procedural 3D models and an in-browser asset manager?"
**Answer**:
> "High-fidelity photogrammetry 3D scans of traditional looms can be tens or hundreds of megabytes, creating prohibitive load times for rural or mobile users. We implemented procedural Three.js models for instant 60 FPS WebGL rendering, paired with an in-browser GLB/GLTF model uploader that lets curators inject photorealistic assets on demand and persist them in browser IndexedDB."

---

## 7. Folder Reference for Research PDFs

All research papers, botanical manuals, and OKF document extractions should be placed in the `/pdf/` directory:
- `/pdf/research/`: Published anthropological and textile literature.
- `/pdf/dyeing/`: Botanical dye chemistry and extraction logs.
- `/pdf/motifs/`: Sacred geometry diagrams and weaving drafts.
- `/pdf/weavers/`: Recorded interview transcripts.
- `/pdf/extractions/`: Structured JSON/OKF intermediate files.
