'use client';

import { useAppStore } from '@/store/useAppStore';

export function useFilters() {
  const viewTab = useAppStore((s) => s.viewTab);
  const sportFilter = useAppStore((s) => s.sportFilter);
  const setViewTab = useAppStore((s) => s.setViewTab);
  const setSportFilter = useAppStore((s) => s.setSportFilter);

  return { viewTab, sportFilter, setViewTab, setSportFilter };
}
