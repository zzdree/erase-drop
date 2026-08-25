import React from 'react';
import { Sun, Moon, History, HelpCircle, Cpu, Zap, Layers, Sparkles } from 'lucide-react';

interface NavbarProps {
  darkMode: boolean;
  onToggleTheme: () => void;
  onOpenHistory: () => void;
  onOpenDocs: () => void;
  isGpuSupported: boolean;
  historyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  onToggleTheme,
  onOpenHistory,
  onOpenDocs,
  isGpuSupported,
  historyCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-2xl bg-white/80 dark:bg-obsidian-950/80 border-b border-slate-200/80 dark:border-obsidian-800 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <a href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-cyan to-brand-blue p-[1px] shadow-sm group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-slate-900 dark:bg-obsidian-900 rounded-[11px] flex items-center justify-center">
                <Layers className="w-4 h-4 text-brand-cyan" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
                Erase<span className="text-brand-cyan">Drop</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-obsidian-850 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-obsidian-750 font-medium">
                <Sparkles className="w-2.5 h-2.5 text-brand-cyan" /> 100% In-Browser
              </span>
            </div>
          </a>
        </div>

        {/* Right Nav controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">

          {/* Hardware Engine Badge */}
          <div
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold border transition-colors ${
              isGpuSupported
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25"
                : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25"
            }`}
            title={isGpuSupported ? "Hardware WebGPU Boost Active" : "WASM SIMD Multi-core Active"}
          >
            {isGpuSupported ? <Zap className="w-3 h-3 fill-current" /> : <Cpu className="w-3 h-3" />}
            <span>{isGpuSupported ? "WebGPU" : "WASM"}</span>
          </div>

          {/* History Button */}
          <button
            onClick={onOpenHistory}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-obsidian-850 border border-transparent hover:border-slate-200 dark:hover:border-obsidian-750 transition-all"
            title="Riwayat Pemrosesan"
          >
            <History className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Riwayat</span>
            {historyCount > 0 && (
              <span className="flex items-center justify-center min-w-[16px] h-[16px] px-1 text-[10px] font-bold rounded-full bg-brand-cyan text-slate-950 font-mono">
                {historyCount}
              </span>
            )}
          </button>

          {/* Privacy & Docs Button */}
          <button
            onClick={onOpenDocs}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-obsidian-850 border border-transparent hover:border-slate-200 dark:hover:border-obsidian-750 transition-all"
            title="Panduan & Privasi"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Privasi &amp; Info</span>
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-obsidian-850 border border-transparent hover:border-slate-200 dark:hover:border-obsidian-750 transition-all"
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

        </div>
      </div>
    </header>
  );
};
