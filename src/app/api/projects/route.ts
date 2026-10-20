import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/cloudflare";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { results } = await getDatabase().prepare(
      "SELECT id, title, description, image, category, stages FROM projects ORDER BY created_at DESC LIMIT 100"
    ).all<{ id: string; title: string; description: string; image: string; category: string; stages: string }>();
    const projects = results.map((project) => {
      let stages: unknown[] = [];
      try { stages = JSON.parse(project.stages) as unknown[]; } catch { /* Keep legacy projects readable. */ }
      return { ...project, stages };
    });
    return NextResponse.json(projects, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Projects database unavailable" }, { status: 503 });
  }
}
