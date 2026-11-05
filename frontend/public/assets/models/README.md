# Bodo Heritage Village & Museum — 3D Asset Directory

This directory stores 3D models (`.glb` and `.gltf`) for authentic Bodo cultural artifacts, traditional handlooms, weaving tools, and village exhibits.

## Directory Structure

```text
public/assets/models/
├── artifacts/    # Preserved garments & masterpieces (e.g. dokhona.glb, aronai.glb)
├── looms/        # Traditional Bodo throw-shuttle frame looms & parts (e.g. bodo-loom.glb)
├── tools/        # Weaving implements (e.g. maku.glb, khabang.glb, takli.glb)
└── other/        # Musical instruments & household utensils (e.g. serja.glb, sifung.glb)
```

## Supported 3D Formats

- **Format:** Binary glTF (`.glb`) is strongly recommended for optimized network loading and texture bundling.
- **Alternative:** Standard glTF (`.gltf` with embedded or companion buffers).
- **Coordinate System:** Y-up, scale in meters (1 unit = 1 meter).
- **Target Polycount:** 10,000 to 50,000 triangles for smooth 60fps mobile exploration and WebXR AR viewing.
- **PBR Textures:** Embedded BaseColor, Roughness/Metallic, Normal map (maximum 2048x2048).

## How to Add Your Own 3D Models

### Method 1: In-App Browser Upload (No Code Required)
1. Launch the application and enter the **Bodo Heritage Village** (click **ENTER HERITAGE VILLAGE**).
2. Click the yellow **`+ ADD 3D OBJECT`** button in the top HUD bar.
3. Choose your `.glb` or `.gltf` file from your computer.
4. Select which Heritage Area to place it in:
   - **Traditional Homestead (No-Mano)**
   - **Handloom Workshop (Sal-Ghor)**
   - **Textile Gallery (Dokhona Pavilion)**
   - **Tools & Materials Compound**
   - **Motif & Dyeing Exhibition**
   - **Custom Village Coordinates**
5. Adjust position, rotation, and scale with the real-time sliders.
6. Click **Place in Heritage Village**. The model is saved to IndexedDB and renders in 3D on a dedicated exhibit pedestal.

### Method 2: Static Code Placement (Permanent Assets)
1. Place your `.glb` file inside the appropriate directory:
   - e.g. `public/assets/models/tools/my_shuttle.glb`
2. In `frontend/src/data/museumData.ts` (or `frontend/src/data/artifacts.ts`), set:
   ```typescript
   modelUrl: '/assets/models/tools/my_shuttle.glb'
   ```
3. The model will automatically load inside the village exhibit pedestal, the 360° orbital 3D viewer, and the mobile AR viewer.
