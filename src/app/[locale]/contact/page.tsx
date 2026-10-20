import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Locale, getDict } from "@/lib/i18n";
import { ChannelCards } from "@/components/contact/ChannelCards";
import { ContactForm } from "@/components/contact/ContactForm";
import { MapEmbed } from "@/components/contact/MapEmbed";

interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: ContactPageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = (rawLocale === "en" ? "en" : "ar") as Locale;
  const dict = getDict(locale);

  return {
    title: dict.meta.contact.title,
    description: dict.meta.contact.description,
  };
}

export default async function ContactPage({ params }: ContactPageProps) {
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
            <span className="text-slate-300">{dict.nav.contact}</span>
          </nav>
          <span className="text-xs sm:text-sm font-bold tracking-widest text-[#DEB86A] uppercase block">
            {dict.contact.overline}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            {dict.contact.heading}{" "}
            <span className="text-gradient-gold">
              {dict.contact.headingAccent}
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300">
            {dict.contact.subtitle}
          </p>
        </div>
      </section>

      {/* 2. Direct Channels & Consultation Form Grid */}
      <section className="section-py bg-white text-slate-900 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Direct Communication Cards (5 Cols) */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#AA7B2F] uppercase tracking-wider block">
                  {locale === "ar" ? "قنوات الاتصال المباشر" : "Direct Channels"}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#0B111E]">
                  {locale === "ar"
                    ? "تواصل فوري مع المهندس الاستشاري"
                    : "Immediate Access to Consultant"}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {locale === "ar"
                    ? "يمكنك الاتصال هاتفياً أو بدء محادثة واتساب فورية لمناقشة أية تفاصيل هندسية أو استشارية."
                    : "Call directly or start a WhatsApp chat for immediate engineering advice or scheduling."}
                </p>
              </div>

              <ChannelCards locale={locale} />
            </div>

            {/* Right Column: Consultation Form (7 Cols) */}
            <div className="lg:col-span-7">
              <ContactForm locale={locale} />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Office Geolocation & Landmark Guide Card */}
      <section className="section-py bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[#AA7B2F] uppercase tracking-wider block">
              {locale === "ar" ? "الموقع الجغرافي" : "Office Geolocation"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B111E]">
              {locale === "ar"
                ? "مقر الشركة بميدان سرور — دمياط"
                : "Damietta Office — Sorour Square"}
            </h2>
          </div>

          <MapEmbed locale={locale} />
        </div>
      </section>
    </div>
  );
}
