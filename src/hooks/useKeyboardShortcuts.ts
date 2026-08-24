import { useEffect } from 'react';

interface KeyboardShortcutHandlers {
  onUndo?: () => void;
  onRedo?: () => void;
  onSave?: () => void;
  onToggleBrush?: () => void;
  onToggleErase?: () => void;
  onToggleSplit?: () => void;
  onClose?: () => void;
  onResetZoom?: () => void;
}

export function useKeyboardShortcuts(handlers: KeyboardShortcutHandlers, enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore when focusing input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const isCtrl = isMac ? e.metaKey : e.ctrlKey;

      if (isCtrl && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handlers.onRedo?.();
        } else {
          handlers.onUndo?.();
        }
      } else if (isCtrl && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handlers.onRedo?.();
      } else if (isCtrl && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handlers.onSave?.();
      } else if (e.key.toLowerCase() === 'b') {
        handlers.onToggleBrush?.();
      } else if (e.key.toLowerCase() === 'e') {
        handlers.onToggleErase?.();
      } else if (e.key.toLowerCase() === 'v') {
        handlers.onToggleSplit?.();
      } else if (e.key === 'Escape') {
        handlers.onClose?.();
      } else if (e.key === '0' && isCtrl) {
        e.preventDefault();
        handlers.onResetZoom?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers, enabled]);
}
