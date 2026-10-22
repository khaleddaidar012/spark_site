import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/cloudflare";
import { storeImage, deleteImage } from "@/lib/image-storage";
import { hasConsoleSession, sameOrigin } from "@/lib/console-auth";

export const dynamic = "force-dynamic";

const extensions: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif" };
const categories = new Set(["structural", "finishing", "residential", "renders"]);
const maxImageSize = 5 * 1024 * 1024;
const maxProjectImages = 16;
const maxImagesPerStage = 8;
const maxStageImagesPerProject = 16;

async function validateImage(file: FormDataEntryValue | null) {
  if (!file || typeof file === "string") throw new Error("اختر صورة صالحة لكل صورة مطلوبة.");
  const extension = extensions[file.type];
  if (!extension || file.size === 0 || file.size > maxImageSize) throw new Error("اختر صورة JPG أو PNG أو WEBP أو AVIF بحجم لا يتجاوز 5 ميجابايت.");
  const bytes = new Uint8Array(await file.arrayBuffer());
  const startsWith = (...signature: number[]) => signature.every((byte, index) => bytes[index] === byte);
  const ascii = (start: number, end: number) => String.fromCharCode(...bytes.slice(start, end));
  const valid = file.type === "image/jpeg" ? startsWith(0xff, 0xd8, 0xff)
    : file.type === "image/png" ? startsWith(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)
    : file.type === "image/webp" ? ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP"
    : ascii(4, 12) === "ftypavif" || ascii(4, 12) === "ftypavis";
  if (!valid) throw new Error("محتوى الملف لا يطابق نوع الصورة.");
  return { bytes, extension, contentType: file.type };
}

type StoredProject = { id: string; image: string; project_images: string; stages: string };

export async function POST(request: Request) { return saveProject(request, false); }
export async function PATCH(request: Request) { return saveProject(request, true); }

async function saveProject(request: Request, editing: boolean) {
  if (!(await hasConsoleSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!sameOrigin(request)) return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  const form = await request.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "بيانات النموذج غير صالحة." }, { status: 400 });
  const id = String(form.get("id") ?? "");
  let existing: StoredProject | null = null;
  let keptImages: string[] = [];
  if (editing) {
    existing = await getDatabase().prepare("SELECT id, image, project_images, stages FROM projects WHERE id = ?").bind(id).first<StoredProject>();
    if (!existing) return NextResponse.json({ error: "المشروع غير موجود" }, { status: 404 });
    try {
      const requested: unknown = JSON.parse(String(form.get("existingImages") ?? "[]"));
      const allowed = new Set([existing.image, ...JSON.parse(existing.project_images)]);
      if (!Array.isArray(requested) || requested.some((image) => typeof image !== "string" || !allowed.has(image))) throw new Error();
      keptImages = [...new Set(requested)] as string[];
    } catch { return NextResponse.json({ error: "صور المشروع غير صالحة" }, { status: 400 }); }
  }
  const title = String(form.get("title") ?? "").trim();
  const location = String(form.get("location") ?? "").trim();
  const year = String(form.get("year") ?? "").trim();
  const description = String(form.get("description") ?? "").trim();
  const category = String(form.get("category") ?? "").trim() || "residential";
  const validYear = !year || (/^\d{4}$/.test(year) && Number(year) >= 1900 && Number(year) <= 2100);
  const projectImageFiles = form.getAll("images").filter((file): file is File => typeof file !== "string" && file.size > 0);
  const stageTitles = form.getAll("stageTitle");
  const stageDescriptions = form.getAll("stageDescription");
  const stageFiles = stageTitles.map((_, index) => form.getAll(`stageImages-${index}`));
  const totalStageImages = stageFiles.reduce((total, files) => total + files.length, 0);
  const stageCount = stageTitles.length;
  if (!title || title.length > 160 || location.length > 120 || !validYear || !description || description.length > 2000 || !categories.has(category) || projectImageFiles.length + keptImages.length < 1 || projectImageFiles.length + keptImages.length > maxProjectImages || stageCount > 12 || stageDescriptions.length !== stageCount || stageFiles.length !== stageCount || stageFiles.some((files) => files.length < 1 || files.length > maxImagesPerStage) || totalStageImages > maxStageImagesPerProject) {
    return NextResponse.json({ error: "أدخل اسم المشروع ووصفه واختر من صورة إلى 16 صورة صالحة للمشروع. البيانات الأخرى اختيارية." }, { status: 400 });
  }
  const stageText = stageTitles.map((value, index) => ({ title: String(value).trim(), description: String(stageDescriptions[index]).trim() }));
  if (stageText.some((stage) => !stage.title || stage.title.length > 160 || !stage.description || stage.description.length > 2000)) {
    return NextResponse.json({ error: "أدخل عنوانًا ووصفًا صالحين لكل مرحلة." }, { status: 400 });
  }

  const keys: string[] = [];
  let stage = "التحقق من الصور";
  try {
    const projectImages = await Promise.all(projectImageFiles.map(validateImage));
    const phaseImages = await Promise.all(stageFiles.map((files) => Promise.all(files.map(validateImage))));
    const upload = async (image: Awaited<ReturnType<typeof validateImage>>) => {
      const key = `${crypto.randomUUID()}.${image.extension}`;
      keys.push(key);
      await storeImage(key, image.bytes, image.contentType);
      return `/api/uploads/${key}`;
    };
    stage = "رفع صور المشروع ومراحله";
    const uploadedUrls = await Promise.all([...projectImages, ...phaseImages.flatMap((images) => images)].map(upload));
    const projectImageUrls = [...keptImages, ...uploadedUrls.slice(0, projectImages.length)];
    const coverImage = projectImageUrls[0];
    const flatPhaseUrls = uploadedUrls.slice(projectImages.length);
    let nextPhaseUrl = 0;
    const projectId = existing?.id ?? crypto.randomUUID();
    const stages = stageText.map((text, index) => {
      const images = flatPhaseUrls.slice(nextPhaseUrl, nextPhaseUrl + phaseImages[index].length);
      nextPhaseUrl += phaseImages[index].length;
      return { stageNumber: index + 1, titleAr: text.title, titleEn: text.title, descriptionAr: text.description, descriptionEn: text.description, image: images[0], images };
    });
    stage = "حفظ بيانات المشروع في D1";
    if (existing) {
      await getDatabase().prepare("UPDATE projects SET title = ?, description = ?, image = ?, project_images = ?, category = ?, location = ?, year = ? WHERE id = ?")
        .bind(title, description, coverImage, JSON.stringify(projectImageUrls), category, location, year, projectId).run();
      await cleanupImages([existing.image, ...JSON.parse(existing.project_images)]).catch(console.error);
      return NextResponse.json({ ok: true, id: projectId });
    }
    await getDatabase().prepare("INSERT INTO projects (id, title, description, image, project_images, category, stages, stages_configured, location, year) VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?)")
      .bind(projectId, title, description, coverImage, JSON.stringify(projectImageUrls), category, JSON.stringify(stages), location, year).run();
    return NextResponse.json({ ok: true, id: projectId }, { status: 201 });
  } catch (error) {
    console.error(`Project creation failed during ${stage}.`, error);
    await Promise.allSettled(keys.map((key) => deleteImage(key)));
    const message = error instanceof Error && stage === "التحقق من الصور" ? error.message : `تعذر إكمال ${stage}. راجع إعدادات Cloudflare المحلية.`;
    return NextResponse.json({ error: message }, { status: stage === "التحقق من الصور" ? 400 : 503 });
  }
}

async function cleanupImages(images: string[]) {
  for (const image of new Set(images)) {
    if (!/^\/api\/uploads\/[0-9a-f-]{36}\.(jpg|png|webp|avif)$/i.test(image)) continue;
    await getDatabase().prepare("DELETE FROM uploaded_images WHERE image_key = ? AND NOT EXISTS (SELECT 1 FROM projects WHERE image = ? OR instr(project_images, ?) > 0 OR instr(stages, ?) > 0)")
      .bind(image.slice("/api/uploads/".length), image, image, image).run();
  }
}

export async function DELETE(request: Request) {
  if (!(await hasConsoleSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!sameOrigin(request)) return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  const body = await request.json().catch(() => null);
  if (typeof body?.id !== "string" || !body.id) return NextResponse.json({ error: "المشروع غير صالح" }, { status: 400 });
  try {
    const db = getDatabase();
    const project = await db.prepare("SELECT id, image, project_images, stages FROM projects WHERE id = ?").bind(body.id).first<StoredProject>();
    if (!project) return NextResponse.json({ error: "المشروع غير موجود" }, { status: 404 });
    await db.prepare("DELETE FROM projects WHERE id = ?").bind(body.id).run();
    const stages = JSON.parse(project.stages) as { image: string; images?: string[] }[];
    await cleanupImages([project.image, ...JSON.parse(project.project_images), ...stages.flatMap(stage => stage.images?.length ? stage.images : [stage.image])]).catch(console.error);
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ error: "تعذر حذف المشروع. حاول مرة أخرى." }, { status: 503 }); }
}
