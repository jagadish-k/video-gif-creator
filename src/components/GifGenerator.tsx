import { useState } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { GifSettings, TimeRange } from '../types';
import { convertVideoToGif } from '../utils/videoProcessing';

interface GifGeneratorProps {
  ffmpeg: FFmpeg | null;
  videoFile: File;
  timeRange: TimeRange;
  settings: GifSettings;
  onComplete: (gifBlob: Blob) => void;
}

export const GifGenerator = ({
  ffmpeg,
  videoFile,
  timeRange,
  settings,
  onComplete,
}: GifGeneratorProps) => {
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!ffmpeg) {
      setError('FFmpeg is not loaded');
      return;
    }

    setGenerating(true);
    setProgress(0);
    setError(null);

    try {
      // Set up progress listener
      ffmpeg.on('progress', ({ progress: prog }) => {
        setProgress(Math.round(prog * 100));
      });

      const gifBlob = await convertVideoToGif(ffmpeg, videoFile, timeRange, settings);
      onComplete(gifBlob);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate GIF';
      setError(errorMessage);
      console.error('GIF generation error:', err);
    } finally {
      setGenerating(false);
      setProgress(0);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          GIF Settings
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Frame Rate (FPS)
            </label>
            <div className="flex gap-2">
              {[10, 15, 20, 25].map((fps) => (
                <button
                  key={fps}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    settings.fps === fps
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => {
                    // This would be handled by parent component
                  }}
                >
                  {fps}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Width (pixels)
            </label>
            <input
              type="number"
              value={settings.width}
              min="100"
              max="1920"
              step="10"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={() => {
                // This would be handled by parent component
              }}
            />
            <p className="mt-1 text-xs text-gray-500">
              Height will be calculated to maintain aspect ratio
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quality
            </label>
            <select
              value={settings.quality}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={() => {
                // This would be handled by parent component
              }}
            >
              <option value="low">Low (smaller file)</option>
              <option value="medium">Medium (balanced)</option>
              <option value="high">High (larger file)</option>
            </select>
          </div>
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={generating || !ffmpeg}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {generating ? 'Generating...' : 'Generate GIF'}
      </button>

      {generating && (
        <div className="space-y-2">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 text-center">
            {progress}% complete
          </p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
};
