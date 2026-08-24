import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, Image as ImageIcon, Sparkles, ShieldCheck, Zap, Layers } from 'lucide-react';

interface DropZoneProps {
  onFilesSelected: (files: File[]) => void;
  isProcessingBatch?: boolean;
}

export const DropZone: React.FC<DropZoneProps> = ({ onFilesSelected }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Support Ctrl+V paste from clipboard
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData && e.clipboardData.files.length > 0) {
        const imageFiles: File[] = [];
        for (let i = 0; i < e.clipboardData.files.length; i++) {
          const file = e.clipboardData.files[i];
          if (file.type.startsWith('image/')) {
            imageFiles.push(file);
          }
        }
        if (imageFiles.length > 0) {
          onFilesSelected(imageFiles);
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [onFilesSelected]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const validFiles: File[] = [];
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        const file = e.dataTransfer.files[i];
        if (file.type.startsWith('image/')) {
          validFiles.push(file);
        }
      }
      if (validFiles.length > 0) {
        onFilesSelected(validFiles);
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      onFilesSelected(filesArray);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Sample images for 1-click test
  const handleLoadSample = async (sampleUrl: string, name: string) => {
    try {
      const res = await fetch(sampleUrl);
      const blob = await res.blob();
      const file = new File([blob], name, { type: blob.type || 'image/jpeg' });
      onFilesSelected([file]);
    } catch (err) {
      console.error('Failed to load sample image:', err);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/avif"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Main Drag & Drop Card */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`w-full group cursor-pointer relative overflow-hidden rounded-3xl p-8 sm:p-14 text-center transition-all duration-300 border-2 border-dashed ${
          isDragOver
            ? 'border-brand-cyan bg-brand-cyan/5 dark:bg-brand-cyan/10 scale-[1.01] shadow-2xl shadow-cyan-500/20'
            : 'border-slate-300 dark:border-surface-800 bg-white/70 dark:bg-surface-850/60 hover:border-brand-cyan/70 dark:hover:border-brand-cyan/50 hover:bg-slate-50/90 dark:hover:bg-surface-800/80 shadow-xl shadow-black/5 dark:shadow-black/40 backdrop-blur-xl'
        }`}
      >
        {/* Background Ambient Glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center justify-center">
          {/* Animated Icon Circle */}
          <div className="relative mb-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-500/20 via-brand-blue/20 to-purple-500/20 dark:from-cyan-500/30 dark:to-purple-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <UploadCloud className="w-10 h-10 text-brand-cyan group-hover:-translate-y-1 transition-transform" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-md">
              <Zap className="w-3.5 h-3.5 fill-current" />
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
            Drag & Drop Images Here
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-6">
            or <span className="text-brand-cyan font-semibold underline underline-offset-4">browse files</span> from your device. Supports JPG, PNG, WEBP, and Paste (Ctrl+V).
          </p>

          {/* Upload Button */}
          <button
            type="button"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-slate-900 text-white dark:bg-white dark:text-slate-950 group-hover:bg-brand-cyan group-hover:text-black dark:group-hover:bg-brand-cyan dark:group-hover:text-black transition-all shadow-lg group-hover:shadow-cyan-500/25"
          >
            <ImageIcon className="w-4 h-4" />
            <span>Select Photos to Remove Background</span>
          </button>
        </div>
      </div>

      {/* Try with Sample Photos */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-slate-500 dark:text-slate-400">
        <span className="font-medium flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-brand-cyan" /> No photo right now? Try demo:
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleLoadSample(
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
              'sample-portrait.jpg'
            );
          }}
          className="px-3 py-1.5 rounded-lg bg-white dark:bg-surface-800 border border-slate-200 dark:border-surface-700 hover:border-brand-cyan text-slate-700 dark:text-slate-300 hover:text-brand-cyan transition-colors"
        >
          👤 Portrait Model
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleLoadSample(
              'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
              'sample-product-shoes.jpg'
            );
          }}
          className="px-3 py-1.5 rounded-lg bg-white dark:bg-surface-800 border border-slate-200 dark:border-surface-700 hover:border-brand-cyan text-slate-700 dark:text-slate-300 hover:text-brand-cyan transition-colors"
        >
          👟 Product Shoes
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleLoadSample(
              'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&auto=format&fit=crop&q=80',
              'sample-dog.jpg'
            );
          }}
          className="px-3 py-1.5 rounded-lg bg-white dark:bg-surface-800 border border-slate-200 dark:border-surface-700 hover:border-brand-cyan text-slate-700 dark:text-slate-300 hover:text-brand-cyan transition-colors"
        >
          🐕 Cute Dog
        </button>
      </div>

      {/* Feature Highlights Trust Badges */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/60 dark:bg-surface-850/60 border border-slate-200/60 dark:border-surface-800 backdrop-blur-sm">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">100% Private</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Processed in browser. 0 byte sent to server.</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/60 dark:bg-surface-850/60 border border-slate-200/60 dark:border-surface-800 backdrop-blur-sm">
          <div className="p-2.5 rounded-xl bg-brand-cyan/10 text-brand-cyan">
            <Zap className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">WebGPU Fast</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Neural matting in 1–3s with GPU acceleration.</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/60 dark:bg-surface-850/60 border border-slate-200/60 dark:border-surface-800 backdrop-blur-sm">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
            <Layers className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Unlimited & Free</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">No tokens, no credit cards, batch export to ZIP.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
