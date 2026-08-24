import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import type { ProcessedImageItem } from '../types';
import { compositeStudioImage } from './canvasEffects';

/**
 * Composite full image with all studio configurations and return a Blob
 */
export async function renderProcessedItemToBlob(
  item: ProcessedImageItem,
  format = 'image/png',
  quality = 0.95
): Promise<Blob> {
  if (!item.processedUrl) throw new Error('No processed URL available');

  const subImg = new Image();
  subImg.crossOrigin = 'anonymous';

  await new Promise<void>((resolve, reject) => {
    subImg.onload = () => resolve();
    subImg.onerror = () => reject(new Error('Failed to load image'));
    subImg.src = item.processedUrl!;
  });

  let origImg: HTMLImageElement | null = null;
  if (item.originalUrl) {
    origImg = new Image();
    origImg.crossOrigin = 'anonymous';
    await new Promise<void>((resolve) => {
      origImg!.onload = () => resolve();
      origImg!.onerror = () => resolve();
      origImg!.src = item.originalUrl;
    });
  }

  const w = subImg.naturalWidth || 800;
  const h = subImg.naturalHeight || 800;

  const canvas = await compositeStudioImage(
    subImg,
    origImg,
    w,
    h,
    item.studioConfig.backdrop,
    item.studioConfig.stroke,
    item.studioConfig.shadow,
    item.studioConfig.adjustments,
    item.studioConfig.edge,
    item.studioConfig.crop
  );

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Canvas blob conversion failed'));
      },
      format,
      quality
    );
  });
}

/**
 * Download all completed items in a single ZIP file
 */
export async function downloadAllAsZip(
  items: ProcessedImageItem[],
  zipName = 'erasedrop_batch.zip'
): Promise<void> {
  const completedItems = items.filter((item) => item.status === 'completed' && item.processedUrl);
  if (completedItems.length === 0) return;

  const zip = new JSZip();

  for (let i = 0; i < completedItems.length; i++) {
    const item = completedItems[i];
    if (!item.processedUrl) continue;

    const baseName = item.name.replace(/\.[^/.]+$/, '');
    const filename = `${baseName}_erasedrop.png`;

    try {
      const renderedBlob = await renderProcessedItemToBlob(item);
      zip.file(filename, renderedBlob);
    } catch (err) {
      console.error(`Failed to process item ${item.name} for ZIP:`, err);
    }
  }

  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, zipName);
}
