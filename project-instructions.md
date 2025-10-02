# GIF Maker - Project Instructions for Claude Code

## Project Overview

Create a React SPA that allows users to upload video files, preview them, select time ranges, and generate GIFs entirely in the browser. This should be deployable to GitHub Pages.

## Tech Stack

- **Framework**: React 18+ with TypeScript
- **Routing**: React Router v6
- **Styling**: TailwindCSS + OriginUI component library
- **Video Processing**: ffmpeg.wasm for client-side video to GIF conversion
- **Build Tool**: Vite
- **Deployment**: GitHub Pages (client-side only, no backend)

## Setup Instructions

### 1. Project Initialization

```bash
npm create vite@latest gif-maker -- --template react-ts
cd gif-maker
npm install
```

### 2. Install Dependencies

```bash
# Core dependencies
npm install react-router-dom

# UI & Styling
npm install -D tailwindcss postcss autoprefixer
npm install @tailwindcss/forms
npm install clsx tailwind-merge

# Video Processing
npm install @ffmpeg/ffmpeg @ffmpeg/util

# GitHub Pages deployment
npm install -D gh-pages
```

### 3. Configure TailwindCSS

- Initialize Tailwind: `npx tailwindcss init -p`
- Configure `tailwind.config.js` with content paths and OriginUI setup
- Add Tailwind directives to `src/index.css`

### 4. Configure Vite for GitHub Pages

Update `vite.config.ts`:

```typescript
export default defineConfig({
	base: '/gif-maker/', // Replace with your repo name
	plugins: [react()],
	optimizeDeps: {
		exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/util'],
	},
});
```

### 5. Add GitHub Pages Scripts to package.json

```json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```

## Application Structure

### Pages/Routes

1. **Home Page** (`/`):

   - Hero section explaining the app
   - File upload area (drag & drop + click to browse)
   - Accepts video formats: MP4, WebM, MOV, AVI

2. **Editor Page** (`/editor`):
   - Video preview player
   - Video metadata display (duration, dimensions, size)
   - Time range selector with:
     - Start time input (HH:MM:SS or seconds)
     - End time input (HH:MM:SS or seconds)
     - Visual timeline slider
     - Duration limit warning (recommend max 10 seconds for GIF)
   - GIF settings:
     - FPS selector (10, 15, 20, 25)
     - Width/height (maintain aspect ratio)
     - Quality selector
   - Generate GIF button
   - Progress indicator during conversion
   - Preview & download section for generated GIF

### Key Components

#### 1. FileUploader Component

- Drag and drop zone
- File type validation
- File size warning (warn if >100MB)
- Show thumbnail preview after upload
- Extract video metadata using HTML5 Video API

#### 2. VideoPlayer Component

- HTML5 video element
- Custom controls for precise time selection
- Current time display
- Thumbnail generation at specific timestamps

#### 3. TimeRangeSelector Component

- Dual-handle range slider for start/end selection
- Time input fields with validation
- Visual representation of selected range
- Duration calculator
- Warning if duration > 10 seconds (large GIF size)

#### 4. GifGenerator Component

- FFmpeg initialization with loading state
- Conversion logic using ffmpeg.wasm
- Progress bar with percentage
- Cancel operation button
- Error handling with user-friendly messages

#### 5. GifPreview Component

- Display generated GIF
- File size display
- Download button
- "Create another" button to reset

## FFmpeg.wasm Implementation

### Key Functions Needed:

1. **Load FFmpeg**:

```typescript
const loadFFmpeg = async () => {
	const ffmpeg = new FFmpeg();
	await ffmpeg.load({
		coreURL: '/path/to/ffmpeg-core.js',
		wasmURL: '/path/to/ffmpeg-core.wasm',
	});
	return ffmpeg;
};
```

2. **Video to GIF Conversion**:

```typescript
const convertToGif = async (videoFile: File, startTime: number, endTime: number, fps: number, width: number) => {
	// Load video into ffmpeg virtual filesystem
	// Run ffmpeg command: -i input.mp4 -ss START -to END -vf "fps=FPS,scale=WIDTH:-1" output.gif
	// Extract result and create downloadable blob
};
```

3. **Progress Tracking**:

- Use ffmpeg.on('progress') to track conversion progress
- Update UI with percentage complete

## UI/UX Requirements

### Design with OriginUI:

- Use OriginUI button components
- Use OriginUI form inputs for time selectors
- Use OriginUI card components for sections
- Implement smooth transitions
- Add loading skeletons during processing
- Use toast notifications for errors/success

### Responsive Design:

- Mobile-first approach
- Stack layout on mobile
- Side-by-side on desktop (video on left, controls on right)

### User Flow:

1. Land on home page with clear CTA
2. Upload video file (drag/drop or browse)
3. Navigate to editor automatically
4. Preview video and select time range
5. Adjust GIF settings
6. Generate GIF with visual feedback
7. Preview and download result
8. Option to create another

## Error Handling

- File type validation errors
- File size warnings
- FFmpeg loading failures
- Conversion errors
- Unsupported browser features
- Time range validation (start < end, within video duration)

## Performance Considerations

- Lazy load FFmpeg only when needed
- Show loading states clearly
- Warn users about large files
- Recommend optimal GIF settings (duration, fps)
- Memory cleanup after conversion

## GitHub Pages Deployment

- Build outputs to `dist/` folder
- Configure base path in router
- Use `HashRouter` for GitHub Pages compatibility
- Add `404.html` fallback

## Additional Features (Nice to Have)

- Video thumbnail extraction at current playback position
- GIF preview before download
- Multiple format exports (GIF, WebP)
- Preset templates (optimized for Twitter, Discord, etc.)
- Local storage for recent conversions metadata

## File Structure

```
src/
├── components/
│   ├── FileUploader.tsx
│   ├── VideoPlayer.tsx
│   ├── TimeRangeSelector.tsx
│   ├── GifGenerator.tsx
│   ├── GifPreview.tsx
│   └── ui/ (OriginUI components)
├── pages/
│   ├── Home.tsx
│   └── Editor.tsx
├── hooks/
│   ├── useFFmpeg.ts
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

## Testing Checklist

- [ ] Upload various video formats
- [ ] Handle large video files (>50MB)
- [ ] Time selection validation
- [ ] GIF generation with different settings
- [ ] Download functionality
- [ ] Mobile responsiveness
- [ ] Browser compatibility (Chrome, Firefox, Safari)
- [ ] Error states display correctly

## Implementation Order

1. **Phase 1**: Project setup, routing, and Home page with file upload
2. **Phase 2**: Editor page with video playback and metadata display
3. **Phase 3**: Time range selector component
4. **Phase 4**: FFmpeg.wasm integration for GIF generation
5. **Phase 5**: GIF preview and download functionality
6. **Phase 6**: Polish UI/UX, error handling, and responsive design
7. **Phase 7**: GitHub Pages deployment configuration

## Notes

- Start by scaffolding the project structure
- Set up routing early
- Create the Home page with file upload first
- Then proceed to the Editor page with video playback
- Finally, integrate FFmpeg.wasm for GIF generation
- Test thoroughly with different video files and settings

```

```
