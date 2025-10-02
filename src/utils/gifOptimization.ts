import { GifSettings, VideoMetadata, TimeRange } from '../types';

const TARGET_SIZE_MB = 1;
const TARGET_SIZE_BYTES = TARGET_SIZE_MB * 1024 * 1024;
const GRACE_PERCENTAGE = 0.05; // 5% grace
const MAX_TARGET_SIZE = TARGET_SIZE_BYTES * (1 + GRACE_PERCENTAGE);

/**
 * Estimates GIF file size based on settings
 * Formula approximation: pixels * frames * compression_factor
 * Compression factor varies with quality: higher quality = less compression
 */
export const estimateGifSize = (
  width: number,
  height: number,
  durationSeconds: number,
  fps: number
): number => {
  const totalFrames = durationSeconds * fps;
  const pixelsPerFrame = width * height;

  // Empirical compression factor for GIF (bytes per pixel per frame)
  // GIFs typically compress to about 0.3-0.5 bytes per pixel
  const compressionFactor = 0.4;

  const estimatedSize = totalFrames * pixelsPerFrame * compressionFactor;
  return estimatedSize;
};

/**
 * Calculates optimal GIF settings to stay under 1MB (with 5% grace)
 * Priority: duration > fps > width
 */
export const calculateOptimalSettings = (
  metadata: VideoMetadata,
  timeRange: TimeRange
): Partial<GifSettings> => {
  const duration = timeRange.end - timeRange.start;
  const aspectRatio = metadata.height / metadata.width;

  // Start with reasonable defaults
  let fps = 15; // Good balance
  let width = metadata.width;
  let height = Math.round(width * aspectRatio);

  // Calculate initial size estimate
  let estimatedSize = estimateGifSize(width, height, duration, fps);

  // If we're already under target, use original dimensions
  if (estimatedSize <= MAX_TARGET_SIZE) {
    return { fps, width, height, quality: 'high' };
  }

  // Strategy 1: Reduce FPS (10fps is acceptable for most GIFs)
  if (estimatedSize > MAX_TARGET_SIZE) {
    fps = 10;
    estimatedSize = estimateGifSize(width, height, duration, fps);
  }

  // Strategy 2: Scale down resolution if still too large
  if (estimatedSize > MAX_TARGET_SIZE) {
    // Calculate required scale down factor
    const scaleFactor = Math.sqrt(MAX_TARGET_SIZE / estimatedSize);
    width = Math.round(metadata.width * scaleFactor);

    // Snap to common widths for better quality
    width = snapToCommonWidth(width);
    height = Math.round(width * aspectRatio);

    estimatedSize = estimateGifSize(width, height, duration, fps);
  }

  // Strategy 3: Further reduce FPS if still too large
  if (estimatedSize > MAX_TARGET_SIZE && fps > 10) {
    fps = Math.max(8, Math.round(fps * (MAX_TARGET_SIZE / estimatedSize)));
    estimatedSize = estimateGifSize(width, height, duration, fps);
  }

  // Determine quality based on final dimensions
  let quality: 'low' | 'medium' | 'high' = 'medium';
  if (width >= 720) {
    quality = 'high';
  } else if (width >= 480) {
    quality = 'medium';
  } else {
    quality = 'low';
  }

  return { fps, width, height, quality };
};

/**
 * Snaps width to common resolutions for better visual quality
 */
const snapToCommonWidth = (width: number): number => {
  const commonWidths = [320, 480, 640, 720, 1080];

  // Find closest common width that's <= target
  for (let i = commonWidths.length - 1; i >= 0; i--) {
    if (commonWidths[i] <= width) {
      return commonWidths[i];
    }
  }

  // If smaller than smallest common width, return as is
  return Math.max(64, width);
};

/**
 * Estimates file size for current settings (for display)
 */
export const getEstimatedFileSizeLabel = (
  settings: GifSettings,
  duration: number
): string => {
  const estimatedBytes = estimateGifSize(
    settings.width,
    settings.height,
    duration,
    settings.fps
  );

  const estimatedMB = estimatedBytes / (1024 * 1024);

  if (estimatedMB < 0.1) {
    return `~${Math.round(estimatedBytes / 1024)}KB`;
  } else {
    return `~${estimatedMB.toFixed(1)}MB`;
  }
};

/**
 * Checks if settings will likely produce a file over 1MB
 */
export const willExceedTargetSize = (
  settings: GifSettings,
  duration: number
): boolean => {
  const estimatedBytes = estimateGifSize(
    settings.width,
    settings.height,
    duration,
    settings.fps
  );

  return estimatedBytes > MAX_TARGET_SIZE;
};
