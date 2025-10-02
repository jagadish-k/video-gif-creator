export interface VideoMetadata {
  duration: number;
  width: number;
  height: number;
  fps?: number;
  size: number;
  fileName: string;
  fileType: string;
}

export interface GifSettings {
  fps: number;
  width: number;
  height: number;
  quality: 'low' | 'medium' | 'high';
}

export interface TimeRange {
  start: number;
  end: number;
}

export interface ConversionProgress {
  ratio: number;
  time: number;
}
