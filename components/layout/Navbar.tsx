'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ViewTab } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { useState, useRef, useEffect } from 'react';

interface NavbarProps {
  activeTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  liveCount?: number;
}

const tabs: { key: ViewTab; label: string }[] = [
  { key: 'UPCOMING', label: 'PROXIMOS' },
  { key: 'LIVE', label: 'EN VIVO' },
  { key: 'RESULTS', label: 'RESULTADOS' },
];

export default function Navbar({ activeTab, onTabChange, liveCount = 0 }: NavbarProps) {
  const { user, profile, loading, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-bg-primary/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex items-baseline">
              <span className="font-orbitron font-black text-xl sm:text-2xl text-cyber-cyan text-glow-cyan tracking-wider">
                VYS
              </span>
              <span className="font-orbitron font-black text-xl sm:text-2xl text-cyber-purple2 text-glow-purple tracking-wider">
                COR
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
            <Link
              href="/calendar"
              className="px-3 py-1.5 rounded-full font-mono text-xs sm:text-sm tracking-wide text-muted hover:text-[#e8e8f0] hover:bg-bg-tertiary transition-all duration-150"
            >
              CALENDARIO
            </Link>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-3">
            {liveCount > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-bg-tertiary border border-border">
                <span className="w-2 h-2 rounded-full bg-cyber-red animate-pulse-live" />
                <span className="font-mono text-xs text-cyber-red">
                  {liveCount} EN VIVO
                </span>
              </div>
            )}

            {/* Auth */}
            {!loading && (
              <>
                {user ? (
                  <div className="relative" ref={menuRef}>
                    <button
                      onClick={() => setMenuOpen(!menuOpen)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-tertiary border border-border hover:border-border-hover transition-all duration-150"
                    >
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyber-cyan to-cyber-purple2 flex items-center justify-center">
                        <span className="font-orbitron text-[10px] font-bold text-bg-primary">
                          {(profile?.name?.[0] || user.email?.[0] || 'U').toUpperCase()}
                        </span>
                      </div>
                      <span className="hidden sm:block font-mono text-xs text-[#e8e8f0] max-w-[100px] truncate">
                        {profile?.name || user.email?.split('@')[0]}
                      </span>
                    </button>

                    {menuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50">
                        <Link
                          href="/preferences"
                          onClick={() => setMenuOpen(false)}
                          className="block px-4 py-2.5 font-mono text-xs text-[#e8e8f0] hover:bg-bg-tertiary transition-colors"
                        >
                          Mis categorias
                        </Link>
                        <button
                          onClick={() => { signOut(); setMenuOpen(false); }}
                          className="w-full text-left px-4 py-2.5 font-mono text-xs text-cyber-red hover:bg-bg-tertiary transition-colors"
                        >
                          Cerrar sesion
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyber-purple to-cyber-purple2 text-white font-orbitron text-xs font-bold tracking-wide transition-all duration-150 hover:opacity-90"
                  >
                    ENTRAR
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
