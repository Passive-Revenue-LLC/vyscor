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
      <h1 className="font-syncopate text-lg font-bold text-white uppercase tracking-[0.1em] mb-2">
        MIS CATEGORIAS FAVORITAS
      </h1>
      <p className="font-inter text-sm text-muted mb-6">
        Selecciona los deportes que te interesan. Apareceran primero en tus filtros.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mb-8">
        {Object.entries(SPORT_CONFIG).map(([sport, config]) => {
          const isSelected = selected.includes(sport);
          return (
            <button
              key={sport}
              onClick={() => toggleCategory(sport)}
              className={cn(
                'flex items-center gap-2 px-3 sm:px-4 py-3 rounded-lg border font-inter text-sm font-medium transition-all duration-150',
                isSelected
                  ? 'border-[#354FE3] bg-[#354FE3]/12 text-white'
                  : 'border-border bg-bg-tertiary text-muted hover:text-white hover:border-border-hover'
              )}
            >
              <span className="text-lg">{config.emoji}</span>
              <span>{config.label}</span>
              {isSelected && (
                <span className="ml-auto text-[#3E60EA]">&#10003;</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-[#354FE3] hover:bg-[#3E60EA] text-white font-syncopate text-sm font-bold rounded-lg uppercase tracking-[0.1em] transition-colors duration-150 disabled:opacity-50"
        >
          {saving ? 'GUARDANDO...' : 'GUARDAR'}
        </button>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-2.5 bg-bg-tertiary border border-border text-muted font-syncopate text-sm font-bold uppercase tracking-[0.1em] rounded-lg hover:text-white transition-all duration-150"
        >
          CANCELAR
        </button>
      </div>
    </div>
  );
}
