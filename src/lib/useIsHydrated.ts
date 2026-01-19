"use client";

import { useSyncExternalStore } from "react";

export function useIsHydrated(): boolean {
  const subscribe = (onStoreChange: () => void) => {
    if (typeof window === "undefined") return () => {};
    const id = window.setTimeout(onStoreChange, 0);
    return () => window.clearTimeout(id);
  };

  const getSnapshot = () => true;
  const getServerSnapshot = () => false;

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

