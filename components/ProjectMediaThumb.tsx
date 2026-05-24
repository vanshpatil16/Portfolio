"use client";

import { useEffect, useState } from "react";

type Props = {
  media: string;
  label: string;
  href?: string;
};

export function ProjectMediaThumb({ media, label, href }: Props) {
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    if (!zoomed) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoomed(false);
    };
    const prevOverflow = document.body.style.overflow;
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [zoomed]);

  return (
    <>
      <div className="proj-thumb proj-thumb-media">
        <span className="pt-label">{label}</span>
        <button
          type="button"
          className="proj-thumb-zoom"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setZoomed(true);
          }}
          aria-label={`${label} — expand preview`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={media} alt={`${label} architecture preview`} loading="lazy" />
        </button>
      </div>

      {zoomed && (
        <div
          className="proj-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${label} preview`}
          onClick={() => setZoomed(false)}
        >
          <button
            type="button"
            className="proj-lightbox-close"
            onClick={(e) => {
              e.stopPropagation();
              setZoomed(false);
            }}
            aria-label="Close preview"
          >
            ×
          </button>

          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="proj-lightbox-link"
              onClick={(e) => e.stopPropagation()}
              aria-label={`${label} — open live`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={media} alt={`${label} architecture preview`} />
            </a>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={media}
              alt={`${label} architecture preview`}
              onClick={(e) => e.stopPropagation()}
            />
          )}

          <span className="proj-lightbox-hint">
            {href ? "Tap image to open live ↗ · × or ESC to close" : "× or ESC to close"}
          </span>
        </div>
      )}
    </>
  );
}
