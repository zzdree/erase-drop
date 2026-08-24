import React, { useState } from 'react';
import {
  Zap,
  ShieldCheck,
  Scissors,
  ArrowRight,
  Sliders
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
    <div className="w-full flex flex-col items-center text-center mb-10 animate-in fade-in slide-in-from-top-4 duration-700">

      {/* Top Floating Badge */}
      <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-mono font-bold bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/30 shadow-lg shadow-cyan-500/10 mb-6 group cursor-default">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-cyan opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-cyan"></span>
        </span>
        <span>100% IN-BROWSER AI ENGINE • ZERO SERVER UPLOAD • UNLIMITED FREE</span>
      </div>

      {/* Main Punchy Headline */}
      <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.08] max-w-4xl mb-6">
        Erase Backgrounds. <br />
        <span className="bg-gradient-to-r from-brand-cyan via-brand-teal to-brand-purple bg-clip-text text-transparent">
          Craft Pro Studio Shots.
        </span>
      </h1>

      {/* Sub-headline description */}
      <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8">
        Hapus background foto secara instan di browser Anda. Dilengkapi crop pas foto resmi Indonesia (2x3, 3x4, 4x6), efek outline stiker YouTube, shadow realistis, dan kuas touch-up.
      </p>

      {/* Value Proposition Pills */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-10 text-xs font-mono">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/80 dark:bg-obsidian-850/80 border border-slate-200 dark:border-obsidian-700 shadow-sm text-slate-700 dark:text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Privasi Mutlak (No Server)</span>
        </div>
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/80 dark:bg-obsidian-850/80 border border-slate-200 dark:border-obsidian-700 shadow-sm text-slate-700 dark:text-slate-300">
          <Zap className="w-4 h-4 text-brand-cyan" />
          <span>{isGpuSupported ? 'WebGPU Hardware Boost' : 'WASM SIMD Multi-core'}</span>
        </div>
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/80 dark:bg-obsidian-850/80 border border-slate-200 dark:border-obsidian-700 shadow-sm text-slate-700 dark:text-slate-300">
          <Scissors className="w-4 h-4 text-amber-500" />
          <span>Pas Foto 2x3, 3x4, 4x6</span>
        </div>
      </div>

      {/* Interactive Showcase Live Preview Card */}
      <div className="w-full max-w-2xl relative rounded-3xl p-3 sm:p-4 bg-white/50 dark:bg-obsidian-900/60 border border-slate-200/80 dark:border-obsidian-800 backdrop-blur-2xl shadow-2xl mb-10">

        {/* Top bar with backdrop mode switcher */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200/60 dark:border-obsidian-800/80 mb-3 text-xs">
          <span className="font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-brand-cyan" />
            <span>Interactive Live Studio Preview</span>
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveBackdropPreview('transparent')}
              className={`px-2 py-0.5 rounded-lg text-[11px] font-mono transition-colors ${
                activeBackdropPreview === 'transparent' ? 'bg-brand-cyan text-black font-bold' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              PNG
            </button>
            <button
              onClick={() => setActiveBackdropPreview('red')}
              className={`px-2 py-0.5 rounded-lg text-[11px] font-mono transition-colors ${
                activeBackdropPreview === 'red' ? 'bg-red-600 text-white font-bold' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Merah
            </button>
            <button
              onClick={() => setActiveBackdropPreview('blue')}
              className={`px-2 py-0.5 rounded-lg text-[11px] font-mono transition-colors ${
                activeBackdropPreview === 'blue' ? 'bg-blue-600 text-white font-bold' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Biru
            </button>
            <button
              onClick={() => setActiveBackdropPreview('gradient')}
              className={`px-2 py-0.5 rounded-lg text-[11px] font-mono transition-colors ${
                activeBackdropPreview === 'gradient' ? 'bg-purple-600 text-white font-bold' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Gradient
            </button>
          </div>
        </div>

        {/* Split Image Canvas Box */}
        <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden shadow-inner select-none">
          {/* Backdrop Background */}
          {activeBackdropPreview === 'transparent' && <div className="absolute inset-0 checkerboard-pattern" />}
          {activeBackdropPreview === 'red' && <div className="absolute inset-0 bg-[#D61C1C]" />}
          {activeBackdropPreview === 'blue' && <div className="absolute inset-0 bg-[#1C54D6]" />}
          {activeBackdropPreview === 'gradient' && (
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-cyan via-brand-blue to-brand-purple" />
          )}

          {/* Foreground Portrait Cutout (Simulated) */}
          <img
            src={sampleOriginal}
            alt="Sample Showcase"
            className="absolute inset-0 w-full h-full object-cover object-top filter drop-shadow-xl"
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
            className="absolute top-0 bottom-0 w-1 bg-brand-cyan shadow-lg cursor-ew-resize z-20"
            style={{ left: `${sliderVal}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-brand-cyan text-slate-950 flex items-center justify-center font-mono font-bold text-xs shadow-md">
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
          <div className="absolute bottom-3 left-3 z-20 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-[11px] font-mono font-bold text-brand-cyan">
            ✨ AI Clean Cutout
          </div>
          <div className="absolute bottom-3 right-3 z-20 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-[11px] font-mono font-bold text-slate-300">
            Original Photo
          </div>
        </div>

        {/* One Click Test Trigger */}
        <div className="mt-3 flex items-center justify-between px-2 pt-2 text-xs">
          <span className="text-slate-500 dark:text-slate-400">Ingin menguji langsung foto di atas?</span>
          <button
            onClick={() => onSelectSample(sampleOriginal, 'sample-portrait.jpg')}
            className="flex items-center gap-1.5 font-bold text-brand-cyan hover:underline"
          >
            <span>Buka di Studio Editor</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
};
