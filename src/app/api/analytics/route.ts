import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDatabase } from "@/lib/cloudflare";
import { hasConsoleSession, sameOrigin } from "@/lib/console-auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  if (await hasConsoleSession()) return new Response(null, { status: 204 });
  const body = await request.json().catch(() => null) as { type?: string } | null;
  if (body?.type !== "view" && body?.type !== "heartbeat") {
    return NextResponse.json({ error: "Invalid analytics event." }, { status: 400 });
  }
  const visitorId = (await cookies()).get("spark_visitor")?.value;
  if (!visitorId || visitorId.length > 64) return new Response(null, { status: 204 });
  try {
    const today = new Date().toISOString().slice(0, 10);
    const now = Math.floor(Date.now() / 1000);
    const db = getDatabase();
    const writes = [];
    if (body.type === "view") {
      writes.push(db.prepare("INSERT INTO page_visits (visit_day, visitor_id, visited_at) VALUES (?, ?, ?)")
        .bind(today, visitorId, now).run());
    } else {
      writes.push(db.prepare("INSERT INTO active_visitors (visitor_id, last_seen) VALUES (?, ?) ON CONFLICT(visitor_id) DO UPDATE SET last_seen = excluded.last_seen")
        .bind(visitorId, now).run());
    }
    await Promise.all(writes);
    return new Response(null, { status: 204 });
  } catch {
    return new Response(null, { status: 503 });
  }
}

export async function GET(request: Request) {
  if (!(await hasConsoleSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const db = getDatabase();
    const activeSince = Math.floor(Date.now() / 1000) - 30;
    if (new URL(request.url).searchParams.get("live") === "1") {
      const activeResult = await db.prepare("SELECT COUNT(*) AS activeNow FROM active_visitors WHERE last_seen >= ?")
        .bind(activeSince).first<{ activeNow: number }>();
      return NextResponse.json({ activeNow: activeResult?.activeNow ?? 0 }, { headers: { "Cache-Control": "no-store" } });
    }

    const [result, trendResult, activeResult] = await Promise.all([
      db.prepare(
      "SELECT COUNT(DISTINCT CASE WHEN visit_day = date('now') THEN visitor_id END) AS daily, " +
      "COUNT(DISTINCT CASE WHEN visit_day = date('now', '-1 day') THEN visitor_id END) AS previousDaily, " +
      "COUNT(DISTINCT CASE WHEN visit_day >= date('now', '-6 days') THEN visitor_id END) AS weekly, " +
      "COUNT(DISTINCT CASE WHEN visit_day BETWEEN date('now', '-13 days') AND date('now', '-7 days') THEN visitor_id END) AS previousWeekly, " +
      "COUNT(DISTINCT CASE WHEN visit_day >= date('now', '-29 days') THEN visitor_id END) AS monthly, " +
      "COUNT(DISTINCT CASE WHEN visit_day BETWEEN date('now', '-59 days') AND date('now', '-30 days') THEN visitor_id END) AS previousMonthly " +
      "FROM page_visits WHERE visit_day >= date('now', '-59 days')"
      ).first<{ daily: number; previousDaily: number; weekly: number; previousWeekly: number; monthly: number; previousMonthly: number }>(),
      db.prepare("SELECT visit_day, COUNT(DISTINCT visitor_id) AS visitors FROM page_visits WHERE visit_day >= date('now', '-29 days') GROUP BY visit_day ORDER BY visit_day")
        .all<{ visit_day: string; visitors: number }>(),
      db.prepare("SELECT COUNT(*) AS activeNow FROM active_visitors WHERE last_seen >= ?")
        .bind(activeSince).first<{ activeNow: number }>(),
    ]);

    const byDay = new Map(trendResult.results.map((row) => [row.visit_day, row.visitors]));
    const today = new Date();
    const trend = Array.from({ length: 30 }, (_, index) => {
      const date = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - 29 + index));
      const day = date.toISOString().slice(0, 10);
      return { day, visitors: byDay.get(day) ?? 0 };
    });

    return NextResponse.json({ ...(result ?? { daily: 0, previousDaily: 0, weekly: 0, previousWeekly: 0, monthly: 0, previousMonthly: 0 }), activeNow: activeResult?.activeNow ?? 0, trend }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Failed to load console analytics", error);
    return NextResponse.json({ error: "تعذر قراءة التحليلات" }, { status: 503 });
  }
}
