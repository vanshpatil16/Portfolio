"use client";

type Props = {
  /** Retained for API compatibility — current implementation is CSS-only. */
  src?: string;
  children: string;
  className?: string;
  /** Retained for API compat — ignored. */
  vbWidth?: number;
  vbHeight?: number;
  fontSize?: number;
  fontWeight?: number | string;
  poster?: string;
};

/**
 * Reliable text display for the hero name.
 *
 * Earlier this component tried to recreate magicui/video-text via an SVG
 * mask over a <video>. That approach proved brittle in production due to
 * three compounding issues:
 *   1. SVG presentation attributes don't resolve CSS custom properties.
 *   2. Web font load races caused the mask glyphs to overflow the viewBox
 *      after the font upgraded from the system fallback.
 *   3. Dark video frames + dark page bg made the cutout invisible even
 *      when the mask did work.
 *
 * This version drops the video entirely and uses background-clip:text with
 * an animated gradient — same "premium" hero vibe, zero runtime risk.
 */
export function VideoText({ children, className }: Props) {
  return (
    <span
      className={"video-text" + (className ? " " + className : "")}
      aria-label={children}
    >
      <span aria-hidden="true">{children}</span>
    </span>
  );
}
