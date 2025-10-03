# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development History

**Built with Claude Code (Anthropic's AI coding assistant)**

- **Development Time:** ~90 minutes (October 2, 2025, 21:37 - 23:07)
- **Total Commits:** 10+ well-documented commits
- **Lines of Code:** ~6,000+
- **AI Tokens Consumed:** ~100,000+ tokens
- **User Instructions:** ~20+ iterative refinements
- **Files Created:** 30+

This project demonstrates effective human-AI collaboration in software development, achieving in 1.5 hours what traditionally might take days.

**Recent Improvements (October 3, 2025):**
- Fixed React StrictMode blob URL revocation issues
- Optimized mobile UI for better responsiveness
- Improved video player stability and error handling

## Project Overview

A React TypeScript SPA for converting video files to GIFs entirely in the browser using ffmpeg.wasm. Deployable to GitHub Pages with no backend required.

## Tech Stack

- **Framework**: React 18+ with TypeScript
- **Routing**: React Router v6 (use HashRouter for GitHub Pages compatibility)
- **Styling**: TailwindCSS v4 with @tailwindcss/postcss
- **Video Processing**: ffmpeg.wasm (client-side conversion)
- **Build Tool**: Vite

## Development Commands

**Project initialization** (if not already set up):
```bash
npm create vite@latest gif-maker -- --template react-ts
cd gif-maker
npm install
```

**Core dependencies**:
```bash
npm install react-router-dom @ffmpeg/ffmpeg @ffmpeg/util clsx tailwind-merge
npm install -D tailwindcss @tailwindcss/postcss postcss autoprefixer gh-pages
```

**Development**:
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run deploy       # Deploy to GitHub Pages
```

**TailwindCSS v4 setup**:
- Use `@import "tailwindcss";` in CSS files (NOT @tailwind directives)
- PostCSS config uses `@tailwindcss/postcss` plugin
- Config file is optional for v4

## Architecture

### Routing Structure
- `/` - Home page with file upload interface
- `/editor` - Video editor with time selection and GIF generation

Use `HashRouter` instead of `BrowserRouter` for GitHub Pages compatibility.

### Component Hierarchy

**Pages**:
- `Home.tsx` - Landing page with drag-and-drop file uploader
- `Editor.tsx` - Main editor orchestrating video preview, controls, and conversion

**Key Components**:
- `FileUploader.tsx` - Drag-and-drop zone, file validation (MP4, WebM, MOV, AVI), metadata extraction
- `VideoPlayer.tsx` - HTML5 video element with custom controls for precise time selection
- `TimeRangeSelector.tsx` - Dual-handle slider for start/end time, validates duration (<10s recommended)
- `GifGenerator.tsx` - FFmpeg initialization, conversion logic, progress tracking
- `GifPreview.tsx` - Display generated GIF, file size, download functionality

### State Management Pattern

The video file and metadata flow through the application:
1. User uploads file in `Home` page
2. Navigate to `Editor` with file data (via router state or context)
3. `Editor` coordinates between VideoPlayer, TimeRangeSelector, and GifGenerator
4. Generated GIF displayed in GifPreview component

### FFmpeg.wasm Integration

**Critical configuration in `vite.config.ts`**:
```typescript
optimizeDeps: {
  exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/util']
}
```

**FFmpeg implementation pattern**:
- Lazy load FFmpeg only when needed in the Editor page
- Use `useFFmpeg` hook with useCallback to manage FFmpeg instance lifecycle
- Track progress with `ffmpeg.on('progress')` event
- Command structure: `-i input.mp4 -ss START -to END -vf "fps=FPS,scale=WIDTH:-1" output.gif`
- Clean up memory after each conversion
- Convert FileData to Blob: `new Blob([data.buffer as ArrayBuffer], { type: 'image/gif' })`

**Important**: FFmpeg loads from jsDelivr CDN:
```typescript
const baseURL = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/esm';
```

### File Validation & Error Handling

- Validate file types: MP4, WebM, MOV, AVI
- Warn if file size >100MB
- Validate time ranges (start < end, within video duration)
- Handle FFmpeg loading failures gracefully
- Show user-friendly error messages for conversion failures
- Check browser compatibility for required APIs

### Blob URL Management (Important!)

**VideoPlayer Component Pattern**:
The VideoPlayer uses a module-level cache to manage blob URLs and prevent React StrictMode issues:

```typescript
// Module-level cache survives component re-mounts
const blobCache = {
  file: null as File | null,
  url: null as string | null,
};

// In useEffect:
// 1. Check if file is cached, reuse blob URL if same
// 2. Only create new blob URL for new files
// 3. Revoke old blob URL when file changes
// 4. No cleanup in useEffect - cache persists across re-mounts
```

**Why this matters**:
- React StrictMode double-mounts components in development
- Without caching, blob URLs get created and immediately revoked
- Browser tries to load revoked URLs → ERR_FILE_NOT_FOUND errors
- Module-level cache ensures blob URL survives re-mounts

**Metadata Extraction**:
- Creates temporary blob URL for metadata extraction
- Revokes immediately after metadata is loaded
- Uses separate blob URL from VideoPlayer

## GitHub Pages Deployment

**Vite configuration** (`vite.config.ts`):
```typescript
export default defineConfig({
  base: '/video-gif-creator/', // Match your repo name
  plugins: [react()],
  optimizeDeps: {
    exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/util']
  }
});
```

**package.json scripts**:
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

Use HashRouter and configure base path in router to match the `base` setting in Vite config.

## File Structure

```
src/
├── components/
│   ├── FileUploader.tsx
│   ├── VideoPlayer.tsx
│   ├── TimeRangeSelector.tsx
│   ├── GifGenerator.tsx
│   ├── GifPreview.tsx
│   └── ui/              # OriginUI components
├── pages/
│   ├── Home.tsx
│   └── Editor.tsx
├── hooks/
│   ├── useFFmpeg.ts     # FFmpeg instance management
│   └── useVideoMetadata.ts
├── utils/
│   ├── videoProcessing.ts
│   ├── timeFormatting.ts
│   └── fileValidation.ts
├── types/
│   └── index.ts
├── App.tsx
└── main.tsx
```

## Performance & UX Considerations

- Show clear loading states during FFmpeg initialization
- Display progress bar during GIF conversion with percentage
- Recommend max 10 seconds for GIF duration (warn users if exceeded)
- Use loading skeletons during video processing
- **Responsive Layout**:
  - Desktop: Flexbox with `lg:flex-row`, video preview `flex-1`, controls `lg:w-[400px]`
  - Mobile: `flex-col` stacked layout
  - Controls are `lg:sticky lg:top-8` on desktop
- Extract and display video metadata: duration, dimensions, file size

## GIF Settings

- **FPS options**: 10, 15, 20, 25 (button group)
- **Quality presets**: 480p/720p/1080p buttons (sets initial width)
- **Width slider**: Custom width with real-time aspect ratio calculation
- **Display format**: Shows `{width} × {height}px` above slider
- **Time format**: HH:MM:SS format with validation
