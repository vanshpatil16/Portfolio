"use client";

import { useEffect } from "react";

/**
 * Mounts a single global pointermove listener that publishes cursor
 * coordinates (in viewport space) onto :root as --x / --y CSS vars,
 * plus normalized --xp / --yp (0..1). Any element with [data-spotlight]
 * picks these up via CSS to render a cursor-following radial glow.
 *
 * Uses background-attachment: fixed in the spotlight layer so the same
 * viewport-relative coordinates render correctly on every card.
 */
export function SpotlightTracker() {
  useEffect(() => {
    // Skip on touch devices — there's no hover/cursor to track.
    if (typeof window === "undefined") return;
    if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) return;

    const root = document.documentElement;
    let raf = 0;
    let pendingX = 0;
    let pendingY = 0;

    function flush() {
      raf = 0;
      root.style.setProperty("--x", pendingX.toFixed(2));
      root.style.setProperty("--y", pendingY.toFixed(2));
      root.style.setProperty("--xp", (pendingX / window.innerWidth).toFixed(3));
      root.style.setProperty("--yp", (pendingY / window.innerHeight).toFixed(3));
    }

    function onMove(e: PointerEvent) {
      pendingX = e.clientX;
      pendingY = e.clientY;
      if (!raf) raf = requestAnimationFrame(flush);
    }

    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
