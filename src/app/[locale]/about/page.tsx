import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  CalendarCheck,
  Building,
  Target,
  Sparkles,
  MapPin,
} from "lucide-react";
import { Locale, getDict } from "@/lib/i18n";
import { CtaStrip } from "@/components/home/CtaStrip";

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: AboutPageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = (rawLocale === "en" ? "en" : "ar") as Locale;
  const dict = getDict(locale);

  return {
    title: dict.meta.about.title,
    description: dict.meta.about.description,
  };
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale: rawLocale } = await params;
  const locale = (rawLocale === "en" ? "en" : "ar") as Locale;
  const dict = getDict(locale);

  return (
    <div className="flex flex-col w-full">
      {/* 1. Page Header */}
      <section className="bg-[#0B111E] text-white py-16 sm:py-20 border-b border-[#C59341]/25 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <nav className="flex justify-center items-center gap-2 text-xs text-[#DEB86A] mb-3">
            <Link href={`/${locale}`} className="hover:underline">
              {dict.nav.home}
            </Link>
            <span>/</span>
            <span className="text-slate-300">{dict.nav.about}</span>
          </nav>
          <span className="text-xs sm:text-sm font-bold tracking-widest text-[#DEB86A] uppercase block">
            {dict.about.overline}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            {dict.about.heading}{" "}
            <span className="text-gradient-gold">{dict.about.headingAccent}</span>
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300">
            {dict.about.subtitle}
          </p>
        </div>
      </section>

      {/* 2. Leadership Spotlight: Eng. Mohamed Sharara */}
      <section className="section-py bg-white text-slate-900 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Leadership Emblem & Photo Frame (5 Cols) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm rounded-3xl bg-[#0B111E] p-8 text-center text-white border-2 border-[#C59341]/40 shadow-2xl space-y-6">
                <div className="relative w-36 h-36 mx-auto rounded-2xl overflow-hidden border-2 border-[#C59341] p-1 bg-white shadow-xl">
                  <Image
                    src="/assets/brand/logo.jpg"
                    alt={dict.about.leadership.name}
                    fill
                    className="object-contain"
                    sizes="144px"
                  />
                </div>

                <div className="space-y-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#DEB86A]/20 text-[#DEB86A] border border-[#DEB86A]/30">
                    {dict.about.leadership.heading}
                  </span>
                  <h3 className="text-2xl font-black text-white tracking-wide">
                    {dict.about.leadership.name}
                  </h3>
                  <p className="text-xs text-[#DEB86A] font-semibold">
                    {dict.about.leadership.title}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 space-y-1">
                  <div className="flex items-center justify-center gap-1.5 text-[#DEB86A] font-bold">
                    <CalendarCheck className="w-4 h-4" />
                    <span>+17 عاماً من الخبرة الميدانية</span>
                  </div>
                  <p className="text-slate-400">في المشروعات الخاصة والحكومية</p>
                </div>
              </div>
            </div>

            {/* Leadership Narrative (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <span className="text-xs sm:text-sm font-bold tracking-widest text-[#AA7B2F] uppercase block">
                  {dict.about.leadership.overline}
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0B111E] tracking-tight leading-snug section-accent">
                  {dict.about.leadership.heading}{" "}
                  <span className="text-[#C59341]">{dict.about.leadership.name}</span>
                </h2>
              </div>

              <p className="text-base sm:text-lg text-slate-700 leading-relaxed pt-2">
                {dict.about.leadership.bio}
              </p>

              {/* Core Areas of Leadership Expertise */}
              <div className="space-y-3 pt-2">
                <h4 className="text-sm font-bold text-[#0B111E] uppercase tracking-wider">
                  {locale === "ar" ? "مجالات الإشراف والخبرة الأساسية:" : "Core Engineering Domains:"}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {dict.about.leadership.expertise.map((exp, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-3 rounded-lg bg-[#F8FAFC] border border-slate-200 text-xs sm:text-sm text-slate-800 font-medium"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#AA7B2F] shrink-0" />
                      <span>{exp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Engineering Philosophy: Challenging Coastal/Delta Soils */}
      <section className="section-py bg-[#0B111E] text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <span className="text-xs sm:text-sm font-bold tracking-widest text-[#DEB86A] uppercase block">
              {dict.about.philosophy.overline}
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {dict.about.philosophy.heading}{" "}
              <span className="text-gradient-gold">
                {dict.about.philosophy.headingAccent}
              </span>
            </h2>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              {dict.about.philosophy.body}
            </p>

            <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-start">
              <div className="p-5 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <span className="text-xs font-bold text-[#DEB86A] uppercase">01. فحص التربة</span>
                <p className="text-xs text-slate-300">تحليل المنسوب الجوفي وتحديد عمق التأسيس ونوع الإحلال المناسب بدقة.</p>
              </div>
              <div className="p-5 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <span className="text-xs font-bold text-[#DEB86A] uppercase">02. عزل متعدد الطبقات</span>
                <p className="text-xs text-slate-300">أغشية بيتومينية ومطاطية متطورة تمنع تآكل حديد التسليح بفعل الرطوبة والأملاح.</p>
              </div>
              <div className="p-5 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <span className="text-xs font-bold text-[#DEB86A] uppercase">03. فحص الخرسانة</span>
                <p className="text-xs text-slate-300">اختبارات هبوط دورية ورقابة استشارية مباشرة قبل وأثناء صب الخرسانة المسلحة.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Core Engineering Values */}
      <section className="section-py bg-[#F8FAFC] text-slate-900 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs sm:text-sm font-bold tracking-widest text-[#AA7B2F] uppercase block">
              {dict.about.values.overline}
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0B111E] tracking-tight">
              {dict.about.values.heading}{" "}
              <span className="text-[#C59341]">{dict.about.values.headingAccent}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {dict.about.values.items.map((val, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-7 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-[#C59341] transition-all duration-300 space-y-3"
              >
                <div className="w-12 h-12 rounded-xl bg-[#0B111E] text-[#DEB86A] flex items-center justify-center font-mono font-bold text-lg mb-4">
                  0{idx + 1}
                </div>
                <h3 className="text-lg font-bold text-[#0B111E]">
                  {val.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Cta Strip */}
      <CtaStrip locale={locale} />
    </div>
  );
}
