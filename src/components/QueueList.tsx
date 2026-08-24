import React from 'react';
import { 
  Download, 
  Trash2, 
  Sliders, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Plus, 
  Archive,
  RefreshCw,
  Eye
} from 'lucide-react';
import type { ProcessedImageItem } from '../types';
import { saveAs } from 'file-saver';
import { renderImageWithBackdrop } from '../services/zipExporter';

interface QueueListProps {
  items: ProcessedImageItem[];
  onOpenStudio: (item: ProcessedImageItem) => void;
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
  onAddMore: () => void;
  onDownloadAllZip: () => void;
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
  isDownloadingZip,
  onRetryItem,
}) => {
  const completedCount = items.filter((i) => i.status === 'completed').length;
  const processingCount = items.filter((i) => i.status === 'processing').length;
  const totalCount = items.length;

  const handleDownloadSingle = async (item: ProcessedImageItem) => {
    if (!item.processedBlob) return;
    try {
      const baseName = item.name.replace(/\.[^/.]+$/, '');
      if (item.backdrop.type === 'transparent') {
        saveAs(item.processedBlob, `${baseName}_transparent.png`);
      } else {
        const rendered = await renderImageWithBackdrop(item.processedBlob, item.backdrop);
        saveAs(rendered, `${baseName}_${item.backdrop.type}.png`);
      }
    } catch (err) {
      console.error('Failed to download image:', err);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* Top Batch Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white/70 dark:bg-surface-850/70 border border-slate-200/80 dark:border-surface-800 backdrop-blur-xl shadow-lg">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Processing Queue</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-semibold bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/30">
              {completedCount}/{totalCount} Done
            </span>
            {processingCount > 0 && (
              <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/30 animate-pulse">
                <Loader2 className="w-3 h-3 animate-spin" /> Processing
              </span>
            )}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Images processed on-device. Click <strong>Studio</strong> to customize background color or pas foto preset.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          {/* Add More Files Button */}
          <button
            onClick={onAddMore}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-surface-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-surface-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add More</span>
          </button>

          {/* Clear All Button */}
          <button
            onClick={onClearAll}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 border border-rose-500/20 transition-colors"
            title="Clear Queue"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>

          {/* Download All as ZIP Button */}
          <button
            onClick={onDownloadAllZip}
            disabled={completedCount === 0 || isDownloadingZip}
            className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
              completedCount > 0 && !isDownloadingZip
                ? 'bg-gradient-to-r from-brand-cyan to-brand-blue text-black hover:opacity-90 hover:scale-[1.02] shadow-cyan-500/20'
                : 'bg-slate-200 dark:bg-surface-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
            }`}
          >
            {isDownloadingZip ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Archiving ZIP...</span>
              </>
            ) : (
              <>
                <Archive className="w-4 h-4" />
                <span>Download All ZIP ({completedCount})</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((item) => (
          <div
            key={item.id}
            className="group relative flex flex-col rounded-2xl bg-white dark:bg-surface-850 border border-slate-200/80 dark:border-surface-800 overflow-hidden shadow-md hover:shadow-xl hover:border-brand-cyan/40 transition-all duration-300"
          >
            {/* Image Preview Canvas Box */}
            <div 
              className="relative w-full aspect-[4/3] flex items-center justify-center p-3 cursor-pointer overflow-hidden"
              style={{
                backgroundColor: item.backdrop.type === 'color' ? item.backdrop.value : undefined,
                backgroundImage: item.backdrop.type === 'gradient' ? `linear-gradient(${item.backdrop.value})` : undefined,
              }}
              onClick={() => item.status === 'completed' && onOpenStudio(item)}
            >
              {/* If transparent, show optical checkerboard */}
              {item.backdrop.type === 'transparent' && (
                <div className="absolute inset-0 checkerboard-pattern opacity-80" />
              )}

              {/* Display Result or Original */}
              <img
                src={item.processedUrl || item.originalUrl}
                alt={item.name}
                className="relative z-10 max-h-full max-w-full object-contain rounded-lg transition-transform duration-300 group-hover:scale-105"
              />

              {/* Status Overlay when Processing or Error */}
              {item.status === 'processing' && (
                <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-white">
                  <div className="relative w-12 h-12 mb-3">
                    <Loader2 className="w-12 h-12 text-brand-cyan animate-spin" />
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-bold">
                      {item.progress}%
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-brand-cyan text-center">Removing Background...</p>
                  <div className="w-36 h-1.5 bg-surface-700 rounded-full overflow-hidden mt-2">
                    <div
                      className="h-full bg-gradient-to-r from-brand-cyan to-emerald-400 transition-all duration-300"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {item.status === 'pending' && (
                <div className="absolute inset-0 z-20 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-900/80 text-slate-300 border border-slate-700">
                    Queued
                  </span>
                </div>
              )}

              {item.status === 'error' && (
                <div className="absolute inset-0 z-20 bg-rose-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-white">
                  <AlertCircle className="w-8 h-8 text-rose-400 mb-2" />
                  <p className="text-xs font-semibold text-rose-300 text-center mb-3">Processing Failed</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRetryItem(item.id);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs bg-rose-600 hover:bg-rose-500 font-semibold"
                  >
                    <RefreshCw className="w-3 h-3" /> Retry
                  </button>
                </div>
              )}

              {/* Hover Quick View Badge */}
              {item.status === 'completed' && (
                <div className="absolute top-3 left-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold bg-black/70 text-white backdrop-blur-md">
                    <Eye className="w-3 h-3 text-brand-cyan" /> Click to Edit
                  </span>
                </div>
              )}

              {/* Duration Badge */}
              {item.durationMs && (
                <div className="absolute bottom-2 right-2 z-20">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-black/70 text-emerald-400 backdrop-blur-md">
                    {(item.durationMs / 1000).toFixed(1)}s
                  </span>
                </div>
              )}
            </div>

            {/* Card Metadata & Actions */}
            <div className="p-4 flex flex-col justify-between flex-grow gap-3">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate" title={item.name}>
                    {item.name}
                  </h4>
                  {item.status === 'completed' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
                  <span>{formatFileSize(item.originalSize)}</span>
                  <span>•</span>
                  <span className="uppercase">{item.backdrop.type}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-surface-800">
                <button
                  onClick={() => onOpenStudio(item)}
                  disabled={item.status !== 'completed'}
                  className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    item.status === 'completed'
                      ? 'bg-slate-100 dark:bg-surface-800 text-slate-800 dark:text-slate-200 hover:bg-brand-cyan/20 hover:text-brand-cyan'
                      : 'bg-slate-100/50 dark:bg-surface-800/40 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                  }`}
                  title="Open Backdrop Studio"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Studio</span>
                </button>

                <button
                  onClick={() => handleDownloadSingle(item)}
                  disabled={item.status !== 'completed'}
                  className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    item.status === 'completed'
                      ? 'bg-brand-cyan text-black hover:bg-cyan-300 shadow-sm'
                      : 'bg-slate-200 dark:bg-surface-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                  }`}
                  title="Download Image"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>

                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                  title="Remove from queue"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
