"use client";

import { useEffect, useRef } from "react";
import createGlobe, { type COBEOptions } from "cobe";

/**
 * Plain-CSS port of magicui/globe.
 *
 * Renders a rotating dotted globe via `cobe` (WebGL canvas). Pointer drag
 * adjusts rotation phi. Respects prefers-reduced-motion (animation halts;
 * static globe remains).
 */

type Props = {
  className?: string;
  config?: Partial<COBEOptions>;
  markerColor?: [number, number, number];
  glowColor?: [number, number, number];
};

const DEFAULT_MARKERS = [
  { location: [19.076, 72.8777], size: 0.1 },
  { location: [25.6, 85.1], size: 0.06 },
  { location: [37.7595, -122.4367], size: 0.05 },
  { location: [40.7128, -74.006], size: 0.05 },
  { location: [51.5074, -0.1278], size: 0.05 },
  { location: [35.6762, 139.6503], size: 0.05 },
  { location: [-33.8688, 151.2093], size: 0.04 },
];

export function Globe({
  className,
  config,
  markerColor = [0.831, 1, 0],
  glowColor = [0.831, 1, 0],
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    let width = canvas.offsetWidth;
    let phi = 0;
    let raf = 0;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onResize = () => {
      width = canvas.offsetWidth;
    };
    window.addEventListener("resize", onResize);

    const globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.12, 0.12, 0.12],
      markerColor,
      glowColor,
      markers: DEFAULT_MARKERS as COBEOptions["markers"],
      ...config,
    });

    const tick = () => {
      if (!pointerInteracting.current && !reduceMotion) phi += 0.003;
      globe.update({
        phi: phi + pointerInteractionMovement.current,
        width: width * 2,
        height: width * 2,
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    requestAnimationFrame(() => {
      canvas.style.opacity = "1";
    });

    return () => {
      cancelAnimationFrame(raf);
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, [config, markerColor, glowColor]);

  return (
    <div className={"globe-wrap" + (className ? " " + className : "")}>
      <canvas
        ref={canvasRef}
        className="globe-canvas"
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX - pointerInteractionMovement.current;
          e.currentTarget.style.cursor = "grabbing";
        }}
        onPointerUp={(e) => {
          pointerInteracting.current = null;
          e.currentTarget.style.cursor = "grab";
        }}
        onPointerOut={(e) => {
          pointerInteracting.current = null;
          e.currentTarget.style.cursor = "grab";
        }}
        onMouseMove={(e) => {
          if (pointerInteracting.current !== null) {
            const delta = e.clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta / 200;
          }
        }}
        onTouchMove={(e) => {
          if (pointerInteracting.current !== null && e.touches[0]) {
            const delta = e.touches[0].clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta / 100;
          }
        }}
      />
    </div>
  );
}
