import React, { useRef, useEffect, useState } from 'react';
import type { StudioConfig, BrushSettings } from '../../types';
import { compositeStudioImage } from '../../services/canvasEffects';

interface StudioCanvasProps {
  processedImgUrl: string;
  originalImgUrl: string;
  config: StudioConfig;
  brush: BrushSettings;
  splitView: boolean;
  sliderPos: number; // 0 to 100
  zoom: number; // 0.2 to 3.0
  onStrokeComplete?: () => void;
  maskCanvasRef?: React.MutableRefObject<HTMLCanvasElement | null>;
}

export const StudioCanvas: React.FC<StudioCanvasProps> = ({
  processedImgUrl,
  originalImgUrl,
  config,
  brush,
  splitView,
  sliderPos,
  zoom,
  onStrokeComplete,
  maskCanvasRef: externalMaskRef,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const internalMaskRef = useRef<HTMLCanvasElement | null>(null);
  const maskCanvasRef = externalMaskRef || internalMaskRef;

  const [imageSize, setImageSize] = useState<{ width: number; height: number }>({ width: 800, height: 800 });
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  // Panning state when zoomed in
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const isPanningRef = useRef(false);
  const startPanRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Reset pan when zoom is at default
  useEffect(() => {
    if (zoom <= 1.0) {
      setPan({ x: 0, y: 0 });
    }
  }, [zoom]);

  // Initialize mask canvas for manual brush touch-ups
  useEffect(() => {
    if (!maskCanvasRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = imageSize.width;
      canvas.height = imageSize.height;
      maskCanvasRef.current = canvas;
    } else if (maskCanvasRef.current.width !== imageSize.width || maskCanvasRef.current.height !== imageSize.height) {
      maskCanvasRef.current.width = imageSize.width;
      maskCanvasRef.current.height = imageSize.height;
    }
  }, [imageSize, maskCanvasRef]);

  // Load images and composite
  const renderComposite = async () => {
    if (!canvasRef.current) return;
    const subImg = new Image();
    subImg.crossOrigin = 'anonymous';

    subImg.onload = async () => {
      const w = subImg.naturalWidth || 800;
      const h = subImg.naturalHeight || 800;
      setImageSize({ width: w, height: h });

      let origImg: HTMLImageElement | null = null;
      if (originalImgUrl) {
        origImg = new Image();
        origImg.crossOrigin = 'anonymous';
        await new Promise<void>((resolve) => {
          origImg!.onload = () => resolve();
          origImg!.onerror = () => resolve();
          origImg!.src = originalImgUrl;
        });
      }

      // Composite full rendered result with effects & backdrop
      const renderedCanvas = await compositeStudioImage(
        subImg,
        origImg,
        w,
        h,
        config.backdrop,
        config.stroke,
        config.shadow,
        config.adjustments,
        config.edge,
        config.crop,
        maskCanvasRef.current
      );

      if (!canvasRef.current) return;

      const mainCanvas = canvasRef.current;
      mainCanvas.width = renderedCanvas.width;
      mainCanvas.height = renderedCanvas.height;
      const ctx = mainCanvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

      if (splitView && origImg) {
        // Draw before/after split view
        const splitX = (sliderPos / 100) * mainCanvas.width;

        // Left side: Processed result
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, splitX, mainCanvas.height);
        ctx.clip();
        ctx.drawImage(renderedCanvas, 0, 0);
        ctx.restore();

        // Right side: Original photo
        ctx.save();
        ctx.beginPath();
        ctx.rect(splitX, 0, mainCanvas.width - splitX, mainCanvas.height);
        ctx.clip();
        ctx.drawImage(origImg, 0, 0, mainCanvas.width, mainCanvas.height);
        ctx.restore();

        // Split divider line
        ctx.save();
        ctx.strokeStyle = '#00E5FF';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(splitX, 0);
        ctx.lineTo(splitX, mainCanvas.height);
        ctx.stroke();
        ctx.restore();
      } else {
        // Normal mode
        ctx.drawImage(renderedCanvas, 0, 0);
      }
    };

    subImg.src = processedImgUrl;
  };

  useEffect(() => {
    renderComposite();
  }, [processedImgUrl, originalImgUrl, config, splitView, sliderPos]);

  // Pointer brush drawing helpers
  const getCanvasCoords = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const drawMask = (x: number, y: number) => {
    if (!maskCanvasRef.current || brush.mode === 'none') return;
    const ctx = maskCanvasRef.current.getContext('2d');
    if (!ctx) return;

    ctx.save();
    if (brush.mode === 'erase') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = `rgba(0, 0, 0, ${brush.opacity})`;
    } else {
      ctx.globalCompositeOperation = 'destination-out';
    }

    ctx.beginPath();
    if (lastPointRef.current) {
      ctx.lineWidth = brush.size * 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = ctx.fillStyle;
      ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else {
      ctx.arc(x, y, brush.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    lastPointRef.current = { x, y };
    renderComposite();
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (brush.mode !== 'none') {
      isDrawingRef.current = true;
      const coords = getCanvasCoords(e);
      lastPointRef.current = null;
      drawMask(coords.x, coords.y);
    } else if (zoom > 1.0) {
      // Start Pan mode when zoomed in
      isPanningRef.current = true;
      startPanRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isDrawingRef.current && brush.mode !== 'none') {
      const coords = getCanvasCoords(e);
      drawMask(coords.x, coords.y);
    } else if (isPanningRef.current && zoom > 1.0) {
      setPan({
        x: e.clientX - startPanRef.current.x,
        y: e.clientY - startPanRef.current.y,
      });
    }
  };

  const handlePointerUp = () => {
    if (isDrawingRef.current) {
      isDrawingRef.current = false;
      lastPointRef.current = null;
      onStrokeComplete?.();
    }
    if (isPanningRef.current) {
      isPanningRef.current = false;
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center p-4 overflow-hidden checkerboard-pattern select-none cursor-grab active:cursor-grabbing"
      onPointerLeave={handlePointerUp}
    >
      <div
        className="relative transition-transform duration-75 shadow-2xl rounded-lg overflow-hidden border border-black/20"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          maxWidth: '100%',
          maxHeight: '100%',
        }}
      >
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className={`block max-w-full max-h-[72vh] object-contain ${
            brush.mode !== 'none' ? 'cursor-crosshair touch-none' : zoom > 1 ? 'cursor-grab' : 'cursor-default'
          }`}
        />
      </div>
    </div>
  );
};
