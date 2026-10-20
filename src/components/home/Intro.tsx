import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Award, CheckCircle2, UserCheck } from "lucide-react";
import { Locale, getDict } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";

interface IntroProps {
  locale: Locale;
}

export function Intro({ locale }: IntroProps) {
  const dict = getDict(locale);
  const isRtl = locale === "ar";
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <section id="intro" className="section-py bg-white text-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Column 1: Narrative & Leadership Information (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="text-xs sm:text-sm font-bold tracking-widest text-[#AA7B2F] uppercase block">
                {dict.intro.overline}
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0B111E] tracking-tight leading-snug section-accent">
                {dict.intro.heading}{" "}
                <span className="text-[#C59341] block sm:inline">
                  {dict.intro.headingAccent}
                </span>
              </h2>
            </div>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed pt-2">
              {dict.intro.body}
            </p>

            {/* Leadership Spotlight Card */}
            <div className="p-5 sm:p-6 rounded-xl bg-[#F8FAFC] border-2 border-[#DEB86A]/40 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#0B111E] text-[#DEB86A] flex items-center justify-center shrink-0 shadow-md">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#0B111E]">
                    {dict.intro.consultant}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    {dict.intro.consultantTitle}
                  </p>
                </div>
              </div>

              <div className="border-t sm:border-t-0 sm:border-s border-slate-200 pt-3 sm:pt-0 sm:ps-5 shrink-0">
                <span className="text-xl sm:text-2xl font-black text-[#AA7B2F] block">
                  {dict.intro.experience}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {dict.intro.experienceDesc}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Button
                href={`/${locale}/about`}
                variant="secondary"
                size="md"
                className="group gap-2 shadow-sm"
              >
                <span>{dict.intro.learnMore}</span>
                <ArrowIcon className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
              </Button>
            </div>
          </div>

          {/* Column 2: Architectural Graphic Motif & Brand Artifact (5 Cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md rounded-2xl overflow-hidden bg-[#0B111E] p-8 shadow-2xl border-2 border-[#C59341]/30">
              {/* Gold Geometric Lines Decoration */}
              <div className="absolute top-0 end-0 w-32 h-32 bg-gradient-to-br from-[#DEB86A]/20 to-transparent rounded-bl-full pointer-events-none" />

              <div className="relative flex flex-col items-center text-center space-y-6">
                <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-2 border-[#C59341] shadow-xl p-1 bg-white">
                  <Image
                    src="/assets/brand/logo.jpg"
                    alt="Spark Emblem"
                    fill
                    className="object-contain"
                    sizes="112px"
                  />
                </div>

                <div className="flex flex-col items-center space-y-3">
                  <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold bg-[#DEB86A]/20 text-[#DEB86A] border border-[#DEB86A]/30">
                    {locale === "ar" ? "اعتماد هندسي استشاري" : "Consultant Certified"}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-wide pt-2 sm:pt-2.5">
                    {locale === "ar" ? "سبارك للهندسة والمقاولات" : "Spark Engineering & Contracting"}
                  </h3>
                  <p className="text-xs text-slate-400 max-w-xs leading-relaxed pt-0.5">
                    {locale === "ar"
                      ? "دمياط — ميدان سرور — أعلى بن جاد وكافيه العربي"
                      : "Damietta — Sorour Square — Consultant Headquarters"}
                  </p>
                </div>

                <div className="w-full pt-4 border-t border-white/10 space-y-2.5 text-xs text-slate-300 text-start">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#DEB86A] shrink-0" />
                    <span>{locale === "ar" ? "فحص حديد التسليح قبل الصب" : "Rebar inspection before casting"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#DEB86A] shrink-0" />
                    <span>{locale === "ar" ? "عزل متخصص للتربة والمياه الجوفية" : "Specialized coastal waterproofing"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#DEB86A] shrink-0" />
                    <span>{locale === "ar" ? "تسليم متكامل على المفتاح" : "Turnkey single-contractor handover"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
