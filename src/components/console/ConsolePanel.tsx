"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUp, BarChart3, CalendarDays, GripVertical, ImagePlus, LogOut, Moon, Plus, RefreshCw, Sun, Trash2, TrendingDown, TrendingUp, Users } from "lucide-react";

type StageDraft = { id: string; preview?: string };

type Counts = {
  daily: number;
  previousDaily: number;
  weekly: number;
  previousWeekly: number;
  monthly: number;
  previousMonthly: number;
  trend: { day: string; visitors: number }[];
};

function TrendBars({ data, locale }: { data: Counts["trend"]; locale: string }) {
  const max = Math.max(1, ...data.map((point) => point.visitors));
  return (
    <div className="mt-5 flex h-14 items-end gap-1" aria-label={locale === "ar" ? "رسم اتجاه الزيارات" : "Visit trend chart"}>
      {data.map((point) => (
        <div key={point.day} className="flex h-full min-w-0 flex-1 items-end" title={`${point.day}: ${point.visitors}`}>
          <div
            className="w-full rounded-t-sm bg-gradient-to-t from-[#C59341]/35 to-[#DEB86A] transition-[height,opacity] duration-700 ease-out group-hover:from-[#C59341]/60"
            style={{ height: `${Math.max(point.visitors > 0 ? 12 : 4, (point.visitors / max) * 100)}%` }}
          />
        </div>
      ))}
    </div>
  );
}

function growth(current: number, previous: number) {
  if (previous === 0) return current === 0 ? { text: "0%", direction: "flat" as const } : { text: "جديد", direction: "up" as const };
  const change = Math.round(((current - previous) / previous) * 100);
  return { text: `${change > 0 ? "+" : ""}${change}%`, direction: change > 0 ? "up" as const : change < 0 ? "down" as const : "flat" as const };
}

export function ConsolePanel({ authenticated: initiallyAuthenticated }: { authenticated: boolean }) {
  const [authenticated, setAuthenticated] = useState(initiallyAuthenticated);
  const [password, setPassword] = useState("");
  const [counts, setCounts] = useState<Counts>({ daily: 0, previousDaily: 0, weekly: 0, previousWeekly: 0, monthly: 0, previousMonthly: 0, trend: [] });
  const [activeVisitors, setActiveVisitors] = useState<number | null>(null);
  const [updatedAt, setUpdatedAt] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [stages, setStages] = useState<StageDraft[]>([{ id: "stage-1" }]);
  const [draggedStage, setDraggedStage] = useState<string | null>(null);
  const previewUrls = useRef(new Map<string, string>());

  useEffect(() => () => {
    previewUrls.current.forEach((url) => URL.revokeObjectURL(url));
    previewUrls.current.clear();
  }, []);

  function moveStage(fromId: string, toId: string) {
    setStages((items) => {
      const from = items.findIndex((item) => item.id === fromId);
      const to = items.findIndex((item) => item.id === toId);
      if (from < 0 || to < 0 || from === to) return items;
      const reordered = [...items];
      const [stage] = reordered.splice(from, 1);
      reordered.splice(to, 0, stage);
      return reordered;
    });
  }

  function removeStage(id: string) {
    const preview = previewUrls.current.get(id);
    if (preview) URL.revokeObjectURL(preview);
    previewUrls.current.delete(id);
    setStages((items) => items.filter((item) => item.id !== id));
  }

  function toggleTheme() {
    setTheme((current) => current === "light" ? "dark" : "light");
  }

  const refreshCounts = useCallback(async (showSpinner = false, signal?: AbortSignal) => {
    if (showSpinner) setRefreshing(true);
    try {
      const response = await fetch("/api/analytics", { cache: "no-store", signal });
      if (response.ok) {
        const result = await response.json() as Counts & { activeNow: number };
        if (signal?.aborted) return;
        setActiveVisitors((current) => current === result.activeNow ? current : result.activeNow);
        const nextCounts: Counts = {
          daily: result.daily,
          previousDaily: result.previousDaily,
          weekly: result.weekly,
          previousWeekly: result.previousWeekly,
          monthly: result.monthly,
          previousMonthly: result.previousMonthly,
          trend: result.trend,
        };
        setCounts((current) => JSON.stringify(current) === JSON.stringify(nextCounts) ? current : nextCounts);
        setUpdatedAt((current) => current !== null && Math.floor(current / 60_000) === Math.floor(Date.now() / 60_000) ? current : Date.now());
      }
    } catch {
      // Keep the last successful snapshot visible while the dashboard is offline.
    } finally {
      if (showSpinner && !signal?.aborted) setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    let stopped = false;
    let activeTimer: number | undefined;
    let countsTimer: number | undefined;
    let activeRequest: AbortController | undefined;
    let countsRequest: AbortController | undefined;

    const scheduleActivePoll = async () => {
      activeRequest?.abort();
      activeRequest = new AbortController();
      try {
        const response = await fetch("/api/analytics?live=1", { cache: "no-store", signal: activeRequest.signal });
        if (!response.ok) return;
        const result = await response.json() as { activeNow: number };
        if (!stopped && !activeRequest.signal.aborted) {
          setActiveVisitors((current) => current === result.activeNow ? current : result.activeNow);
        }
      } catch {
        // Keep the last successful live count while the dashboard is offline.
      } finally {
        if (!stopped && document.visibilityState === "visible") {
          activeTimer = window.setTimeout(() => void scheduleActivePoll(), 15_000);
        }
      }
    };

    const scheduleCountsPoll = async () => {
      countsRequest?.abort();
      countsRequest = new AbortController();
      await refreshCounts(false, countsRequest.signal);
      if (!stopped && document.visibilityState === "visible") {
        countsTimer = window.setTimeout(() => void scheduleCountsPoll(), 15_000);
      }
    };

    const stopTimers = () => {
      if (activeTimer !== undefined) window.clearTimeout(activeTimer);
      if (countsTimer !== undefined) window.clearTimeout(countsTimer);
      activeTimer = undefined;
      countsTimer = undefined;
      activeRequest?.abort();
      countsRequest?.abort();
    };

    const startPolling = () => {
      stopTimers();
      if (document.visibilityState !== "visible") return;
      void scheduleActivePoll();
      void scheduleCountsPoll();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") startPolling();
      else stopTimers();
    };

    startPolling();
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      stopped = true;
      stopTimers();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [authenticated, refreshCounts]);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage("");
    const response = await fetch("/api/console/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
    const result = await response.json();
    setBusy(false);
    if (!response.ok) { setMessage(result.error ?? "تعذر تسجيل الدخول"); return; }
    setAuthenticated(true); setPassword("");
  }

  async function addProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage("");
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const response = await fetch("/api/console/projects", { method: "POST", body: form });
    const result = await response.json();
    setBusy(false);
    if (!response.ok) { setMessage(result.error ?? "تعذر إضافة المشروع"); return; }
    formElement.reset();
    previewUrls.current.forEach((url) => URL.revokeObjectURL(url));
    previewUrls.current.clear();
    setStages([{ id: crypto.randomUUID() }]);
    setMessage("تم حفظ المشروع وسيظهر في المعرض.");
  }

  async function logout() {
    await fetch("/api/console/login", { method: "DELETE" });
    setAuthenticated(false);
  }

  return (
    <main dir="rtl" data-theme={theme} className={`spark-console-page min-h-[100svh] ${authenticated ? "px-4 py-12 sm:px-8" : "grid place-items-center p-4"}`}>
      <div className={`w-full ${authenticated ? "mx-auto max-w-6xl space-y-8" : "max-w-md"}`}>
        <header className={`mb-6 ${authenticated ? "flex flex-wrap items-center justify-between gap-4" : "text-center"}`}>
          <div><p className={`text-sm font-bold ${theme === "light" ? "text-[#946200]" : "text-[#DEB86A]"}`}>SPARK • PRIVATE</p><h1 className="mt-2 text-3xl font-extrabold">لوحة إدارة سبارك</h1></div>
          <div className={`flex items-center gap-2 ${authenticated ? "" : "mx-auto"}`}>
            <button type="button" onClick={toggleTheme} aria-label={theme === "light" ? "تفعيل الوضع الداكن" : "تفعيل الوضع الفاتح"} title={theme === "light" ? "تفعيل الوضع الداكن" : "تفعيل الوضع الفاتح"} aria-pressed={theme === "dark"} className="console-theme-toggle inline-flex h-11 w-11 items-center justify-center rounded-xl border transition duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C59341] focus-visible:ring-offset-2">
              {theme === "light" ? <Moon className="h-5 w-5" aria-hidden="true" /> : <Sun className="h-5 w-5" aria-hidden="true" />}
            </button>
            {authenticated && <button type="button" onClick={logout} aria-label="تسجيل الخروج" title="تسجيل الخروج" className="console-outline-button inline-flex h-11 w-11 items-center justify-center rounded-xl border transition duration-200 hover:-translate-y-0.5 hover:border-red-400 hover:bg-red-50 hover:text-red-600 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2"><LogOut className="h-5 w-5" aria-hidden="true" /></button>}
          </div>
        </header>
        {!authenticated ? (
          <form onSubmit={login} className="console-login-card w-full space-y-4 rounded-2xl border p-6 shadow-[0_24px_80px_rgba(0,0,0,0.12)] backdrop-blur-xl sm:p-8">
            <label className="block space-y-2"><span>كلمة مرور الإدارة</span><input autoComplete="current-password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-lg bg-white px-3 py-3 text-slate-900" /></label>
            <button disabled={busy} className="w-full rounded-lg bg-[#C59341] px-4 py-3 font-bold text-[#0B111E]">{busy ? "جارٍ الدخول…" : "دخول"}</button>
            {message && <p role="alert" className={`text-sm ${theme === "light" ? "text-red-700" : "text-red-300"}`}>{message}</p>}
          </form>
        ) : (
          <>
            <section aria-label="الزوار الموجودون الآن" className="console-live-card relative isolate flex flex-wrap items-center justify-between gap-5 overflow-hidden rounded-2xl border border-emerald-300/15 bg-gradient-to-l from-emerald-400/[0.10] via-white/[0.045] to-white/[0.025] px-5 py-5 shadow-[0_18px_55px_rgba(0,0,0,0.16)] backdrop-blur-xl sm:px-7">
              <div className="pointer-events-none absolute -end-8 -top-14 -z-10 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl" />
              <div className="flex items-center gap-4">
                <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-emerald-300/20 bg-emerald-400/10 text-emerald-200">
                  <Users className="h-5 w-5" />
                  <span className="absolute -end-1 -top-1 flex h-3.5 w-3.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" /><span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-400" /></span>
                </span>
                <div>
                  <h2 className="font-bold text-white">الزوار على الموقع الآن</h2>
                  <p className="mt-1 text-xs text-slate-400">جلسات الزوار النشطة خلال آخر 30 ثانية · يتحدث الرقم كل 15 ثانية</p>
                </div>
              </div>
              <div className="flex items-baseline gap-2 ps-1">
                <span key={activeVisitors ?? "loading"} className="animate-stat-pop text-4xl font-extrabold tracking-tight text-emerald-100 tabular-nums sm:text-5xl">{activeVisitors === null ? "…" : activeVisitors.toLocaleString("en-US")}</span>
                <span className="text-xs text-slate-400">متصل الآن</span>
              </div>
            </section>
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-label="إحصائيات الزيارات">
              {([
                { key: "daily", label: "اليوم", subtitle: "مقارنة بالأمس", value: counts.daily, previous: counts.previousDaily, Icon: Users, sample: counts.trend.slice(-7) },
                { key: "weekly", label: "آخر 7 أيام", subtitle: "مقارنة بالأسبوع السابق", value: counts.weekly, previous: counts.previousWeekly, Icon: CalendarDays, sample: counts.trend.slice(-7) },
                { key: "monthly", label: "آخر 30 يومًا", subtitle: "مقارنة بالـ30 يومًا السابقة", value: counts.monthly, previous: counts.previousMonthly, Icon: BarChart3, sample: counts.trend },
              ] as const).map(({ key, label, subtitle, value, previous, Icon, sample }) => {
                const delta = growth(value, previous);
                const TrendIcon = delta.direction === "up" ? TrendingUp : delta.direction === "down" ? TrendingDown : null;
                const deltaStyle = delta.direction === "up" ? "border-emerald-300/20 bg-emerald-400/10 text-emerald-200" : delta.direction === "down" ? "border-rose-300/20 bg-rose-400/10 text-rose-200" : theme === "light" ? "border-slate-200 bg-slate-100 text-slate-600" : "border-white/10 bg-white/5 text-slate-300";
                return (
                  <article key={key} className={`console-stat-card group relative isolate overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.09] via-white/[0.045] to-white/[0.025] p-5 shadow-[0_16px_55px_rgba(0,0,0,0.18)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-[#DEB86A]/40 hover:shadow-[0_20px_65px_rgba(197,147,65,0.14)] sm:p-6 ${key === "monthly" ? "sm:col-span-2 xl:col-span-1" : ""}`}>
                    <div className="pointer-events-none absolute -end-10 -top-12 -z-10 h-36 w-36 rounded-full bg-[#C59341]/10 blur-3xl transition-colors duration-500 group-hover:bg-[#DEB86A]/20" />
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className={`grid h-11 w-11 place-items-center rounded-xl border ${theme === "light" ? "border-[#e7d7ae] bg-[#fbf6e8] text-[#946200]" : "border-[#DEB86A]/20 bg-[#DEB86A]/10 text-[#DEB86A] shadow-[0_0_25px_rgba(222,184,106,0.08)]"}`}><Icon className="h-5 w-5" /></span>
                        <div><h2 className="font-bold text-white">زيارات {label}</h2><p className="mt-0.5 text-xs text-slate-400">{subtitle}</p></div>
                      </div>
                      <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-bold ${deltaStyle}`}>
                        {updatedAt === null ? "…" : <>{TrendIcon && <TrendIcon className="h-3.5 w-3.5" />}{delta.text}</>}
                      </span>
                    </div>
                    <p className="mt-6 flex items-baseline gap-2">
                      <span key={updatedAt === null ? "loading" : value} className="animate-stat-pop text-4xl font-extrabold tracking-tight text-white tabular-nums">{updatedAt === null ? "…" : value.toLocaleString("en-US")}</span>
                      <span className="text-xs text-slate-400">زيارة</span>
                    </p>
                    <TrendBars data={sample} locale="ar" />
                    <div className="mt-2 flex justify-between text-[10px] text-slate-500"><span>{key === "monthly" ? "قبل 30 يومًا" : "قبل 7 أيام"}</span><span>اليوم</span></div>
                  </article>
                );
              })}
            </section>
            <div className="console-meta flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
              <p>يتحدث العداد الحي والإحصاءات كل 15 ثانية. تُحتسب كل زيارة لصفحة عامة، وتُستثنى لوحة الإدارة.</p>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-2"><span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" /><span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" /></span>مباشر{updatedAt ? ` • ${new Date(updatedAt).toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })}` : ""}</span>
                <button type="button" onClick={() => void refreshCounts(true)} aria-label="تحديث الإحصائيات" className="console-outline-button rounded-lg border p-2 transition hover:border-[#DEB86A]/40 hover:text-[#DEB86A]"><RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} /></button>
              </div>
            </div>
            <form onSubmit={addProject} className="console-project-form space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-bold">إضافة مشروع</h2>
              <label className="block space-y-2"><span>عنوان المشروع</span><input name="title" required maxLength={160} className="w-full rounded-lg bg-white px-3 py-3 text-slate-900" /></label>
              <label className="block space-y-2"><span>نوع المشروع</span><select name="category" required defaultValue="residential" className="w-full rounded-lg border border-white/10 bg-white/[0.07] px-3 py-3 text-sm text-slate-200"><option value="structural">الأساسات والتأسيس</option><option value="finishing">التشطيبات</option><option value="residential">الإنشاءات السكنية</option><option value="renders">التصاميم المعمارية 3D</option></select></label>
              <label className="block space-y-2"><span>الوصف</span><textarea name="description" required maxLength={2000} rows={4} className="w-full rounded-lg bg-white px-3 py-3 text-slate-900" /></label>
              <label className="block space-y-2"><span>صورة المشروع</span><input name="image" type="file" accept="image/jpeg,image/png,image/webp,image/avif" required className="w-full rounded-lg border border-white/10 bg-white/[0.07] px-3 py-3 text-sm text-slate-200 file:me-3 file:rounded-md file:border-0 file:bg-[#C59341] file:px-3 file:py-2 file:font-bold file:text-[#0B111E]" /><span className="block text-xs text-slate-400">JPG أو PNG أو WEBP أو AVIF، بحد أقصى 5 ميجابايت.</span></label>
              <section className="space-y-4 border-t border-slate-200 pt-5" aria-label="مراحل المشروع">
                <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-bold">مراحل تنفيذ المشروع</h3><p className="mt-1 text-xs text-slate-400">اسحب المراحل لتغيير ترتيبها، أو استخدم الأسهم. ستظهر بالترتيب نفسه في المعرض.</p></div><button type="button" onClick={() => setStages((items) => [...items, { id: crypto.randomUUID() }])} disabled={stages.length >= 12} className="inline-flex items-center gap-2 rounded-lg border border-[#C59341]/40 px-3 py-2 text-sm font-bold text-[#946200] transition hover:bg-[#C59341]/10 disabled:opacity-50"><Plus className="h-4 w-4" />إضافة مرحلة</button></div>
                {stages.map((stage, index) => <fieldset key={stage.id} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); if (draggedStage) moveStage(draggedStage, stage.id); setDraggedStage(null); }} className={`space-y-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4 transition ${draggedStage === stage.id ? "opacity-50" : ""}`}><legend className="sr-only">المرحلة {index + 1}</legend><div className="flex items-center justify-between"><div className="flex items-center gap-2"><button type="button" draggable onDragStart={() => setDraggedStage(stage.id)} onDragEnd={() => setDraggedStage(null)} aria-label={`اسحب لإعادة ترتيب المرحلة ${index + 1}`} title="اسحب لإعادة الترتيب" className="cursor-grab touch-none rounded-lg p-2 text-slate-500 hover:bg-slate-200 active:cursor-grabbing"><GripVertical className="h-4 w-4" /></button><span className="text-sm font-bold">المرحلة {index + 1}</span></div><div className="flex items-center gap-1">{index > 0 && <button type="button" onClick={() => moveStage(stage.id, stages[index - 1].id)} aria-label={`نقل المرحلة ${index + 1} لأعلى`} className="rounded-lg p-2 text-slate-500 hover:bg-slate-200"><ArrowUp className="h-4 w-4" /></button>}{index < stages.length - 1 && <button type="button" onClick={() => moveStage(stage.id, stages[index + 1].id)} aria-label={`نقل المرحلة ${index + 1} لأسفل`} className="rounded-lg p-2 text-slate-500 hover:bg-slate-200"><ArrowDown className="h-4 w-4" /></button>}{stages.length > 1 && <button type="button" onClick={() => removeStage(stage.id)} aria-label={`حذف المرحلة ${index + 1}`} className="rounded-lg p-2 text-rose-600 transition hover:bg-rose-50"><Trash2 className="h-4 w-4" /></button>}</div></div><label className="block space-y-2"><span>عنوان المرحلة</span><input name="stageTitle" required maxLength={160} className="w-full rounded-lg bg-white px-3 py-3 text-slate-900" /></label><label className="block space-y-2"><span>وصف المرحلة</span><textarea name="stageDescription" required maxLength={2000} rows={3} className="w-full rounded-lg bg-white px-3 py-3 text-slate-900" /></label><label className="block space-y-2"><span>صورة المرحلة</span><input name="stageImage" type="file" accept="image/jpeg,image/png,image/webp,image/avif" required onChange={(event) => { const file = event.currentTarget.files?.[0]; const previous = previewUrls.current.get(stage.id); if (previous) URL.revokeObjectURL(previous); if (!file) { previewUrls.current.delete(stage.id); setStages((items) => items.map((item) => item.id === stage.id ? { ...item, preview: undefined } : item)); return; } const preview = URL.createObjectURL(file); previewUrls.current.set(stage.id, preview); setStages((items) => items.map((item) => item.id === stage.id ? { ...item, preview } : item)); }} className="w-full rounded-lg border border-white/10 bg-white/[0.07] px-3 py-3 text-sm text-slate-200 file:me-3 file:rounded-md file:border-0 file:bg-[#C59341] file:px-3 file:py-2 file:font-bold file:text-[#0B111E]" />{stage.preview ? <span className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-2"><Image src={stage.preview} alt={`معاينة صورة المرحلة ${index + 1}`} width={112} height={80} unoptimized className="h-20 w-28 rounded-md object-cover" /><span className="text-xs text-slate-500">معاينة الصورة قبل الرفع</span></span> : <span className="flex items-center gap-2 text-xs text-slate-400"><ImagePlus className="h-4 w-4" />ستظهر معاينة الصورة هنا بعد اختيارها</span>}</label></fieldset>)}
              </section>
              <button disabled={busy} className="rounded-lg bg-[#C59341] px-6 py-3 font-bold text-[#0B111E]">{busy ? "جارٍ رفع الصورة وحفظ المشروع…" : "رفع وحفظ المشروع"}</button>
              {message && <p role="status" className={`text-sm ${theme === "light" ? "text-[#946200]" : "text-[#DEB86A]"}`}>{message}</p>}
            </form>
          </>
        )}
      </div>
    </main>
  );
}
