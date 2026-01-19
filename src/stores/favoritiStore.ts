import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Vozilo } from "@/types/vozilo";

interface FavoritiState {
  favoriti: Vozilo[];
  recentlyViewed: string[];
  hasHydrated: boolean;
  setHasHydrated: (hydrated: boolean) => void;
  addFavorit: (vozilo: Vozilo) => boolean;
  removeFavorit: (id: string) => void;
  isFavorit: (id: string) => boolean;
  toggleFavorit: (vozilo: Vozilo) => boolean;
  clearFavoriti: () => void;
  addRecentlyViewed: (id: string) => void;
  getRecentlyViewedIds: () => string[];
}

export const useFavoritiStore = create<FavoritiState>()(
  persist(
    (set, get) => ({
      favoriti: [],
      recentlyViewed: [],
      hasHydrated: false,
      setHasHydrated: (hydrated) => set({ hasHydrated: hydrated }),

      addFavorit: (vozilo) => {
        const { favoriti } = get();
        if (favoriti.find((v) => v.id === vozilo.id)) {
          return false;
        }
        set({ favoriti: [...favoriti, vozilo] });
        return true;
      },

      removeFavorit: (id) => {
        set({ favoriti: get().favoriti.filter((v) => v.id !== id) });
      },

      isFavorit: (id) => {
        return get().favoriti.some((v) => v.id === id);
      },

      toggleFavorit: (vozilo) => {
        const { isFavorit, addFavorit, removeFavorit } = get();
        if (isFavorit(vozilo.id)) {
          removeFavorit(vozilo.id);
          return false;
        } else {
          addFavorit(vozilo);
          return true;
        }
      },

      clearFavoriti: () => {
        set({ favoriti: [] });
      },

      addRecentlyViewed: (id) => {
        const { recentlyViewed } = get();
        const filtered = recentlyViewed.filter((vid) => vid !== id);
        const updated = [id, ...filtered].slice(0, 10);
        set({ recentlyViewed: updated });
      },

      getRecentlyViewedIds: () => {
        return get().recentlyViewed;
      },
    }),
    {
      name: "favoriti-storage",
      skipHydration: true,
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
