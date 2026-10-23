"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { isFinePointer, prefersReducedMotion } from "@/lib/motion";

// Cursor code is only downloaded on desktop with a real mouse and motion allowed.
const MagneticCursor = dynamic(() => import("./magnetic-cursor"), { ssr: false });

export function MotionRoot() {
  const [cursor, setCursor] = useState(false);
  useEffect(() => {
    // deferred to idle so it never competes with hydration / LCP
    const enable = () => setCursor(isFinePointer() && !prefersReducedMotion());
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(enable, { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(enable, 300); // Safari
    return () => clearTimeout(id);
  }, []);
  return cursor ? <MagneticCursor /> : null;
}
