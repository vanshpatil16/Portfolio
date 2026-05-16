import { NextResponse } from "next/server";
import { getResolvedAchievements } from "@/lib/achievements-server";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const tier = url.searchParams.get("tier");
  const all = await getResolvedAchievements();
  const items = tier ? all.filter((a) => a.tier === tier) : all;
  return NextResponse.json(
    {
      ok: true,
      count: items.length,
      items,
    },
    {
      // CDN-cacheable; revalidate every hour.
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
    },
  );
}
