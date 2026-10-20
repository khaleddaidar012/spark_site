"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Globe, PhoneCall } from "lucide-react";
import { Locale, getDict } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";

interface HeaderProps {
  locale: Locale;
}

export function Header({ locale }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const dict = getDict(locale);

  const navLinks = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: `/${locale}/about`, label: dict.nav.about },
    { href: `/${locale}/services`, label: dict.nav.services },
    { href: `/${locale}/our-work`, label: dict.nav.work },
    { href: `/${locale}/contact`, label: dict.nav.contact },
  ];

  // Alternate locale link calculation
  const targetLocale = locale === "ar" ? "en" : "ar";
  const switchLocaleHref = pathname
    ? pathname.replace(new RegExp(`^/${locale}`), `/${targetLocale}`) || `/${targetLocale}`
    : `/${targetLocale}`;

  const isActive = (href: string) => {
    if (href === `/${locale}`) {
      return pathname === `/${locale}` || pathname === `/${locale}/`;
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B111E]/95 backdrop-blur-md border-b border-[#C59341]/25 text-white transition-all shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <Link
          href={`/${locale}`}
          className="flex items-center gap-3.5 group focus-visible:outline-[#C59341]"
          aria-label={locale === "ar" ? "سبارك للهندسة والمقاولات — الصفحة الرئيسية" : "Spark Engineering & Contracting — Home"}
        >
          <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-[#C59341]/40 shadow-sm group-hover:border-[#DEB86A] transition-colors">
            <Image
              src="/assets/brand/logo.jpg"
              alt="Spark Engineering Logo"
              fill
              className="object-cover"
              sizes="48px"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-bold tracking-tight text-white group-hover:text-[#DEB86A] transition-colors">
              {locale === "ar" ? "سبارك للهندسة والمقاولات" : "Spark Engineering"}
            </span>
            <span className="text-xs text-[#DEB86A] font-medium tracking-wider">
              {locale === "ar" ? "إشراف استشاري متكامل" : "Contracting & Consultancy"}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  active
                    ? "text-[#DEB86A] bg-white/5 border-b-2 border-[#C59341]"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {/* Language Switcher */}
          <Link
            href={switchLocaleHref}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 border border-white/10 hover:border-[#C59341]/40 transition-all"
            aria-label={`تغيير اللغة إلى ${dict.nav.langSwitch}`}
          >
            <Globe className="w-4 h-4 text-[#DEB86A]" />
            <span>{dict.nav.langSwitch}</span>
          </Link>

          {/* Consultation CTA */}
          <Button
            href={`/${locale}/contact`}
            variant="primary"
            size="sm"
            className="gap-1.5 shadow-sm"
          >
            <PhoneCall className="w-4 h-4" />
            <span>{dict.nav.requestConsultation}</span>
          </Button>
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            href={switchLocaleHref}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-200 border border-white/15 hover:border-[#C59341]"
            aria-label={`تغيير اللغة إلى ${dict.nav.langSwitch}`}
          >
            <Globe className="w-3.5 h-3.5 text-[#DEB86A]" />
            <span>{targetLocale.toUpperCase()}</span>
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? dict.nav.closeMenu : dict.nav.openMenu}
            aria-expanded={isMobileMenuOpen}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-[#C59341]"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0B111E] px-4 pt-4 pb-6 space-y-3 animate-fade-in shadow-2xl">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg text-base font-medium transition-all ${
                    active
                      ? "bg-[#C59341]/15 text-[#DEB86A] font-bold border-s-4 border-[#C59341]"
                      : "text-slate-200 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
            <Button
              href={`/${locale}/contact`}
              variant="primary"
              size="md"
              className="w-full gap-2 justify-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <PhoneCall className="w-4 h-4" />
              <span>{dict.nav.requestConsultation}</span>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
