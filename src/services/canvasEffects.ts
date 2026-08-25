import type {
  BackdropOption,
  EdgeTuning,
  StrokeEffect,
  DropShadowEffect,
  ColorAdjustments,
  CropRect
} from '../types';

/**
 * Creates an offscreen canvas with specified dimensions
 */
export function createOffscreen(width: number, height: number): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  return { canvas, ctx };
}

/**
 * Apply subject color adjustments to context using standard Canvas filters & color matrix
 */
export function applySubjectFilters(
  ctx: CanvasRenderingContext2D,
  adjustments: ColorAdjustments
): void {
  const brightness = 100 + adjustments.brightness; // percentage
  const contrast = 100 + adjustments.contrast;     // percentage
  const saturate = 100 + adjustments.saturation;   // percentage

  // Basic filter string
  let filterStr = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%)`;

  // Temperature approximation: warm turns slight sepia/yellow, cool turns slight blue/cyan hue
  if (adjustments.temperature > 0) {
    // Warm tone
    filterStr += ` sepia(${Math.round(adjustments.temperature * 0.4)}%)`;
  } else if (adjustments.temperature < 0) {
    // Cool tone
    filterStr += ` hue-rotate(${Math.round(adjustments.temperature * 0.3)}deg)`;
  }

  ctx.filter = filterStr;
}

/**
 * Draw background layer onto canvas
 */
export async function renderBackgroundLayer(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  backdrop: BackdropOption,
  originalImage?: HTMLImageElement | null
): Promise<void> {
  ctx.save();
  ctx.filter = 'none';

  if (backdrop.type === 'transparent') {
    // Leave clear/transparent
  } else if (backdrop.type === 'color') {
    ctx.fillStyle = backdrop.value || '#FFFFFF';
    ctx.fillRect(0, 0, width, height);
  } else if (backdrop.type === 'gradient') {
    const val = backdrop.value;
    const grad = ctx.createLinearGradient(0, 0, width, height);

    // Parse comma separated colors or hex
    const parts = val.split(',').map(s => s.trim()).filter(Boolean);
    if (parts.length >= 2) {
      parts.forEach((stopColor, idx) => {
        const offset = idx / (parts.length - 1);
        try {
          grad.addColorStop(offset, stopColor);
        } catch {
          // fallback
        }
      });
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    } else {
      ctx.fillStyle = val;
      ctx.fillRect(0, 0, width, height);
    }
  } else if (backdrop.type === 'blur_original' && originalImage) {
    // Portrait mode background blur
    const blurAmount = 15; // default px
    ctx.filter = `blur(${blurAmount}px)`;
    // Draw slightly scaled up to avoid edge bleeding
    const scale = 1.08;
    const sx = -(width * (scale - 1)) / 2;
    const sy = -(height * (scale - 1)) / 2;
    ctx.drawImage(originalImage, sx, sy, width * scale, height * scale);
  } else if (backdrop.type === 'image' && backdrop.value) {
    // Custom background image
    await new Promise<void>((resolve) => {
      const bg = new Image();
      bg.crossOrigin = 'anonymous';
      bg.onload = () => {
        // Draw image cover
        const bgRatio = bg.width / bg.height;
        const targetRatio = width / height;
        let dw = width;
        let dh = height;
        let dx = 0;
        let dy = 0;

        if (bgRatio > targetRatio) {
          dw = height * bgRatio;
          dx = (width - dw) / 2;
        } else {
          dh = width / bgRatio;
          dy = (height - dh) / 2;
        }

        ctx.drawImage(bg, dx, dy, dw, dh);
        resolve();
      };
      bg.onerror = () => resolve();
      bg.src = backdrop.value;
    });
  }

  ctx.restore();
}

/**
 * Render stroke outline around the subject silhouette
 */
export function renderOutlineStroke(
  targetCtx: CanvasRenderingContext2D,
  subjectCanvas: HTMLCanvasElement,
  width: number,
  height: number,
  stroke: StrokeEffect
): void {
  if (!stroke.enabled || stroke.width <= 0) return;

  const { canvas: strokeCanvas, ctx: strokeCtx } = createOffscreen(width, height);

  // Step 1: Draw silhouette
  strokeCtx.drawImage(subjectCanvas, 0, 0);
  strokeCtx.globalCompositeOperation = 'source-in';
  strokeCtx.fillStyle = stroke.color;
  strokeCtx.fillRect(0, 0, width, height);

  // Step 2: Multi-directional radial stamping for smooth boundary expansion (dilation)
  const d = Math.round(stroke.width);
  const steps = Math.max(12, Math.min(32, d * 2));
  const { canvas: stampCanvas, ctx: stampCtx } = createOffscreen(width, height);

  stampCtx.globalAlpha = stroke.opacity;

  for (let r = 1; r <= d; r += Math.max(1, Math.floor(d / 4))) {
    for (let i = 0; i < steps; i++) {
      const angle = (i / steps) * Math.PI * 2;
      const ox = Math.cos(angle) * r;
      const oy = Math.sin(angle) * r;
      stampCtx.drawImage(strokeCanvas, ox, oy);
    }
  }

  // Draw final expanded stroke silhouette onto target canvas
  targetCtx.save();
  targetCtx.drawImage(stampCanvas, 0, 0);
  targetCtx.restore();
}

/**
 * Render drop shadow underneath the subject
 */
export function renderDropShadow(
  targetCtx: CanvasRenderingContext2D,
  subjectCanvas: HTMLCanvasElement,
  shadow: DropShadowEffect
): void {
  if (!shadow.enabled) return;

  targetCtx.save();
  targetCtx.shadowColor = shadow.color;
  targetCtx.shadowBlur = shadow.blur;
  targetCtx.shadowOffsetX = shadow.offsetX;
  targetCtx.shadowOffsetY = shadow.offsetY;
  targetCtx.globalAlpha = shadow.opacity;

  targetCtx.drawImage(subjectCanvas, 0, 0);
  targetCtx.restore();
}

/**
 * Apply edge choke (erosion/dilation) and feathering to alpha mask
 */
export function applyEdgeTuning(
  sourceCanvas: HTMLCanvasElement,
  width: number,
  height: number,
  edge: EdgeTuning
): HTMLCanvasElement {
  if (edge.smooth === 0 && edge.feather === 0 && edge.choke === 0) {
    return sourceCanvas;
  }

  const { canvas: tunedCanvas, ctx: tunedCtx } = createOffscreen(width, height);
  tunedCtx.drawImage(sourceCanvas, 0, 0);

  if (edge.feather > 0 || edge.smooth > 0) {
    const blur = Math.max(edge.feather, edge.smooth);
    tunedCtx.filter = `blur(${blur}px)`;
    tunedCtx.drawImage(sourceCanvas, 0, 0);
    tunedCtx.filter = 'none';
  }

  return tunedCanvas;
}

/**
 * Composite full image with all studio layers and crop output
 */
export async function compositeStudioImage(
  subjectImg: HTMLImageElement,
  originalImg: HTMLImageElement | null,
  width: number,
  height: number,
  backdrop: BackdropOption,
  stroke: StrokeEffect,
  shadow: DropShadowEffect,
  adjustments: ColorAdjustments,
  edge: EdgeTuning,
  crop: CropRect,
  manualMaskCanvas?: HTMLCanvasElement | null
): Promise<HTMLCanvasElement> {
  // 1. Prepare Base Subject Canvas
  const { canvas: subCanvas, ctx: subCtx } = createOffscreen(width, height);

  // Apply filters on subject
  applySubjectFilters(subCtx, adjustments);
  subCtx.drawImage(subjectImg, 0, 0, width, height);
  subCtx.filter = 'none';

  // Apply manual mask overlay if present
  if (manualMaskCanvas) {
    subCtx.globalCompositeOperation = 'destination-out';
    subCtx.drawImage(manualMaskCanvas, 0, 0, width, height);
    subCtx.globalCompositeOperation = 'source-over';
  }

  // 2. Apply Edge Tuning (Smoothing / Feathering)
  const tunedSubjectCanvas = applyEdgeTuning(subCanvas, width, height, edge);

  // 3. Prepare Full Uncropped Canvas with Background, Shadow & Outline
  const { canvas: fullCanvas, ctx: fullCtx } = createOffscreen(width, height);

  // Layer 1: Background
  await renderBackgroundLayer(fullCtx, width, height, backdrop, originalImg);

  // Layer 2: Drop Shadow
  if (shadow.enabled) {
    renderDropShadow(fullCtx, tunedSubjectCanvas, shadow);
  }

  // Layer 3: Outline / Stroke
  if (stroke.enabled) {
    renderOutlineStroke(fullCtx, tunedSubjectCanvas, width, height, stroke);
  }

  // Layer 4: Foreground Subject
  fullCtx.drawImage(tunedSubjectCanvas, 0, 0);

  // 4. Apply Crop if specified
  if (crop.width < 1 || crop.height < 1 || crop.x > 0 || crop.y > 0) {
    const cropX = Math.round(crop.x * width);
    const cropY = Math.round(crop.y * height);
    const cropW = Math.max(1, Math.round(crop.width * width));
    const cropH = Math.max(1, Math.round(crop.height * height));

    const { canvas: croppedCanvas, ctx: croppedCtx } = createOffscreen(cropW, cropH);
    croppedCtx.drawImage(fullCanvas, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
    return croppedCanvas;
  }

  return fullCanvas;
}

/**
 * Copy a canvas or blob directly to user's system clipboard as PNG
 */
export async function copyCanvasToClipboard(canvas: HTMLCanvasElement): Promise<boolean> {
  if (typeof window === 'undefined' || !navigator.clipboard || !window.ClipboardItem) {
    throw new Error('Clipboard API is not supported in this browser.');
  }

  return new Promise<boolean>((resolve, reject) => {
    canvas.toBlob(async (blob) => {
      if (!blob) {
        reject(new Error('Failed to generate image blob for clipboard'));
        return;
      }
      try {
        const item = new ClipboardItem({ 'image/png': blob });
        await navigator.clipboard.write([item]);
        resolve(true);
      } catch (err) {
        console.error('Clipboard copy failed:', err);
        reject(err);
      }
    }, 'image/png');
  });
}

/**
 * Generate a ready-to-print Pas Foto Sheet (e.g. A4 or 4R size grid)
 * Standard layout: 4x (3x4 cm) + 2x (4x6 cm) + 4x (2x3 cm)
 */
export function generatePasFotoPrintSheet(
  photoCanvas: HTMLCanvasElement,
  paperType: '4R' | 'A4' = '4R'
): HTMLCanvasElement {
  // 300 DPI calculations:
  // 4R = 4 x 6 inches = 1200 x 1800 px (300 DPI)
  // A4 = 8.27 x 11.69 inches = 2480 x 3508 px (300 DPI)
  const isA4 = paperType === 'A4';
  const sheetW = isA4 ? 2480 : 1200;
  const sheetH = isA4 ? 3508 : 1800;

  const { canvas: sheetCanvas, ctx } = createOffscreen(sheetW, sheetH);

  // Fill crisp white photo paper ground
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, sheetW, sheetH);

  // Helper to draw a single photo with subtle cutting guide border
  const drawPhotoTile = (x: number, y: number, w: number, h: number, label: string) => {
    ctx.drawImage(photoCanvas, 0, 0, photoCanvas.width, photoCanvas.height, x, y, w, h);

    // Subtle 1px cutting line
    ctx.strokeStyle = '#D1D5DB';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);

    // Mini size label below
    ctx.fillStyle = '#9CA3AF';
    ctx.font = '16px monospace';
    ctx.fillText(label, x + 6, y + h + 18);
  };

  // Convert cm to px @ 300 DPI (1 cm = ~118.11 px)
  const cmToPx = (cm: number) => Math.round(cm * 118.11);

  const p2x3_w = cmToPx(2.0);
  const p2x3_h = cmToPx(2.7);

  const p3x4_w = cmToPx(2.8);
  const p3x4_h = cmToPx(3.8);

  const p4x6_w = cmToPx(3.8);
  const p4x6_h = cmToPx(5.6);

  const marginX = cmToPx(0.8);
  let currentY = cmToPx(0.8);

  // Header info banner on print sheet
  ctx.fillStyle = '#111827';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText(`EraseDrop Pas Foto Print Sheet (${paperType} • 300 DPI)`, marginX, currentY);
  currentY += 40;

  // 1. Draw Row 1: 4x6 cm photos (2 copies)
  let curX = marginX;
  for (let i = 0; i < (isA4 ? 4 : 2); i++) {
    drawPhotoTile(curX, currentY, p4x6_w, p4x6_h, '4x6 cm');
    curX += p4x6_w + cmToPx(0.4);
  }

  currentY += p4x6_h + cmToPx(0.7);

  // 2. Draw Row 2: 3x4 cm photos (4 copies)
  curX = marginX;
  for (let i = 0; i < (isA4 ? 6 : 3); i++) {
    drawPhotoTile(curX, currentY, p3x4_w, p3x4_h, '3x4 cm');
    curX += p3x4_w + cmToPx(0.4);
  }

  currentY += p3x4_h + cmToPx(0.7);

  // 3. Draw Row 3: 2x3 cm photos (4 copies)
  curX = marginX;
  for (let i = 0; i < (isA4 ? 8 : 4); i++) {
    drawPhotoTile(curX, currentY, p2x3_w, p2x3_h, '2x3 cm');
    curX += p2x3_w + cmToPx(0.4);
  }

  return sheetCanvas;
}

