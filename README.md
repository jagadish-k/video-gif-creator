# GIF Maker

A modern, browser-based video to GIF converter built with React, TypeScript, and FFmpeg.wasm. Convert videos to GIFs entirely in your browser - no uploads, completely private.

## ✨ Features

- 🎬 **Browser-based conversion** - All processing happens locally using FFmpeg.wasm
- 🔒 **100% Private** - No server uploads, your files never leave your device
- ⚡ **Fast & Easy** - Simple drag-and-drop interface
- 🎨 **Customizable** - Adjust FPS, quality, size, and time range
- 📱 **Responsive** - Works on desktop and mobile devices
- 🎯 **Time Range Selection** - Choose exactly which part of the video to convert
- 📏 **Smart Scaling** - Resize GIFs while maintaining aspect ratio

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/video-gif-creator.git
cd video-gif-creator

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📦 Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build locally
npm run deploy    # Deploy to GitHub Pages
```

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Routing**: React Router v6 (HashRouter for GitHub Pages)
- **Styling**: TailwindCSS v4
- **Video Processing**: FFmpeg.wasm
- **Build Tool**: Vite

## 📖 How to Use

1. **Upload a video** - Drag and drop or click to browse (MP4, WebM, MOV, AVI)
2. **Select time range** - Choose the start and end time for your GIF
3. **Adjust settings**:
   - Frame rate (10-25 FPS)
   - Quality preset (480p, 720p, 1080p)
   - Custom width with aspect ratio maintained
4. **Generate GIF** - Click generate and wait for processing
5. **Download** - Save your GIF or create another

## 🌐 Deployment

### GitHub Pages (Automated with GitHub Actions)

**Setup (one-time):**

1. Update `base` in `vite.config.ts` to match your repository name:
   ```ts
   base: '/your-repo-name/'
   ```

2. Push to GitHub:
   ```bash
   git remote add origin https://github.com/yourusername/video-gif-creator.git
   git push -u origin main
   ```

3. Enable GitHub Pages in repository settings:
   - Go to **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**
   - The workflow will automatically deploy on push to main

**Manual Deployment (alternative):**

```bash
npm run deploy  # Deploys to gh-pages branch
```

Then set GitHub Pages source to `gh-pages` branch in settings.

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── FileUploader.tsx
│   ├── VideoPlayer.tsx
│   ├── TimeRangeSelector.tsx
│   ├── GifPreview.tsx
│   └── ui/
├── pages/              # Route pages
│   ├── Home.tsx
│   └── Editor.tsx
├── hooks/              # Custom React hooks
│   ├── useFFmpeg.ts
│   └── useVideoMetadata.ts
├── utils/              # Utility functions
│   ├── fileValidation.ts
│   ├── timeFormatting.ts
│   └── videoProcessing.ts
├── types/              # TypeScript types
│   └── index.ts
├── App.tsx             # Main app component
└── main.tsx            # Entry point
```

## 🔧 Configuration

### FFmpeg.wasm

The app uses FFmpeg.wasm loaded from jsDelivr CDN. The core files are loaded at runtime when entering the editor page.

### Supported Video Formats

- MP4 (video/mp4)
- WebM (video/webm)
- MOV (video/quicktime)
- AVI (video/x-msvideo)

### GIF Settings

- **FPS**: 10, 15, 20, 25
- **Quality Presets**:
  - Low (480p) - Smaller file size
  - Medium (720p) - Balanced
  - High (1080p) - Larger file size
- **Custom Width**: Slider with maintained aspect ratio
- **Max Recommended Duration**: 10 seconds (for optimal file size)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the ISC License.

## 🐛 Known Issues

- Large video files (>100MB) may take longer to process
- Some browsers may have memory limitations for very large files
- Safari may require additional permissions for file access

## 🙏 Acknowledgments

- [FFmpeg.wasm](https://github.com/ffmpegwasm/ffmpeg.wasm) - WebAssembly port of FFmpeg
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Vite](https://vitejs.dev/) - Next generation frontend tooling
