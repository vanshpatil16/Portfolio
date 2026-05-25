"use client";

import { useId } from "react";

type Props = {
  src: string;
  children: string;
  /** SVG viewBox width. Default 1000. */
  vbWidth?: number;
  /** SVG viewBox height. Default 200. */
  vbHeight?: number;
  /** Font size in SVG user units. Default 180. */
  fontSize?: number;
  /** Font-family. Falls back to the page's serif var. */
  fontFamily?: string;
  /** Font-weight. Default 600. */
  fontWeight?: number | string;
  className?: string;
  /** Poster image for the underlying video. */
  poster?: string;
};

/**
 * Plain-CSS port of magicui/video-text.
 *
 * A <video> fills the container; an SVG overlay paints the page background
 * everywhere EXCEPT inside the letterforms via an SVG <mask>. White = visible,
 * black (text) = invisible — so the rect covers the area outside the glyphs,
 * revealing the video through the text shape.
 */
export function VideoText({
  src,
  children,
  vbWidth = 1000,
  vbHeight = 200,
  fontSize = 180,
  fontFamily,
  fontWeight = 600,
  className,
  poster,
}: Props) {
  const maskId = useId().replace(/[:]/g, "");
  const family = fontFamily ?? "var(--serif, serif)";

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
        preserveAspectRatio="xMidYMid slice"
        aria-label={children}
      >
        <defs>
          <mask id={`vt-mask-${maskId}`}>
            <rect width="100%" height="100%" fill="white" />
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily={family}
              fontWeight={fontWeight}
              fontSize={fontSize}
              fill="black"
            >
              {children}
            </text>
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="var(--bg)"
          mask={`url(#vt-mask-${maskId})`}
        />
      </svg>
    </div>
  );
}
