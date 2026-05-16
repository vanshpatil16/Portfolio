"use client";

import { useMemo, useState } from "react";
import type { ResolvedAchievement } from "@/lib/achievements-server";

export function AchievementCard({
  achievement: a,
  onOpen,
}: {
  achievement: ResolvedAchievement;
  onOpen?: (id: string) => void;
}) {
  const photos = useMemo(
    () =>
      [a.resolvedPhoto, ...a.resolvedGallery].filter(Boolean) as string[],
    [a.resolvedPhoto, a.resolvedGallery]
  );
  const hasPhoto = photos.length > 0;
  const hasGallery = photos.length > 1;

  const [idx, setIdx] = useState(0);
  const current = hasPhoto ? photos[idx % photos.length] : null;

  function cycle() {
    if (hasGallery) {
      setIdx((i) => (i + 1) % photos.length);
    } else {
      // single image (or none) — clicking opens the lightbox
      onOpen?.(a.id);
    }
  }

  return (
    <div
      className={`ach-card ${hasPhoto ? "has-photo" : "no-photo"} tier-${a.tier}`}
      data-spotlight
      role="group"
      aria-label={`${a.tierLabel}: ${a.name}`}
    >
      <button
        type="button"
        className="ach-photo"
        onClick={cycle}
        aria-label={
          hasGallery
            ? `${a.name} — image ${idx + 1} of ${photos.length}, click for next`
            : `${a.name} — click to view details`
        }
      >
        {hasPhoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={`${a.id}-${idx}`}
            src={`/achievements/${current}`}
            alt={a.name}
            loading="lazy"
            className="ach-photo-img"
          />
        ) : (
          <div className="ach-photo-fallback" aria-hidden="true">
            <span className="ach-mono">{a.id.split("-")[0].toUpperCase()}</span>
            <span className="ach-tier-glyph">
              {a.tier === "winner" ? "★" : a.tier === "silver" ? "▪" : "▫"}
            </span>
          </div>
        )}
        <span className={`ach-tier-pill tier-${a.tier}`}>{a.tierLabel}</span>
        <span className="ach-num">{a.num}</span>
        {hasGallery && (
          <div className="ach-photo-dots" aria-hidden="true">
            {photos.map((_, i) => (
              <span
                key={i}
                className={`ach-photo-dot${i === idx ? " active" : ""}`}
              />
            ))}
          </div>
        )}
        {hasGallery && (
          <span className="ach-photo-hint" aria-hidden="true">
            CLICK · NEXT
          </span>
        )}
      </button>
      <div className="ach-body">
        <h3 className="ach-name">{a.name}</h3>
        <div className="ach-meta">
          <span className="ach-org">{a.org}</span>
          <span className="ach-sep">·</span>
          <span className="ach-date">{a.date}</span>
          {a.location && (
            <>
              <span className="ach-sep">·</span>
              <span className="ach-loc">{a.location}</span>
            </>
          )}
        </div>
        {a.summary ? (
          <p className="ach-summary">{a.summary.split(/\n\n+/)[0]}</p>
        ) : (
          <p className="ach-summary ach-summary-empty">
            Summary coming soon — drop the LinkedIn caption into{" "}
            <code>lib/achievements.ts</code>.
          </p>
        )}
        <div className="ach-tags">
          {a.tags?.map((t) => (
            <span key={t} className="ach-tag">
              {t}
            </span>
          ))}
        </div>
      </div>
      <button
        type="button"
        className="ach-arrow"
        onClick={() => onOpen?.(a.id)}
        aria-label={`Open details for ${a.name}`}
      >
        ↗
      </button>
    </div>
  );
}
