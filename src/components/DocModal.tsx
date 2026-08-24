import React from 'react';
import { X, ShieldCheck, Zap, Cpu, HelpCircle, Sparkles, CheckCircle2 } from 'lucide-react';

interface DocModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocModal: React.FC<DocModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-surface-50 dark:bg-surface-900 rounded-3xl border border-slate-200 dark:border-surface-800 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-surface-800 bg-white/50 dark:bg-surface-850/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-brand-cyan/10 text-brand-cyan">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">How EraseDrop Works</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">100% In-Browser AI & Privacy Architecture</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-surface-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 text-sm text-slate-700 dark:text-slate-300">
          
          {/* Privacy Guarantee Block */}
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3.5">
            <ShieldCheck className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                Zero Cloud Uploads • 100% Client-Side Privacy
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                Unlike traditional online background removers that send your private photos to remote cloud servers, <strong>EraseDrop executes deep learning segmentation models directly inside your web browser</strong>. Your photos never leave your device.
              </p>
            </div>
          </div>

          {/* Under the hood */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-2 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-brand-cyan" /> Deep Learning Under the Hood
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              EraseDrop uses highly optimized neural network architectures (such as ISNet / RMBG) compiled into <strong>WebAssembly (WASM SIMD)</strong> and accelerated by <strong>WebGPU</strong> hardware acceleration. Once loaded, the models run entirely offline with zero server processing latency.
            </p>
          </div>

          {/* Features Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-white dark:bg-surface-850 border border-slate-200 dark:border-surface-800">
              <h5 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5 mb-1">
                <Zap className="w-3.5 h-3.5 text-brand-cyan" /> Unlimited Batch Processing
              </h5>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Drop 10, 50, or 100+ photos at once. Export all transparent results as a single packaged ZIP archive.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-surface-850 border border-slate-200 dark:border-surface-800">
              <h5 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Formal Pas Foto Presets
              </h5>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Instantly swap backgrounds to Indonesian formal ID Red (Tahun Ganjil), Blue (Tahun Genap), or e-commerce white.
              </p>
            </div>
          </div>

          {/* Tips for Best Results */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-2">
              Tips for Best Cutout Quality:
            </h4>
            <ul className="text-xs space-y-1.5 text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-cyan" /> Use photos with clear contrast between the subject and background.
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-cyan" /> Works exceptionally well on portraits, fashion apparel, shoes, pets, cars, and products.
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-cyan" /> Supports Chrome, Edge, Safari, Firefox, and modern mobile browsers.
              </li>
            </ul>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-surface-800 bg-white/50 dark:bg-surface-850/50 flex items-center justify-between">
          <span className="text-xs text-slate-500">EraseDrop • Built by @zzdree</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-cyan text-black hover:bg-cyan-300 transition-colors"
          >
            Got it!
          </button>
        </div>

      </div>
    </div>
  );
};
