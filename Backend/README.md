# Multimodal Agentic AI Framework for Virtual Reality Museum Navigation

An interactive WebGL/Three.js Virtual Reality museum navigation and multimodal AI cultural docent system celebrating the indigenous handloom and sericulture heritage of the Bodo people of Assam.

## Key Features

1. **3D Virtual Reality Museum Navigation**:
   - Four thematic exhibition galleries with realistic architectural staging, custom spotlights, and spatial waypoints:
     - Gallery 1: Sericulture & Raw Fibers (Eri silkworm, Castor/Kesseru foodplants, Neotha cotton ginning)
     - Gallery 2: Spinning & Sizing Workshop (Zenther spinning wheel, Maidi rice starch sizing, Swrkhi bobbin winder)
     - Gallery 3: Loom Engineering & Warping Pavilion (Ji Swngnai warping creel, Weaver's beam with Phannai fastening, Baleb lease rods & Nw Hasung heald pipe)
     - Gallery 4: Master Weaving Sanctuary & Textiles (Traditional Sal throw-shuttle loom, Thati Sal fly-shuttle loom, Ceremonial Aronai scarf, and Dokhona attire)
   - Dual-eye stereoscopic VR mode simulation for immersive headsets / Google Cardboard.
   - Interactive 3D raycasting: click pedestals to examine artifacts, inspect dimensions, and trigger audio narration.

2. **Multimodal Agentic AI Docent ("Aronai AI")**:
   - Voice interaction via Web Speech API (speech recognition and synthesis).
   - Agentic tool calling:
     - `navigate_to_exhibit(gallery_id, exhibit_id)`
     - `retrieve_knowledge_chunk(query, concept)`
     - `run_retrieval_benchmark()`
     - `synthesize_audio_guide(text)`
   - Displays real-time reasoning and retrieval traces.

3. **Open Knowledge Framework (OKF) Repository**:
   - Interactive explorer covering all 9 verified traditional Bodo handloom processes:
     - Ginning (*Neotha hwnai*)
     - Spinning (*Khundung thunnai*)
     - Reeling (*Kwfwnai*)
     - Sizing (*Maidi hwnai*)
     - Warping (*Ji Swngnai*)
     - Winding (*Phira thunnai*)
     - Beaming (*Phannai*)
     - Looming (*Nw khonnai & Khainai*)
     - Weaving (*Daonai - Sal & Thati sal*)
   - Toggle between structured process cards and raw validated OKF markdown.

4. **Retrieval & Embedding Benchmark Suite**:
   - Executes the 15 evaluation queries from the original benchmark.
   - Live scoring, Top-1 accuracy metrics, and interactive custom query sandbox.

5. **Ingestion & Registry Visualizer**:
   - 6-stage pipeline architecture visualization from raw document extraction to LangChain recursive chunking.
   - Document manifest registry reflecting `document_manifest.json` UUIDs and SHA-256 hashes.

## Tech Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion
- **3D Engine**: Three.js (WebGL rendering, directional spotlights, shadows, procedural artifact models)
- **Audio & Speech**: Web Speech API (SpeechRecognition & SpeechSynthesis)
- **Build System**: Vite 6, served on port 3000
