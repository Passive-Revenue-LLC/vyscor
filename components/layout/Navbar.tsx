'use client';

import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ViewTab } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { useState, useRef, useEffect } from 'react';

interface NavbarProps {
  activeTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  liveCount?: number;
}

const tabs: { key: ViewTab; label: string; shortLabel: string }[] = [
  { key: 'UPCOMING', label: 'PROXIMOS', shortLabel: 'PROX' },
  { key: 'LIVE', label: 'EN VIVO', shortLabel: 'LIVE' },
  { key: 'RESULTS', label: 'RESULTADOS', shortLabel: 'RESULT' },
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
    <nav className="sticky top-0 z-50 bg-[#111111]/85 backdrop-blur-md border-b border-[#252525]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0" aria-label="Vyscor">
            <Image
              src="/assets/logo-white.svg"
              alt="Vyscor"
              width={140}
              height={28}
              priority
              className="h-6 sm:h-7 w-auto"
            />
          </Link>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-0.5 sm:gap-1 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => onTabChange(tab.key)}
                  className={cn(
                    'relative px-2.5 sm:px-3.5 py-2 font-syncopate text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.1em] transition-colors duration-150 whitespace-nowrap',
                    isActive
                      ? 'text-white'
                      : 'text-[#6B6B6B] hover:text-white'
                  )}
                >
                  <span className="sm:hidden">{tab.shortLabel}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                  {isActive && (
                    <span className="absolute left-1/2 -translate-x-1/2 -bottom-0.5 w-1 h-1 rounded-full bg-[#354FE3]" />
                  )}
                </button>
              );
            })}
            <Link
              href="/calendar"
              className="hidden sm:block px-3.5 py-2 font-syncopate text-[11px] font-bold uppercase tracking-[0.1em] text-[#6B6B6B] hover:text-white transition-colors duration-150 whitespace-nowrap"
            >
              CALENDARIO
            </Link>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {liveCount > 0 && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#354FE3]/12 border border-[#354FE3]/35">
                <span className="w-1.5 h-1.5 rounded-full bg-[#354FE3] animate-pulse-live" />
                <span className="font-syncopate text-[10px] font-bold uppercase tracking-[0.1em] text-[#3E60EA] whitespace-nowrap">
                  {liveCount}<span className="hidden sm:inline">&nbsp;LIVE</span>
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
                      className="flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-md bg-[#1B1B1B] border border-[#252525] hover:border-[#354FE3] transition-colors duration-150"
                    >
                      <div className="w-6 h-6 rounded-full bg-[#354FE3] flex items-center justify-center shrink-0">
                        <span className="font-syncopate text-[10px] font-bold text-white">
                          {(profile?.name?.[0] || user.email?.[0] || 'U').toUpperCase()}
                        </span>
                      </div>
                      <span className="hidden sm:block font-syncopate text-[11px] font-bold uppercase tracking-[0.05em] text-white max-w-[100px] truncate">
                        {profile?.name || user.email?.split('@')[0]}
                      </span>
                    </button>

                    {menuOpen && (
                      <div className="absolute right-0 mt-2 w-52 bg-[#1B1B1B] border border-[#252525] rounded-xl overflow-hidden z-50">
                        <Link
                          href="/calendar"
                          onClick={() => setMenuOpen(false)}
                          className="block sm:hidden px-4 py-3 font-syncopate text-[11px] font-bold uppercase tracking-[0.1em] text-white hover:bg-[#252525] transition-colors"
                        >
                          Calendario
                        </Link>
                        <Link
                          href="/preferences"
                          onClick={() => setMenuOpen(false)}
                          className="block px-4 py-3 font-syncopate text-[11px] font-bold uppercase tracking-[0.1em] text-white hover:bg-[#252525] transition-colors"
                        >
                          Mis categorias
                        </Link>
                        <button
                          onClick={() => { signOut(); setMenuOpen(false); }}
                          className="w-full text-left px-4 py-3 font-syncopate text-[11px] font-bold uppercase tracking-[0.1em] text-[#3E60EA] hover:bg-[#252525] transition-colors"
                        >
                          Cerrar sesion
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="px-3 sm:px-4 py-2 rounded-md bg-[#354FE3] hover:bg-[#3E60EA] text-white font-syncopate text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.1em] transition-colors duration-150"
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
