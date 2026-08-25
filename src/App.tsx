import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import type {
  ProcessedImageItem,
  HistoryRecord,
  BackdropOption,
  StudioConfig
} from './types';
import { DEFAULT_STUDIO_CONFIG } from './types';
import { processImageBackground, isWebGPUSupported } from './services/bgRemoval';
import {
  saveHistoryItem,
  getAllHistoryItems,
  deleteHistoryItem,
  clearAllHistory
} from './services/db';
import { downloadAllAsZip } from './services/zipExporter';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { DropZone } from './components/DropZone';
import { QueueList } from './components/QueueList';
import { StudioModal } from './components/studio/StudioModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { DocModal } from './components/DocModal';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('erasedrop_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Hardware support state
  const [isGpuSupported, setIsGpuSupported] = useState<boolean>(false);

  // Queue state
  const [items, setItems] = useState<ProcessedImageItem[]>([]);
  const isProcessingQueueRef = useRef(false);

  // Studio modal state
  const [activeStudioItem, setActiveStudioItem] = useState<ProcessedImageItem | null>(null);

  // Drawers and Modals
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [historyItems, setHistoryItems] = useState<HistoryRecord[]>([]);
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);

  // Initialize theme class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('erasedrop_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('erasedrop_theme', 'light');
    }
  }, [darkMode]);

  // Check GPU support on mount
  useEffect(() => {
    isWebGPUSupported().then((supported) => setIsGpuSupported(supported));
  }, []);

  // Load IndexedDB history on mount
  useEffect(() => {
    getAllHistoryItems().then((records) => setHistoryItems(records));
  }, []);

  const handleToggleTheme = () => setDarkMode(!darkMode);

  // Helper to convert blob to base64 DataURL for history storage
  const blobToDataUrl = (blob: Blob): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  };

  // Add files to queue
  const handleFilesSelected = (files: File[]) => {
    const newItems: ProcessedImageItem[] = files.map((file) => ({
      id: `img_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      file,
      name: file.name,
      originalSize: file.size,
      originalUrl: URL.createObjectURL(file),
      processedBlob: null,
      processedUrl: null,
      status: 'pending',
      progress: 0,
      studioConfig: { ...DEFAULT_STUDIO_CONFIG },
    }));

    setItems((prev) => [...prev, ...newItems]);
  };

  // Handle sample selection from Hero
  const handleSelectSample = async (sampleUrl: string, name: string) => {
    try {
      const res = await fetch(sampleUrl);
      const blob = await res.blob();
      const file = new File([blob], name, { type: blob.type || 'image/jpeg' });
      handleFilesSelected([file]);
    } catch (err) {
      console.error('Failed to load sample image:', err);
    }
  };

  // Background removal worker loop
  useEffect(() => {
    const processQueue = async () => {
      if (isProcessingQueueRef.current) return;

      const nextPending = items.find((i) => i.status === 'pending');
      if (!nextPending) return;

      isProcessingQueueRef.current = true;

      // Mark as processing
      setItems((prev) =>
        prev.map((item) =>
          item.id === nextPending.id ? { ...item, status: 'processing', progress: 5 } : item
        )
      );

      const startTime = performance.now();

      try {
        const resultBlob = await processImageBackground(nextPending.file, {
          onProgress: (progress) => {
            setItems((prev) =>
              prev.map((item) =>
                item.id === nextPending.id ? { ...item, progress } : item
              )
            );
          },
        });

        const durationMs = Math.round(performance.now() - startTime);
        const processedUrl = URL.createObjectURL(resultBlob);

        // Update item in queue
        setItems((prev) =>
          prev.map((item) =>
            item.id === nextPending.id
              ? {
                  ...item,
                  status: 'completed',
                  progress: 100,
                  processedBlob: resultBlob,
                  processedUrl,
                  durationMs,
                }
              : item
          )
        );

        // Save to IndexedDB history
        const processedDataUrl = await blobToDataUrl(resultBlob);
        const historyRecord: HistoryRecord = {
          id: nextPending.id,
          name: nextPending.name,
          originalSize: nextPending.originalSize,
          processedSize: resultBlob.size,
          timestamp: Date.now(),
          thumbnailDataUrl: processedDataUrl,
          processedDataUrl,
          width: 0,
          height: 0,
        };
        await saveHistoryItem(historyRecord);
        setHistoryItems((prev) => [historyRecord, ...prev]);

        // If this was the last item, trigger confetti celebration!
        const remainingPending = items.filter(
          (i) => i.status === 'pending' && i.id !== nextPending.id
        );
        if (remainingPending.length === 0) {
          confetti({
            particleCount: 90,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#00F0FF', '#10B981', '#6366F1', '#EC4899'],
          });
        }
      } catch (err: unknown) {
        console.error('Error processing item:', err);
        setItems((prev) =>
          prev.map((item) =>
            item.id === nextPending.id
              ? {
                  ...item,
                  status: 'error',
                  error: err instanceof Error ? err.message : 'Processing failed',
                }
              : item
          )
        );
      } finally {
        isProcessingQueueRef.current = false;
      }
    };

    processQueue();
  }, [items]);

  // Queue actions
  const handleRemoveItem = (id: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) {
        if (item.originalUrl) URL.revokeObjectURL(item.originalUrl);
        if (item.processedUrl) URL.revokeObjectURL(item.processedUrl);
      }
      return prev.filter((i) => i.id !== id);
    });
  };

  const handleClearAll = () => {
    items.forEach((item) => {
      if (item.originalUrl) URL.revokeObjectURL(item.originalUrl);
      if (item.processedUrl) URL.revokeObjectURL(item.processedUrl);
    });
    setItems([]);
  };

  const handleRetryItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'pending', progress: 0, error: undefined } : item
      )
    );
  };

  const handleSaveStudioConfig = (id: string, config: StudioConfig) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, studioConfig: config } : item))
    );
    if (activeStudioItem && activeStudioItem.id === id) {
      setActiveStudioItem((prev) => (prev ? { ...prev, studioConfig: config } : null));
    }
  };

  const handleUpdateItemBackdrop = (id: string, backdrop: BackdropOption) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              studioConfig: { ...item.studioConfig, backdrop },
            }
          : item
      )
    );
  };

  const handleApplyBackdropToAll = (backdrop: BackdropOption) => {
    setItems((prev) =>
      prev.map((item) => ({
        ...item,
        studioConfig: { ...item.studioConfig, backdrop },
      }))
    );
  };

  const handleDownloadAllZip = async () => {
    setIsDownloadingZip(true);
    try {
      await downloadAllAsZip(items, `erasedrop_batch_${Date.now()}.zip`);
    } catch (err) {
      console.error('Failed to export ZIP:', err);
    } finally {
      setIsDownloadingZip(false);
    }
  };

  // History Drawer actions
  const handleDeleteHistory = async (id: string) => {
    await deleteHistoryItem(id);
    setHistoryItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAllHistory = async () => {
    await clearAllHistory();
    setHistoryItems([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-mesh-light dark:bg-mesh-dark transition-colors text-slate-900 dark:text-white antialiased selection:bg-brand-cyan selection:text-slate-950">

      {/* Top Navbar */}
      <Navbar
        darkMode={darkMode}
        onToggleTheme={handleToggleTheme}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenDocs={() => setIsDocsOpen(true)}
        isGpuSupported={isGpuSupported}
        historyCount={historyItems.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 flex flex-col items-center">

        {/* Hero Value Section (When queue is empty) */}
        {items.length === 0 && (
          <HeroSection
            onSelectSample={handleSelectSample}
            isGpuSupported={isGpuSupported}
          />
        )}

        {/* Dropzone / Upload Area */}
        {items.length === 0 ? (
          <div className="w-full max-w-3xl animate-in fade-in duration-500">
            <DropZone onFilesSelected={handleFilesSelected} />
          </div>
        ) : (
          <div className="w-full animate-in fade-in duration-300">
            <QueueList
              items={items}
              onOpenStudio={(item) => setActiveStudioItem(item)}
              onRemoveItem={handleRemoveItem}
              onClearAll={handleClearAll}
              onAddMore={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.multiple = true;
                input.accept = 'image/*';
                input.onchange = (e) => {
                  const target = e.target as HTMLInputElement;
                  if (target.files) handleFilesSelected(Array.from(target.files));
                };
                input.click();
              }}
              onDownloadAllZip={handleDownloadAllZip}
              onApplyBackdropToAll={handleApplyBackdropToAll}
              onUpdateItemBackdrop={handleUpdateItemBackdrop}
              isDownloadingZip={isDownloadingZip}
              onRetryItem={handleRetryItem}
            />
          </div>
        )}

      </main>

      {/* Footer */}
      <Footer onOpenDocs={() => setIsDocsOpen(true)} />

      {/* Pro Studio Modal */}
      <StudioModal
        item={activeStudioItem}
        onClose={() => setActiveStudioItem(null)}
        onSaveConfig={handleSaveStudioConfig}
      />

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        historyItems={historyItems}
        onClearHistory={handleClearAllHistory}
        onDeleteItem={handleDeleteHistory}
      />

      {/* Documentation / Privacy Modal */}
      <DocModal
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
      />

    </div>
  );
};

export default App;
