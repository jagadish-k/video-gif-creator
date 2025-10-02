export const formatTime = (seconds: number): string => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hrs > 0) {
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const parseTimeToSeconds = (timeString: string): number => {
  const parts = timeString.split(':').map(Number);

  if (parts.length === 3) {
    // HH:MM:SS
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    // MM:SS
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 1) {
    // Just seconds
    return parts[0];
  }

  return 0;
};

export const validateTimeRange = (
  start: number,
  end: number,
  duration: number
): { valid: boolean; error?: string } => {
  if (start < 0 || start >= duration) {
    return { valid: false, error: 'Start time is out of range' };
  }

  if (end <= start) {
    return { valid: false, error: 'End time must be after start time' };
  }

  if (end > duration) {
    return { valid: false, error: 'End time exceeds video duration' };
  }

  const durationSeconds = end - start;
  if (durationSeconds > 10) {
    return {
      valid: true,
      error: `Warning: ${durationSeconds.toFixed(1)}s duration may result in a large GIF file. Consider keeping it under 10 seconds.`,
    };
  }

  return { valid: true };
};
