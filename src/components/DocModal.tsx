import React from 'react';
import { X, ShieldCheck, Cpu, HelpCircle, Sparkles, CheckCircle2, Scissors } from 'lucide-react';

interface DocModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocModal: React.FC<DocModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-obsidian-950 rounded-3xl border border-slate-200 dark:border-obsidian-800 shadow-2xl overflow-hidden flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-obsidian-800 bg-slate-50/50 dark:bg-obsidian-900/50 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/30">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Cara Kerja EraseDrop Pro</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">100% In-Browser AI • Arsitektur Privasi Tanpa Server</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-obsidian-850 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 text-sm text-slate-700 dark:text-slate-300">

          {/* Privacy Guarantee Block */}
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3.5">
            <ShieldCheck className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                Zero Cloud Uploads • 100% Privasi di Perangkat Anda
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                Tidak seperti tool online konvensional yang mengirim foto pribadi Anda ke server pihak ketiga, <strong>EraseDrop mengeksekusi model neural network langsung di dalam browser Anda</strong>. Foto tidak pernah meninggalkan memori lokal laptop/HP Anda.
              </p>
            </div>
          </div>

          {/* Under the hood */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-2 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-brand-cyan" /> Teknologi AI WebGPU &amp; WASM SIMD
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              EraseDrop memanfaatkan arsitektur segmentasi saraf berbobot ringan yang dikompilasi ke <strong>WebAssembly (WASM SIMD)</strong> dan diakselerasi oleh <strong>WebGPU</strong>. Begitu model termuat di cache browser, seluruh proses berjalan 100% offline dengan latensi nol.
            </p>
          </div>

          {/* Features Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-obsidian-900 border border-slate-200 dark:border-obsidian-800">
              <h5 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5 mb-1">
                <Scissors className="w-3.5 h-3.5 text-brand-amber" /> Pas Foto Resmi &amp; Crop
              </h5>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Preset ukuran pas foto standar Indonesia (2x3, 3x4, 4x6 cm) dan latar belakang formal Merah &amp; Biru.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-obsidian-900 border border-slate-200 dark:border-obsidian-800">
              <h5 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-brand-purple" /> Studio Outline &amp; Shadows
              </h5>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Tambahkan garis tepi stiker ala thumbnail YouTube dan bayangan realistis dengan slider mudah.
              </p>
            </div>
          </div>

          {/* Tips for Best Results */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-2">
              Tips Hasil Potongan Terbaik:
            </h4>
            <ul className="text-xs space-y-1.5 text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-cyan" /> Gunakan foto dengan pencahayaan cukup dan kontras antara subjek & latar.
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-cyan" /> Sangat optimal untuk foto portrait, produk e-commerce, hewan peliharaan, dan kendaraan.
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-cyan" /> Kompatibel dengan Chrome, Edge, Safari, Firefox, dan browser mobile modern.
              </li>
            </ul>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-obsidian-800 bg-slate-50/50 dark:bg-obsidian-900/50 flex items-center justify-between">
          <span className="text-xs font-mono text-slate-500">EraseDrop • Dibuat oleh @zzdree</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-brand-cyan text-slate-950 hover:brightness-110 shadow-md shadow-cyan-500/20 transition-all font-mono"
          >
            Mengerti!
          </button>
        </div>

      </div>
    </div>
  );
};
