import { useRef, useEffect, useState } from 'react';
import { formatTime } from '../utils/timeFormatting';

interface VideoPlayerProps {
  videoFile: File;
  onTimeUpdate?: (currentTime: number) => void;
  startTime?: number;
  endTime?: number;
}

export const VideoPlayer = ({ videoFile, onTimeUpdate, startTime = 0, endTime }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      if (startTime > 0) {
        video.currentTime = startTime;
      }
    };

    const handleTimeUpdate = () => {
      const time = video.currentTime;
      setCurrentTime(time);
      onTimeUpdate?.(time);

      // Loop between start and end time if set
      if (endTime && time >= endTime) {
        video.currentTime = startTime;
        if (!playing) {
          video.pause();
        }
      }
    };

    const handlePlay = () => setPlaying(true);
    const handlePause = () => setPlaying(false);

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [startTime, endTime, playing, onTimeUpdate]);

  useEffect(() => {
    if (videoRef.current && videoFile) {
      const url = URL.createObjectURL(videoFile);
      videoRef.current.src = url;
      return () => URL.revokeObjectURL(url);
    }
  }, [videoFile]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  return (
    <div className="w-full">
      <div className="relative bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          className="w-full"
          controls
        />
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            step="0.1"
            value={currentTime}
            onChange={handleSeek}
            className="flex-1"
          />
          <span className="text-sm font-medium text-gray-700">
            {formatTime(duration)}
          </span>
        </div>

        {startTime !== undefined && endTime !== undefined && (
          <div className="text-xs text-gray-500 text-center">
            Selected range: {formatTime(startTime)} - {formatTime(endTime)} ({formatTime(endTime - startTime)})
          </div>
        )}
      </div>
    </div>
  );
};
