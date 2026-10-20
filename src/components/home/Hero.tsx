import React from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ShieldCheck, PhoneCall, ChevronDown } from "lucide-react";
import { Locale, getDict } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface HeroProps {
  locale: Locale;
}

export function Hero({ locale }: HeroProps) {
  const dict = getDict(locale);
  const isRtl = locale === "ar";
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <section className="relative w-full min-h-[85vh] lg:min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#0B111E]">
      {/* Background Hero Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/brand/hero_bg_clean.jpg"
          alt={locale === "ar" ? "سبارك للهندسة والمقاولات — غطاء هندسي معماري" : "Spark Engineering & Contracting Cover"}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_35%] lg:object-[center_30%]"
        />
        {/* Layered Architectural Gradient Masks for Pristine Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B111E] via-[#0B111E]/80 to-[#0B111E]/55" />
        <div className="hidden lg:block absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(11,17,30,0.4)_0%,rgba(11,17,30,0.9)_100%)]" />
      </div>

      {/* Decorative Grid Lines Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#C593410a_1px,transparent_1px),linear-gradient(to_bottom,#C593410a_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center">
        {/* Badge */}
        <div className="mb-6 animate-fade-in">
          <Badge
            variant="navy"
            size="md"
            className="py-1.5 px-4 shadow-lg backdrop-blur-md border border-[#C59341]/50 text-[#DEB86A]"
          >
            <ShieldCheck className="w-4 h-4 text-[#DEB86A]" />
            <span>{dict.hero.badge}</span>
          </Badge>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.2] max-w-4xl">
          <span>{dict.hero.title}</span>{" "}
          <span className="text-gradient-gold block sm:inline">
            {dict.hero.titleAccent}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl leading-relaxed font-normal">
          {dict.hero.subtitle}
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Button
            href={`/${locale}/services`}
            variant="primary"
            size="lg"
            className="w-full sm:w-auto shadow-xl group"
          >
            <span>{dict.hero.ctaExplore}</span>
            <ArrowIcon className="w-5 h-5 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
          </Button>

          <Button
            href={`/${locale}/contact`}
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto shadow-md"
          >
            <PhoneCall className="w-5 h-5 text-[#DEB86A]" />
            <span>{dict.hero.ctaConsult}</span>
          </Button>
        </div>

        {/* Scroll Indicator */}
        <a
          href="#intro"
          className="mt-14 inline-flex flex-col items-center gap-1.5 text-xs text-slate-400 hover:text-[#DEB86A] transition-colors"
          aria-label={dict.hero.scrollDown}
        >
          <span className="tracking-wider">{dict.hero.scrollDown}</span>
          <ChevronDown className="w-4 h-4 animate-bounce text-[#DEB86A]" />
        </a>
      </div>
    </section>
  );
}
