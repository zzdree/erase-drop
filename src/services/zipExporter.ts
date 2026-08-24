import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import type { ProcessedImageItem } from '../types';

/**
 * Composite a transparent image over a backdrop (color, gradient, image) onto a canvas and return a Blob
 */
export async function renderImageWithBackdrop(
  imgSource: string | Blob,
  backdrop: ProcessedImageItem['backdrop'],
  format: string = 'image/png',
  quality: number = 0.95
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = typeof imgSource === 'string' ? imgSource : URL.createObjectURL(imgSource);
    
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        if (typeof imgSource !== 'string') URL.revokeObjectURL(url);
        reject(new Error('Canvas context unavailable'));
        return;
      }

      // Draw backdrop if not transparent
      if (backdrop.type === 'color') {
        ctx.fillStyle = backdrop.value;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (backdrop.type === 'gradient') {
        const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        const stops = backdrop.value.split(',');
        if (stops.length >= 2) {
          grad.addColorStop(0, stops[0].trim());
          grad.addColorStop(1, stops[1].trim());
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else {
          ctx.fillStyle = backdrop.value;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      } else if (backdrop.type === 'image' && backdrop.value) {
        const bgImg = new Image();
        bgImg.onload = () => {
          ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          canvas.toBlob(
            (blob) => {
              if (typeof imgSource !== 'string') URL.revokeObjectURL(url);
              if (blob) resolve(blob);
              else reject(new Error('Canvas blob generation failed'));
            },
            format,
            quality
          );
        };
        bgImg.src = backdrop.value;
        return;
      }

      // Draw cutout foreground
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (typeof imgSource !== 'string') URL.revokeObjectURL(url);
          if (blob) resolve(blob);
          else reject(new Error('Canvas blob generation failed'));
        },
        format,
        quality
      );
    };

    img.onerror = () => {
      if (typeof imgSource !== 'string') URL.revokeObjectURL(url);
      reject(new Error('Failed to load image for rendering'));
    };

    img.src = url;
  });
}

/**
 * Download all completed items in a single ZIP file
 */
export async function downloadAllAsZip(
  items: ProcessedImageItem[],
  zipName = 'erasedrop_images.zip'
): Promise<void> {
  const completedItems = items.filter((item) => item.status === 'completed' && item.processedBlob);
  if (completedItems.length === 0) return;

  const zip = new JSZip();

  for (let i = 0; i < completedItems.length; i++) {
    const item = completedItems[i];
    if (!item.processedBlob) continue;

    const baseName = item.name.replace(/\.[^/.]+$/, '');
    const extension = item.backdrop.type === 'transparent' ? 'png' : 'png';
    const filename = `${baseName}_erasedrop.${extension}`;

    if (item.backdrop.type === 'transparent') {
      zip.file(filename, item.processedBlob);
    } else {
      const renderedBlob = await renderImageWithBackdrop(item.processedBlob, item.backdrop);
      zip.file(filename, renderedBlob);
    }
  }

  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, zipName);
}
