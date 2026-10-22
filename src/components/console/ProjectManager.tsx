"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Image from "next/image";

type Project = { id: string; title: string; description: string; category: string; location: string; year: string; image: string; images: string[] };

export function ProjectManager({ revision }: { revision: number }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Project | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [deleting, setDeleting] = useState<Project | null>(null);
  const refresh = useCallback(async () => {

    try {
      const response = await fetch("/api/projects", { cache: "no-store" });
      if (!response.ok) throw new Error("تعذر تحميل المشاريع. حاول التحديث.");
      setProjects(await response.json());
    } catch (error) { setMessage(error instanceof Error ? error.message : "تعذر تحميل المشاريع"); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/projects", { cache: "no-store", signal: controller.signal })
      .then(async response => {
        if (!response.ok) throw new Error("تعذر تحميل المشاريع. حاول التحديث.");
        const rows = await response.json();
        if (!controller.signal.aborted) { setProjects(rows); setLoading(false); }
      })
      .catch(() => { if (!controller.signal.aborted) { setMessage("تعذر تحميل المشاريع. حاول التحديث."); setLoading(false); } });
    return () => controller.abort();
  }, [revision]);
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing || busy) return;
    if (images.length + files.length < 1 || images.length + files.length > 16) { setMessage("اختر من صورة إلى 16 صورة للمشروع."); return; }
    const form = new FormData(event.currentTarget);
    form.set("id", editing.id);
    form.set("existingImages", JSON.stringify(images));
    files.forEach(file => form.append("images", file));
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/console/projects", { method: "PATCH", body: form });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "تعذر حفظ التعديل");
      setEditing(null); setFiles([]); setMessage("تم تعديل المشروع بنجاح."); await refresh();
    } catch (error) { setMessage(error instanceof Error ? error.message : "تعذر حفظ التعديل"); }
    finally { setBusy(false); }
  }
  async function remove() {
    if (!deleting || busy) return;
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/console/projects", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: deleting.id }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "تعذر حذف المشروع");
      if (editing?.id === deleting.id) setEditing(null);
      setDeleting(null); setMessage("تم حذف المشروع."); await refresh();
    } catch (error) { setMessage(error instanceof Error ? error.message : "تعذر حذف المشروع"); }
    finally { setBusy(false); }
  }
  const input = "w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-slate-900";
  const button = "rounded-lg border border-current/25 px-4 py-2 text-sm font-bold disabled:opacity-50";
  return <section className="console-project-form space-y-5 rounded-2xl border border-white/10 bg-white/5 p-6" aria-label="إدارة المشاريع">
    <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-bold">إدارة المشاريع</h2><button type="button" disabled={busy || loading} onClick={() => void refresh()} className={button}>تحديث القائمة</button></div>
    {message && <p role="status">{message}</p>}
    {loading ? <p role="status">جارٍ تحميل المشاريع…</p> : projects.length === 0 ? <p>لا توجد مشاريع بعد. أضف أول مشروع من النموذج أعلاه.</p> : <ul className="space-y-3">{projects.map(project => <li key={project.id} className="flex flex-wrap items-center gap-4 rounded-xl border border-current/15 p-3">
      <Image src={project.images?.[0] || project.image} alt={project.title} width={96} height={72} unoptimized className="h-18 w-24 rounded-lg object-cover" />
      <div className="min-w-0 flex-1"><h3 className="break-words font-bold">{project.title}</h3><p className="text-sm opacity-70">{[project.location, project.year].filter(Boolean).join(" • ")}</p></div>
      <button type="button" disabled={busy} className={button} onClick={() => { setEditing(project); setImages(project.images?.length ? project.images : [project.image]); setFiles([]); setMessage(""); }}>تعديل</button>
      <button type="button" disabled={busy} className={button + " text-red-600"} onClick={() => setDeleting(project)}>حذف</button>
    </li>)}</ul>}
    {editing && <form key={editing.id} onSubmit={save} className="space-y-4 rounded-xl border border-amber-500/50 p-4">
      <h3 className="text-lg font-bold">تعديل: {editing.title}</h3>
      <label className="block space-y-2"><span>اسم المشروع</span><input name="title" defaultValue={editing.title} required maxLength={160} className={input} /></label>
      <label className="block space-y-2"><span>الوصف</span><textarea name="description" defaultValue={editing.description} required maxLength={2000} rows={4} className={input} /></label>
      <label className="block space-y-2"><span>التصنيف</span><select name="category" defaultValue={editing.category} className={input}><option value="structural">الأساسات والتأسيس</option><option value="finishing">التشطيبات</option><option value="residential">الإنشاءات السكنية</option><option value="renders">التصاميم المعمارية 3D</option></select></label>
      <label className="block space-y-2"><span>موقع التنفيذ</span><input name="location" defaultValue={editing.location} maxLength={120} className={input} /></label>
      <label className="block space-y-2"><span>سنة التنفيذ</span><input name="year" type="number" defaultValue={editing.year} min={1900} max={2100} step={1} className={input} /></label>
      <p className="text-sm">صور المشروع — أول صورة هي الغلاف. يمكنك إزالة الصور وإضافة غيرها، بحد أقصى 16 صورة.</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{images.map((image, index) => <div key={image} className="space-y-2"><Image src={image} alt={index === 0 ? "صورة الغلاف" : "صورة المشروع"} width={160} height={120} unoptimized className="h-28 w-full rounded-lg object-cover" /><button type="button" disabled={busy} className={button} onClick={() => setImages(current => current.filter(url => url !== image))}>إزالة الصورة</button></div>)}</div>
      <label className="block space-y-2"><span>إضافة صور (حتى 5 ميجابايت للصورة)</span><input type="file" multiple accept="image/jpeg,image/png,image/webp,image/avif" disabled={busy} className={input} onChange={event => { const incoming = Array.from(event.currentTarget.files ?? []); if (incoming.some(file => file.size > 5 * 1024 * 1024) || incoming.length + images.length + files.length > 16) { setMessage("الحد 16 صورة، وحجم كل صورة حتى 5 ميجابايت."); } else { setFiles(current => [...current, ...incoming]); } event.currentTarget.value = ""; }} /></label>
      {files.map((file, index) => <div key={index} className="flex items-center justify-between gap-3"><span className="truncate">{file.name}</span><button type="button" disabled={busy} className={button} onClick={() => setFiles(current => current.filter((_, i) => i !== index))}>إزالة</button></div>)}
      <div className="flex gap-3"><button disabled={busy} className="rounded-lg bg-[#C59341] px-5 py-3 font-bold text-[#0B111E] disabled:opacity-50">{busy ? "جارٍ الحفظ…" : "حفظ التعديلات"}</button><button type="button" disabled={busy} className={button} onClick={() => setEditing(null)}>إلغاء</button></div>
    </form>}
    {deleting && <div role="alertdialog" aria-modal="true" aria-labelledby="delete-project-title" className="fixed inset-0 z-[100] grid place-items-center bg-black/75 p-4"><div className="w-full max-w-md space-y-5 rounded-2xl bg-white p-6 text-slate-900"><h3 id="delete-project-title" className="text-xl font-bold">حذف المشروع؟</h3><p>سيُحذف مشروع «{deleting.title}» من الموقع. لا يمكن التراجع عن الحذف.</p><div className="flex gap-3"><button type="button" autoFocus disabled={busy} className={button} onClick={() => setDeleting(null)}>إلغاء</button><button type="button" disabled={busy} className="rounded-lg bg-red-700 px-4 py-2 font-bold text-white disabled:opacity-50" onClick={() => void remove()}>{busy ? "جارٍ الحذف…" : "تأكيد الحذف"}</button></div></div></div>}
  </section>;
}
