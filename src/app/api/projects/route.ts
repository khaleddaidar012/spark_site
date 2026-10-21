import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/cloudflare";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { results } = await getDatabase().prepare(
      "SELECT id, title, description, image, project_images, category, stages, stages_configured, location, year FROM projects ORDER BY created_at DESC LIMIT 100"
    ).all<{ id: string; title: string; description: string; image: string; project_images: string; category: string; stages: string; stages_configured: number; location: string; year: string }>();
    const projects = results.map((project) => {
      let stages: unknown[] = [];
      try { stages = JSON.parse(project.stages) as unknown[]; } catch { /* Keep legacy projects readable. */ }
      let images: string[] = [];
      try { images = JSON.parse(project.project_images) as string[]; } catch { /* Keep legacy projects readable. */ }
      return { ...project, images: images.length ? images : [project.image], stages, stagesConfigured: project.stages_configured === 1 };
    });
    return NextResponse.json(projects, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Projects database unavailable" }, { status: 503 });
  }
}
