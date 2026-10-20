import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Info } from "lucide-react";
import { Locale, getDict } from "@/lib/i18n";
import { ProjectGrid } from "@/components/gallery/ProjectGrid";
import { CtaStrip } from "@/components/home/CtaStrip";

interface OurWorkPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: OurWorkPageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = (rawLocale === "en" ? "en" : "ar") as Locale;
  const dict = getDict(locale);

  return {
    title: dict.meta.work.title,
    description: dict.meta.work.description,
  };
}

export default async function OurWorkPage({ params }: OurWorkPageProps) {
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
            <span className="text-slate-300">{dict.nav.work}</span>
          </nav>
          <span className="text-xs sm:text-sm font-bold tracking-widest text-[#DEB86A] uppercase block">
            {dict.gallery.overline}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            {dict.gallery.heading}{" "}
            <span className="text-gradient-gold">
              {dict.gallery.headingAccent}
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300">
            {dict.gallery.subtitle}
          </p>
        </div>
      </section>

      {/* 2. Strict Transparency Guard Banner */}
      <div className="bg-[#F8FAFC] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-600">
            <Info className="w-5 h-5 text-[#AA7B2F] shrink-0" />
            <p>
              {locale === "ar"
                ? "تلتزم سبارك بالشفافية الكاملة: نميز بوضوح بين المشروعات المنفذة ميدانياً (بالأخضر) والتصميمات المعمارية 3D (بالذهبي)."
                : "Spark adheres to strict integrity: clearly distinguishing completed on-site builds (green) from 3D architectural renders (gold)."}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Filterable Gallery Grid with Lightbox */}
      <section className="section-py bg-white text-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProjectGrid locale={locale} />
        </div>
      </section>

      {/* 4. CTA */}
      <CtaStrip locale={locale} />
    </div>
  );
}
