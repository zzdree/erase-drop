import { useState, useRef, useCallback, useEffect } from 'react';
import type { BrushSettings } from '../types';

interface UseTouchUpBrushProps {
  width: number;
  height: number;
  brush: BrushSettings;
  onStrokeComplete?: () => void;
}

export function useTouchUpBrush({ width, height, brush, onStrokeComplete }: UseTouchUpBrushProps) {
  const [maskCanvas, setMaskCanvas] = useState<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  // Initialize mask canvas
  useEffect(() => {
    if (width <= 0 || height <= 0) return;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    setMaskCanvas(canvas);
  }, [width, height]);

  const drawBrushStroke = useCallback((x: number, y: number) => {
    if (!maskCanvas || brush.mode === 'none') return;
    const ctx = maskCanvas.getContext('2d');
    if (!ctx) return;

    ctx.save();

    if (brush.mode === 'erase') {
      // Erase adds white mask (blocks subject)
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = `rgba(0, 0, 0, ${brush.opacity})`;
    } else if (brush.mode === 'restore') {
      // Restore cuts out from mask
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = `rgba(0, 0, 0, ${brush.opacity})`;
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
  }, [maskCanvas, brush]);

  const startStroke = useCallback((x: number, y: number) => {
    if (brush.mode === 'none') return;
    isDrawingRef.current = true;
    lastPointRef.current = null;
    drawBrushStroke(x, y);
  }, [brush.mode, drawBrushStroke]);

  const continueStroke = useCallback((x: number, y: number) => {
    if (!isDrawingRef.current) return;
    drawBrushStroke(x, y);
  }, [drawBrushStroke]);

  const endStroke = useCallback(() => {
    if (isDrawingRef.current) {
      isDrawingRef.current = false;
      lastPointRef.current = null;
      onStrokeComplete?.();
    }
  }, [onStrokeComplete]);

  const clearMask = useCallback(() => {
    if (!maskCanvas) return;
    const ctx = maskCanvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
    onStrokeComplete?.();
  }, [maskCanvas, onStrokeComplete]);

  return {
    maskCanvas,
    startStroke,
    continueStroke,
    endStroke,
    clearMask,
    isDrawing: isDrawingRef.current
  };
}
