import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/cloudflare";
import { hasConsoleSession, sameOrigin } from "@/lib/console-auth";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const row = await getDatabase().prepare("SELECT setting_value FROM site_settings WHERE setting_key = ?").bind("home_projects_layout").first<{ setting_value: string }>();
    return NextResponse.json({ mode: row?.setting_value === "slideshow" ? "slideshow" : "grid" }, { headers: { "Cache-Control": "no-store" } });
  } catch { return NextResponse.json({ error: "تعذر تحميل طريقة العرض" }, { status: 503 }); }
}
export async function PUT(request: Request) {
  if (!(await hasConsoleSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!sameOrigin(request)) return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  const body = await request.json().catch(() => null);
  if (body?.mode !== "grid" && body?.mode !== "slideshow") return NextResponse.json({ error: "طريقة العرض غير صالحة" }, { status: 400 });
  try {
    await getDatabase().prepare("INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?) ON CONFLICT(setting_key) DO UPDATE SET setting_value = excluded.setting_value").bind("home_projects_layout", body.mode).run();
    return NextResponse.json({ ok: true, mode: body.mode });
  } catch { return NextResponse.json({ error: "تعذر حفظ طريقة العرض" }, { status: 503 }); }
}
