import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/cloudflare";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { results } = await getDatabase().prepare(
      "SELECT id, title, description, image FROM projects ORDER BY created_at DESC LIMIT 100"
    ).all<{ id: string; title: string; description: string; image: string }>();
    return NextResponse.json(results, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Projects database unavailable" }, { status: 503 });
  }
}
