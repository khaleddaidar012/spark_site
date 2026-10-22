import { readImage } from "@/lib/image-storage";

export const dynamic = "force-dynamic";

const contentTypes: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif",
};

export async function GET(_request: Request, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const match = /^([0-9a-f-]{36})\.(jpg|png|webp|avif)$/i.exec(key);
  if (!match) return new Response("Not found", { status: 404 });

  try {
    const object = await readImage(key);
    if (!object?.body) return new Response("Not found", { status: 404 });

    const headers = new Headers({
      "Content-Type": object.contentType ?? contentTypes[match[2].toLowerCase()],
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    });
    return new Response(object.body, { headers });
  } catch {
    return new Response("Image storage unavailable", { status: 503 });
  }
}
