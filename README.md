# Bodo Handloom & Cultural Heritage VR Museum

A dedicated digital museum, immersive 3D/VR archive, and living knowledge platform preserving the indigenous handloom craftsmanship, sacred Agor motifs, Ahimsa Eri silk lineage, natural botanical dyeing techniques, and oral histories of the Bodo weaving community of Assam, Northeast India.

---

## 🏛️ System Architecture & Project Organization

The repository is modularly structured to keep the complete frontend website isolated in `frontend/`, providing a clean boundary for future service components:

```text
bodo-handloom-museum/
│
├── frontend/        ← Complete website & interactive UI (React, Vite, Three.js, Tailwind)
├── backend/         ← Future API service layer & server routes
├── rag/             ← Future Retrieval-Augmented Generation cultural knowledge pipeline
├── database/        ← Future relational/graph cultural repository
├── models/          ← Future dedicated 3D/AI asset pipelines
└── documentation/   ← Field ethnographic archives & research papers
```

> **Note:** Backend, RAG, and database components will be implemented in future phases. All current active website, 3D visualization, WebXR spatial computation, and UI code resides strictly within `frontend/`.

---

## 🚀 Quick Start (Running Frontend)

### Navigate to Frontend
```bash
cd frontend
```

### Install Dependencies
```bash
npm install
```

### Start Development Server
```bash
npm run dev
```
The application will launch at `http://localhost:3000`.

### Build for Production
```bash
npm run build
```

---

## 📂 Frontend Directory Overview

For complete details on replacing photographs, editing artifact data, updating fonts, or swapping 3D models, see [`frontend/README.md`](./frontend/README.md).
