import React from 'react';
import {
  Palette,
  Crop,
  Sparkles,
  Paintbrush,
  SlidersHorizontal,
  Layers
} from 'lucide-react';

export type StudioTab = 'background' | 'crop' | 'effects' | 'touchup' | 'adjust';

interface StudioSidebarProps {
  activeTab: StudioTab;
  onChangeTab: (tab: StudioTab) => void;
}

export const StudioSidebar: React.FC<StudioSidebarProps> = ({ activeTab, onChangeTab }) => {
  const tabs = [
    { id: 'background' as StudioTab, label: 'Backdrop', icon: Palette, badge: 'Presets' },
    { id: 'crop' as StudioTab, label: 'Pas Foto & Crop', icon: Crop, badge: '2x3, 3x4, 4x6' },
    { id: 'effects' as StudioTab, label: 'Outline & Shadow', icon: Sparkles, badge: 'Sticker FX' },
    { id: 'touchup' as StudioTab, label: 'Touch-up Brush', icon: Paintbrush, badge: 'Erase/Restore' },
    { id: 'adjust' as StudioTab, label: 'Color Adjust', icon: SlidersHorizontal, badge: 'Filters' },
  ];

  return (
    <div className="w-full md:w-64 flex md:flex-col bg-surface-100/80 dark:bg-surface-900/90 border-b md:border-b-0 md:border-r border-slate-200/80 dark:border-surface-800 p-2 md:p-3 gap-1.5 overflow-x-auto md:overflow-y-auto shrink-0 select-none">
      <div className="hidden md:flex items-center gap-2 px-3 py-2 text-xs font-mono font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
        <Layers className="w-3.5 h-3.5 text-brand-cyan" />
        <span>Studio Tools</span>
      </div>

      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChangeTab(tab.id)}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left font-medium transition-all text-xs sm:text-sm whitespace-nowrap md:whitespace-normal group ${
              isActive
                ? 'bg-brand-cyan text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-surface-800'
            }`}
          >
            <Icon className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
            <div className="flex flex-col flex-1">
              <span>{tab.label}</span>
              <span className={`text-[10px] hidden md:block ${isActive ? 'text-slate-900/80' : 'text-slate-400 dark:text-slate-500 font-mono'}`}>
                {tab.badge}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};
