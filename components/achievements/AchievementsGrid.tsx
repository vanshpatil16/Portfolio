"use client";

import { useCallback, useState } from "react";
import type { ResolvedAchievement } from "@/lib/achievements-server";
import { AchievementCard } from "./AchievementCard";
import { AchievementLightbox } from "./AchievementLightbox";
import { SpotlightTracker } from "./SpotlightTracker";

export function AchievementsGrid({ items }: { items: ResolvedAchievement[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const open = useCallback((id: string) => setOpenId(id), []);
  const close = useCallback(() => setOpenId(null), []);
  const active = openId ? items.find((a) => a.id === openId) ?? null : null;

  return (
    <>
      <SpotlightTracker />
      <div className="ach-grid">
        {items.map((a) => (
          <AchievementCard key={a.id} achievement={a} onOpen={open} />
        ))}
      </div>
      <AchievementLightbox achievement={active} onClose={close} />
    </>
  );
}
