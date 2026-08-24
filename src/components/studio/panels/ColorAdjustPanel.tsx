import React from 'react';
import {
  Sun,
  Contrast,
  Palette,
  Thermometer,
  RotateCcw
} from 'lucide-react';
import type { ColorAdjustments } from '../../../types';

interface ColorAdjustPanelProps {
  adjustments: ColorAdjustments;
  onChangeAdjustments: (adjustments: ColorAdjustments) => void;
}

export const ColorAdjustPanel: React.FC<ColorAdjustPanelProps> = ({
  adjustments,
  onChangeAdjustments,
}) => {
  const handleReset = () => {
    onChangeAdjustments({
      brightness: 0,
      contrast: 0,
      saturation: 0,
      temperature: 0,
      blurBackground: 0,
    });
  };

  return (
    <div className="flex flex-col gap-5 p-4 sm:p-5 text-slate-800 dark:text-slate-200">

      {/* Header & Reset */}
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Subject Tone Adjustments
        </h4>
        <button
          onClick={handleReset}
          className="text-xs text-brand-cyan hover:underline flex items-center gap-1 font-medium"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      <div className="flex flex-col gap-4 p-4 rounded-2xl border border-slate-200 dark:border-surface-800 bg-white/50 dark:bg-surface-850/50">

        {/* 1. Brightness */}
        <div>
          <div className="flex items-center justify-between text-xs font-mono mb-1.5">
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Brightness</span>
            </div>
            <span className="font-bold text-brand-cyan">
              {adjustments.brightness > 0 ? `+${adjustments.brightness}` : adjustments.brightness}%
            </span>
          </div>
          <input
            type="range"
            min="-50"
            max="50"
            value={adjustments.brightness}
            onChange={(e) => onChangeAdjustments({ ...adjustments, brightness: parseInt(e.target.value) })}
            className="w-full accent-brand-cyan"
          />
        </div>

        {/* 2. Contrast */}
        <div>
          <div className="flex items-center justify-between text-xs font-mono mb-1.5">
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <Contrast className="w-3.5 h-3.5 text-purple-500" />
              <span>Contrast</span>
            </div>
            <span className="font-bold text-brand-cyan">
              {adjustments.contrast > 0 ? `+${adjustments.contrast}` : adjustments.contrast}%
            </span>
          </div>
          <input
            type="range"
            min="-50"
            max="50"
            value={adjustments.contrast}
            onChange={(e) => onChangeAdjustments({ ...adjustments, contrast: parseInt(e.target.value) })}
            className="w-full accent-brand-cyan"
          />
        </div>

        {/* 3. Saturation */}
        <div>
          <div className="flex items-center justify-between text-xs font-mono mb-1.5">
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <Palette className="w-3.5 h-3.5 text-pink-500" />
              <span>Saturation</span>
            </div>
            <span className="font-bold text-brand-cyan">
              {adjustments.saturation > 0 ? `+${adjustments.saturation}` : adjustments.saturation}%
            </span>
          </div>
          <input
            type="range"
            min="-50"
            max="50"
            value={adjustments.saturation}
            onChange={(e) => onChangeAdjustments({ ...adjustments, saturation: parseInt(e.target.value) })}
            className="w-full accent-brand-cyan"
          />
        </div>

        {/* 4. Temperature */}
        <div>
          <div className="flex items-center justify-between text-xs font-mono mb-1.5">
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <Thermometer className="w-3.5 h-3.5 text-blue-500" />
              <span>Temperature (Warm / Cool)</span>
            </div>
            <span className="font-bold text-brand-cyan">
              {adjustments.temperature > 0 ? `+${adjustments.temperature}` : adjustments.temperature}
            </span>
          </div>
          <input
            type="range"
            min="-40"
            max="40"
            value={adjustments.temperature}
            onChange={(e) => onChangeAdjustments({ ...adjustments, temperature: parseInt(e.target.value) })}
            className="w-full accent-brand-cyan"
          />
        </div>

      </div>

    </div>
  );
};
