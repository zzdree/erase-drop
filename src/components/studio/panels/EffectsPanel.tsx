import React from 'react';
import {
  Sparkles,
  Sliders,
  Layers
} from 'lucide-react';
import type { StrokeEffect, DropShadowEffect, EdgeTuning } from '../../../types';

interface EffectsPanelProps {
  stroke: StrokeEffect;
  onChangeStroke: (stroke: StrokeEffect) => void;
  shadow: DropShadowEffect;
  onChangeShadow: (shadow: DropShadowEffect) => void;
  edge: EdgeTuning;
  onChangeEdge: (edge: EdgeTuning) => void;
}

export const EffectsPanel: React.FC<EffectsPanelProps> = ({
  stroke,
  onChangeStroke,
  shadow,
  onChangeShadow,
  edge,
  onChangeEdge,
}) => {
  const strokeColors = [
    '#FFFFFF', // White
    '#000000', // Black
    '#00E5FF', // Neon Cyan
    '#F59E0B', // Amber Gold
    '#10B981', // Emerald
    '#EC4899', // Hot Pink
    '#8B5CF6', // Purple
    '#D61C1C', // Red
  ];

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-5 text-slate-800 dark:text-slate-200">

      {/* 1. Outline / Sticker Stroke Effect */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-surface-800 bg-white/50 dark:bg-surface-850/50 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-pink-500/10 text-pink-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Subject Outline (Sticker)</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">YouTube thumbnail & sticker border</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={stroke.enabled}
              onChange={(e) => onChangeStroke({ ...stroke, enabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-surface-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-cyan"></div>
          </label>
        </div>

        {stroke.enabled && (
          <div className="flex flex-col gap-3.5 pt-2 border-t border-slate-200/80 dark:border-surface-800/80">
            {/* Outline Width Slider */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-slate-600 dark:text-slate-400">Outline Width</span>
                <span className="font-bold text-brand-cyan">{stroke.width} px</span>
              </div>
              <input
                type="range"
                min="1"
                max="24"
                value={stroke.width}
                onChange={(e) => onChangeStroke({ ...stroke, width: parseInt(e.target.value) })}
                className="w-full accent-brand-cyan"
              />
            </div>

            {/* Outline Color Swatches */}
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="text-slate-600 dark:text-slate-400">Stroke Color</span>
                <input
                  type="color"
                  value={stroke.color}
                  onChange={(e) => onChangeStroke({ ...stroke, color: e.target.value })}
                  className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent p-0"
                />
              </div>
              <div className="flex items-center gap-2">
                {strokeColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => onChangeStroke({ ...stroke, color })}
                    className={`w-6 h-6 rounded-full border shadow-sm transition-transform ${
                      stroke.color === color ? 'scale-125 border-brand-cyan ring-2 ring-brand-cyan/30' : 'border-slate-300 dark:border-surface-700 hover:scale-110'
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Drop Shadow Generator */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-surface-800 bg-white/50 dark:bg-surface-850/50 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Drop Shadow & Depth</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Realistic ground & float shadows</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={shadow.enabled}
              onChange={(e) => onChangeShadow({ ...shadow, enabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-surface-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-cyan"></div>
          </label>
        </div>

        {shadow.enabled && (
          <div className="flex flex-col gap-3.5 pt-2 border-t border-slate-200/80 dark:border-surface-800/80">
            {/* Blur Radius */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-slate-600 dark:text-slate-400">Blur Radius</span>
                <span className="font-bold text-brand-cyan">{shadow.blur} px</span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                value={shadow.blur}
                onChange={(e) => onChangeShadow({ ...shadow, blur: parseInt(e.target.value) })}
                className="w-full accent-brand-cyan"
              />
            </div>

            {/* Vertical Offset */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-slate-600 dark:text-slate-400">Y Offset</span>
                <span className="font-bold text-brand-cyan">{shadow.offsetY} px</span>
              </div>
              <input
                type="range"
                min="-30"
                max="30"
                value={shadow.offsetY}
                onChange={(e) => onChangeShadow({ ...shadow, offsetY: parseInt(e.target.value) })}
                className="w-full accent-brand-cyan"
              />
            </div>

            {/* Shadow Opacity */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-slate-600 dark:text-slate-400">Shadow Opacity</span>
                <span className="font-bold text-brand-cyan">{Math.round(shadow.opacity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="1"
                step="0.05"
                value={shadow.opacity}
                onChange={(e) => onChangeShadow({ ...shadow, opacity: parseFloat(e.target.value) })}
                className="w-full accent-brand-cyan"
              />
            </div>
          </div>
        )}
      </div>

      {/* 3. Edge Feathering & Smoothing */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-surface-800 bg-white/50 dark:bg-surface-850/50 flex flex-col gap-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Edge Feathering & Softness</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Smooth jagged pixel borders</p>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs font-mono mb-1.5">
            <span className="text-slate-600 dark:text-slate-400">Feather Radius</span>
            <span className="font-bold text-brand-cyan">{edge.feather} px</span>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            value={edge.feather}
            onChange={(e) => onChangeEdge({ ...edge, feather: parseInt(e.target.value) })}
            className="w-full accent-brand-cyan"
          />
        </div>
      </div>

    </div>
  );
};
