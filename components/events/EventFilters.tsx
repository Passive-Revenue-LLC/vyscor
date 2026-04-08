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
    <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
      {filters.map((filter) => {
        const isActive = activeFilter === filter.key;
        const isFav = favSet.has(filter.key);
        return (
          <button
            key={filter.key}
            onClick={() => onFilterChange(filter.key)}
            className={cn(
              'flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg font-mono text-[11px] sm:text-xs whitespace-nowrap transition-all duration-150 border',
              isActive
                ? 'border-[#6B00F0] text-white bg-[#6B00F0]/12'
                : isFav
                  ? 'border-[#6B00F0]/40 bg-[#6B00F0]/5 text-[#7C4CFF] hover:text-white hover:border-[#7C4CFF]'
                  : 'border-[#252525] bg-[#1B1B1B] text-[#6B6B6B] hover:text-white hover:border-[#3A3A3A]'
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
