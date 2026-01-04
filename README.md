# Wall Mockup Tool

A React web application for visualizing paintings and artwork on walls at accurate real-world scale. Upload a photo of your wall, specify its dimensions, and place artwork to see exactly how it will look before hanging.

## Features

- **Accurate scaling** - Enter real-world wall dimensions for true-to-life artwork sizing
- **Drag and drop** - Position artwork anywhere on your wall
- **Frame styles** - Choose from 8 frame options (Modern Black/White, Classic Gold/Silver, Rustic/Dark Wood, Gallery Float, No Frame)
- **Zoom controls** - View at 5%-150% zoom with fit-to-screen option
- **Project management** - Save, load, and delete projects stored locally in your browser
- **Import/Export** - Share projects as JSON files

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Opens the app at `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

## Usage

1. **Set up your wall** - Upload a wall photo and enter its width and height in inches
2. **Add paintings** - Upload artwork images with their dimensions and select a frame style
3. **Arrange** - Drag paintings to position them on the wall
4. **Save** - Save your project to return to it later

## Tech Stack

- React 18
- Vite
- IndexedDB (browser storage)
