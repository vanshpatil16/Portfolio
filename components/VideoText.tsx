"use client";

import { useId } from "react";

type Props = {
  src: string;
  children: string;
  vbWidth?: number;
  vbHeight?: number;
  fontSize?: number;
  fontWeight?: number | string;
  className?: string;
  poster?: string;
};

/**
 * Video-through-text effect (plain-CSS port of magicui/video-text).
 *
 * Rendering stack (bottom → top):
 *   1. Container div  — background: var(--accent)  [always-visible fallback]
 *   2. <video>        — mix-blend-mode: screen      [black frames = transparent]
 *   3. SVG overlay    — paints var(--bg) everywhere outside the text glyphs
 *
 * Two previous bugs fixed:
 *   • fontFamily/fontWeight/fontSize moved to inline SVG <style> so CSS vars
 *     and web font names resolve correctly — SVG presentation attributes do
 *     NOT resolve CSS custom properties.
 *   • overlay rect fill moved to style attribute for the same reason.
 */
export function VideoText({
  src,
  children,
  vbWidth = 1000,
  vbHeight = 260,
  fontSize = 210,
  fontWeight = 500,
  className,
  poster,
}: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const maskId = `vtm-${uid}`;

  return (
    <div className={"video-text" + (className ? " " + className : "")}>
      <video
        className="vt-video"
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <svg
        className="vt-overlay"
        viewBox={`0 0 ${vbWidth} ${vbHeight}`}
        preserveAspectRatio="xMidYMid meet"
        aria-label={children}
        role="img"
      >
        {/* Inline <style> so CSS custom properties and web font names
            resolve inside the SVG rendering context */}
        <style>{`
          #${maskId}-text {
            font-family: 'Instrument Serif', 'Times New Roman', serif;
            font-weight: ${fontWeight};
            font-size: ${fontSize}px;
          }
        `}</style>
        <defs>
          <mask id={maskId}>
            <rect width="100%" height="100%" fill="white" />
            <text
              id={`${maskId}-text`}
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="central"
              fill="black"
            >
              {children}
            </text>
          </mask>
        </defs>
        {/* style= resolves CSS vars correctly; fill= attribute would not */}
        <rect
          width="100%"
          height="100%"
          style={{ fill: "var(--bg, #0a0a0a)" }}
          mask={`url(#${maskId})`}
        />
      </svg>
    </div>
  );
}
