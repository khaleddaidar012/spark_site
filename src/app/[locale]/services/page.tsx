import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Locale, getDict } from "@/lib/i18n";
import { ServicesSlider } from "@/components/services/ServicesSlider";
import { ServiceGrid } from "@/components/services/ServiceGrid";
import { CtaStrip } from "@/components/home/CtaStrip";

interface ServicesPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: ServicesPageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = (rawLocale === "en" ? "en" : "ar") as Locale;
  const dict = getDict(locale);

  return {
    title: dict.meta.services.title,
    description: dict.meta.services.description,
  };
}

export default async function ServicesPage({ params }: ServicesPageProps) {
  const { locale: rawLocale } = await params;
  const locale = (rawLocale === "en" ? "en" : "ar") as Locale;
  const dict = getDict(locale);

  return (
    <div className="flex flex-col w-full">
      {/* 1. Header */}
      <section className="bg-[#0B111E] text-white py-16 sm:py-20 border-b border-[#C59341]/25 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <nav className="flex justify-center items-center gap-2 text-xs text-[#DEB86A] mb-3">
            <Link href={`/${locale}`} className="hover:underline">
              {dict.nav.home}
            </Link>
            <span>/</span>
            <span className="text-slate-300">{dict.nav.services}</span>
          </nav>
          <span className="text-xs sm:text-sm font-bold tracking-widest text-[#DEB86A] uppercase block">
            {dict.services.overline}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            {dict.services.heading}{" "}
            <span className="text-gradient-gold">
              {dict.services.headingAccent}
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300">
            {locale === "ar"
              ? "نقدم حزمة هندسية متكاملة تشمل التصميم، الحفر والأساسات، العزل، الإشراف الاستشاري، والتشطيبات الفاخرة."
              : "Comprehensive civil contracting, architectural design, specialized waterproofing, and turnkey delivery."}
          </p>
        </div>
      </section>

      {/* 2. Interactive Flagship Services Slider */}
      <ServicesSlider locale={locale} />

      {/* 3. Complete Services Catalog Grid */}
      <section className="section-py bg-white text-slate-900 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs sm:text-sm font-bold tracking-widest text-[#AA7B2F] uppercase block">
              {locale === "ar" ? "دليل الخدمات الشامل" : "Complete Service Directory"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B111E]">
              {locale === "ar"
                ? "تفاصيل ونطاق أعمال جميع الخدمات الهندسية"
                : "Full Scope & Specifications for All Services"}
            </h2>
          </div>

          <ServiceGrid locale={locale} />
        </div>
      </section>

      {/* 4. CTA */}
      <CtaStrip locale={locale} />
    </div>
  );
}
