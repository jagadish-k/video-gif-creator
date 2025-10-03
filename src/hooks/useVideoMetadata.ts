import { useState, useEffect } from 'react';
import { VideoMetadata } from '../types';

export const useVideoMetadata = (videoFile: File | null) => {
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!videoFile) {
      setMetadata(null);
      return;
    }

    const extractMetadata = async () => {
      setLoading(true);
      setError(null);

      try {
        const video = document.createElement('video');
        video.preload = 'metadata';

        const metadataBlobUrl = URL.createObjectURL(videoFile);

        await new Promise<void>((resolve, reject) => {
          video.onloadedmetadata = () => resolve();
          video.onerror = () => reject(new Error('Failed to load video metadata'));
          video.src = metadataBlobUrl;
        });

        // Try to extract FPS from video (not always available in browser)
        let fps: number | undefined;
        try {
          // Request animation frame to estimate FPS (approximation)
          const videoAny = video as any;
          if (videoAny.mozDecodedFrames !== undefined && videoAny.mozPresentedFrames !== undefined) {
            fps = Math.round((videoAny.mozPresentedFrames || 0) / video.duration);
          }
        } catch (err) {
          // FPS extraction not available in this browser
        }

        const metadata: VideoMetadata = {
          duration: video.duration,
          width: video.videoWidth,
          height: video.videoHeight,
          fps,
          size: videoFile.size,
          fileName: videoFile.name,
          fileType: videoFile.type,
        };

        setMetadata(metadata);
        URL.revokeObjectURL(metadataBlobUrl);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to extract metadata';
        setError(errorMessage);
        console.error('Metadata extraction error:', err);
      } finally {
        setLoading(false);
      }
    };

    extractMetadata();
  }, [videoFile]);

  return { metadata, loading, error };
};
