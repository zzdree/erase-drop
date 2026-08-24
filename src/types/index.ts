export type ProcessingStatus = 'pending' | 'processing' | 'completed' | 'error';

export interface BackdropOption {
  type: 'transparent' | 'color' | 'gradient' | 'image';
  value: string; // hex color, css gradient, or dataUrl for image
  name?: string;
}

export interface ProcessedImageItem {
  id: string;
  file: File;
  name: string;
  originalSize: number;
  originalUrl: string;
  processedBlob: Blob | null;
  processedUrl: string | null;
  status: ProcessingStatus;
  progress: number; // 0 to 100
  durationMs?: number;
  error?: string;
  dimensions?: { width: number; height: number };
  backdrop: BackdropOption;
}

export interface HistoryRecord {
  id: string;
  name: string;
  originalSize: number;
  processedSize: number;
  timestamp: number;
  thumbnailDataUrl: string;
  processedDataUrl: string;
  width: number;
  height: number;
}
