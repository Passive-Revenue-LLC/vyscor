'use client';

import { SPORT_CONFIG, FilterTab } from '@/types';
import { cn } from '@/lib/utils';

interface EventFiltersProps {
  activeFilter: FilterTab;
  onFilterChange: (filter: FilterTab) => void;
}

const filters: { key: FilterTab; label: string; emoji?: string }[] = [
  { key: 'TODOS', label: 'TODOS' },
  ...Object.entries(SPORT_CONFIG).map(([sport, config]) => ({
    key: sport as FilterTab,
    label: config.label.toUpperCase(),
    emoji: config.emoji,
  })),
];

export default function EventFilters({ activeFilter, onFilterChange }: EventFiltersProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {filters.map((filter) => {
        const isActive = activeFilter === filter.key;
        return (
          <button
            key={filter.key}
            onClick={() => onFilterChange(filter.key)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs whitespace-nowrap transition-all duration-150 border',
              isActive
                ? 'border-cyber-cyan text-cyber-cyan bg-cyber-cyan/5'
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
