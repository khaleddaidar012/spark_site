"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  ArrowLeft,
  ArrowRight,
  MessageCircle,
  AlertCircle,
  Compass,
  HardHat,
  ClipboardCheck,
  Layers,
  ShieldCheck,
  Paintbrush,
  KeyRound,
  Building2,
} from "lucide-react";
import { Locale, getDict } from "@/lib/i18n";
import { servicesData } from "@/data/services";
import { buildWhatsAppUrl } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface ServicesSliderProps {
  locale: Locale;
}

const iconMap: Record<string, React.ElementType> = {
  Compass,
  HardHat,
  ClipboardCheck,
  Layers,
  ShieldCheck,
  Paintbrush,
  KeyRound,
  Building2,
};

const AUTOPLAY_INTERVAL = 4500; // 4.5 seconds per slide for an engaging, professional pace

export function ServicesSlider({ locale }: ServicesSliderProps) {
  const dict = getDict(locale);
  const isRtl = locale === "ar";
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [isPlaying, setIsPlaying] = useState(true);
  const [isTabVisible, setIsTabVisible] = useState(true);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const totalSlides = dict.services.items.length;

  const handleNext = useCallback(() => {
    setDirection("next");
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const handlePrev = useCallback(() => {
    setDirection("prev");
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const handleGoTo = useCallback(
    (idx: number) => {
      setDirection(idx >= currentIndex ? "next" : "prev");
      setCurrentIndex(idx);
    },
    [currentIndex]
  );

  // Reliable Autoplay with Page Visibility handling
  useEffect(() => {
    if (!isPlaying || !isTabVisible) return;

    const timer = setInterval(() => {
      setDirection("next");
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, AUTOPLAY_INTERVAL);

    return () => clearInterval(timer);
  }, [isPlaying, isTabVisible, totalSlides, currentIndex]);

  // Page Visibility API auto-pause / resume
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabVisible(!document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Keyboard navigation inside carousel
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      isRtl ? handleNext() : handlePrev();
    } else if (e.key === "ArrowRight") {
      isRtl ? handlePrev() : handleNext();
    }
  };

  // Touch Swipe Handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;

    // Minimum swipe threshold 50px
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        isRtl ? handlePrev() : handleNext();
      } else {
        isRtl ? handleNext() : handlePrev();
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const currentService = dict.services.items[currentIndex];
  const serviceMeta =
    servicesData.find((s) => s.id === currentService.id) || servicesData[0];
  const IconComponent = iconMap[serviceMeta.iconName] || HardHat;
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  // Prefilled WhatsApp message tailored to this specific service
  const whatsappText = isRtl
    ? `السلام عليكم، أود الاستفسار عن خدمة "${currentService.title}" لدى سبارك للهندسة.`
    : `Hello Spark Engineering, I would like to enquire about "${currentService.title}".`;
  const whatsappUrl = buildWhatsAppUrl(whatsappText);

  return (
    <section
      id="services-slider"
      className="section-py bg-[#0B111E] text-white relative overflow-hidden"
      aria-roledescription="carousel"
      aria-label={dict.services.heading}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Architectural Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#C593410f_1px,transparent_1px),linear-gradient(to_bottom,#C593410f_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-2">
            <span className="text-xs sm:text-sm font-bold tracking-widest text-[#DEB86A] uppercase block">
              {dict.services.overline}
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight section-accent">
              {dict.services.heading}{" "}
              <span className="text-gradient-gold">
                {dict.services.headingAccent}
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <Button
              href={`/${locale}/services`}
              variant="outline"
              size="sm"
              className="gap-2 text-xs sm:text-sm border-[#DEB86A] text-[#DEB86A] hover:bg-[#DEB86A] hover:text-[#0B111E]"
            >
              <span>{dict.services.viewAll}</span>
              <ArrowIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Flagship Slider Showcase Card with Rotating Border Beam */}
        <div className="relative p-[2px] rounded-2xl overflow-hidden shadow-2xl animate-pulse-gold group">
          {/* Continuous Rotating Golden Light Beam */}
          <div
            className="absolute -inset-[150%] rounded-[inherit] pointer-events-none will-change-transform opacity-80 group-hover:opacity-100 transition-opacity"
            style={{
              background:
                "conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 65deg, rgba(222, 184, 106, 0.4) 80deg, #DEB86A 90deg, #FFFFFF 92deg, #C59341 96deg, rgba(197, 147, 65, 0.3) 115deg, transparent 130deg, transparent 360deg)",
              animation: "spin-beam 8s linear infinite",
            }}
          />

          {/* Autoplay Progress Line at Top of Card */}
          <div className="absolute top-0 left-0 right-0 z-30 h-[3px] bg-white/10 overflow-hidden">
            <div
              key={`progress-${currentIndex}-${isPlaying}`}
              className="h-full bg-gradient-to-r from-[#C59341] via-[#DEB86A] to-[#F5EACF] shadow-[0_0_12px_#DEB86A]"
              style={{
                animation: isPlaying
                  ? `slider-progress ${AUTOPLAY_INTERVAL}ms linear forwards`
                  : "none",
                width: isPlaying ? undefined : "0%",
              }}
            />
          </div>

          {/* Inner Card Container */}
          <div className="min-h-[560px] lg:min-h-[490px] w-full rounded-2xl bg-[#0F172A]/95 backdrop-blur-xl border border-[#C59341]/25 overflow-hidden flex flex-col lg:flex-row transition-all duration-300 relative z-10">
            {/* Image Showcase Pane (50%) - Framed & Uncropped with Ambient Glow */}
            <div className="relative w-full lg:w-1/2 min-h-[320px] sm:min-h-[400px] lg:min-h-full flex items-center justify-center p-3 sm:p-5 lg:p-6 bg-[#070B14]/85 overflow-hidden">
              {/* Soft atmospheric ambient glow behind the frame */}
              <div
                className="absolute inset-0 bg-cover bg-center opacity-20 blur-3xl scale-110 pointer-events-none transition-all duration-700"
                style={{ backgroundImage: `url(${serviceMeta.image})` }}
              />

              {/* Framed Image Container with visible crisp borders */}
              <div
                key={`img-${currentIndex}`}
                className="relative w-full h-full min-h-[280px] sm:min-h-[360px] lg:min-h-[420px] rounded-xl overflow-hidden border border-[#C59341]/35 shadow-2xl flex items-center justify-center bg-black/60 animate-luxury-image z-10"
              >
                <Image
                  src={serviceMeta.image}
                  alt={currentService.title}
                  fill
                  className="object-contain p-1.5 transition-transform duration-700 hover:scale-[1.02]"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>

              {/* Service Step Number Badge (with BiDi fix and pop animation) */}
              <div
                key={`badge-${currentIndex}`}
                dir="ltr"
                className="absolute top-5 start-5 z-20 px-3 py-1.5 rounded-lg bg-[#0B111E]/90 backdrop-blur-md border border-[#C59341]/40 text-[#DEB86A] text-xs font-mono font-bold shadow-xl animate-badge-pop"
              >
                0{currentIndex + 1} / 0{totalSlides}
              </div>

              {/* Flagged notice badge if applicable */}
              {serviceMeta.isFlagged && (
                <div className="absolute bottom-5 start-5 end-5 lg:end-auto z-20 px-3 py-1.5 rounded-lg bg-amber-500/20 backdrop-blur-md border border-amber-500/50 text-amber-200 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>{dict.services.flaggedNotice}</span>
                </div>
              )}
            </div>

            {/* Service Details Pane (50%) */}
            <div className="w-full lg:w-1/2 p-6 sm:p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden">
              <div
                key={`content-${currentIndex}`}
                className="space-y-5 animate-luxury-text"
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-[#0B111E] border border-[#C59341]/40 text-[#DEB86A] shadow-md shadow-[#C59341]/10 transition-transform duration-300 hover:scale-110">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#DEB86A] uppercase tracking-wider block">
                      {dict.services.overline}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
                      {currentService.title}
                    </h3>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  {currentService.shortDesc}
                </p>

                {/* Verified Scope of Work */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 hover:border-[#C59341]/30 transition-colors animate-luxury-scope">
                  <h4 className="text-xs font-bold text-[#DEB86A] uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#DEB86A]" />
                    {locale === "ar"
                      ? "نطاق العمل المعتمد:"
                      : "Verified Scope of Work:"}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {currentService.scope}
                  </p>
                </div>
              </div>

              {/* Action Bar & Controls */}
              <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
                {/* WhatsApp direct inquiry */}
                <Button
                  href={whatsappUrl}
                  external
                  variant="gold"
                  size="md"
                  className="w-full sm:w-auto gap-2 shadow-md hover:scale-102 transition-transform"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>{dict.services.enquire}</span>
                </Button>

                {/* Slider Controls: Arrows, Play/Pause, Indicators */}
                <div className="flex items-center gap-3">
                  {/* Play/Pause accessible toggle */}
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    aria-label={
                      isPlaying
                        ? "إيقاف التشغيل التلقائي"
                        : "تشغيل العرض التلقائي"
                    }
                    className="p-2 rounded-lg text-slate-400 hover:text-[#DEB86A] hover:bg-white/10 transition-colors focus-visible:outline-2 focus-visible:outline-[#C59341]"
                    title={isPlaying ? "إيقاف مؤقت" : "تشغيل العرض التلقائي"}
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4 text-[#DEB86A]" />
                    )}
                  </button>

                  {/* Prev Button */}
                  <button
                    onClick={handlePrev}
                    aria-label={isRtl ? "الخدمة السابقة" : "Previous Service"}
                    className="p-2.5 rounded-lg bg-[#0B111E] border border-[#C59341]/30 text-white hover:text-[#DEB86A] hover:border-[#DEB86A] hover:scale-105 active:scale-95 transition-all shadow-md focus-visible:outline-2 focus-visible:outline-[#C59341]"
                  >
                    <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
                  </button>

                  {/* Slide Indicators */}
                  <div className="flex items-center gap-1.5 px-2">
                    {dict.services.items.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleGoTo(idx)}
                        aria-label={`انتقل إلى الخدمة ${idx + 1}`}
                        className={`h-2 rounded-full transition-all duration-500 focus-visible:outline-2 focus-visible:outline-[#C59341] ${
                          idx === currentIndex
                            ? "w-8 bg-gradient-to-r from-[#DEB86A] to-[#C59341] shadow-[0_0_10px_rgba(222,184,106,0.8)]"
                            : "w-2 bg-slate-600 hover:bg-slate-400"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={handleNext}
                    aria-label={isRtl ? "الخدمة التالية" : "Next Service"}
                    className="p-2.5 rounded-lg bg-[#0B111E] border border-[#C59341]/30 text-white hover:text-[#DEB86A] hover:border-[#DEB86A] hover:scale-105 active:scale-95 transition-all shadow-md focus-visible:outline-2 focus-visible:outline-[#C59341]"
                  >
                    <ChevronRight className="w-5 h-5 rtl:rotate-180" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

