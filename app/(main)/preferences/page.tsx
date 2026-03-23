'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { SPORT_CONFIG } from '@/types';
import { cn } from '@/lib/utils';

export default function PreferencesPage() {
  const { user, profile, loading, refetchProfile } = useAuth();
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (profile?.favoriteCategories) {
      setSelected(profile.favoriteCategories);
    }
  }, [profile]);

  const toggleCategory = (sport: string) => {
    setSelected((prev) =>
      prev.includes(sport) ? prev.filter((s) => s !== sport) : [...prev, sport]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    await fetch('/api/user/categories', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categories: selected }),
    });
    await refetchProfile();
    setSaving(false);
    router.push('/');
  };

  if (loading || !user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-bg-tertiary rounded w-1/3" />
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-14 bg-bg-tertiary rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="font-orbitron text-lg font-bold text-[#e8e8f0] mb-2">
        MIS CATEGORIAS FAVORITAS
      </h1>
      <p className="font-mono text-xs text-muted mb-6">
        Selecciona los deportes que te interesan. Apareceran primero en tus filtros.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        {Object.entries(SPORT_CONFIG).map(([sport, config]) => {
          const isSelected = selected.includes(sport);
          return (
            <button
              key={sport}
              onClick={() => toggleCategory(sport)}
              className={cn(
                'flex items-center gap-2 px-4 py-3 rounded-lg border font-mono text-sm transition-all duration-150',
                isSelected
                  ? 'border-cyber-cyan bg-cyber-cyan/10 text-cyber-cyan'
                  : 'border-border bg-bg-tertiary text-muted hover:text-[#e8e8f0] hover:border-border-hover'
              )}
            >
              <span className="text-lg">{config.emoji}</span>
              <span>{config.label}</span>
              {isSelected && (
                <span className="ml-auto text-cyber-cyan">&#10003;</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-gradient-to-r from-cyber-purple to-cyber-purple2 text-white font-orbitron text-sm font-bold rounded-lg tracking-wide transition-all duration-150 hover:opacity-90 disabled:opacity-50"
        >
          {saving ? 'GUARDANDO...' : 'GUARDAR'}
        </button>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-2.5 bg-bg-tertiary border border-border text-muted font-mono text-sm rounded-lg hover:text-[#e8e8f0] transition-all duration-150"
        >
          CANCELAR
        </button>
      </div>
    </div>
  );
}
