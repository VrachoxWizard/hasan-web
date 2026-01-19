"use client";

import { useSyncExternalStore } from "react";

export function useMediaQuery(query: string): boolean {
  const getSnapshot = () => {
    if (typeof window === "undefined" || !("matchMedia" in window)) return false;
    return window.matchMedia(query).matches;
  };

  const getServerSnapshot = () => false;

  const subscribe = (onStoreChange: () => void) => {
    if (typeof window === "undefined" || !("matchMedia" in window)) {
      return () => {};
    }

    const media = window.matchMedia(query);
    const listener = () => onStoreChange();

    // Modern browsers
    if ("addEventListener" in media) {
      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
    }

    // Safari < 14 fallback
    const legacyMedia = media as MediaQueryList & {
      addListener?: (listener: (event: MediaQueryListEvent) => void) => void;
      removeListener?: (listener: (event: MediaQueryListEvent) => void) => void;
    };

    legacyMedia.addListener?.(listener);
    return () => legacyMedia.removeListener?.(listener);
  };

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
