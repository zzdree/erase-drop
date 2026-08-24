import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, Image as ImageIcon, Sparkles, Zap } from 'lucide-react';

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

  const handleDropFiles = (e: React.DragEvent) => {
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
        onDrop={handleDropFiles}
        onClick={() => fileInputRef.current?.click()}
        className={`w-full group cursor-pointer relative overflow-hidden rounded-3xl p-8 sm:p-14 text-center transition-all duration-300 border-2 border-dashed ${
          isDragOver
            ? 'border-brand-cyan bg-brand-cyan/10 scale-[1.01] shadow-2xl shadow-cyan-500/25 ring-4 ring-brand-cyan/20'
            : 'border-slate-300 dark:border-obsidian-700 bg-white/80 dark:bg-obsidian-900/80 hover:border-brand-cyan dark:hover:border-brand-cyan hover:bg-slate-50/90 dark:hover:bg-obsidian-850/90 shadow-2xl shadow-black/5 dark:shadow-black/50 backdrop-blur-2xl'
        }`}
      >
        {/* Background Ambient Glow */}
        <div className="absolute -inset-2 bg-gradient-to-tr from-brand-cyan/10 via-brand-teal/5 to-brand-purple/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl blur-xl" />

        <div className="relative z-10 flex flex-col items-center justify-center">
          {/* Animated Icon Circle */}
          <div className="relative mb-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-brand-cyan/20 via-brand-teal/20 to-brand-purple/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-inner">
              <UploadCloud className="w-10 h-10 text-brand-cyan group-hover:-translate-y-1 transition-transform" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-brand-emerald flex items-center justify-center text-slate-950 font-bold shadow-md">
              <Zap className="w-3.5 h-3.5 fill-current" />
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
            Drag & Drop Foto ke Sini
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-6">
            atau <span className="text-brand-cyan font-semibold underline underline-offset-4">klik untuk memilih file</span> dari laptop/HP Anda. Mendukung JPG, PNG, WEBP, dan Clipboard Paste (<span className="font-mono text-xs bg-slate-200 dark:bg-obsidian-800 px-1.5 py-0.5 rounded">Ctrl+V</span>).
          </p>

          {/* Upload Button */}
          <button
            type="button"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-extrabold text-sm bg-slate-950 text-white dark:bg-white dark:text-slate-950 group-hover:bg-gradient-to-r group-hover:from-brand-cyan group-hover:to-brand-teal group-hover:text-slate-950 transition-all shadow-xl group-hover:shadow-cyan-500/25 active:scale-95 font-mono"
          >
            <ImageIcon className="w-4 h-4" />
            <span>Pilih Gambar untuk Hapus Background</span>
          </button>
        </div>
      </div>

      {/* Try with Sample Photos */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 text-xs text-slate-500 dark:text-slate-400">
        <span className="font-medium flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-brand-cyan" /> Tidak ada foto? Coba sampel:
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleLoadSample(
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
              'sample-portrait.jpg'
            );
          }}
          className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-obsidian-850 border border-slate-200 dark:border-obsidian-700 hover:border-brand-cyan text-slate-700 dark:text-slate-300 hover:text-brand-cyan transition-colors shadow-sm font-medium"
        >
          👤 Portrait Model
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleLoadSample(
              'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
              'sample-product-shoes.jpg'
            );
          }}
          className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-obsidian-850 border border-slate-200 dark:border-obsidian-700 hover:border-brand-cyan text-slate-700 dark:text-slate-300 hover:text-brand-cyan transition-colors shadow-sm font-medium"
        >
          👟 Sepatu Produk
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleLoadSample(
              'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&auto=format&fit=crop&q=80',
              'sample-dog.jpg'
            );
          }}
          className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-obsidian-850 border border-slate-200 dark:border-obsidian-700 hover:border-brand-cyan text-slate-700 dark:text-slate-300 hover:text-brand-cyan transition-colors shadow-sm font-medium"
        >
          🐕 Anjing Lucu
        </button>
      </div>

    </div>
  );
};
