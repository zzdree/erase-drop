import React, { useRef } from 'react';
import { Check, Upload, Sparkles } from 'lucide-react';
import type { BackdropOption } from '../../../types';

interface BackgroundPanelProps {
  currentBackdrop: BackdropOption;
  onChangeBackdrop: (backdrop: BackdropOption) => void;
  hasOriginalImage: boolean;
}

export const BackgroundPanel: React.FC<BackgroundPanelProps> = ({
  currentBackdrop,
  onChangeBackdrop,
  hasOriginalImage,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Indonesian Formal ID & Studio Presets
  const idPresets = [
    { name: 'Pas Foto Merah', color: '#D61C1C', desc: 'Indonesian ID (Tahun Ganjil)' },
    { name: 'Pas Foto Biru', color: '#1C54D6', desc: 'Indonesian ID (Tahun Genap)' },
    { name: 'Paspor / Visa Putih', color: '#FFFFFF', desc: 'International Passport' },
    { name: 'CPNS / Kedinasan Abu', color: '#64748B', desc: 'Formal Document Gray' },
  ];

  const solidPresets = [
    { name: 'Studio Black', color: '#090A0F' },
    { name: 'Charcoal Slate', color: '#1E293B' },
    { name: 'Pure White', color: '#FFFFFF' },
    { name: 'Minimal Gray', color: '#E2E8F0' },
    { name: 'Sunset Peach', color: '#FF6B6B' },
    { name: 'Electric Mint', color: '#10B981' },
    { name: 'Cyber Yellow', color: '#F59E0B' },
    { name: 'Neon Purple', color: '#8B5CF6' },
  ];

  const gradientPresets = [
    { name: 'Cyber Neon', value: '#00E5FF, #7928CA' },
    { name: 'Sunset Glow', value: '#FF512F, #DD2476' },
    { name: 'Ocean Wave', value: '#2193b0, #6dd5ed' },
    { name: 'Emerald Forest', value: '#11998e, #38ef7d' },
    { name: 'Deep Cosmic', value: '#8A2387, #E94057, #F27121' },
    { name: 'Soft Aurora', value: '#a8ff78, #78ffd6' },
    { name: 'Midnight Violet', value: '#0f0c29, #302b63, #24243e' },
  ];

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onChangeBackdrop({
            type: 'image',
            value: event.target.result as string,
            name: 'Custom Background'
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-5 text-slate-800 dark:text-slate-200">

      {/* 1. Transparent Alpha Option */}
      <div>
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
          1. Transparency Mode
        </h4>
        <button
          onClick={() => onChangeBackdrop({ type: 'transparent', value: '', name: 'Transparent' })}
          className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
            currentBackdrop.type === 'transparent'
              ? 'border-brand-cyan bg-brand-cyan/10 text-brand-cyan shadow-sm font-bold'
              : 'border-slate-200 dark:border-surface-800 hover:border-slate-300 dark:hover:border-surface-700 bg-white/50 dark:bg-surface-850/50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg checkerboard-pattern border border-slate-300 dark:border-surface-700" />
            <div className="text-left">
              <div className="text-sm font-semibold text-slate-900 dark:text-white">Transparent (PNG)</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Zero background alpha cutout</div>
            </div>
          </div>
          {currentBackdrop.type === 'transparent' && <Check className="w-4 h-4 text-brand-cyan" />}
        </button>
      </div>

      {/* 2. Portrait Mode / Bokeh Blur */}
      {hasOriginalImage && (
        <div>
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
            2. DSLR Portrait Bokeh Effect
          </h4>
          <button
            onClick={() => onChangeBackdrop({ type: 'blur_original', value: '15', name: 'Blur Original' })}
            className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
              currentBackdrop.type === 'blur_original'
                ? 'border-brand-cyan bg-brand-cyan/10 text-brand-cyan shadow-sm font-bold'
                : 'border-slate-200 dark:border-surface-800 hover:border-slate-300 dark:hover:border-surface-700 bg-white/50 dark:bg-surface-850/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-slate-900 dark:text-white">Blur Original Background</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Cinematic lens depth-of-field</div>
              </div>
            </div>
            {currentBackdrop.type === 'blur_original' && <Check className="w-4 h-4 text-brand-cyan" />}
          </button>
        </div>
      )}

      {/* 3. Indonesian ID Photo Standard Presets */}
      <div>
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
          3. Pas Foto Resmi Indonesia
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {idPresets.map((preset) => {
            const isSelected = currentBackdrop.type === 'color' && currentBackdrop.value === preset.color;
            return (
              <button
                key={preset.name}
                onClick={() => onChangeBackdrop({ type: 'color', value: preset.color, name: preset.name })}
                className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-brand-cyan bg-brand-cyan/10 shadow-sm'
                    : 'border-slate-200 dark:border-surface-800 hover:border-slate-300 dark:hover:border-surface-700 bg-white/50 dark:bg-surface-850/50'
                }`}
              >
                <div
                  className="w-7 h-7 rounded-lg shrink-0 shadow-inner border border-black/10"
                  style={{ backgroundColor: preset.color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{preset.name}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{preset.desc}</div>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-brand-cyan shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Studio Color Swatches & Hex Picker */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            4. Studio Solid Colors
          </h4>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={currentBackdrop.type === 'color' ? currentBackdrop.value : '#1C54D6'}
              onChange={(e) => onChangeBackdrop({ type: 'color', value: e.target.value, name: 'Custom Color' })}
              className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent p-0"
              title="Pick any color"
            />
            <span className="text-xs font-mono text-slate-500">Pick Custom</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {solidPresets.map((preset) => {
            const isSelected = currentBackdrop.type === 'color' && currentBackdrop.value === preset.color;
            return (
              <button
                key={preset.name}
                onClick={() => onChangeBackdrop({ type: 'color', value: preset.color, name: preset.name })}
                className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border text-center transition-all ${
                  isSelected
                    ? 'border-brand-cyan bg-brand-cyan/10'
                    : 'border-slate-200 dark:border-surface-800 hover:border-slate-300 dark:hover:border-surface-700 bg-white/50 dark:bg-surface-850/50'
                }`}
              >
                <div
                  className="w-full h-7 rounded-lg shadow-inner border border-black/10"
                  style={{ backgroundColor: preset.color }}
                />
                <span className="text-[10px] font-medium text-slate-700 dark:text-slate-300 truncate w-full">
                  {preset.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Studio Multi-stop Gradients */}
      <div>
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
          5. Multi-stop Studio Gradients
        </h4>
        <div className="grid grid-cols-2 gap-2.5">
          {gradientPresets.map((grad) => {
            const isSelected = currentBackdrop.type === 'gradient' && currentBackdrop.value === grad.value;
            return (
              <button
                key={grad.name}
                onClick={() => onChangeBackdrop({ type: 'gradient', value: grad.value, name: grad.name })}
                className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-brand-cyan bg-brand-cyan/10 shadow-sm'
                    : 'border-slate-200 dark:border-surface-800 hover:border-slate-300 dark:hover:border-surface-700 bg-white/50 dark:bg-surface-850/50'
                }`}
              >
                <div
                  className="w-7 h-7 rounded-lg shrink-0 shadow-inner"
                  style={{ background: `linear-gradient(45deg, ${grad.value})` }}
                />
                <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                  {grad.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. Custom Image Backdrop Upload */}
      <div>
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
          6. Custom Image Backdrop
        </h4>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleCustomUpload}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 p-3.5 rounded-xl border-2 border-dashed border-slate-300 dark:border-surface-700 hover:border-brand-cyan text-slate-700 dark:text-slate-300 hover:text-brand-cyan font-medium transition-colors text-sm"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Background Image</span>
        </button>
      </div>

    </div>
  );
};
