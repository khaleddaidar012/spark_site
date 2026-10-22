"use client";
import { Children, ReactNode, useEffect, useState } from "react";
export function ProjectsPresentation({ children, featured, paused, isRtl }: { children: ReactNode; featured: boolean; paused: boolean; isRtl: boolean }) {
  const cards = Children.toArray(children);
  const [mode, setMode] = useState("grid");
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [stopped, setStopped] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    if (!featured) return;
    const controller = new AbortController();
    fetch("/api/project-display", { cache: "no-store", signal: controller.signal }).then(response => response.ok ? response.json() : null).then(result => { if (result && !controller.signal.aborted) setMode(result.mode); }).catch(() => {});
    return () => controller.abort();
  }, [featured]);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReduced(query.matches);
    const updateVisibility = () => setVisible(document.visibilityState === "visible");
    updateMotion(); updateVisibility(); query.addEventListener("change", updateMotion); document.addEventListener("visibilitychange", updateVisibility);
    return () => { query.removeEventListener("change", updateMotion); document.removeEventListener("visibilitychange", updateVisibility); };
  }, []);
  const carousel = featured && mode === "slideshow" && cards.length > 3;
  useEffect(() => {
    if (!carousel || paused || hovered || focused || stopped || reduced || !visible) return;
    const timer = window.setInterval(() => setIndex(current => current >= cards.length ? current : current + 1), 4500);
    return () => window.clearInterval(timer);
  }, [carousel, cards.length, paused, hovered, focused, stopped, reduced, visible]);
  function finishTransition() {
    if (index < cards.length) return;
    setAnimate(false); setIndex(0);
  }
  useEffect(() => {
    if (animate) return;
    let second: number;
    const first = requestAnimationFrame(() => { second = requestAnimationFrame(() => setAnimate(true)); });
    return () => { cancelAnimationFrame(first); if (second) cancelAnimationFrame(second); };
  }, [animate]);
  if (!carousel) return <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-8 lg:grid-cols-3 [&>div]:!min-w-0 [&>div]:!max-w-none">{children}</div>;
  const next = () => { if (index >= cards.length) return; if (reduced) setIndex(current => (current + 1) % cards.length); else setIndex(current => current + 1); };
  return <section aria-roledescription={isRtl ? "عرض شرائح المشاريع" : "Project carousel"} aria-label={isRtl ? "مشاريع سبارك" : "Spark projects"} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
    <div className="overflow-hidden py-2"><div dir="ltr" className={"projects-carousel-track " + (animate && !reduced ? "projects-carousel-animated" : "")} style={{ transform: `translateX(calc(-1 * ${index} * (100% + 2rem) / var(--projects-visible)))` }} onTransitionEnd={event => { if (event.target === event.currentTarget) finishTransition(); }}>
      {[...cards, ...cards.slice(0, 3)].map((card, position) => <div key={position} dir={isRtl ? "rtl" : "ltr"} className="projects-carousel-slide">{card}</div>)}
    </div></div>
    <div className="mt-5 flex items-center justify-center gap-3"><button type="button" onClick={() => setStopped(current => !current)} className="rounded-lg border border-[#C59341] px-4 py-2 text-sm text-[#0B111E]">{reduced ? (isRtl ? "عرض يدوي" : "Manual mode") : stopped ? (isRtl ? "تشغيل الحركة" : "Play") : (isRtl ? "إيقاف الحركة" : "Pause")}</button><span className="text-sm text-slate-600" aria-live="polite">{index % cards.length + 1} / {cards.length}</span><button type="button" onClick={next} className="rounded-lg bg-[#C59341] px-4 py-2 text-sm font-bold text-[#0B111E]">{isRtl ? "التالي ←" : "Next ←"}</button></div>
  </section>;
}
