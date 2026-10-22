"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ProjectDisplaySettings } from "./ProjectDisplaySettings";
import { ProjectManager } from "./ProjectManager";
import { BarChart3, CalendarDays, LogOut, Moon, RefreshCw, Sun, TrendingDown, TrendingUp, Users, X } from "lucide-react";

type Counts = {
  daily: number;
  previousDaily: number;
  weekly: number;
  previousWeekly: number;
  monthly: number;
  previousMonthly: number;
  trend: { day: string; visitors: number }[];
};

function ProjectImagePreview({ file, onPreview, onRemove }: { file: File; onPreview: () => void; onRemove: () => void }) {
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <div className="relative overflow-hidden rounded-xl border border-white/15 bg-slate-950/70">
      <div className="relative aspect-square">
        <button type="button" onClick={onPreview} aria-label={`عرض الصورة ${file.name} بحجم كبير`} title="اضغط لعرض الصورة" className="absolute inset-0 z-[1] cursor-zoom-in focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#DEB86A]">
          {previewUrl && <Image src={previewUrl} alt={file.name} fill unoptimized className="object-cover" sizes="120px" />}
        </button>
        <button type="button" onClick={onRemove} aria-label={`حذف الصورة ${file.name}`} title="حذف الصورة" className="absolute end-1.5 top-1.5 z-10 grid h-8 w-8 place-items-center rounded-full border border-white/25 bg-black/75 text-white shadow transition hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-[#DEB86A]">
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <p className="truncate px-2 py-1.5 text-[11px] text-slate-200" title={file.name}>{file.name}</p>
    </div>
  );
}

function ProjectImageLightbox({ file, onClose }: { file: File; onClose: () => void }) {
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  return (
    <div role="dialog" aria-modal="true" aria-label={`معاينة الصورة ${file.name}`} className="fixed inset-0 z-[100] grid place-items-center bg-black/90 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="w-full max-w-5xl overflow-hidden rounded-2xl border border-white/15 bg-[#0B111E] shadow-2xl">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3 text-white">
          <p className="truncate text-sm font-semibold" title={file.name}>{file.name}</p>
          <button type="button" onClick={onClose} aria-label="إغلاق معاينة الصورة" title="إغلاق" className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/20 bg-white/10 transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-[#DEB86A]">
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="relative h-[min(78vh,800px)] w-full bg-black">
          {previewUrl && <Image src={previewUrl} alt={file.name} fill unoptimized className="object-contain" sizes="95vw" />}
        </div>
      </div>
    </div>
  );
}

function TrendBars({ data, locale, theme }: { data: Counts["trend"]; locale: string; theme: "light" | "dark" }) {
  const max = Math.max(1, ...data.map((point) => point.visitors));
  const isArabic = locale === "ar";
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const selectedPoint = data.find((point) => point.day === selectedDay) ?? data.at(-1);
  const selectedDate = selectedPoint ? new Date(`${selectedPoint.day}T12:00:00Z`) : null;
  const selectedDateLabel = selectedDate ? new Intl.DateTimeFormat(isArabic ? "ar-EG" : "en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(selectedDate) : "";
  const selectedVisitorLabel = selectedPoint
    ? isArabic
      ? (selectedPoint.visitors === 1 ? "زائر واحد" : `${selectedPoint.visitors.toLocaleString("ar-EG")} زوار`)
      : `${selectedPoint.visitors.toLocaleString("en-US")} visitors`
    : "";
  return (
    <div>
      <div aria-live="polite" className={`mt-4 flex min-h-11 flex-wrap items-center justify-between gap-x-2 gap-y-1 rounded-lg border px-3 py-2 text-xs sm:text-sm ${theme === "light" ? "border-slate-200 bg-white text-slate-800" : "border-white/10 bg-slate-950/80 text-slate-100"}`}>
        <span className="max-w-full break-words font-semibold">{selectedDateLabel}</span>
        <span className={`shrink-0 font-bold ${theme === "light" ? "text-amber-800" : "text-amber-200"}`}>{selectedVisitorLabel}</span>
      </div>
      <div className="mt-3 flex h-14 items-end gap-1" aria-label={isArabic ? "رسم تفاعلي لعدد الزوار حسب اليوم" : "Interactive daily visitor trend chart"} onMouseLeave={() => setSelectedDay(null)}>
      {data.map((point) => {
        const date = new Date(`${point.day}T12:00:00Z`);
        const dateLabel = new Intl.DateTimeFormat(isArabic ? "ar-EG" : "en-US", {
          weekday: "long",
          day: "numeric",
          month: "long",
        }).format(date);
        const visitorLabel = isArabic ? (point.visitors === 1 ? "زائر واحد" : `${point.visitors.toLocaleString("ar-EG")} زوار`) : `${point.visitors.toLocaleString("en-US")} visitors`;
        return (
        <button key={point.day} type="button" className="group/bar flex h-full min-w-0 flex-1 items-end border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-amber-500" title={`${dateLabel}: ${visitorLabel}`} aria-label={`${dateLabel}: ${visitorLabel}`} aria-pressed={selectedPoint?.day === point.day} onPointerEnter={() => setSelectedDay(point.day)} onFocus={() => setSelectedDay(point.day)} onClick={() => setSelectedDay(point.day)}>
          <div
            className={`w-full rounded-t-sm bg-gradient-to-t from-[#C59341]/35 to-[#DEB86A] transition-[height,opacity] duration-300 ease-out group-hover/bar:from-[#C59341]/60 ${selectedPoint?.day === point.day ? "ring-1 ring-inset ring-amber-900/30" : ""}`}
            style={{ height: `${Math.max(point.visitors > 0 ? 12 : 4, (point.visitors / max) * 100)}%` }}
          />
        </button>
      );})}
      </div>
    </div>
  );
}

function growth(current: number, previous: number) {
  if (previous === 0) return current === 0 ? { text: "0%", direction: "flat" as const } : { text: "جديد", direction: "up" as const };
  const change = Math.round(((current - previous) / previous) * 100);
  return { text: `${change > 0 ? "+" : ""}${change}%`, direction: change > 0 ? "up" as const : change < 0 ? "down" as const : "flat" as const };
}

export function ConsolePanel({ authenticated: initiallyAuthenticated }: { authenticated: boolean }) {
  const [projectsRevision, setProjectsRevision] = useState(0);
  const [authenticated, setAuthenticated] = useState(initiallyAuthenticated);
  const [password, setPassword] = useState("");
  const [counts, setCounts] = useState<Counts>({ daily: 0, previousDaily: 0, weekly: 0, previousWeekly: 0, monthly: 0, previousMonthly: 0, trend: [] });
  const [updatedAt, setUpdatedAt] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [projectImages, setProjectImages] = useState<File[]>([]);
  const [previewingImage, setPreviewingImage] = useState<File | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  function toggleTheme() {
    setTheme((current) => current === "light" ? "dark" : "light");
  }

  const refreshCounts = useCallback(async (showSpinner = false, signal?: AbortSignal) => {
    if (showSpinner) setRefreshing(true);
    try {
      const response = await fetch("/api/analytics", { cache: "no-store", signal });
      if (response.ok) {
        const result = await response.json() as Counts;
        if (signal?.aborted) return;
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
    let countsTimer: number | undefined;
    let countsRequest: AbortController | undefined;

    const scheduleCountsPoll = async () => {
      countsRequest?.abort();
      countsRequest = new AbortController();
      await refreshCounts(false, countsRequest.signal);
      if (!stopped && document.visibilityState === "visible") {
        countsTimer = window.setTimeout(() => void scheduleCountsPoll(), 15_000);
      }
    };

    const stopTimers = () => {
      if (countsTimer !== undefined) window.clearTimeout(countsTimer);
      countsTimer = undefined;
      countsRequest?.abort();
    };

    const startPolling = () => {
      stopTimers();
      if (document.visibilityState !== "visible") return;
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
    event.preventDefault(); setMessage("");
    if (projectImages.length === 0) { setMessage("أضف صورة واحدة على الأقل، وستظهر معاينتها هنا قبل الرفع."); return; }
    setBusy(true);
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    projectImages.forEach((file) => form.append("images", file));
    const response = await fetch("/api/console/projects", { method: "POST", body: form });
    const result = await response.json();
    setBusy(false);
    if (!response.ok) { setMessage(result.error ?? "تعذر إضافة المشروع"); return; }
    setProjectsRevision(current => current + 1);
    formElement.reset();
    setProjectImages([]);
    setMessage("تم حفظ المشروع وسيظهر في المعرض.");
  }

  function addProjectImages(files: FileList | null) {
    if (!files?.length) return;
    const incoming = Array.from(files);
    const remaining = 16 - projectImages.length;
    if (incoming.length > remaining) setMessage("يمكنك إضافة 16 صورة كحد أقصى للمشروع.");
    else setMessage("");
    setProjectImages((current) => [...current, ...incoming.slice(0, Math.max(0, remaining))]);
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
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-label="إحصائيات الزوار">
              {([
                { key: "daily", label: "اليوم", subtitle: "مقارنة بالأمس", value: counts.daily, previous: counts.previousDaily, Icon: Users, sample: counts.trend.slice(-2) },
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
                        <div><h2 className="font-bold text-white">زوار {label}</h2><p className="mt-0.5 text-xs text-slate-400">{subtitle}</p></div>
                      </div>
                      <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-bold ${deltaStyle}`}>
                        {updatedAt === null ? "…" : <>{TrendIcon && <TrendIcon className="h-3.5 w-3.5" />}{delta.text}</>}
                      </span>
                    </div>
                    <p className="mt-6 flex items-baseline gap-2">
                      <span key={updatedAt === null ? "loading" : value} className="animate-stat-pop text-4xl font-extrabold tracking-tight text-white tabular-nums">{updatedAt === null ? "…" : value.toLocaleString("en-US")}</span>
                      <span className="text-xs text-slate-400">زائر</span>
                    </p>
                    <TrendBars data={sample} locale="ar" theme={theme} />
                    <div className="mt-2 flex justify-between text-[10px] text-slate-500"><span>{key === "monthly" ? "قبل 30 يومًا" : key === "daily" ? "أمس" : "قبل 7 أيام"}</span><span>اليوم</span></div>
                  </article>
                );
              })}
            </section>
            <div className="console-meta flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
              <p>تُحدّث إحصائيات الزوار كل 15 ثانية، وتُستثنى زيارات لوحة الإدارة.</p>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-2"><span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" /><span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" /></span>مباشر{updatedAt ? ` • ${new Date(updatedAt).toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })}` : ""}</span>
                <button type="button" onClick={() => void refreshCounts(true)} aria-label="تحديث الإحصائيات" className="console-outline-button rounded-lg border p-2 transition hover:border-[#DEB86A]/40 hover:text-[#DEB86A]"><RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} /></button>
              </div>
            </div>
            <form onSubmit={addProject} className="console-project-form space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-bold">إضافة مشروع</h2>
              <label className="block space-y-2"><span>اسم المشروع (مطلوب)</span><input name="title" required maxLength={160} className="w-full rounded-lg bg-white px-3 py-3 text-slate-900" /></label>
              <label className="block space-y-2"><span>وصف المشروع (مطلوب)</span><textarea name="description" required maxLength={2000} rows={4} className="w-full rounded-lg bg-white px-3 py-3 text-slate-900" /></label>
              <div className="space-y-3">
                <label className="block space-y-2"><span>صور المشروع (مطلوبة)</span><input type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple aria-required="true" onChange={(event) => { addProjectImages(event.currentTarget.files); event.currentTarget.value = ""; }} className="w-full rounded-lg border border-white/10 bg-white/[0.07] px-3 py-3 text-sm text-slate-200 file:me-3 file:rounded-md file:border-0 file:bg-[#C59341] file:px-3 file:py-2 file:font-bold file:text-[#0B111E]" /><span className="block text-xs text-slate-400">اختر حتى 16 صورة للمشروع. يمكنك الاختيار على دفعات، وحذف أي صورة قبل الرفع. JPG أو PNG أو WEBP أو AVIF، بحد أقصى 5 ميجابايت للصورة.</span></label>
                {projectImages.length > 0 && <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6" aria-live="polite">{projectImages.map((file, index) => <ProjectImagePreview key={`${file.name}-${file.size}-${file.lastModified}-${index}`} file={file} onPreview={() => setPreviewingImage(file)} onRemove={() => setProjectImages((current) => current.filter((_, imageIndex) => imageIndex !== index))} />)}</div>}
                <p className="text-xs text-slate-400">{projectImages.length} / 16 صورة مختارة</p>
              </div>
              <button disabled={busy} className="rounded-lg bg-[#C59341] px-6 py-3 font-bold text-[#0B111E]">{busy ? "جارٍ رفع الصورة وحفظ المشروع…" : "رفع وحفظ المشروع"}</button>
              {message && <p role="status" className={`text-sm ${theme === "light" ? "text-[#946200]" : "text-[#DEB86A]"}`}>{message}</p>}
            </form>
            <ProjectDisplaySettings />
            <ProjectManager revision={projectsRevision} />
            {previewingImage && <ProjectImageLightbox file={previewingImage} onClose={() => setPreviewingImage(null)} />}
          </>
        )}
      </div>
    </main>
  );
}
