import React from 'react';
import { Eraser, RotateCcw, Paintbrush } from 'lucide-react';
import type { BrushSettings } from '../../../types';

interface TouchUpPanelProps {
  brush: BrushSettings;
  onChangeBrush: (brush: BrushSettings) => void;
  onClearMask: () => void;
}

export const TouchUpPanel: React.FC<TouchUpPanelProps> = ({
  brush,
  onChangeBrush,
  onClearMask,
}) => {
  return (
    <div className="flex flex-col gap-6 p-4 sm:p-5 text-slate-800 dark:text-slate-200">

      {/* Mode Selector */}
      <div>
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
          1. Kuas Touch-up Mode
        </h4>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => onChangeBrush({ ...brush, mode: brush.mode === 'erase' ? 'none' : 'erase' })}
            className={`flex items-center gap-2.5 p-3 rounded-xl border transition-all ${
              brush.mode === 'erase'
                ? 'border-red-500 bg-red-500/10 text-red-500 font-bold shadow-sm'
                : 'border-slate-200 dark:border-surface-800 hover:border-slate-300 dark:hover:border-surface-700 bg-white/50 dark:bg-surface-850/50'
            }`}
          >
            <Eraser className="w-4 h-4 shrink-0" />
            <div className="text-left">
              <div className="text-xs font-bold text-slate-900 dark:text-white">Erase Area</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Hapus sisa background</div>
            </div>
          </button>

          <button
            onClick={() => onChangeBrush({ ...brush, mode: brush.mode === 'restore' ? 'none' : 'restore' })}
            className={`flex items-center gap-2.5 p-3 rounded-xl border transition-all ${
              brush.mode === 'restore'
                ? 'border-brand-cyan bg-brand-cyan/10 text-brand-cyan font-bold shadow-sm'
                : 'border-slate-200 dark:border-surface-800 hover:border-slate-300 dark:hover:border-surface-700 bg-white/50 dark:bg-surface-850/50'
            }`}
          >
            <Paintbrush className="w-4 h-4 shrink-0" />
            <div className="text-left">
              <div className="text-xs font-bold text-slate-900 dark:text-white">Restore Area</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Pulihkan subjek asli</div>
            </div>
          </button>
        </div>
      </div>

      {/* Brush Controls */}
      <div className="flex flex-col gap-4 p-4 rounded-2xl border border-slate-200 dark:border-surface-800 bg-white/50 dark:bg-surface-850/50">
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          2. Pengaturan Kuas
        </h4>

        {/* Brush Size */}
        <div>
          <div className="flex justify-between text-xs font-mono mb-1.5">
            <span className="text-slate-600 dark:text-slate-400">Ukuran Kuas (Radius)</span>
            <span className="font-bold text-brand-cyan">{brush.size} px</span>
          </div>
          <input
            type="range"
            min="4"
            max="120"
            value={brush.size}
            onChange={(e) => onChangeBrush({ ...brush, size: parseInt(e.target.value) })}
            className="w-full accent-brand-cyan"
          />
        </div>

        {/* Brush Opacity */}
        <div>
          <div className="flex justify-between text-xs font-mono mb-1.5">
            <span className="text-slate-600 dark:text-slate-400">Opasitas Kuas</span>
            <span className="font-bold text-brand-cyan">{Math.round(brush.opacity * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.05"
            value={brush.opacity}
            onChange={(e) => onChangeBrush({ ...brush, opacity: parseFloat(e.target.value) })}
            className="w-full accent-brand-cyan"
          />
        </div>
      </div>

      {/* Clear/Reset Mask */}
      <div>
        <button
          onClick={onClearMask}
          className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-surface-800 hover:bg-red-500/10 hover:border-red-500 text-slate-700 dark:text-slate-300 hover:text-red-500 font-medium transition-colors text-xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Semua Kuas Touch-up</span>
        </button>
      </div>

    </div>
  );
};
