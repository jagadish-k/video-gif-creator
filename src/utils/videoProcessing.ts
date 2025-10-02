import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import { GifSettings, TimeRange } from '../types';

export const convertVideoToGif = async (
  ffmpeg: FFmpeg,
  videoFile: File,
  timeRange: TimeRange,
  settings: GifSettings
): Promise<Blob> => {
  const { start, end } = timeRange;
  const { fps, width } = settings;

  // Write the video file to FFmpeg's virtual filesystem
  await ffmpeg.writeFile('input.mp4', await fetchFile(videoFile));

  // Build the FFmpeg command
  const duration = end - start;
  await ffmpeg.exec([
    '-i', 'input.mp4',
    '-ss', start.toString(),
    '-t', duration.toString(),
    '-vf', `fps=${fps},scale=${width}:-1:flags=lanczos`,
    '-gifflags', '+transdiff',
    '-y',
    'output.gif'
  ]);

  // Read the result
  const data = await ffmpeg.readFile('output.gif');

  // Clean up
  await ffmpeg.deleteFile('input.mp4');
  await ffmpeg.deleteFile('output.gif');

  // Convert to blob
  if (typeof data === 'string') {
    throw new Error('Unexpected string data from FFmpeg');
  }
  // Cast the buffer to ArrayBuffer to satisfy TypeScript
  return new Blob([data.buffer as ArrayBuffer], { type: 'image/gif' });
};

export const getQualityScale = (quality: 'low' | 'medium' | 'high'): number => {
  switch (quality) {
    case 'low':
      return 480;
    case 'medium':
      return 720;
    case 'high':
      return 1080;
    default:
      return 720;
  }
};
