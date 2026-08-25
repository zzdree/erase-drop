import React, { useState, useRef } from 'react';
import {
  X,
  Download,
  Columns,
  ZoomIn,
  ZoomOut,
  Undo2,
  Redo2,
  Copy,
  Check,
  Printer,
  ChevronDown
} from 'lucide-react';
import type { ProcessedImageItem, StudioConfig, BrushSettings } from '../../types';
import type { StudioTab } from './StudioSidebar';
import { StudioSidebar } from './StudioSidebar';
import { StudioCanvas } from './StudioCanvas';
import { BackgroundPanel } from './panels/BackgroundPanel';
import { CropPanel } from './panels/CropPanel';
import { EffectsPanel } from './panels/EffectsPanel';
import { TouchUpPanel } from './panels/TouchUpPanel';
import { ColorAdjustPanel } from './panels/ColorAdjustPanel';
import { useHistoryStack } from '../../hooks/useHistoryStack';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import {
  compositeStudioImage,
  copyCanvasToClipboard,
  generatePasFotoPrintSheet
} from '../../services/canvasEffects';
import { saveAs } from 'file-saver';

interface StudioModalProps {
  item: ProcessedImageItem | null;
  onClose: () => void;
  onSaveConfig: (id: string, config: StudioConfig) => void;
}

export const StudioModal: React.FC<StudioModalProps> = ({
  item,
  onClose,
  onSaveConfig,
}) => {
  if (!item || !item.processedUrl) return null;

  // Active Sidebar Tool Tab
  const [activeTab, setActiveTab] = useState<StudioTab>('background');

  // Mask canvas ref for touch-up brush
  const maskCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Studio History Stack for Undo/Redo
  const {
    canUndo,
    canRedo,
    undo,
    redo,
    pushState,
    currentConfig,
  } = useHistoryStack(item.studioConfig);

  // Brush settings
  const [brush, setBrush] = useState<BrushSettings>({
    mode: 'none',
    size: 25,
    softness: 0.5,
    opacity: 1,
  });

  // Zoom & Viewport states
  const [zoom, setZoom] = useState(1.0);
  const [splitView, setSplitView] = useState(false);
  const [sliderPos, setSliderPos] = useState(50);
  const [isExporting, setIsExporting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onUndo: () => {
      const prev = undo();
      if (prev) onSaveConfig(item.id, prev);
    },
    onRedo: () => {
      const next = redo();
      if (next) onSaveConfig(item.id, next);
    },
    onClose,
    onToggleSplit: () => setSplitView((v) => !v),
    onResetZoom: () => setZoom(1.0),
  });

  const handleConfigChange = (newConfig: StudioConfig) => {
    pushState(newConfig);
    onSaveConfig(item.id, newConfig);
  };

  const getCompositedCanvas = async (): Promise<HTMLCanvasElement> => {
    const subImg = new Image();
    subImg.crossOrigin = 'anonymous';

    await new Promise<void>((resolve, reject) => {
      subImg.onload = () => resolve();
      subImg.onerror = () => reject(new Error('Failed to load image'));
      subImg.src = item.processedUrl!;
    });

    let origImg: HTMLImageElement | null = null;
    if (item.originalUrl) {
      origImg = new Image();
      origImg.crossOrigin = 'anonymous';
      await new Promise<void>((resolve) => {
        origImg!.onload = () => resolve();
        origImg!.onerror = () => resolve();
        origImg!.src = item.originalUrl;
      });
    }

    const w = subImg.naturalWidth || 800;
    const h = subImg.naturalHeight || 800;

    return compositeStudioImage(
      subImg,
      origImg,
      w,
      h,
      currentConfig.backdrop,
      currentConfig.stroke,
      currentConfig.shadow,
      currentConfig.adjustments,
      currentConfig.edge,
      currentConfig.crop,
      maskCanvasRef.current
    );
  };

  const handleCopy = async () => {
    try {
      const canvas = await getCompositedCanvas();
      await copyCanvasToClipboard(canvas);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Clipboard copy failed:', err);
    }
  };

  const handleExport = async (format: 'image/png' | 'image/jpeg' | 'image/webp' = 'image/png') => {
    setIsExporting(true);
    setShowExportMenu(false);
    try {
      const finalCanvas = await getCompositedCanvas();

      finalCanvas.toBlob(
        (blob: Blob | null) => {
          if (blob) {
            const ext = format === 'image/jpeg' ? 'jpg' : format === 'image/webp' ? 'webp' : 'png';
            const baseName = item.name.replace(/\.[^/.]+$/, '');
            saveAs(blob, `${baseName}_erasedrop_pro.${ext}`);
          }
          setIsExporting(false);
        },
        format,
        0.95
      );
    } catch (err) {
      console.error('Export failed:', err);
      setIsExporting(false);
    }
  };

  const handleExportPrintSheet = async (paper: '4R' | 'A4') => {
    setIsExporting(true);
    setShowExportMenu(false);
    try {
      const photoCanvas = await getCompositedCanvas();
      const sheetCanvas = generatePasFotoPrintSheet(photoCanvas, paper);

      sheetCanvas.toBlob(
        (blob: Blob | null) => {
          if (blob) {
            const baseName = item.name.replace(/\.[^/.]+$/, '');
            saveAs(blob, `${baseName}_pasfoto_sheet_${paper}.jpg`);
          }
          setIsExporting(false);
        },
        'image/jpeg',
        0.98
      );
    } catch (err) {
      console.error('Print sheet generation failed:', err);
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">

      {/* Studio Dialog Container */}
      <div className="relative w-full max-w-7xl h-[94vh] bg-surface-50 dark:bg-void border border-slate-200 dark:border-surface-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-900 dark:text-white">

        {/* Top Studio Action Bar */}
        <div className="h-14 px-4 border-b border-slate-200/80 dark:border-surface-800 flex items-center justify-between bg-white/70 dark:bg-surface-900/80 backdrop-blur-xl shrink-0">

          {/* Left Title & Undo/Redo */}
          <div className="flex items-center gap-3">
            <div className="font-extrabold text-sm sm:text-base flex items-center gap-2">
              <span className="bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/30 px-2 py-0.5 rounded text-xs font-mono">
                PRO STUDIO
              </span>
              <span className="truncate max-w-[140px] sm:max-w-[240px] font-mono text-xs sm:text-sm">{item.name}</span>
            </div>

            <div className="hidden sm:flex items-center gap-1 pl-3 border-l border-slate-200 dark:border-surface-800">
              <button
                onClick={() => {
                  const prev = undo();
                  if (prev) onSaveConfig(item.id, prev);
                }}
                disabled={!canUndo}
                className="p-1.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-surface-800 disabled:opacity-30 transition-colors"
                title="Undo (Ctrl+Z)"
              >
                <Undo2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  const next = redo();
                  if (next) onSaveConfig(item.id, next);
                }}
                disabled={!canRedo}
                className="p-1.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-surface-800 disabled:opacity-30 transition-colors"
                title="Redo (Ctrl+Y)"
              >
                <Redo2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Center Viewport Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setSplitView(!splitView)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium border transition-colors ${
                splitView
                  ? 'border-brand-cyan bg-brand-cyan/10 text-brand-cyan'
                  : 'border-slate-200 dark:border-surface-800 hover:bg-slate-200/60 dark:hover:bg-surface-800'
              }`}
              title="Split Before/After (V)"
            >
              <Columns className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Split Compare</span>
            </button>

            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-xl border border-slate-200 dark:border-surface-800 bg-white/50 dark:bg-surface-850/50">
              <button
                onClick={() => setZoom((z) => Math.max(0.3, z - 0.15))}
                className="p-1 hover:text-brand-cyan"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono w-10 text-center font-bold">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => setZoom((z) => Math.min(2.5, z + 0.15))}
                className="p-1 hover:text-brand-cyan"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Export & Close Buttons */}
          <div className="flex items-center gap-2">
            {/* 1-Click Copy Button */}
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs border transition-all ${
                isCopied
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500'
                  : 'border-slate-200 dark:border-surface-700 bg-white/50 dark:bg-surface-800/80 hover:border-brand-cyan text-slate-800 dark:text-slate-200'
              }`}
              title="Copy to Clipboard (PNG)"
            >
              {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isCopied ? 'Copied!' : 'Copy'}</span>
            </button>

            {/* Export Dropdown */}
            <div className="relative">
              <div className="flex items-center">
                <button
                  onClick={() => handleExport('image/png')}
                  disabled={isExporting}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-l-xl font-bold text-xs bg-gradient-to-r from-brand-cyan to-teal-400 text-slate-950 hover:brightness-110 shadow-md shadow-cyan-500/20 active:scale-95 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isExporting ? 'Exporting...' : 'Export PNG'}</span>
                </button>
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  disabled={isExporting}
                  className="p-1.5 px-2 rounded-r-xl border-l border-cyan-400/40 bg-teal-400 text-slate-950 hover:brightness-110 shadow-md shadow-cyan-500/20 transition-all"
                  title="More Export Options"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Dropdown Menu */}
              {showExportMenu && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-surface-900 border border-slate-200 dark:border-surface-750 rounded-xl shadow-2xl p-1.5 z-50 flex flex-col gap-1 animate-in fade-in slide-in-from-top-1 text-xs">
                  <div className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                    Export Formats
                  </div>
                  <button
                    onClick={() => handleExport('image/png')}
                    className="flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-surface-800 text-left font-medium"
                  >
                    <span>PNG (Transparan HD)</span>
                    <span className="text-[10px] font-mono text-slate-400">Lossless</span>
                  </button>
                  <button
                    onClick={() => handleExport('image/webp')}
                    className="flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-surface-800 text-left font-medium"
                  >
                    <span>WebP (Optimal Web)</span>
                    <span className="text-[10px] font-mono text-emerald-500">Kecil</span>
                  </button>
                  <button
                    onClick={() => handleExport('image/jpeg')}
                    className="flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-surface-800 text-left font-medium"
                  >
                    <span>JPEG / JPG</span>
                    <span className="text-[10px] font-mono text-slate-400">Standard</span>
                  </button>

                  <div className="my-1 border-t border-slate-200 dark:border-surface-800" />
                  <div className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1">
                    <Printer className="w-3 h-3 text-brand-cyan" /> Pas Foto Sheet
                  </div>
                  <button
                    onClick={() => handleExportPrintSheet('4R')}
                    className="flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-surface-800 text-left font-medium text-brand-cyan"
                  >
                    <span>Lembar Cetak 4R (Grid)</span>
                    <span className="text-[10px] font-mono text-slate-400">300 DPI</span>
                  </button>
                  <button
                    onClick={() => handleExportPrintSheet('A4')}
                    className="flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-surface-800 text-left font-medium text-brand-cyan"
                  >
                    <span>Lembar Cetak A4 (Grid)</span>
                    <span className="text-[10px] font-mono text-slate-400">300 DPI</span>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-surface-800 transition-colors"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Main Studio Body (Split Sidebar + Viewport) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">

          {/* Tool Navigation Sidebar */}
          <StudioSidebar activeTab={activeTab} onChangeTab={setActiveTab} />

          {/* Center Interactive Canvas Viewport */}
          <div className="flex-1 relative flex flex-col overflow-hidden bg-slate-950">

            {/* Interactive Split View Slider bar when enabled */}
            {splitView && (
              <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 px-3 py-1.5 rounded-full bg-surface-900/90 border border-surface-700 backdrop-blur-md shadow-lg text-xs font-mono text-brand-cyan">
                <span>Before (Original)</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderPos}
                  onChange={(e) => setSliderPos(parseInt(e.target.value))}
                  className="w-24 accent-brand-cyan"
                />
                <span>After (AI Clean)</span>
              </div>
            )}

            <StudioCanvas
              processedImgUrl={item.processedUrl}
              originalImgUrl={item.originalUrl}
              config={currentConfig}
              brush={brush}
              splitView={splitView}
              sliderPos={sliderPos}
              zoom={zoom}
              maskCanvasRef={maskCanvasRef}
            />
          </div>

          {/* Right Parameter Customizer Panel */}
          <div className="w-full md:w-80 lg:w-96 border-t md:border-t-0 md:border-l border-slate-200/80 dark:border-surface-800 bg-white/90 dark:bg-surface-900/90 backdrop-blur-xl overflow-y-auto shrink-0 max-h-[38vh] md:max-h-full">
            {activeTab === 'background' && (
              <BackgroundPanel
                currentBackdrop={currentConfig.backdrop}
                onChangeBackdrop={(backdrop) => handleConfigChange({ ...currentConfig, backdrop })}
                hasOriginalImage={Boolean(item.originalUrl)}
              />
            )}

            {activeTab === 'crop' && (
              <CropPanel
                currentCrop={currentConfig.crop}
                onChangeCrop={(crop) => handleConfigChange({ ...currentConfig, crop })}
                originalWidth={item.dimensions?.width || 800}
                originalHeight={item.dimensions?.height || 800}
              />
            )}

            {activeTab === 'effects' && (
              <EffectsPanel
                stroke={currentConfig.stroke}
                onChangeStroke={(stroke) => handleConfigChange({ ...currentConfig, stroke })}
                shadow={currentConfig.shadow}
                onChangeShadow={(shadow) => handleConfigChange({ ...currentConfig, shadow })}
                edge={currentConfig.edge}
                onChangeEdge={(edge) => handleConfigChange({ ...currentConfig, edge })}
              />
            )}

            {activeTab === 'touchup' && (
              <TouchUpPanel
                brush={brush}
                onChangeBrush={setBrush}
                onClearMask={() => {
                  if (maskCanvasRef.current) {
                    const ctx = maskCanvasRef.current.getContext('2d');
                    if (ctx) {
                      ctx.clearRect(0, 0, maskCanvasRef.current.width, maskCanvasRef.current.height);
                      // Trigger config update to re-render canvas
                      handleConfigChange({ ...currentConfig });
                    }
                  }
                }}
              />
            )}

            {activeTab === 'adjust' && (
              <ColorAdjustPanel
                adjustments={currentConfig.adjustments}
                onChangeAdjustments={(adjustments) => handleConfigChange({ ...currentConfig, adjustments })}
              />
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
