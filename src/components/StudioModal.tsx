import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  X, 
  Download, 
  Check, 
  Palette, 
  Upload,
  SplitSquareVertical,
  RefreshCcw
} from 'lucide-react';
import type { ProcessedImageItem, BackdropOption } from '../types';
import { saveAs } from 'file-saver';
import { renderImageWithBackdrop } from '../services/zipExporter';

interface StudioModalProps {
  item: ProcessedImageItem | null;
  onClose: () => void;
  onSaveBackdrop: (id: string, backdrop: BackdropOption) => void;
}

export const StudioModal: React.FC<StudioModalProps> = ({ item, onClose, onSaveBackdrop }) => {
  if (!item || !item.processedUrl) return null;

  // Local state for active backdrop
  const [currentBackdrop, setCurrentBackdrop] = useState<BackdropOption>(item.backdrop);
  const [customColor, setCustomColor] = useState('#1C54D6');
  const [sliderPosition, setSliderPosition] = useState(50); // percentage (0 to 100)
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<'image/png' | 'image/jpeg' | 'image/webp'>('image/png');

  const containerRef = useRef<HTMLDivElement>(null);
  const customBgInputRef = useRef<HTMLInputElement>(null);

  // Sync with item backdrop if reopened
  useEffect(() => {
    setCurrentBackdrop(item.backdrop);
  }, [item]);

  // ID Photo & Studio Color Presets
  const colorPresets = [
    { name: 'Pas Foto Merah', color: '#D61C1C', desc: 'Indonesian ID (Tahun Ganjil)' },
    { name: 'Pas Foto Biru', color: '#1C54D6', desc: 'Indonesian ID (Tahun Genap)' },
    { name: 'Studio Putih', color: '#FFFFFF', desc: 'E-Commerce Marketplace' },
    { name: 'Studio Abu-Abu', color: '#E2E8F0', desc: 'Minimalist Clean' },
    { name: 'Charcoal Gelap', color: '#1E293B', desc: 'Professional Dark' },
    { name: 'Neon Cyber', color: '#090A0F', desc: 'Ultra Contrast' },
    { name: 'Warm Sunset', color: '#FF6B6B', desc: 'Warm Pastel' },
    { name: 'Fresh Mint', color: '#10B981', desc: 'Vibrant Green' },
  ];

  const gradientPresets = [
    { name: 'Cyber Neon', value: '45deg, #00E5FF, #7928CA' },
    { name: 'Sunset Glow', value: '45deg, #FF512F, #DD2476' },
    { name: 'Ocean Wave', value: '45deg, #2193b0, #6dd5ed' },
    { name: 'Emerald Forest', value: '45deg, #11998e, #38ef7d' },
    { name: 'Cosmic Purple', value: '45deg, #8A2387, #E94057' },
  ];

  // Drag logic for split slider
  const handleSliderMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDraggingSlider) return;
    handleSliderMove(e.touches[0].clientX);
  }, [isDraggingSlider, handleSliderMove]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDraggingSlider) return;
    handleSliderMove(e.clientX);
  }, [isDraggingSlider, handleSliderMove]);

  const handleMouseUp = useCallback(() => {
    setIsDraggingSlider(false);
  }, []);

  useEffect(() => {
    if (isDraggingSlider) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDraggingSlider, handleMouseMove, handleMouseUp, handleTouchMove]);

  // Handle custom background image upload
  const handleCustomBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          const backdrop: BackdropOption = {
            type: 'image',
            value: reader.result as string,
            name: 'Custom Backdrop',
          };
          setCurrentBackdrop(backdrop);
          onSaveBackdrop(item.id, backdrop);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectBackdrop = (backdrop: BackdropOption) => {
    setCurrentBackdrop(backdrop);
    onSaveBackdrop(item.id, backdrop);
  };

  const handleExportDownload = async () => {
    if (!item.processedBlob) return;
    setIsExporting(true);
    try {
      const baseName = item.name.replace(/\.[^/.]+$/, '');
      const ext = exportFormat === 'image/png' ? 'png' : exportFormat === 'image/jpeg' ? 'jpg' : 'webp';
      
      if (currentBackdrop.type === 'transparent') {
        saveAs(item.processedBlob, `${baseName}_cutout.${ext}`);
      } else {
        const renderedBlob = await renderImageWithBackdrop(
          item.processedBlob,
          currentBackdrop,
          exportFormat,
          0.95
        );
        saveAs(renderedBlob, `${baseName}_studio.${ext}`);
      }
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-5xl max-h-[95vh] bg-surface-50 dark:bg-surface-900 rounded-3xl border border-slate-200 dark:border-surface-800 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-surface-800 bg-white/50 dark:bg-surface-850/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-brand-cyan/10 text-brand-cyan">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>EraseDrop Studio</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-surface-200 dark:bg-surface-800 text-slate-600 dark:text-slate-300 font-mono">
                  {item.name}
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Drag the center slider to inspect cutout edges • Choose background below
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-surface-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Split Screen Canvas + Controls */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Left / Center 2 Cols: Before / After Slider Canvas */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center">
            
            <div
              ref={containerRef}
              onMouseDown={() => setIsDraggingSlider(true)}
              onTouchStart={() => setIsDraggingSlider(true)}
              className="relative w-full aspect-[4/3] sm:aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-surface-700 select-none cursor-ew-resize bg-surface-950 flex items-center justify-center"
            >
              {/* BACKDROP LAYER (For processed image) */}
              <div 
                className="absolute inset-0 z-0"
                style={{
                  backgroundColor: currentBackdrop.type === 'color' ? currentBackdrop.value : undefined,
                  backgroundImage: currentBackdrop.type === 'gradient' ? `linear-gradient(${currentBackdrop.value})` : currentBackdrop.type === 'image' ? `url(${currentBackdrop.value})` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {currentBackdrop.type === 'transparent' && (
                  <div className="absolute inset-0 checkerboard-pattern opacity-90" />
                )}
              </div>

              {/* AFTER (PROCESSED) IMAGE - Full width behind split */}
              <div className="absolute inset-0 z-10 flex items-center justify-center p-4">
                <img
                  src={item.processedUrl}
                  alt="Processed"
                  className="max-h-full max-w-full object-contain pointer-events-none drop-shadow-md"
                />
              </div>

              {/* BEFORE (ORIGINAL) IMAGE - Clipped by Slider Position */}
              <div
                className="absolute inset-0 z-20 overflow-hidden flex items-center justify-center bg-surface-900 border-r-2 border-brand-cyan/80 shadow-2xl"
                style={{ width: `${sliderPosition}%` }}
              >
                <div 
                  className="absolute inset-0 flex items-center justify-center p-4"
                  style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%' }}
                >
                  <img
                    src={item.originalUrl}
                    alt="Original"
                    className="max-h-full max-w-full object-contain pointer-events-none"
                  />
                </div>
                
                {/* "Before" Tag */}
                <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black/70 backdrop-blur-md text-[11px] font-mono font-bold text-white uppercase">
                  Original
                </div>
              </div>

              {/* "After" Tag */}
              <div className="absolute top-3 right-3 z-30 px-2 py-1 rounded bg-brand-cyan/90 backdrop-blur-md text-[11px] font-mono font-bold text-black uppercase">
                Cutout
              </div>

              {/* Draggable Slider Bar & Handle */}
              <div
                className="absolute top-0 bottom-0 z-30 flex items-center justify-center pointer-events-none"
                style={{ left: `calc(${sliderPosition}% - 16px)` }}
              >
                <div className="w-8 h-8 rounded-full bg-brand-cyan text-black shadow-xl flex items-center justify-center border-2 border-white ring-4 ring-black/40">
                  <SplitSquareVertical className="w-4 h-4 rotate-90" />
                </div>
              </div>
            </div>

            {/* Slider hint */}
            <div className="w-full flex items-center justify-between mt-3 text-xs text-slate-500 dark:text-slate-400 font-mono px-2">
              <span>← Original Image</span>
              <span>Slide to inspect cutout precision</span>
              <span>AI Cutout ({currentBackdrop.name || currentBackdrop.type}) →</span>
            </div>
          </div>

          {/* Right 1 Col: Backdrop & Export Customizer Sidebar */}
          <div className="flex flex-col gap-5 w-full bg-white dark:bg-surface-850 p-5 rounded-2xl border border-slate-200 dark:border-surface-800">
            
            {/* 1. Backdrop Selector */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-brand-cyan" /> 1. Choose Background
              </h4>

              {/* Transparent Button */}
              <button
                onClick={() => handleSelectBackdrop({ type: 'transparent', value: '', name: 'Transparent' })}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-semibold mb-3 transition-all ${
                  currentBackdrop.type === 'transparent'
                    ? 'border-brand-cyan bg-brand-cyan/10 text-brand-cyan dark:text-brand-cyan ring-1 ring-brand-cyan'
                    : 'border-slate-200 dark:border-surface-700 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg checkerboard-pattern border border-slate-400/30" />
                  <span>Transparent PNG (Alpha Cutout)</span>
                </div>
                {currentBackdrop.type === 'transparent' && <Check className="w-4 h-4" />}
              </button>

              {/* Formal ID Photo Presets Section */}
              <div className="mb-4">
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-2 block">
                  Formal Pas Foto & Studio Colors:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {colorPresets.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => handleSelectBackdrop({ type: 'color', value: preset.color, name: preset.name })}
                      className={`relative flex flex-col items-center p-2 rounded-xl border text-[10px] font-medium transition-all ${
                        currentBackdrop.type === 'color' && currentBackdrop.value === preset.color
                          ? 'border-brand-cyan ring-2 ring-brand-cyan/40 scale-105 bg-brand-cyan/5'
                          : 'border-slate-200 dark:border-surface-700 hover:border-slate-400 bg-surface-50 dark:bg-surface-900'
                      }`}
                      title={`${preset.name}: ${preset.desc}`}
                    >
                      <div
                        className="w-6 h-6 rounded-full border border-black/20 shadow-inner mb-1"
                        style={{ backgroundColor: preset.color }}
                      />
                      <span className="truncate w-full text-center text-[9px] text-slate-700 dark:text-slate-300">
                        {preset.name.replace('Pas Foto ', '')}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Color Swatch */}
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => {
                    setCustomColor(e.target.value);
                    handleSelectBackdrop({ type: 'color', value: e.target.value, name: 'Custom Color' });
                  }}
                  className="w-9 h-9 rounded-xl border-0 cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={customColor}
                  onChange={(e) => {
                    setCustomColor(e.target.value);
                    if (e.target.value.match(/^#[0-9A-Fa-f]{6}$/)) {
                      handleSelectBackdrop({ type: 'color', value: e.target.value, name: 'Custom Hex' });
                    }
                  }}
                  className="flex-1 px-3 py-2 rounded-xl text-xs font-mono uppercase bg-slate-100 dark:bg-surface-900 border border-slate-200 dark:border-surface-700 text-slate-900 dark:text-white"
                  placeholder="#1C54D6"
                />
              </div>

              {/* Gradients */}
              <div className="mb-4">
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-2 block">
                  Studio Gradients:
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {gradientPresets.map((g) => (
                    <button
                      key={g.name}
                      onClick={() => handleSelectBackdrop({ type: 'gradient', value: g.value, name: g.name })}
                      className={`h-8 rounded-lg border transition-all ${
                        currentBackdrop.type === 'gradient' && currentBackdrop.value === g.value
                          ? 'border-brand-cyan ring-2 ring-brand-cyan/40 scale-105'
                          : 'border-transparent hover:scale-105'
                      }`}
                      style={{ backgroundImage: `linear-gradient(${g.value})` }}
                      title={g.name}
                    />
                  ))}
                </div>
              </div>

              {/* Custom Image Background */}
              <div>
                <input
                  ref={customBgInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleCustomBgUpload}
                  className="hidden"
                />
                <button
                  onClick={() => customBgInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-dashed border-slate-300 dark:border-surface-700 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:border-brand-cyan hover:text-brand-cyan transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Custom Background Photo</span>
                </button>
              </div>
            </div>

            {/* 2. Format Export & Download */}
            <div className="pt-4 border-t border-slate-200 dark:border-surface-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
                <Download className="w-4 h-4 text-emerald-400" /> 2. Export Format
              </h4>

              {/* Format pills */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {(['image/png', 'image/webp', 'image/jpeg'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setExportFormat(fmt)}
                    className={`py-1.5 rounded-lg text-xs font-mono font-bold transition-all uppercase ${
                      exportFormat === fmt
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-black shadow'
                        : 'bg-slate-100 dark:bg-surface-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {fmt.replace('image/', '')}
                  </button>
                ))}
              </div>

              {/* Download Action */}
              <button
                onClick={handleExportDownload}
                disabled={isExporting}
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-brand-cyan via-cyan-400 to-brand-emerald text-black shadow-lg hover:opacity-95 hover:scale-[1.02] transition-all"
              >
                {isExporting ? (
                  <>
                    <RefreshCcw className="w-4 h-4 animate-spin" />
                    <span>Rendering...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download Cutout ({exportFormat.replace('image/', '').toUpperCase()})</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
