import React from 'react';
import {
  Check,
  Maximize2,
  Smartphone,
  Tv,
  Camera,
  UserCheck
} from 'lucide-react';
import type { AspectRatioPreset, CropRect } from '../../../types';

interface CropPanelProps {
  currentCrop: CropRect;
  onChangeCrop: (crop: CropRect) => void;
  originalWidth: number;
  originalHeight: number;
}

export const CropPanel: React.FC<CropPanelProps> = ({
  currentCrop,
  onChangeCrop,
  originalWidth,
  originalHeight,
}) => {
  const calculateCropFromAspect = (ratioValue: number, preset: AspectRatioPreset): CropRect => {
    if (preset === 'original') {
      return { x: 0, y: 0, width: 1, height: 1, aspectRatio: 'original' };
    }

    const currentImgAspect = originalWidth / originalHeight;
    let w = 1;
    let h = 1;

    if (currentImgAspect > ratioValue) {
      // Image is wider than desired ratio
      w = (originalHeight * ratioValue) / originalWidth;
      h = 1;
    } else {
      // Image is taller than desired ratio
      w = 1;
      h = originalWidth / (originalHeight * ratioValue);
    }

    const x = (1 - w) / 2;
    const y = (1 - h) / 2;

    return { x, y, width: w, height: h, aspectRatio: preset };
  };

  const idPresets = [
    {
      id: 'id_2x3' as AspectRatioPreset,
      name: 'Pas Foto 2x3 cm',
      sub: '20 x 30 mm',
      ratio: 2 / 3,
      desc: 'Buku Nikah / Ijazah'
    },
    {
      id: 'id_3x4' as AspectRatioPreset,
      name: 'Pas Foto 3x4 cm',
      sub: '30 x 40 mm',
      ratio: 3 / 4,
      desc: 'Lamaran Kerja / CPNS / BUMN'
    },
    {
      id: 'id_4x6' as AspectRatioPreset,
      name: 'Pas Foto 4x6 cm',
      sub: '40 x 60 mm',
      ratio: 4 / 6,
      desc: 'SKCK / Paspor / Visa'
    },
  ];

  const socialPresets = [
    {
      id: '1:1' as AspectRatioPreset,
      name: '1:1 Square',
      icon: Camera,
      ratio: 1,
      desc: 'Instagram Post / Avatar'
    },
    {
      id: '9:16' as AspectRatioPreset,
      name: '9:16 Story / Reels',
      icon: Smartphone,
      ratio: 9 / 16,
      desc: 'TikTok / IG Story'
    },
    {
      id: '16:9' as AspectRatioPreset,
      name: '16:9 Landscape',
      icon: Tv,
      ratio: 16 / 9,
      desc: 'YouTube Thumbnail / Banner'
    },
    {
      id: '4:5' as AspectRatioPreset,
      name: '4:5 Portrait',
      icon: Camera,
      ratio: 4 / 5,
      desc: 'Instagram Feed Portrait'
    },
  ];

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-5 text-slate-800 dark:text-slate-200">

      {/* 1. Full Image Reset */}
      <div>
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
          1. Original Aspect Ratio
        </h4>
        <button
          onClick={() => onChangeCrop({ x: 0, y: 0, width: 1, height: 1, aspectRatio: 'original' })}
          className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
            currentCrop.aspectRatio === 'original'
              ? 'border-brand-cyan bg-brand-cyan/10 text-brand-cyan shadow-sm font-bold'
              : 'border-slate-200 dark:border-surface-800 hover:border-slate-300 dark:hover:border-surface-700 bg-white/50 dark:bg-surface-850/50'
          }`}
        >
          <div className="flex items-center gap-3">
            <Maximize2 className="w-5 h-5" />
            <div className="text-left">
              <div className="text-sm font-semibold text-slate-900 dark:text-white">Original (No Crop)</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {originalWidth} × {originalHeight} px
              </div>
            </div>
          </div>
          {currentCrop.aspectRatio === 'original' && <Check className="w-4 h-4 text-brand-cyan" />}
        </button>
      </div>

      {/* 2. Formal Indonesian ID Photo Dimensions */}
      <div>
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5 flex items-center gap-1.5">
          <UserCheck className="w-3.5 h-3.5 text-brand-cyan" />
          <span>2. Pas Foto Resmi Indonesia (Cetak)</span>
        </h4>
        <div className="flex flex-col gap-2">
          {idPresets.map((preset) => {
            const isSelected = currentCrop.aspectRatio === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => onChangeCrop(calculateCropFromAspect(preset.ratio, preset.id))}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                  isSelected
                    ? 'border-brand-cyan bg-brand-cyan/10 shadow-sm'
                    : 'border-slate-200 dark:border-surface-800 hover:border-slate-300 dark:hover:border-surface-700 bg-white/50 dark:bg-surface-850/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-blue/10 dark:bg-brand-blue/20 text-brand-blue dark:text-brand-cyan flex items-center justify-center font-bold text-xs font-mono">
                    {preset.id.replace('id_', '')}
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{preset.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-surface-800 text-slate-600 dark:text-slate-400 font-mono">
                        {preset.sub}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{preset.desc}</div>
                  </div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-brand-cyan shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Social Media & E-Commerce Ratios */}
      <div>
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
          3. Media Sosial & Marketplace
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {socialPresets.map((preset) => {
            const isSelected = currentCrop.aspectRatio === preset.id;
            const Icon = preset.icon;
            return (
              <button
                key={preset.id}
                onClick={() => onChangeCrop(calculateCropFromAspect(preset.ratio, preset.id))}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-brand-cyan bg-brand-cyan/10 shadow-sm'
                    : 'border-slate-200 dark:border-surface-800 hover:border-slate-300 dark:hover:border-surface-700 bg-white/50 dark:bg-surface-850/50'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-surface-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
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

    </div>
  );
};
