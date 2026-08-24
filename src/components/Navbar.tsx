import React from 'react';
import { Sun, Moon, History, HelpCircle, Cpu, Zap, Layers } from 'lucide-react';

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
    <header className="sticky top-0 z-40 w-full backdrop-blur-2xl bg-white/70 dark:bg-obsidian-950/75 border-b border-slate-200/80 dark:border-obsidian-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <a href="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-cyan via-brand-teal to-brand-purple p-[1.5px] shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-white dark:bg-obsidian-900 rounded-[10px] flex items-center justify-center">
                <Layers className="w-5 h-5 text-brand-cyan group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                  Erase<span className="text-brand-cyan">Drop</span>
                </span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/30 font-bold tracking-wider">
                  PRO STUDIO
                </span>
              </div>
            </div>
          </a>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Hardware Acceleration Telemetry Badge */}
          <div
            title={isGpuSupported ? "WebGPU Hardware Acceleration Active (Fastest)" : "CPU WASM Multi-threading Active"}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold border transition-colors ${
              isGpuSupported
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
            }`}
          >
            {isGpuSupported ? <Zap className="w-3.5 h-3.5 fill-current" /> : <Cpu className="w-3.5 h-3.5" />}
            <span>{isGpuSupported ? "WebGPU Active" : "CPU WASM Active"}</span>
          </div>

          {/* History Button */}
          <button
            onClick={onOpenHistory}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-obsidian-850 transition-colors"
            title="Lihat Riwayat Gambar"
          >
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">Riwayat</span>
            {historyCount > 0 && (
              <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[11px] font-bold rounded-full bg-brand-cyan text-slate-950 font-mono">
                {historyCount}
              </span>
            )}
          </button>

          {/* Documentation / Info Button */}
          <button
            onClick={onOpenDocs}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-obsidian-850 transition-colors"
            title="Cara Kerja & Jaminan Privasi"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Panduan</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-obsidian-850 transition-colors focus:outline-none"
            aria-label="Toggle Dark Mode"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

        </div>
      </div>
    </header>
  );
};
