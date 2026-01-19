"use client";

import dynamic from "next/dynamic";

// Lazy-load floating UI from the client side to keep the server layout lean
const FloatingWhatsApp = dynamic(() => import("./FloatingWhatsApp"), {
  ssr: false,
});

const FloatingCompareBar = dynamic(() => import("./FloatingCompareBar"), {
  ssr: false,
});

export default function FloatingOverlays() {
  return (
    <>
      <FloatingCompareBar />
      <FloatingWhatsApp />
    </>
  );
}
