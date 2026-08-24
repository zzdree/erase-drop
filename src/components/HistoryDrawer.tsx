import React from 'react';
import { X, Trash2, Download, History } from 'lucide-react';
import type { HistoryRecord } from '../types';
import { saveAs } from 'file-saver';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  historyItems: HistoryRecord[];
  onClearHistory: () => void;
  onDeleteItem: (id: string) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  historyItems,
  onClearHistory,
  onDeleteItem,
}) => {
  if (!isOpen) return null;

  const handleDownload = (record: HistoryRecord) => {
    saveAs(record.processedDataUrl, `${record.name.replace(/\.[^/.]+$/, '')}_cutout.png`);
  };

  const formatDate = (timestamp: number) => {
    const d = new Date(timestamp);
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-obsidian-950 border-l border-slate-200 dark:border-obsidian-800 shadow-2xl flex flex-col">

          {/* Header */}
          <div className="p-5 border-b border-slate-200 dark:border-obsidian-800 flex items-center justify-between bg-slate-50/50 dark:bg-obsidian-900/50 backdrop-blur-xl">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/30">
                <History className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Riwayat Lokal</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Tersimpan di IndexedDB browser Anda</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-obsidian-850 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {historyItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center text-slate-400">
                <History className="w-12 h-12 stroke-[1.5] mb-3 opacity-40 text-brand-cyan" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Belum ada riwayat tersimpan</p>
                <p className="text-xs text-slate-500 max-w-xs mt-1">
                  Foto yang diproses di EraseDrop akan disimpan di memori browser lokal tanpa server.
                </p>
              </div>
            ) : (
              historyItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-obsidian-900 border border-slate-200/80 dark:border-obsidian-800 hover:border-brand-cyan/40 transition-colors group shadow-sm"
                >
                  {/* Thumbnail */}
                  <div className="relative w-16 h-16 rounded-xl checkerboard-pattern overflow-hidden flex-shrink-0 border border-slate-200 dark:border-obsidian-700">
                    <img
                      src={item.processedDataUrl}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Metadata */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate" title={item.name}>
                      {item.name}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-mono">
                      <span>{formatSize(item.processedSize)}</span>
                      <span>•</span>
                      <span>{formatDate(item.timestamp)}</span>
                    </div>
                  </div>

                  {/* Quick actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDownload(item)}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-obsidian-800 hover:bg-brand-cyan/20 hover:text-brand-cyan text-slate-700 dark:text-slate-300 transition-colors"
                      title="Download PNG"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteItem(item.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                      title="Hapus dari riwayat"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Action */}
          {historyItems.length > 0 && (
            <div className="p-4 border-t border-slate-200 dark:border-obsidian-800 bg-slate-50/50 dark:bg-obsidian-900/50">
              <button
                onClick={onClearHistory}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 text-xs font-bold transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Hapus Semua Riwayat ({historyItems.length})</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
