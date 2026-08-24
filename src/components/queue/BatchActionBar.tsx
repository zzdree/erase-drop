import React from 'react';
import { Palette, Archive, Trash2 } from 'lucide-react';
import type { BackdropOption } from '../../types';

interface BatchActionBarProps {
  totalCount: number;
  completedCount: number;
  onApplyBackdropToAll: (backdrop: BackdropOption) => void;
  onDownloadAllZip: () => void;
  onClearAll: () => void;
  isDownloadingZip: boolean;
}

export const BatchActionBar: React.FC<BatchActionBarProps> = ({
  totalCount,
  completedCount,
  onApplyBackdropToAll,
  onDownloadAllZip,
  onClearAll,
  isDownloadingZip,
}) => {
  const quickBackdrops: BackdropOption[] = [
    { type: 'transparent', value: '', name: 'Transparent' },
    { type: 'color', value: '#D61C1C', name: 'Pas Foto Merah' },
    { type: 'color', value: '#1C54D6', name: 'Pas Foto Biru' },
    { type: 'color', value: '#FFFFFF', name: 'Studio Putih' },
  ];

  return (
    <div className="w-full p-4 rounded-2xl bg-white/80 dark:bg-surface-850/80 border border-slate-200/80 dark:border-surface-800 backdrop-blur-xl shadow-lg flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">

      {/* Left: Quick Batch Backdrop Preset */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1.5 mr-1">
          <Palette className="w-3.5 h-3.5 text-brand-cyan" />
          <span>Batch Backdrop:</span>
        </span>

        {quickBackdrops.map((bd) => (
          <button
            key={bd.name}
            onClick={() => onApplyBackdropToAll(bd)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium border border-slate-200 dark:border-surface-700 hover:border-brand-cyan dark:hover:border-brand-cyan bg-white/50 dark:bg-surface-900/50 text-slate-700 dark:text-slate-300 transition-colors"
          >
            {bd.type === 'color' ? (
              <span className="w-2.5 h-2.5 rounded-full border border-black/20" style={{ backgroundColor: bd.value }} />
            ) : (
              <span className="w-2.5 h-2.5 rounded-full checkerboard-pattern border border-black/20" />
            )}
            <span>{bd.name}</span>
          </button>
        ))}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2.5 w-full lg:w-auto justify-end">
        <button
          onClick={onClearAll}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-colors"
          title="Clear all images"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear All</span>
        </button>

        <button
          onClick={onDownloadAllZip}
          disabled={completedCount === 0 || isDownloadingZip}
          className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-brand-cyan to-teal-400 text-slate-950 hover:brightness-110 shadow-md shadow-cyan-500/20 disabled:opacity-40 disabled:pointer-events-none active:scale-95 transition-all font-mono"
        >
          <Archive className="w-3.5 h-3.5" />
          <span>{isDownloadingZip ? 'Compressing ZIP...' : `Download All ZIP (${completedCount}/${totalCount})`}</span>
        </button>
      </div>

    </div>
  );
};
