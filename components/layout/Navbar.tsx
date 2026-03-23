'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ViewTab } from '@/types';
import { getLiveCount } from '@/lib/mock-data';

interface NavbarProps {
  activeTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
}

const tabs: { key: ViewTab; label: string }[] = [
  { key: 'UPCOMING', label: 'PROXIMOS' },
  { key: 'LIVE', label: 'EN VIVO' },
  { key: 'RESULTS', label: 'RESULTADOS' },
];

export default function Navbar({ activeTab, onTabChange }: NavbarProps) {
  const liveCount = getLiveCount();

  return (
    <nav className="sticky top-0 z-50 bg-bg-primary/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex items-baseline">
              <span className="font-orbitron font-black text-xl sm:text-2xl text-cyber-cyan text-glow-cyan tracking-wider">
                ODD
              </span>
              <span className="font-orbitron font-black text-xl sm:text-2xl text-cyber-purple2 text-glow-purple tracking-wider">
                YX
              </span>
            </div>
            <span className="hidden sm:block font-mono text-[10px] text-muted tracking-widest uppercase">
              Sports &amp; Esports Hub
            </span>
          </Link>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 sm:gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => onTabChange(tab.key)}
                className={cn(
                  'px-3 py-1.5 rounded-full font-mono text-xs sm:text-sm tracking-wide transition-all duration-150',
                  activeTab === tab.key
                    ? 'bg-cyber-cyan text-bg-primary font-bold'
                    : 'text-muted hover:text-[#e8e8f0] hover:bg-bg-tertiary'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Right section */}
          <div className="flex items-center gap-3">
            {/* Live pill */}
            {liveCount > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-bg-tertiary border border-border">
                <span className="w-2 h-2 rounded-full bg-cyber-red animate-pulse-live" />
                <span className="font-mono text-xs text-cyber-red">
                  {liveCount} EN VIVO
                </span>
              </div>
            )}

            {/* Betting button */}
            <div className="relative hidden sm:block">
              <span className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-cyber-amber text-bg-primary font-mono text-[9px] font-bold rounded-full z-10">
                PROXIMO
              </span>
              <button className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyber-purple to-cyber-purple2 text-white font-orbitron text-xs font-bold tracking-wide transition-all duration-150 hover:opacity-90">
                APUESTAS
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
