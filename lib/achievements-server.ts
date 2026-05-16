// Server-only: auto-discovers images under public/achievements/ for each achievement.
// Drop a file named `<photoSlug>-N.<ext>` and it will be picked up automatically — no code change required.

import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { ACHIEVEMENTS, type Achievement } from "./achievements";

const IMG_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"]);

/** Natural sort: foo-2 < foo-10, and "6.0" < "7". */
function naturalCompare(a: string, b: string): number {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

async function listFolderFiles(): Promise<string[]> {
  const dir = path.join(process.cwd(), "public", "achievements");
  try {
    const entries = await fs.readdir(dir);
    return entries.filter((f) => IMG_EXT.has(path.extname(f).toLowerCase()));
  } catch {
    return [];
  }
}

export type ResolvedAchievement = Achievement & {
  /** Primary photo to show in the card banner (file name, served from /achievements/<name>). */
  resolvedPhoto?: string;
  /** Additional photos for the lightbox carousel. */
  resolvedGallery: string[];
};

export async function getResolvedAchievements(): Promise<ResolvedAchievement[]> {
  const allFiles = await listFolderFiles();

  return ACHIEVEMENTS.map((a) => {
    // Manual override path (legacy): if `photo` is set, prefer that.
    if (a.photo) {
      return {
        ...a,
        resolvedPhoto: a.photo,
        resolvedGallery: a.gallery ?? [],
      };
    }

    // Auto-discovery: any file starting with the slug + "-".
    const slug = a.photoSlug ?? a.id;
    const matches = allFiles
      .filter((f) => f.startsWith(slug + "-") || f.startsWith(slug + "."))
      .sort(naturalCompare);

    return {
      ...a,
      resolvedPhoto: matches[0],
      resolvedGallery: matches.slice(1),
    };
  });
}
