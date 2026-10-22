"use client";
import { useEffect, useState } from "react";
export function ProjectDisplaySettings() {
  const [mode, setMode] = useState("grid");
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/project-display", { cache: "no-store", signal: controller.signal }).then(async response => {
      if (!response.ok) throw new Error();
      const result = await response.json();
      if (!controller.signal.aborted) { setMode(result.mode); setReady(true); }
    }).catch(() => { if (!controller.signal.aborted) setMessage("تعذر تحميل الإعداد. أعد تحميل الصفحة."); });
    return () => controller.abort();
  }, []);
  async function save() {
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/project-display", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mode }) });
      if (!response.ok) throw new Error();
      setMessage("تم حفظ طريقة العرض في الصفحة الرئيسية.");
    } catch { setMessage("تعذر الحفظ. حاول مرة أخرى."); } finally { setBusy(false); }
  }
  return <section className="console-project-form space-y-5 rounded-2xl border border-white/10 bg-white/5 p-6">
    <h2 className="text-xl font-bold">طريقة عرض مشاريع الصفحة الرئيسية</h2>
    <p className="text-sm opacity-75">السلايد شو يعرض 3 مشاريع على الكمبيوتر، ويستبدل مشروعًا كل مرة بحركة إلى اليسار عند وجود أكثر من 3 مشاريع.</p>
    <div className="grid gap-4 sm:grid-cols-2">{[{ value: "grid", title: "معرض تحت بعض", detail: "كل المشاريع في صفوف ثابتة" }, { value: "slideshow", title: "سلايد شو متحرك", detail: "3 مشاريع ظاهرة، وكارت جديد يدخل من اليمين" }].map(option => <label key={option.value} className={"cursor-pointer rounded-xl border-2 p-4 transition-all duration-300 " + (mode === option.value ? "border-[#C59341] bg-[#C59341]/10 shadow-lg" : "border-slate-400/30")}>
      <span className="flex items-center gap-3"><input type="radio" name="projects-layout" value={option.value} checked={mode === option.value} disabled={!ready || busy} onChange={() => setMode(option.value)} /><strong>{option.title}</strong></span>
      <span className="mt-2 block text-sm opacity-75">{option.detail}</span>
      <span aria-hidden="true" className="mt-4 flex gap-2 overflow-hidden">{[0, 1, 2].map(index => <span key={index} className={"h-8 flex-1 rounded bg-[#C59341]/40 transition-transform duration-500 " + (mode === option.value ? "scale-100" : "scale-90")} />)}</span>
    </label>)}</div>
    <button type="button" disabled={!ready || busy} onClick={() => void save()} className="rounded-lg bg-[#C59341] px-5 py-3 font-bold text-[#0B111E] disabled:opacity-50">{busy ? "جارٍ الحفظ…" : "حفظ طريقة العرض"}</button>
    {message && <p role="status">{message}</p>}
  </section>;
}
