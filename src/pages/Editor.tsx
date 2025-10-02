import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { VideoPlayer } from '../components/VideoPlayer';
import { TimeRangeSelector } from '../components/TimeRangeSelector';
import { GifPreview } from '../components/GifPreview';
import { useFFmpeg } from '../hooks/useFFmpeg';
import { useVideoMetadata } from '../hooks/useVideoMetadata';
import { GifSettings, TimeRange } from '../types';
import { formatFileSize } from '../utils/fileValidation';
import { getQualityScale, convertVideoToGif } from '../utils/videoProcessing';
import { calculateOptimalSettings, getEstimatedFileSizeLabel, willExceedTargetSize } from '../utils/gifOptimization';

export const Editor = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const videoFile = location.state?.videoFile as File | undefined;

  const { ffmpeg, loaded, loading, error: ffmpegError, load } = useFFmpeg();
  const { metadata, loading: metadataLoading } = useVideoMetadata(videoFile || null);

  const [timeRange, setTimeRange] = useState<TimeRange>({ start: 0, end: 5 });
  const [settings, setSettings] = useState<GifSettings>({
    fps: 15,
    width: 480,
    height: 270,
    quality: 'medium',
  });
  const [gifBlob, setGifBlob] = useState<Blob | null>(null);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!videoFile) {
      navigate('/');
    }
  }, [videoFile, navigate]);

  useEffect(() => {
    if (videoFile && !loaded && !loading) {
      load();
    }
  }, [videoFile, loaded, loading, load]);

  useEffect(() => {
    if (metadata) {
      const initialTimeRange = { start: 0, end: Math.min(metadata.duration, 5) };
      setTimeRange(initialTimeRange);

      // Calculate optimal settings for <1MB target
      const optimalSettings = calculateOptimalSettings(metadata, initialTimeRange);

      setSettings(prev => ({
        ...prev,
        ...optimalSettings,
      }));
    }
  }, [metadata]);

  // Recalculate optimal settings when time range changes
  useEffect(() => {
    if (metadata && timeRange) {
      const optimalSettings = calculateOptimalSettings(metadata, timeRange);

      setSettings(prev => ({
        ...prev,
        ...optimalSettings,
      }));
    }
  }, [timeRange, metadata]);

  const handleSettingsChange = (key: keyof GifSettings, value: any) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: value };

      // Update height based on aspect ratio when width changes
      if (key === 'width' && metadata) {
        newSettings.height = Math.round((metadata.height / metadata.width) * value);
      }

      // Update width and height when quality preset is selected
      if (key === 'quality' && metadata) {
        const width = getQualityScale(value);
        newSettings.width = width;
        newSettings.height = Math.round((metadata.height / metadata.width) * width);
      }

      return newSettings;
    });
  };

  const handleReset = () => {
    setGifBlob(null);
    setTimeRange({ start: 0, end: Math.min(metadata?.duration || 5, 5) });
    setError(null);
  };

  const handleGenerate = async () => {
    if (!ffmpeg || !videoFile) {
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
      setGifBlob(gifBlob);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate GIF';
      setError(errorMessage);
      console.error('GIF generation error:', err);
    } finally {
      setGenerating(false);
      setProgress(0);
    }
  };

  if (!videoFile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Upload
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">
            Edit & Generate GIF
          </h1>
        </div>

        {/* FFmpeg Loading Status */}
        {loading && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">Loading video processor...</p>
          </div>
        )}

        {ffmpegError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">Error: {ffmpegError}</p>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Left Column - Video Preview */}
          <div className="flex-1 space-y-4 lg:space-y-6 min-w-0">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Video Preview
              </h2>

              {metadataLoading ? (
                <div className="animate-pulse bg-gray-200 rounded-lg h-64" />
              ) : (
                <VideoPlayer
                  videoFile={videoFile}
                  startTime={timeRange.start}
                  endTime={timeRange.end}
                />
              )}

              {metadata && (
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Duration:</span>
                    <span className="ml-2 font-medium">{metadata.duration.toFixed(2)}s</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Resolution:</span>
                    <span className="ml-2 font-medium">{metadata.width}x{metadata.height}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Quality:</span>
                    <span className="ml-2 font-medium">
                      {metadata.width >= 1920 ? '1080p+' :
                       metadata.width >= 1280 ? '720p' :
                       metadata.width >= 854 ? '480p' :
                       metadata.width >= 640 ? '360p' : '< 360p'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">File Size:</span>
                    <span className="ml-2 font-medium">{formatFileSize(metadata.size)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Format:</span>
                    <span className="ml-2 font-medium">{metadata.fileType.split('/')[1].toUpperCase()}</span>
                  </div>
                </div>
              )}
            </div>

            {metadata && (
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                <TimeRangeSelector
                  duration={metadata.duration}
                  onChange={setTimeRange}
                  initialRange={timeRange}
                />
              </div>
            )}
          </div>

          {/* Right Column - Settings & Generation */}
          <div className="lg:w-[400px] lg:flex-shrink-0 space-y-4 lg:space-y-6 lg:sticky lg:top-8 lg:self-start">
            {!gifBlob ? (
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                <div className="space-y-6">
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
                              onClick={() => handleSettingsChange('fps', fps)}
                            >
                              {fps}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Size / Quality
                        </label>
                        <div className="flex gap-2 mb-3">
                          {[
                            { value: 'low', label: '480p' },
                            { value: 'medium', label: '720p' },
                            { value: 'high', label: '1080p' }
                          ].map((preset) => (
                            <button
                              key={preset.value}
                              className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                settings.quality === preset.value
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                              onClick={() => handleSettingsChange('quality', preset.value as 'low' | 'medium' | 'high')}
                            >
                              {preset.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Scale: {settings.width} × {settings.height}px
                        </label>
                        <input
                          type="range"
                          value={settings.width}
                          min={64}
                          max={metadata ? metadata.width : 1920}
                          step="10"
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                          onChange={(e) => handleSettingsChange('width', parseInt(e.target.value))}
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>Smaller (faster)</span>
                          <span>Original size</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Estimated File Size Indicator */}
                  {metadata && (
                    <div className={`p-3 rounded-lg border ${
                      willExceedTargetSize(settings, timeRange.end - timeRange.start)
                        ? 'bg-yellow-50 border-yellow-200'
                        : 'bg-green-50 border-green-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          Estimated size:
                        </span>
                        <span className={`text-sm font-semibold ${
                          willExceedTargetSize(settings, timeRange.end - timeRange.start)
                            ? 'text-yellow-700'
                            : 'text-green-700'
                        }`}>
                          {getEstimatedFileSizeLabel(settings, timeRange.end - timeRange.start)}
                        </span>
                      </div>
                      {willExceedTargetSize(settings, timeRange.end - timeRange.start) && (
                        <p className="text-xs text-yellow-600 mt-1">
                          May exceed 1MB target. Consider reducing duration, FPS, or size.
                        </p>
                      )}
                    </div>
                  )}

                  <button
                    onClick={handleGenerate}
                    disabled={!loaded || loading || generating}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {generating ? 'Generating...' : loading ? 'Loading...' : loaded ? 'Generate GIF' : 'Initializing...'}
                  </button>

                  {generating && (
                    <div className="space-y-2 mt-4">
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
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg mt-4">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                <GifPreview gifBlob={gifBlob} onReset={handleReset} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
