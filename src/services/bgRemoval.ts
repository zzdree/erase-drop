import { removeBackground } from '@imgly/background-removal';
import type { Config } from '@imgly/background-removal';

export interface RemoveBgOptions {
  onProgress?: (progress: number, stage: string) => void;
  quality?: number;
  format?: 'image/png' | 'image/webp' | 'image/jpeg';
}

/**
 * Check if the browser supports WebGPU for hardware acceleration
 */
export async function isWebGPUSupported(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  if (!('gpu' in navigator)) return false;
  try {
    const adapter = await (navigator as unknown as { gpu: { requestAdapter: () => Promise<unknown> } }).gpu.requestAdapter();
    return !!adapter;
  } catch {
    return false;
  }
}

/**
 * Remove background from an image file/blob/url completely on-device
 */
export async function processImageBackground(
  imageSource: Blob | File | string,
  options?: RemoveBgOptions
): Promise<Blob> {
  const isGpu = await isWebGPUSupported();

  const config: Config = {
    debug: false,
    device: isGpu ? 'gpu' : 'cpu',
    output: {
      format: options?.format || 'image/png',
      quality: options?.quality ?? 0.95,
    },
    progress: (key: string, current: number, total: number) => {
      if (options?.onProgress) {
        let percent = 0;
        if (total > 0) {
          percent = Math.min(100, Math.round((current / total) * 100));
        } else if (current > 0) {
          percent = Math.min(95, current);
        }
        
        let label = 'Processing AI Model...';
        if (key.includes('fetch') || key.includes('download')) {
          label = 'Downloading AI Weights...';
        } else if (key.includes('inference') || key.includes('compute')) {
          label = 'Isolating Subject...';
        }
        
        options.onProgress(percent, label);
      }
    },
  };

  try {
    const resultBlob = await removeBackground(imageSource, config);
    return resultBlob;
  } catch (err: unknown) {
    console.error('Error during client-side background removal:', err);
    throw new Error(err instanceof Error ? err.message : 'Failed to remove background');
  }
}
