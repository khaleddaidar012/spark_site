import React from "react";
import { Phone, MessageCircle, Mail, MapPin, ExternalLink } from "lucide-react";
import { Locale, getDict } from "@/lib/i18n";
import {
  PHONE_NUMBER,
  WHATSAPP_NUMBER,
  EMAIL,
  ADDRESS_AR,
  ADDRESS_EN,
  buildWhatsAppUrl,
} from "@/lib/utils";

interface ChannelCardsProps {
  locale: Locale;
}

export function ChannelCards({ locale }: ChannelCardsProps) {
  const dict = getDict(locale);
  const address = locale === "ar" ? ADDRESS_AR : ADDRESS_EN;
  const whatsappUrl = buildWhatsAppUrl(dict.contact.channels.whatsapp.prefill);

  const channels = [
    {
      id: "phone",
      icon: Phone,
      title: dict.contact.channels.phone.label,
      value:
        locale === "ar"
          ? "مكالمة هاتفية مع المهندس الاستشاري"
          : "Direct Phone Call with Consultant",
      actionText: dict.contact.channels.phone.action,
      href: `tel:${WHATSAPP_NUMBER}`,
      color: "text-[#AA7B2F]",
      border: "hover:border-[#DEB86A]",
    },
    {
      id: "whatsapp",
      icon: MessageCircle,
      title: dict.contact.channels.whatsapp.label,
      value:
        locale === "ar"
          ? "محادثة فورية واستشارة سريعة"
          : "Instant WhatsApp Chat & Consultation",
      actionText: dict.contact.channels.whatsapp.action,
      href: whatsappUrl,
      external: true,
      color: "text-[#25D366]",
      border: "hover:border-[#25D366]",
    },
    {
      id: "email",
      icon: Mail,
      title: dict.contact.channels.email.label,
      value:
        locale === "ar"
          ? "إرسال المخططات والتفاصيل الهندسية"
          : "Send Blueprints & Project Details",
      emailPill: EMAIL,
      actionText: dict.contact.channels.email.action,
      href: `mailto:${EMAIL}?subject=Spark%20Consultation%20Inquiry`,
      color: "text-[#C59341]",
      border: "hover:border-[#C59341]",
    },
    {
      id: "address",
      icon: MapPin,
      title: dict.contact.channels.address.label,
      value: address,
      actionText: dict.contact.channels.address.action,
      href: "https://maps.google.com/?q=Sorour+Square+Damietta+Egypt",
      external: true,
      color: "text-[#AA7B2F]",
      border: "hover:border-[#AA7B2F]",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {channels.map((ch) => {
        const Icon = ch.icon;
        return (
          <a
            key={ch.id}
            href={ch.href}
            target={ch.external ? "_blank" : undefined}
            rel={ch.external ? "noopener noreferrer" : undefined}
            className={`p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group ${ch.border} cursor-pointer`}
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#0B111E] text-[#DEB86A] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <Icon className="w-6 h-6" />
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                  {ch.title}
                </span>
                <p className="mt-1 font-bold text-slate-900 group-hover:text-[#AA7B2F] transition-colors leading-snug text-sm sm:text-base">
                  {ch.value}
                </p>
                {ch.emailPill && (
                  <span
                    dir="ltr"
                    className="inline-block mt-2 px-2.5 py-1 rounded bg-slate-100 border border-slate-200/80 text-[11px] font-mono text-slate-600 break-all select-all"
                  >
                    {ch.emailPill}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold text-[#AA7B2F]">
              <span>{ch.actionText}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </div>
          </a>
        );
      })}
    </div>
  );
}
