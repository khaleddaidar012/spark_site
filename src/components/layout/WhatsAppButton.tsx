"use client";

import React from "react";
import { MessageCircle } from "lucide-react";
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
        className="group flex items-center gap-2.5 px-4 py-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-[#25D366] focus-visible:outline-offset-4"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
        </span>
        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="text-sm hidden sm:inline-block">
          {dict.footer.whatsappFloat}
        </span>
      </a>
    </aside>
  );
}
