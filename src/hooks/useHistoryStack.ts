import { useState, useCallback } from 'react';
import type { StudioConfig } from '../types';

export function useHistoryStack(initialConfig: StudioConfig, maxHistory = 30) {
  const [history, setHistory] = useState<StudioConfig[]>([initialConfig]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const pushState = useCallback((newConfig: StudioConfig) => {
    setHistory((prev) => {
      const sliced = prev.slice(0, currentIndex + 1);
      if (sliced.length >= maxHistory) {
        sliced.shift();
      }
      return [...sliced, newConfig];
    });
    setCurrentIndex((prev) => Math.min(prev + 1, maxHistory - 1));
  }, [currentIndex, maxHistory]);

  const undo = useCallback((): StudioConfig | null => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      return history[newIndex];
    }
    return null;
  }, [currentIndex, history]);

  const redo = useCallback((): StudioConfig | null => {
    if (currentIndex < history.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      return history[newIndex];
    }
    return null;
  }, [currentIndex, history]);

  const resetHistory = useCallback((config: StudioConfig) => {
    setHistory([config]);
    setCurrentIndex(0);
  }, []);

  return {
    canUndo: currentIndex > 0,
    canRedo: currentIndex < history.length - 1,
    undo,
    redo,
    pushState,
    resetHistory,
    currentConfig: history[currentIndex] || initialConfig,
  };
}
