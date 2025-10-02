const ACCEPTED_VIDEO_FORMATS = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export const validateVideoFile = (file: File): { valid: boolean; error?: string } => {
  if (!ACCEPTED_VIDEO_FORMATS.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload MP4, WebM, MOV, or AVI files.',
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: true,
      error: `Warning: File size is ${(file.size / 1024 / 1024).toFixed(2)}MB. Large files may take longer to process.`,
    };
  }

  return { valid: true };
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};
