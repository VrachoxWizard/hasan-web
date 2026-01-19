"use client";

import { useEffect } from "react";
import { useFavoritiStore } from "@/stores/favoritiStore";
import { useUsporediStore } from "@/stores/usporediStore";

export default function StoreHydration() {
  useEffect(() => {
    // Rehydrate stores from localStorage
    useFavoritiStore.persist.rehydrate();
    useUsporediStore.persist.rehydrate();

    // Fallback: If rehydration doesn't trigger within 100ms, force hydrated state
    // This handles cases where localStorage is unavailable (private browsing, etc.)
    const timeout = setTimeout(() => {
      if (!useFavoritiStore.getState().hasHydrated) {
        useFavoritiStore.getState().setHasHydrated(true);
      }
      if (!useUsporediStore.getState().hasHydrated) {
        useUsporediStore.getState().setHasHydrated(true);
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  return null;
}
