import React, { useState } from 'react';
import {
  ShieldCheck,
  Zap,
  Sliders,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface HeroSectionProps {
  onSelectSample: (sampleUrl: string, name: string) => void;
  isGpuSupported: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSelectSample, isGpuSupported }) => {
  const [sliderVal, setSliderVal] = useState(50);
  const [activeBackdropPreview, setActiveBackdropPreview] = useState<'transparent' | 'red' | 'blue' | 'gradient'>('transparent');

  const sampleOriginal = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80';

  return (
    <div className="w-full flex flex-col items-center text-center mb-8 animate-in fade-in slide-in-from-top-3 duration-500">

      {/* Modern Compact Floating Pill */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-obsidian-850 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-obsidian-750 shadow-sm mb-5">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-cyan opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-cyan"></span>
        </span>
        <span>100% In-Browser AI • Tanpa Kirim Data ke Server</span>
      </div>

      {/* Main Clean Headline */}
      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white max-w-3xl mb-4 leading-[1.15]">
        Hapus Background Foto Secara Instan &amp; Privat
      </h1>

      {/* Sub-headline description */}
      <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed mb-6">
        Didukung AI WebGPU lokal, tanpa batas pemakaian, dan tanpa watermark. Dilengkapi editor ganti warna pas foto resmi, stiker thumbnail, dan ekspor instan.
      </p>

      {/* Interactive Showcase Preview */}
      <div className="w-full max-w-xl relative rounded-2xl p-2.5 sm:p-3 bg-white/70 dark:bg-obsidian-900/80 border border-slate-200/80 dark:border-obsidian-800 backdrop-blur-xl shadow-lg mb-8">

        {/* Top Mini Control bar */}
        <div className="flex items-center justify-between px-2 py-1.5 border-b border-slate-100 dark:border-obsidian-800/80 mb-2.5 text-xs">
          <span className="font-mono text-slate-500 text-[11px] flex items-center gap-1.5">
            <Sliders className="w-3 h-3 text-brand-cyan" />
            <span>Hasil Potongan AI</span>
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveBackdropPreview('transparent')}
              className={`px-2 py-0.5 rounded text-[11px] font-mono transition-all ${
                activeBackdropPreview === 'transparent'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Transparan
            </button>
            <button
              onClick={() => setActiveBackdropPreview('red')}
              className={`px-2 py-0.5 rounded text-[11px] font-mono transition-all ${
                activeBackdropPreview === 'red' ? 'bg-red-600 text-white font-bold' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Merah
            </button>
            <button
              onClick={() => setActiveBackdropPreview('blue')}
              className={`px-2 py-0.5 rounded text-[11px] font-mono transition-all ${
                activeBackdropPreview === 'blue' ? 'bg-blue-600 text-white font-bold' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Biru
            </button>
          </div>
        </div>

        {/* Split Image Canvas Box */}
        <div className="relative w-full h-56 sm:h-64 rounded-xl overflow-hidden shadow-inner select-none bg-slate-900">
          {/* Backdrop Background */}
          {activeBackdropPreview === 'transparent' && <div className="absolute inset-0 checkerboard-pattern" />}
          {activeBackdropPreview === 'red' && <div className="absolute inset-0 bg-[#D61C1C]" />}
          {activeBackdropPreview === 'blue' && <div className="absolute inset-0 bg-[#1C54D6]" />}
          {activeBackdropPreview === 'gradient' && (
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-cyan via-brand-blue to-brand-purple" />
          )}

          {/* Foreground Portrait Cutout */}
          <img
            src={sampleOriginal}
            alt="Sample Showcase"
            className="absolute inset-0 w-full h-full object-cover object-top filter drop-shadow-md"
            style={{
              clipPath: `polygon(0 0, ${sliderVal}% 0, ${sliderVal}% 100%, 0 100%)`,
            }}
          />

          {/* Original Photo Side */}
          <div
            className="absolute inset-0 w-full h-full overflow-hidden"
            style={{
              clipPath: `polygon(${sliderVal}% 0, 100% 0, 100% 100%, ${sliderVal}% 100%)`,
            }}
          >
            <img
              src={sampleOriginal}
              alt="Original photo"
              className="w-full h-full object-cover object-top"
            />
          </div>

          {/* Split Divider Handle */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-brand-cyan cursor-ew-resize z-20"
            style={{ left: `${sliderVal}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-brand-cyan text-slate-950 flex items-center justify-center font-mono font-bold text-[10px] shadow-md">
              ↔
            </div>
          </div>

          {/* Interactive Range Slider Overlay */}
          <input
            type="range"
            min="0"
            max="100"
            value={sliderVal}
            onChange={(e) => setSliderVal(parseInt(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
          />

          {/* Corner Floating Badges */}
          <div className="absolute bottom-2.5 left-2.5 z-20 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-mono font-medium text-brand-cyan">
            ✨ Setelah (Cutout)
          </div>
          <div className="absolute bottom-2.5 right-2.5 z-20 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-mono font-medium text-slate-300">
            Sebelum (Asli)
          </div>
        </div>

        {/* One Click Test Trigger */}
        <div className="mt-2.5 flex items-center justify-between px-1 text-xs">
          <span className="text-slate-500 text-[11px]">Coba foto di atas sekarang?</span>
          <button
            onClick={() => onSelectSample(sampleOriginal, 'sample-portrait.jpg')}
            className="flex items-center gap-1 font-semibold text-brand-cyan hover:underline text-[11px]"
          >
            <span>Buka di Editor</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

      </div>

    </div>
  );
};
