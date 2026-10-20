import React from "react";
import Image from "next/image";
import {
  Compass,
  HardHat,
  ClipboardCheck,
  Layers,
  ShieldCheck,
  Paintbrush,
  KeyRound,
  Building2,
  MessageCircle,
  AlertCircle,
} from "lucide-react";
import { Locale, getDict } from "@/lib/i18n";
import { servicesData } from "@/data/services";
import { buildWhatsAppUrl } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface ServiceGridProps {
  locale: Locale;
}

const iconMap: Record<string, React.ElementType> = {
  Compass,
  HardHat,
  ClipboardCheck,
  Layers,
  ShieldCheck,
  Paintbrush,
  KeyRound,
  Building2,
};

export function ServiceGrid({ locale }: ServiceGridProps) {
  const dict = getDict(locale);
  const isRtl = locale === "ar";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {dict.services.items.map((service, idx) => {
        const meta = servicesData.find((s) => s.id === service.id) || servicesData[0];
        const Icon = iconMap[meta.iconName] || HardHat;

        const whatsappText = isRtl
          ? `السلام عليكم، أود الاستفسار عن خدمة "${service.title}" لدى سبارك للهندسة.`
          : `Hello Spark Engineering, I would like to enquire about "${service.title}".`;
        const whatsappUrl = buildWhatsAppUrl(whatsappText);

        return (
          <div
            key={service.id}
            className={`rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-[#C59341] transition-all duration-300 flex flex-col overflow-hidden group ${
              meta.isFlagged ? "border-amber-300 bg-amber-50/20" : ""
            }`}
          >
            {/* Header / Media Header */}
            <div className="relative h-48 w-full bg-[#0B111E] overflow-hidden">
              <Image
                src={meta.image}
                alt={service.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-60"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B111E] via-[#0B111E]/40 to-transparent" />

              <div className="absolute top-4 start-4 flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-[#0B111E]/90 border border-[#C59341]/50 text-[#DEB86A] flex items-center justify-center shadow-lg">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-1 rounded-md bg-black/60 text-white text-xs font-mono font-bold">
                  0{idx + 1}
                </span>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-[#0B111E] group-hover:text-[#AA7B2F] transition-colors">
                  {service.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {service.shortDesc}
                </p>

                {/* Scope of Work */}
                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-slate-100 text-xs text-slate-700 space-y-1">
                  <span className="font-bold text-[#AA7B2F] block uppercase tracking-wider">
                    {locale === "ar" ? "نطاق العمل:" : "Scope:"}
                  </span>
                  <p className="leading-relaxed">{service.scope}</p>
                </div>

                {meta.isFlagged && (
                  <div className="p-2.5 rounded-lg bg-amber-100 border border-amber-300 text-amber-900 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-amber-700" />
                    <span>{dict.services.flaggedNotice}</span>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-slate-100">
                <Button
                  href={whatsappUrl}
                  external
                  variant="gold"
                  size="sm"
                  className="w-full gap-2 text-xs font-bold"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>{dict.services.enquire}</span>
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
