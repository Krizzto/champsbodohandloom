# Cultural Heritage & Research PDF Document Repository

This directory (`/pdf/`) serves as the dedicated repository for academic papers, ethnographic field manuals, botanical dye extraction guides, and project defense documentation for the **Bodo Handloom Cultural Heritage Digital Platform**.

---

## 1. Generated Project Architecture & Defense Guide

- **Compiled PDF**: [`Bodo_Heritage_Platform_Complete_Architecture_and_Research_Defense_Guide.pdf`](./Bodo_Heritage_Platform_Complete_Architecture_and_Research_Defense_Guide.pdf)  
  *Directly downloadable or accessible via the browser at `/pdf/Bodo_Heritage_Platform_Complete_Architecture_and_Research_Defense_Guide.pdf`*.
- **Full Markdown Master Analysis**: [`BODO_HERITAGE_SYSTEM_AND_RESEARCH_GUIDE.md`](./BODO_HERITAGE_SYSTEM_AND_RESEARCH_GUIDE.md)  
  *Exhaustive 12-section technical and research breakdown matching IEEE / ACM conference formatting guidelines.*
- **PDF Compiler Script**: [`generate_pdf.py`](./generate_pdf.py)  
  *Automated Python/Ghostscript compilation utility to regenerate the PDF at any time.*

---

## 2. Recommended PDF Taxonomy & Document Organization

When uploading external research papers, botanical dye manuals, and field interview transcripts for document extraction and future RAG indexing, organize them into these specialized subdirectories:

```
pdf/
├── Bodo_Heritage_Platform_Complete_Architecture_and_Research_Defense_Guide.pdf
├── BODO_HERITAGE_SYSTEM_AND_RESEARCH_GUIDE.md
├── generate_pdf.py
├── README.md
│
├── research/           # Published academic papers, ethnographic surveys, linguistic studies
├── dyeing/             # Botanical dye recipes, plant extraction manuals, mordanting records
├── motifs/             # Geometric Agor diagrams, mathematical weaving drafts, symbolic lexicons
├── weavers/            # Master weaver biographies, field interview transcripts, guild records
└── extractions/        # Structured JSON / OKF representations extracted from raw PDF documents
```

### Folder Purposes:
1. **`/pdf/research/`**:
   - Scholarly literature on Sino-Tibetan and Bodo textile traditions.
   - Comparative studies on Bodo vs. Mising vs. Karbi extra-weft weaving traditions.
2. **`/pdf/dyeing/`**:
   - Laboratory protocols and indigenous knowledge regarding turmeric (*Haldi*), madder root, wild indigo, and alum (*Fitkaari*) mordants.
   - Temperature, pH, and boiling duration parameters for Ahimsa Eri silk dyeing.
3. **`/pdf/motifs/`**:
   - High-resolution scans and vector drafts of sacred *Agor* motifs (*Hajw Agor*, *Daorai Agor*, *Phul Agor*, *Dingkhia Agor*).
   - Spatial symmetry group classifications (frieze and wallpaper symmetry groups).
4. **`/pdf/weavers/`**:
   - Transcripts of oral histories and audio recordings collected from master weavers across Kokrajhar, Chirang, Baksa, and Udalguri districts.
5. **`/pdf/extractions/`**:
   - Intermediate structured knowledge representations (e.g. Open Knowledge Framework JSON-LD) generated during document parsing.
