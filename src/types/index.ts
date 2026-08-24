export type ProcessingStatus = 'pending' | 'processing' | 'completed' | 'error';

export type AspectRatioPreset =
  | 'original'
  | '1:1'
  | '9:16'
  | '16:9'
  | '4:5'
  | 'id_2x3'
  | 'id_3x4'
  | 'id_4x6'
  | 'custom';

export interface CropRect {
  x: number; // 0 to 1 relative
  y: number; // 0 to 1 relative
  width: number; // 0 to 1 relative
  height: number; // 0 to 1 relative
  aspectRatio: AspectRatioPreset;
}

export interface EdgeTuning {
  smooth: number;    // 0 to 20 px
  feather: number;   // 0 to 15 px
  choke: number;     // -10 to +10 px (erosion / dilation)
}

export interface StrokeEffect {
  enabled: boolean;
  color: string;
  width: number;     // 1 to 30 px
  opacity: number;   // 0 to 1
}

export interface DropShadowEffect {
  enabled: boolean;
  color: string;
  blur: number;      // 0 to 50 px
  offsetX: number;   // -50 to +50 px
  offsetY: number;   // -50 to +50 px
  opacity: number;   // 0 to 1
}

export interface ColorAdjustments {
  brightness: number; // -100 to +100 (default 0)
  contrast: number;   // -100 to +100 (default 0)
  saturation: number; // -100 to +100 (default 0)
  temperature: number;// -100 to +100 (warm / cool)
  blurBackground: number; // 0 to 30 px (portrait mode bokeh effect)
}

export type BrushMode = 'erase' | 'restore' | 'none';

export interface BrushSettings {
  mode: BrushMode;
  size: number;       // 5 to 150 px
  softness: number;   // 0 (hard) to 1 (soft feather)
  opacity: number;    // 0.1 to 1.0
}

export interface BackdropOption {
  type: 'transparent' | 'color' | 'gradient' | 'image' | 'blur_original';
  value: string; // hex color, css gradient string, or dataUrl for image
  name?: string;
}

export interface StudioConfig {
  backdrop: BackdropOption;
  crop: CropRect;
  edge: EdgeTuning;
  stroke: StrokeEffect;
  shadow: DropShadowEffect;
  adjustments: ColorAdjustments;
}

export interface ProcessedImageItem {
  id: string;
  file: File;
  name: string;
  originalSize: number;
  originalUrl: string;
  processedBlob: Blob | null;
  processedUrl: string | null;
  maskDataUrl?: string; // Optional manual mask edits
  status: ProcessingStatus;
  progress: number; // 0 to 100
  durationMs?: number;
  error?: string;
  dimensions?: { width: number; height: number };
  studioConfig: StudioConfig;
}

export interface HistoryRecord {
  id: string;
  name: string;
  originalSize: number;
  processedSize: number;
  timestamp: number;
  thumbnailDataUrl: string;
  processedDataUrl: string;
  originalDataUrl?: string;
  width: number;
  height: number;
}

export interface BatchConfig {
  backdrop: BackdropOption;
  cropPreset: AspectRatioPreset;
  format: 'image/png' | 'image/webp' | 'image/jpeg';
  quality: number;
  namingPattern: string; // e.g. "{name}_erasedrop"
}

export const DEFAULT_STUDIO_CONFIG: StudioConfig = {
  backdrop: { type: 'transparent', value: '', name: 'Transparent' },
  crop: { x: 0, y: 0, width: 1, height: 1, aspectRatio: 'original' },
  edge: { smooth: 0, feather: 0, choke: 0 },
  stroke: { enabled: false, color: '#FFFFFF', width: 6, opacity: 1 },
  shadow: { enabled: false, color: '#000000', blur: 15, offsetX: 0, offsetY: 8, opacity: 0.4 },
  adjustments: { brightness: 0, contrast: 0, saturation: 0, temperature: 0, blurBackground: 0 }
};
