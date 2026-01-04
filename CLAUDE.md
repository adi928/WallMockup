# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
npm run dev      # Start Vite dev server
npm run build    # Production build to /dist
npm run preview  # Preview production build
```

No test or lint commands are configured.

## Architecture

Wall Mockup Tool - a React + Vite SPA for visualizing paintings on walls at accurate real-world scale.

### State Management

All state is centralized in `App.jsx` using React hooks:
- `wall` - Wall image and dimensions (pixel + real-world measurements)
- `paintings` - Array of painting objects with position, dimensions, and frame style
- `currentProjectId` - Active project for IndexedDB persistence

### Component Structure

**Sidebar (form inputs):**
- `WallSetup.jsx` - Wall image upload and dimension input
- `PaintingUpload.jsx` - Painting image upload with frame style selection (8 frame types)
- `ProjectManager.jsx` - Save/load/delete/export/import projects

**Canvas (visualization):**
- `WallCanvas.jsx` - Canvas container with zoom controls (5%-150%)
- `DraggablePainting.jsx` - Draggable painting with mouse event handlers and bounds checking

### Utilities

- `scaleUtils.js` - Pixel-to-inch conversion based on wall dimensions
- `projectDb.js` - IndexedDB wrapper (database: `WallMockupDB`, store: `projects`)

### Data Persistence

Projects are stored in IndexedDB. Images are serialized to base64 for storage and converted back to blob URLs when loaded.

### Styling

Single CSS file (`App.css`) with no CSS variables. Mobile breakpoint at 900px.
