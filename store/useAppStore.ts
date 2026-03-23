import { create } from 'zustand';
import { ViewTab, FilterTab, Event } from '@/types';

interface AppState {
  viewTab: ViewTab;
  sportFilter: FilterTab;
  favorites: string[];
  setViewTab: (tab: ViewTab) => void;
  setSportFilter: (filter: FilterTab) => void;
  toggleFavorite: (eventId: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  viewTab: 'UPCOMING',
  sportFilter: 'TODOS',
  favorites: [],
  setViewTab: (tab) => set({ viewTab: tab }),
  setSportFilter: (filter) => set({ sportFilter: filter }),
  toggleFavorite: (eventId) =>
    set((state) => ({
      favorites: state.favorites.includes(eventId)
        ? state.favorites.filter((id) => id !== eventId)
        : [...state.favorites, eventId],
    })),
}));
