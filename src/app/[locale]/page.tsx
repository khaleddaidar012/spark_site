import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Locale, getDict } from "@/lib/i18n";
import { Hero } from "@/components/home/Hero";
import { Intro } from "@/components/home/Intro";
import { ServicesSlider } from "@/components/services/ServicesSlider";
import { Process } from "@/components/home/Process";
import { WhyUs } from "@/components/home/WhyUs";
import { CtaStrip } from "@/components/home/CtaStrip";
import { ProjectGrid } from "@/components/gallery/ProjectGrid";
import { Button } from "@/components/ui/Button";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale: rawLocale } = await params;
  const locale = (rawLocale === "en" ? "en" : "ar") as Locale;
  const dict = getDict(locale);
  const isRtl = locale === "ar";
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero Section */}
      <Hero locale={locale} />

      {/* 2. Executive Intro & Leadership */}
      <Intro locale={locale} />

      {/* 3. Flagship Interactive Services Slider */}
      <ServicesSlider locale={locale} />

      {/* 4. Selected Projects Spotlight */}
      <section className="section-py bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="space-y-2">
              <span className="text-xs sm:text-sm font-bold tracking-widest text-[#AA7B2F] uppercase block">
                {dict.gallery.overline}
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0B111E] tracking-tight section-accent">
                {dict.gallery.heading}{" "}
                <span className="text-[#C59341]">{dict.gallery.headingAccent}</span>
              </h2>
            </div>

            <Button
              href={`/${locale}/our-work`}
              variant="outline"
              size="md"
              className="gap-2 group w-fit"
            >
              <span>{dict.gallery.viewAll}</span>
              <ArrowIcon className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            </Button>
          </div>

          <ProjectGrid locale={locale} limit={3} />
        </div>
      </section>

      {/* 5. 4-Stage Work Process */}
      <Process locale={locale} />

      {/* 6. Why Choose Spark */}
      <WhyUs locale={locale} />

      {/* 7. Direct Action CTA Strip */}
      <CtaStrip locale={locale} />
    </div>
  );
}
