"use client";

import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import { Locale, getDict } from "@/lib/i18n";
import { buildWhatsAppUrl } from "@/lib/utils";

interface WhatsAppButtonProps {
  locale: Locale;
}

export function WhatsAppButton({ locale }: WhatsAppButtonProps) {
  const dict = getDict(locale);
  const href = buildWhatsAppUrl(dict.contact.channels.whatsapp.prefill);

  return (
    <aside aria-label={dict.footer.whatsappFloat} className="fixed bottom-6 end-6 z-50">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={dict.footer.whatsappFloat}
        title={dict.footer.whatsappFloat}
        className="group relative flex items-center gap-2.5 overflow-hidden rounded-full bg-[#25D366] px-4 py-3 font-bold text-white shadow-[0_12px_35px_rgba(37,211,102,0.28)] transition-all duration-300 hover:scale-105 hover:bg-[#20ba59] hover:shadow-[0_16px_42px_rgba(37,211,102,0.4)] active:scale-95 focus-visible:outline-2 focus-visible:outline-[#25D366] focus-visible:outline-offset-4"
      >
        <FaWhatsapp aria-hidden="true" className="relative h-6 w-6 shrink-0" />
        <span className="text-sm hidden sm:inline-block">
          {dict.footer.whatsappFloat}
        </span>
      </a>
    </aside>
  );
}
