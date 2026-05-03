# PickMaster Twin® — Fast Pattern Editor

A browser-based 3D editor for arranging items on PickMaster trays. Supports full import/export of the PickMaster JSON format used by ABB robotics pick-and-place systems.

> **Disclaimer:** This is an independent community tool with no official affiliation with the ABB Group.  
> ABB™ and PickMaster™ are registered trademarks of ABB Asea Brown Boveri Ltd.  
> All data is processed exclusively in your browser — nothing is uploaded to any server.

---

## Features

- **3D viewport** — perspective, top, front and side views with Z-up coordinate system
- **Import / Export** — full round-trip compatible with PickMaster `.json` files
- **Drag & Drop** — drop `.json` files directly onto the viewport
- **Multi-select** — marquee selection, Shift-click, Ctrl+A
- **Drag to move** — move selected items by dragging in the viewport
- **Arrow key movement** — 1 mm steps, 10 mm with Shift
- **Snap to grid** — configurable step size
- **Align & distribute** — 6 alignment options + X/Y distribution
- **Rotate** — ±90° via panel or RX/RY/RZ fields
- **Layers** — multiple Z-layers with visibility toggle and PageUp/Down cycling
- **Undo / Redo** — unlimited history (100 steps)
- **Pattern generator** — fill rows × columns automatically
- **Collision detection** — AABB overlap warning with visual highlight
- **Duplicate order IDs** — detected and highlighted
- **Orientation marker** — stripe on each item showing the +Y ("front") direction
- **Wireframe toggle** — show/hide edge lines
- **Measurement tool** — click two points to measure distance
- **Persistent storage** — auto-saves to IndexedDB; restores on next visit
- **PWA** — installable, works offline
- **Multilingual** — German 🇩🇪 and English 🇬🇧
- **Resizable sidebars** — drag to resize or collapse both panels

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | SvelteKit 2 + Svelte 5 Runes |
| Language | TypeScript |
| 3D | Threlte v8 + Three.js |
| Styling | Tailwind CSS v4 |
| PWA | @vite-pwa/sveltekit |
| Deployment | nginx (static SPA) / Docker |

---

## Getting Started

### Prerequisites

- Node.js ≥ 20
- npm ≥ 10

### Install & Run

```bash
cd tray-editor
npm install --legacy-peer-deps
npm run dev
# → http://localhost:5173
```

### Generate PWA Icons

Run once after cloning, or whenever `static/icons/icon.svg` changes:

```bash
npm install --no-save --legacy-peer-deps sharp
npm run generate-icons
```

### Build

```bash
npm run build
# Static output → ./build/
```

### Type Check

```bash
npm run check
```

---

## Docker

```bash
# Build image (icon generation + compilation happens automatically)
docker build -t pickmaster-twin .

# Run
docker run -p 8080:80 pickmaster-twin
# → http://localhost:8080
```

Two-stage build: Node 20 Alpine (build) → nginx Alpine (serve).

---

## Project Structure

```
src/
├── lib/
│   ├── components/
│   │   ├── panels/          # Sidebar panels (properties, align, layers, …)
│   │   └── viewport/        # 3D viewport (scene, meshes, orbit camera, …)
│   ├── i18n/                # Translations (de.ts, en.ts)
│   ├── io/                  # JSON parse / serialize / IndexedDB / file helpers
│   ├── state/               # Svelte 5 reactive state modules
│   ├── three/               # Three.js helpers (Z-up orbit, item Z coords)
│   ├── types/               # TypeScript types (PickMaster format + editor)
│   └── utils/               # Keyboard shortcuts, debounce
├── routes/
│   └── +page.svelte         # App entry point
static/
├── icons/                   # PWA icons (generated from icon.svg)
├── samples/                 # Demo PickMaster JSON files
└── favicon.svg
scripts/
└── generate-icons.mjs       # PNG icon generator (requires sharp)
```

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `1` / `2` / `3` / `4` | Switch view: 3D · Top · Front · Side |
| `Ctrl+Z` | Undo |
| `Ctrl+Shift+Z` / `Ctrl+Y` | Redo |
| `Ctrl+A` | Select all |
| `Ctrl+D` | Duplicate selection |
| `Del` / `Backspace` | Delete selection |
| `Esc` | Deselect / cancel placement mode |
| `← ↑ → ↓` | Move 1 mm |
| `Shift + ← ↑ → ↓` | Move 10 mm |
| `PageUp` / `PageDown` | Move to higher / lower layer |
| `Ctrl + drag` | Pan camera |
| `Ctrl+Shift + drag` | Rotate camera |
| `Scroll wheel` | Zoom to cursor |

---

## PickMaster JSON Compatibility

Reads and writes the exact JSON structure produced by PickMaster:

- `ContainerModel` — tray with size, appearance and layers
- `LayerModel` — Z-offset layer containing arranged items
- `ArrangedItemModel` — per-item position (X, Y, Z), rotation (RX, RY, RZ) and pick order
- `ItemModel` — item type with size, color and appearance

The export is a lossless round-trip: all fields not managed by the editor are preserved unchanged from the loaded file.

---

## License

MIT
