'use client';

import { SPORT_CONFIG, FilterTab } from '@/types';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useMemo } from 'react';

interface EventFiltersProps {
  activeFilter: FilterTab;
  onFilterChange: (filter: FilterTab) => void;
}

export default function EventFilters({ activeFilter, onFilterChange }: EventFiltersProps) {
  const { profile } = useAuth();

  const filters = useMemo(() => {
    const allSports = Object.entries(SPORT_CONFIG).map(([sport, config]) => ({
      key: sport as FilterTab,
      label: config.label.toUpperCase(),
      emoji: config.emoji,
    }));

    const favs = profile?.favoriteCategories || [];
    const todos = { key: 'TODOS' as FilterTab, label: 'TODOS', emoji: '' };

    if (favs.length === 0) {
      return [todos, ...allSports];
    }

    const favSet = new Set(favs);
    const favorite = allSports.filter((s) => favSet.has(s.key));
    const rest = allSports.filter((s) => !favSet.has(s.key));

    return [todos, ...favorite, ...rest];
  }, [profile]);

  const favSet = new Set(profile?.favoriteCategories || []);

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {filters.map((filter) => {
        const isActive = activeFilter === filter.key;
        const isFav = favSet.has(filter.key);
        return (
          <button
            key={filter.key}
            onClick={() => onFilterChange(filter.key)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs whitespace-nowrap transition-all duration-150 border',
              isActive
                ? 'border-cyber-cyan text-cyber-cyan bg-cyber-cyan/5'
                : isFav
                  ? 'border-cyber-purple2/50 bg-cyber-purple/5 text-cyber-purple2 hover:text-[#e8e8f0] hover:border-cyber-purple2'
                  : 'border-border-hover bg-bg-tertiary text-muted hover:text-[#e8e8f0] hover:border-border-hover'
            )}
          >
            {filter.emoji && <span>{filter.emoji}</span>}
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
