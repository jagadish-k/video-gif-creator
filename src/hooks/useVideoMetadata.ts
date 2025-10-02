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

        await new Promise<void>((resolve, reject) => {
          video.onloadedmetadata = () => resolve();
          video.onerror = () => reject(new Error('Failed to load video metadata'));
          video.src = URL.createObjectURL(videoFile);
        });

        const metadata: VideoMetadata = {
          duration: video.duration,
          width: video.videoWidth,
          height: video.videoHeight,
          size: videoFile.size,
          fileName: videoFile.name,
          fileType: videoFile.type,
        };

        setMetadata(metadata);
        URL.revokeObjectURL(video.src);
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
