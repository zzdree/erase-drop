import React, { useState } from 'react';
import {
  Download,
  Trash2,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Plus,
  RefreshCw,
  Copy,
  Check,
  Palette
} from 'lucide-react';
import type { ProcessedImageItem, BackdropOption } from '../types';
import { BatchActionBar } from './queue/BatchActionBar';
import { saveAs } from 'file-saver';
import { compositeStudioImage, copyCanvasToClipboard } from '../services/canvasEffects';

interface QueueListProps {
  items: ProcessedImageItem[];
  onOpenStudio: (item: ProcessedImageItem) => void;
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
  onAddMore: () => void;
  onDownloadAllZip: () => void;
  onApplyBackdropToAll: (backdrop: BackdropOption) => void;
  onUpdateItemBackdrop?: (id: string, backdrop: BackdropOption) => void;
  isDownloadingZip: boolean;
  onRetryItem: (id: string) => void;
}

export const QueueList: React.FC<QueueListProps> = ({
  items,
  onOpenStudio,
  onRemoveItem,
  onClearAll,
  onAddMore,
  onDownloadAllZip,
  onApplyBackdropToAll,
  onUpdateItemBackdrop,
  isDownloadingZip,
  onRetryItem,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const completedCount = items.filter((i) => i.status === 'completed').length;
  const processingCount = items.filter((i) => i.status === 'processing').length;
  const totalCount = items.length;

  const quickPresets: BackdropOption[] = [
    { type: 'transparent', value: '', name: 'Transparan' },
    { type: 'color', value: '#FFFFFF', name: 'Putih' },
    { type: 'color', value: '#D61C1C', name: 'Merah KTP' },
    { type: 'color', value: '#1C54D6', name: 'Biru ID' },
  ];

  const handleCopySingle = async (item: ProcessedImageItem) => {
    if (!item.processedBlob || !item.processedUrl) return;
    try {
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

      await copyCanvasToClipboard(canvas);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const handleDownloadSingle = async (item: ProcessedImageItem, format: 'image/png' | 'image/jpeg' | 'image/webp' = 'image/png') => {
    if (!item.processedBlob || !item.processedUrl) return;
    try {
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

      canvas.toBlob((blob) => {
        if (blob) {
          const ext = format === 'image/jpeg' ? 'jpg' : format === 'image/webp' ? 'webp' : 'png';
          const baseName = item.name.replace(/\.[^/.]+$/, '');
          saveAs(blob, `${baseName}_erasedrop.${ext}`);
        }
      }, format, 0.95);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="w-full flex flex-col gap-5">

      {/* Top Batch Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-white/70 dark:bg-surface-850/70 border border-slate-200/80 dark:border-surface-800 backdrop-blur-xl shadow-lg">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Batch Queue</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-semibold bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/30">
              {completedCount}/{totalCount} Processed
            </span>
            {processingCount > 0 && (
              <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/30 animate-pulse font-mono">
                <Loader2 className="w-3 h-3 animate-spin" /> Processing AI
              </span>
            )}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            100% In-Browser Matting • Zero Network Transmission
          </p>
        </div>

        <button
          onClick={onAddMore}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add More Images</span>
        </button>
      </div>

      {/* Bulk Batch Actions */}
      <BatchActionBar
        totalCount={totalCount}
        completedCount={completedCount}
        onApplyBackdropToAll={onApplyBackdropToAll}
        onDownloadAllZip={onDownloadAllZip}
        onClearAll={onClearAll}
        isDownloadingZip={isDownloadingZip}
      />

      {/* Grid List of Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => {
          const isDone = item.status === 'completed';
          const isProc = item.status === 'processing';
          const isErr = item.status === 'error';

          return (
            <div
              key={item.id}
              className="group relative flex flex-col rounded-2xl border border-slate-200/80 dark:border-surface-800 bg-white/70 dark:bg-surface-850/70 backdrop-blur-xl shadow-md overflow-hidden hover:border-brand-cyan/50 dark:hover:border-brand-cyan/50 transition-all"
            >
              {/* Image Preview Container */}
              <div className="relative w-full h-52 checkerboard-pattern flex items-center justify-center p-3 overflow-hidden bg-slate-100 dark:bg-surface-900">
                {/* Backdrop representation */}
                {isDone && item.studioConfig.backdrop.type === 'color' && (
                  <div
                    className="absolute inset-0 transition-colors"
                    style={{ backgroundColor: item.studioConfig.backdrop.value }}
                  />
                )}
                {isDone && item.studioConfig.backdrop.type === 'gradient' && (
                  <div
                    className="absolute inset-0"
                    style={{ background: `linear-gradient(45deg, ${item.studioConfig.backdrop.value})` }}
                  />
                )}

                {/* Main Foreground Image */}
                <img
                  src={item.processedUrl || item.originalUrl}
                  alt={item.name}
                  className="relative z-10 max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                />

                {/* Progress / Status Overlay */}
                {isProc && (
                  <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-white">
                    <Loader2 className="w-8 h-8 text-brand-cyan animate-spin mb-2" />
                    <span className="text-xs font-mono font-bold text-brand-cyan">
                      {Math.round(item.progress)}%
                    </span>
                    <span className="text-[10px] text-slate-300 font-mono mt-1">
                      Extracting Alpha Matte...
                    </span>
                    <div className="w-3/4 h-1.5 bg-white/20 rounded-full mt-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-brand-cyan to-teal-400 transition-all duration-200"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {isErr && (
                  <div className="absolute inset-0 z-20 bg-red-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-white text-center">
                    <AlertCircle className="w-8 h-8 text-red-400 mb-1.5" />
                    <span className="text-xs font-bold text-red-300">Processing Failed</span>
                    <button
                      onClick={() => onRetryItem(item.id)}
                      className="mt-2.5 flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold bg-white text-red-900 hover:bg-slate-100"
                    >
                      <RefreshCw className="w-3 h-3" /> Retry
                    </button>
                  </div>
                )}

                {/* Corner Status Badge */}
                <div className="absolute top-2.5 left-2.5 z-20">
                  {isDone && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/90 text-white shadow-sm">
                      <CheckCircle2 className="w-3 h-3" /> AI READY
                    </span>
                  )}
                  {item.status === 'pending' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-slate-900/80 text-slate-300">
                      QUEUED
                    </span>
                  )}
                </div>

                {/* Duration Badge */}
                {item.durationMs && (
                  <div className="absolute top-2.5 right-2.5 z-20 text-[10px] font-mono bg-black/60 text-brand-cyan px-2 py-0.5 rounded-md backdrop-blur-sm">
                    {(item.durationMs / 1000).toFixed(1)}s
                  </div>
                )}
              </div>

              {/* Bottom Card Footer Actions */}
              <div className="p-3.5 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[180px]" title={item.name}>
                    {item.name}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                    {formatFileSize(item.originalSize)}
                  </span>
                </div>

                {/* Quick 1-Click Background Presets (When completed) */}
                {isDone && (
                  <div className="flex items-center justify-between gap-1 pt-1 pb-1 border-t border-b border-slate-100 dark:border-surface-800/80">
                    <span className="text-[10px] font-mono font-medium text-slate-400 dark:text-slate-500 flex items-center gap-1">
                      <Palette className="w-3 h-3 text-brand-cyan" /> BG:
                    </span>
                    <div className="flex items-center gap-1">
                      {quickPresets.map((preset) => {
                        const isSelected =
                          (preset.type === 'transparent' && item.studioConfig.backdrop.type === 'transparent') ||
                          (preset.type === 'color' && item.studioConfig.backdrop.type === 'color' && item.studioConfig.backdrop.value === preset.value);
                        return (
                          <button
                            key={preset.name}
                            onClick={() => onUpdateItemBackdrop?.(item.id, preset)}
                            className={`px-1.5 py-0.5 rounded-lg text-[10px] font-mono border transition-all flex items-center gap-1 ${
                              isSelected
                                ? 'border-brand-cyan bg-brand-cyan/10 text-brand-cyan font-bold shadow-sm'
                                : 'border-slate-200 dark:border-surface-700 bg-white/40 dark:bg-surface-900/40 text-slate-600 dark:text-slate-400 hover:border-slate-400'
                            }`}
                            title={`Ganti ke ${preset.name}`}
                          >
                            {preset.type === 'color' ? (
                              <span className="w-2 h-2 rounded-full border border-black/20" style={{ backgroundColor: preset.value }} />
                            ) : (
                              <span className="w-2 h-2 rounded-full checkerboard-pattern border border-black/20" />
                            )}
                            <span className="text-[9px]">{(preset.name || 'BG').split(' ')[0]}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-1.5 pt-1">
                  <button
                    onClick={() => onOpenStudio(item)}
                    disabled={!isDone}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-xl text-xs font-bold bg-brand-cyan/10 text-brand-cyan hover:bg-brand-cyan hover:text-slate-950 border border-brand-cyan/30 disabled:opacity-30 disabled:pointer-events-none transition-all"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Studio</span>
                  </button>

                  <button
                    onClick={() => handleCopySingle(item)}
                    disabled={!isDone}
                    className={`p-2 rounded-xl border transition-all ${
                      copiedId === item.id
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500'
                        : 'border-slate-200 dark:border-surface-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-surface-800 disabled:opacity-30'
                    }`}
                    title="1-Click Copy to Clipboard (PNG)"
                  >
                    {copiedId === item.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => handleDownloadSingle(item, 'image/png')}
                    disabled={!isDone}
                    className="p-2 rounded-xl border border-slate-200 dark:border-surface-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-surface-800 disabled:opacity-30 transition-colors"
                    title="Download PNG HD"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                    title="Hapus gambar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
