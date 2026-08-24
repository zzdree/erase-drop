import React from 'react';
import { Shield, Layers } from 'lucide-react';

interface FooterProps {
  onOpenDocs: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDocs }) => {
  return (
    <footer className="w-full mt-24 border-t border-slate-200/80 dark:border-obsidian-800 bg-white/40 dark:bg-obsidian-950/40 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">

        {/* Brand & Mission */}
        <div className="flex flex-col items-center md:items-start gap-1 text-center md:text-left">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-brand-cyan/20 to-brand-purple/20 border border-brand-cyan/30 flex items-center justify-center">
              <Layers className="w-4 h-4 text-brand-cyan" />
            </div>
            <span className="font-extrabold text-base text-slate-900 dark:text-white tracking-tight">
              Erase<span className="text-brand-cyan">Drop</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Next-gen 100% In-Browser AI Background Remover & Pro Studio Suite.
          </p>
        </div>

        {/* Links & Attribution */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-400">
          <button
            onClick={onOpenDocs}
            className="hover:text-brand-cyan transition-colors"
          >
            Cara Kerja & Arsitektur
          </button>

          <button
            onClick={onOpenDocs}
            className="hover:text-brand-cyan transition-colors flex items-center gap-1.5"
          >
            <Shield className="w-3.5 h-3.5 text-brand-emerald" />
            <span>Jaminan Privasi 100%</span>
          </button>

          <a
            href="https://github.com/zzdree/erase-drop"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-slate-800 dark:text-slate-200 hover:text-brand-cyan transition-colors"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span>GitHub @zzdree</span>
          </a>
        </div>

      </div>

      <div className="border-t border-slate-200/40 dark:border-obsidian-900 py-4 text-center text-[11px] font-mono text-slate-400">
        <p>© {new Date().getFullYear()} EraseDrop. 100% Client-Side Machine Learning. Made for creators & professionals.</p>
      </div>
    </footer>
  );
};
