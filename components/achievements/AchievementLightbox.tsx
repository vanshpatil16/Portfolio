"use client";

import { useEffect, useMemo, useState } from "react";
import type { ResolvedAchievement } from "@/lib/achievements-server";

const AUTOPLAY_MS = 4500;

export function AchievementLightbox({
  achievement,
  onClose,
}: {
  achievement: ResolvedAchievement | null;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  const photos = useMemo(() => {
    if (!achievement) return [] as string[];
    return [achievement.resolvedPhoto, ...achievement.resolvedGallery].filter(
      Boolean
    ) as string[];
  }, [achievement]);

  // reset gallery state whenever the active achievement changes
  useEffect(() => {
    setIdx(0);
    setPaused(false);
  }, [achievement?.id]);

  // keyboard: ESC closes, arrows navigate gallery (and pause autoplay)
  useEffect(() => {
    if (!achievement) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight" && photos.length > 1) {
        setIdx((i) => (i + 1) % photos.length);
        setPaused(true);
      } else if (e.key === "ArrowLeft" && photos.length > 1) {
        setIdx((i) => (i - 1 + photos.length) % photos.length);
        setPaused(true);
      }
    }
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [achievement, onClose, photos.length]);

  // autoplay slideshow — pauses on hover/manual nav, respects reduced-motion
  useEffect(() => {
    if (!achievement || photos.length < 2 || paused) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const id = window.setInterval(() => {
      setIdx((i) => (i + 1) % photos.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [achievement, photos.length, paused, idx]);

  if (!achievement) return null;
  const current = photos[idx];
  const paragraphs = (achievement.summary ?? "").split(/\n\n+/).filter(Boolean);
  const playing = photos.length > 1 && !paused;

  return (
    <div className="ach-lb-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="ach-lb" onClick={(e) => e.stopPropagation()}>
        <button className="ach-lb-close" onClick={onClose} aria-label="Close">
          ✕
        </button>
        <div
          className="ach-lb-photo"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="ach-lb-stage">
            {current ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={`${achievement.id}-${idx}`}
                src={`/achievements/${current}`}
                alt={achievement.name}
                className="ach-lb-slide"
              />
            ) : (
              <div className="ach-lb-fallback">no image yet</div>
            )}
          </div>
          {photos.length > 1 && (
            <>
              <button
                className="ach-lb-nav prev"
                onClick={() => {
                  setIdx((i) => (i - 1 + photos.length) % photos.length);
                  setPaused(true);
                }}
                aria-label="Previous image"
              >
                ←
              </button>
              <button
                className="ach-lb-nav next"
                onClick={() => {
                  setIdx((i) => (i + 1) % photos.length);
                  setPaused(true);
                }}
                aria-label="Next image"
              >
                →
              </button>
              <div className="ach-lb-counter">
                <span>{String(idx + 1).padStart(2, "0")}</span>
                <span className="sep">/</span>
                <span>{String(photos.length).padStart(2, "0")}</span>
              </div>
              <div className="ach-lb-dots" role="tablist" aria-label="Slide navigation">
                {photos.map((_, i) => (
                  <button
                    key={i}
                    className={`ach-lb-dot${i === idx ? " active" : ""}`}
                    role="tab"
                    aria-selected={i === idx}
                    aria-label={`Go to image ${i + 1}`}
                    onClick={() => {
                      setIdx(i);
                      setPaused(true);
                    }}
                  >
                    <span
                      className="ach-lb-dot-fill"
                      style={
                        i === idx && playing
                          ? { animationDuration: `${AUTOPLAY_MS}ms` }
                          : undefined
                      }
                    />
                  </button>
                ))}
              </div>
              <button
                className="ach-lb-play"
                onClick={() => setPaused((p) => !p)}
                aria-label={paused ? "Resume slideshow" : "Pause slideshow"}
                aria-pressed={!paused}
              >
                {paused ? "▶" : "❚❚"}
              </button>
            </>
          )}
        </div>
        <div className="ach-lb-body">
          <div className="ach-lb-head">
            <span className={`ach-tier-pill tier-${achievement.tier}`}>
              {achievement.tierLabel}
            </span>
            <span className="ach-lb-num">{achievement.num}</span>
          </div>
          <h3 className="ach-lb-name">{achievement.name}</h3>
          <div className="ach-lb-meta">
            <span>{achievement.org}</span>
            <span className="ach-sep">·</span>
            <span>{achievement.date}</span>
            {achievement.location && (
              <>
                <span className="ach-sep">·</span>
                <span>{achievement.location}</span>
              </>
            )}
          </div>
          <div className="ach-lb-summary">
            {paragraphs.length > 0 ? (
              paragraphs.map((p, i) => <p key={i}>{p}</p>)
            ) : (
              <p className="muted">Summary coming soon.</p>
            )}
          </div>
          {achievement.team && achievement.team.length > 0 && (
            <div className="ach-lb-section">
              <div className="ach-lb-label">Team</div>
              <div className="ach-lb-list">{achievement.team.join(" · ")}</div>
            </div>
          )}
          {achievement.tags && achievement.tags.length > 0 && (
            <div className="ach-lb-tags">
              {achievement.tags.map((t) => (
                <span key={t} className="ach-tag">
                  {t}
                </span>
              ))}
            </div>
          )}
          {achievement.href && (
            <a
              className="ach-lb-link"
              href={achievement.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              View on LinkedIn ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
