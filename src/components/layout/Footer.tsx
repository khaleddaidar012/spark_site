import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, MapPin, Award, ExternalLink, MessageCircle } from "lucide-react";
import { Locale, getDict } from "@/lib/i18n";
import {
  FACEBOOK_URL,
  WHATSAPP_NUMBER,
  ADDRESS_AR,
  ADDRESS_EN,
  buildWhatsAppUrl,
} from "@/lib/utils";

function FacebookIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
        clipRule="evenodd"
      />
    </svg>
  );
}

interface FooterProps {
  locale: Locale;
}

export function Footer({ locale }: FooterProps) {
  const dict = getDict(locale);
  const address = locale === "ar" ? ADDRESS_AR : ADDRESS_EN;

  return (
    <footer className="bg-[#0B111E] text-slate-300 border-t border-[#C59341]/30 relative overflow-hidden">
      {/* Decorative top gold line */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#C59341] to-transparent opacity-80" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-14">
        {/* Simplified 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Column 1: Brand, Tagline & Facebook (5 Cols) */}
          <div className="md:col-span-6 lg:col-span-5 space-y-5">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-[#C59341]/40 shrink-0">
                <Image
                  src="/assets/brand/logo.jpg"
                  alt="Spark Engineering"
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-wide">
                  {locale === "ar" ? "سبارك للهندسة والمقاولات" : "Spark Engineering"}
                </h3>
                <p className="text-xs text-[#DEB86A]">
                  {locale === "ar" ? "إشراف استشاري متكامل" : "Contracting & Consultancy"}
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              {dict.footer.tagline}
            </p>

            {/* Leadership Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-lg bg-white/5 border border-[#C59341]/30">
              <Award className="w-4 h-4 text-[#DEB86A] shrink-0" />
              <p className="text-xs font-semibold text-slate-200">
                {dict.footer.leadership}
              </p>
            </div>

            {/* Prominent Facebook & WhatsApp Links */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="صفحة المهندس محمد شرارة على فيسبوك"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1877F2]/10 hover:bg-[#1877F2] text-[#1877F2] hover:text-white border border-[#1877F2]/30 hover:border-[#1877F2] transition-all text-xs font-bold group shadow-sm"
              >
                <FacebookIcon className="w-4 h-4 shrink-0" />
                <span>{locale === "ar" ? "فيسبوك | م. محمد شرارة" : "Facebook | Eng. Mohamed Sharara"}</span>
                <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100" />
              </a>

              <a
                href={buildWhatsAppUrl(dict.contact.channels.whatsapp.prefill)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="محادثة واتساب"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#25D366]/10 hover:bg-[#25D366] text-[#25D366] hover:text-white border border-[#25D366]/30 hover:border-[#25D366] transition-all text-xs font-bold group shadow-sm"
              >
                <MessageCircle className="w-4 h-4 fill-current shrink-0" />
                <span>{locale === "ar" ? "واتساب" : "WhatsApp"}</span>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Navigation (3 Cols) */}
          <div className="md:col-span-3 lg:col-span-3 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C59341]" />
              {dict.footer.quickLinks}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href={`/${locale}`}
                  className="hover:text-[#DEB86A] transition-colors inline-block"
                >
                  {dict.nav.home}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/about`}
                  className="hover:text-[#DEB86A] transition-colors inline-block"
                >
                  {dict.nav.about}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/services`}
                  className="hover:text-[#DEB86A] transition-colors inline-block"
                >
                  {dict.nav.services}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/our-work`}
                  className="hover:text-[#DEB86A] transition-colors inline-block"
                >
                  {dict.nav.work}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/contact`}
                  className="hover:text-[#DEB86A] transition-colors inline-block"
                >
                  {dict.nav.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Direct Contact & Location (4 Cols) */}
          <div className="md:col-span-3 lg:col-span-4 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C59341]" />
              {dict.footer.contactInfo}
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href={`tel:${WHATSAPP_NUMBER}`}
                  className="flex items-center gap-2.5 text-slate-300 hover:text-[#DEB86A] transition-colors group"
                >
                  <Phone className="w-4 h-4 text-[#DEB86A] shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">
                    {locale === "ar" ? "اتصال هاتفي مباشر" : "Direct Phone Call"}
                  </span>
                </a>
              </li>

              <li>
                <a
                  href={buildWhatsAppUrl(dict.contact.channels.whatsapp.prefill)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-slate-300 hover:text-[#25D366] transition-colors group"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">
                    {locale === "ar" ? "محادثة فورية عبر واتساب" : "Instant WhatsApp Chat"}
                  </span>
                </a>
              </li>

              <li>
                <a
                  href={FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-slate-300 hover:text-[#1877F2] transition-colors group"
                >
                  <FacebookIcon className="w-4 h-4 text-[#1877F2] shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">
                    {locale === "ar" ? "الصفحة الرسمية على فيسبوك" : "Official Facebook Page"}
                  </span>
                </a>
              </li>

              <li>
                <a
                  href="https://maps.google.com/?q=Sorour+Square+Damietta+Egypt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 text-slate-300 hover:text-[#DEB86A] transition-colors group pt-1"
                >
                  <MapPin className="w-4 h-4 text-[#DEB86A] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs text-slate-400 leading-relaxed group-hover:text-slate-200">
                    {address}
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & socials bar */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p suppressHydrationWarning>{dict.footer.rights} 2026</p>

          <div className="flex items-center gap-3 pe-0 sm:pe-20">
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-[#1877F2] transition-colors flex items-center gap-1.5"
            >
              <FacebookIcon className="w-3.5 h-3.5" />
              <span>Facebook</span>
            </a>
            <span>•</span>
            <a
              href={buildWhatsAppUrl(dict.contact.channels.whatsapp.prefill)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-[#25D366] transition-colors flex items-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
