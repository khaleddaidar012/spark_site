import { NextResponse } from "next/server";
import { getDatabase, getImagesBucket } from "@/lib/cloudflare";
import { hasConsoleSession, sameOrigin } from "@/lib/console-auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!(await hasConsoleSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!sameOrigin(request)) return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  const form = await request.formData().catch(() => null);
  const title = typeof form?.get("title") === "string" ? String(form.get("title")).trim() : "";
  const description = typeof form?.get("description") === "string" ? String(form.get("description")).trim() : "";
  const image = form?.get("image");
  if (!title || title.length > 160 || !description || description.length > 2000 || !image || typeof image === "string") {
    return NextResponse.json({ error: "أدخل العنوان والوصف واختر صورة للمشروع." }, { status: 400 });
  }
  const extensions: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif" };
  const extension = extensions[image.type];
  if (!extension || image.size === 0 || image.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "اختر صورة JPG أو PNG أو WEBP أو AVIF بحجم لا يتجاوز 5 ميجابايت." }, { status: 400 });
  }
  const bytes = new Uint8Array(await image.arrayBuffer());
  const startsWith = (...signature: number[]) => signature.every((byte, index) => bytes[index] === byte);
  const ascii = (start: number, end: number) => String.fromCharCode(...bytes.slice(start, end));
  const signaturesMatch = image.type === "image/jpeg" ? startsWith(0xff, 0xd8, 0xff)
    : image.type === "image/png" ? startsWith(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)
    : image.type === "image/webp" ? ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP"
    : ascii(4, 12) === "ftypavif" || ascii(4, 12) === "ftypavis";
  if (!signaturesMatch) return NextResponse.json({ error: "محتوى الملف لا يطابق نوع الصورة." }, { status: 400 });

  const id = crypto.randomUUID();
  const key = `${crypto.randomUUID()}.${extension}`;
  let bucket: ReturnType<typeof getImagesBucket> | undefined;
  let stage = "إعداد مخزن الصور";
  try {
    bucket = getImagesBucket();
    stage = "رفع الصورة";
    await bucket.put(key, bytes, { httpMetadata: { contentType: image.type, cacheControl: "public, max-age=31536000, immutable" } });
    stage = "حفظ بيانات المشروع في D1";
    await getDatabase().prepare("INSERT INTO projects (id, title, description, image) VALUES (?, ?, ?, ?)")
      .bind(id, title, description, `/api/uploads/${key}`).run();
    return NextResponse.json({ ok: true, id }, { status: 201 });
  } catch (error) {
    console.error(`Project creation failed during ${stage}.`, error);
    await bucket?.delete(key).catch(() => undefined);
    return NextResponse.json({ error: `تعذر إكمال ${stage}. راجع إعدادات Cloudflare المحلية.` }, { status: 503 });
  }
}
