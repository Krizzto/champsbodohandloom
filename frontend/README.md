# Bodo Handloom Museum — Frontend

This directory contains the entire frontend website, 3D WebXR museum, and interactive cultural knowledge interface.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
The app runs on `http://localhost:3000`.

### 3. Build Production Bundle
```bash
npm run build
```

---

## 📁 Project Structure

```text
frontend/
├── public/
│   └── assets/
│       ├── images/          ← Centralized user-replaceable photographs
│       │   ├── hero/        ← Hero banner photographs
│       │   ├── about/       ← Exactly 5 uploadable About photos (about-1 to about-5)
│       │   ├── aronai/      ← Ceremonial Aronai scarf images
│       │   ├── handloom/    ← Traditional Sal loom photographs
│       │   ├── weaving/     ← Weaving detail & yarn photos
│       │   ├── tools/       ← Shuttles, bobbins, ginning tools
│       │   ├── textiles/    ← Dokhona, Aronai, Eri silk garments
│       │   ├── motifs/      ← Agor pattern photographs
│       │   ├── cultural/    ← Community practices & festivals
│       │   ├── people/      ← Master weavers & ethnographic elders
│       │   ├── process/     ← Step-by-step thread journey photos
│       │   └── ui/          ← Patterns and decorative icons
│       │
│       ├── models/          ← 3D WebGL / WebXR models (.glb / .gltf)
│       │   ├── tools/       ← Maku shuttle, bobbin winder, cotton gin
│       │   ├── looms/       ← Traditional Bodo frame loom
│       │   ├── artifacts/   ← Dokhona, Aronai, Eri cocoon
│       │   └── other/       ← Dye pots, cane baskets
│       │
│       ├── audio/           ← Field oral recordings & weaver interviews
│       └── video/           ← Craft documentary footage
│
├── src/
│   ├── components/          ← Modular React UI components
│   │   ├── layout/          ← Navbar, Header, PageContainer, MobileMenu
│   │   ├── ui/              ← HeritageImage, Button, Modal, Card, Tabs
│   │   ├── home/            ← Hero, Introduction, FeaturedArtifacts
│   │   ├── museum/          ← ArtifactGrid, ArtifactCard, CategoryFilter
│   │   ├── three/           ← ModelViewer, ModelControls, ModelLoader
│   │   ├── explore/         ← ProcessTimeline, CulturalMap
│   │   ├── ai/              ← Cultural Knowledge Assistant Drawer
│   │   └── arvr/            ← WebXR AR & VR museum gateways
│   │
│   ├── data/                ← Editable cultural data & registries
│   │   ├── siteImages.ts    ← Centralized image registry (hero, about, aronai)
│   │   ├── artifacts.ts     ← Museum catalog items, accession numbers, GLB references
│   │   ├── categories.ts    ← Textile, tools, looms, dyeing categories
│   │   ├── processes.ts     ← 9 stages of handloom lineage
│   │   ├── culturalData.ts  ← Historical context and regional knowledge
│   │   ├── motifs.ts        ← Sacred Agor geometric patterns
│   │   ├── dyeing.ts        ← Botanical dyeing ingredients & recipes
│   │   ├── weavers.ts       ← Living master artisan profiles & quotes
│   │   └── navigation.ts    ← Header and footer link definitions
│   │
│   ├── styles/
│   │   ├── fonts.css        ← Central typography configuration (--font-display, --font-heading, --font-body)
│   │   ├── index.css        ← Global Tailwind CSS & custom highlight styles
│   │   └── animations.css   ← Cultural ambient and shuttle animations
│   │
│   ├── services/
│   │   └── api.ts           ← Future backend integration boundary
│   │
│   ├── store/               ← Zustand stores (museumStore, contentStore)
│   ├── types/               ← TypeScript cultural interfaces
│   ├── App.tsx              ← Root application component
│   └── main.tsx             ← React entry point
│
├── index.html               ← HTML entry point with cultural SEO meta tags
├── vite.config.ts           ← Vite build and development configuration
├── tsconfig.json            ← TypeScript configuration
└── README.md                ← Frontend documentation
```

---

## 🖼️ How to Replace Images

All website photos reside inside:
```text
frontend/public/assets/images/
```

- **About Section (5 Slots)**:
  Drop your photos into:
  - `frontend/public/assets/images/about/about-1.jpg`
  - `frontend/public/assets/images/about/about-2.jpg`
  - `frontend/public/assets/images/about/about-3.jpg`
  - `frontend/public/assets/images/about/about-4.jpg`
  - `frontend/public/assets/images/about/about-5.jpg`
  *(Supports `.jpg`, `.jpeg`, `.png`, and `.webp`)*
  The website will immediately reflect the new images upon refreshing.

- **Hero Banner**:
  Place `hero-main.jpg` in `frontend/public/assets/images/hero/`.

- **Aronai Photos**:
  Place `aronai-left.jpg` and `aronai-right.jpg` in `frontend/public/assets/images/aronai/`.

---

## 🧊 How to Replace 3D Models (.glb)

All 3D models reside inside:
```text
frontend/public/assets/models/
```
- Tools: `frontend/public/assets/models/tools/maku.glb`, `khabang.glb`, `zenther.glb`
- Looms: `frontend/public/assets/models/looms/traditional-loom.glb`
- Artifacts: `frontend/public/assets/models/artifacts/dokhona.glb`, `aronai.glb`

---

## ✍️ How to Edit Typography

The entire website typography is managed in one central location:
```text
frontend/src/styles/fonts.css
```
Edit the top CSS variables:
```css
:root {
  --font-display: "Merriweather", Georgia, serif;
  --font-heading: "Cormorant Garamond", Georgia, serif;
  --font-body: "Plus Jakarta Sans", sans-serif;
  --font-mono: monospace;
}
```

---

## 🔌 Future Backend Integration

The integration boundary for connecting to future backend services is defined in:
```text
frontend/src/services/api.ts
```
When your backend and RAG services are ready, connect `api.ts` to your endpoints.
