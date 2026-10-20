import React from "react";
import { MapPin, Navigation } from "lucide-react";
import { Locale } from "@/lib/i18n";
import { ADDRESS_AR, ADDRESS_EN } from "@/lib/utils";

interface MapEmbedProps {
  locale: Locale;
}

export function MapEmbed({ locale }: MapEmbedProps) {
  const address = locale === "ar" ? ADDRESS_AR : ADDRESS_EN;

  return (
    <div className="rounded-2xl overflow-hidden bg-[#0B111E] border-2 border-[#C59341]/30 shadow-xl">
      <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#C59341] text-[#0B111E] flex items-center justify-center font-bold">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white">
              {locale === "ar" ? "مقر شركة سبارك — دمياط" : "Spark Headquarters — Damietta"}
            </h4>
            <p className="text-xs text-[#DEB86A] mt-0.5">{address}</p>
          </div>
        </div>

        <a
          href="https://maps.google.com/?q=Sorour+Square+Damietta+Egypt"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white border border-white/10 transition-colors w-fit"
        >
          <Navigation className="w-3.5 h-3.5 text-[#DEB86A]" />
          <span>{locale === "ar" ? "الاتجاهات في الخرائط" : "Get Directions"}</span>
        </a>
      </div>

      <div className="relative h-72 sm:h-96 w-full bg-slate-900">
        <iframe
          title={locale === "ar" ? "موقع سبارك على خريطة دمياط" : "Spark Location Map"}
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13650.045395276324!2d31.8100!3d31.4170!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14f9e34eb06830a7%3A0x6b10eb53ad78a87b!2sSorour%20Square%2C%20Damietta%2C%20Egypt!5e0!3m2!1sen!2seg!4v1710000000000!5m2!1sen!2seg"
          width="100%"
          height="100%"
          style={{ border: 0, filter: "contrast(1.05) saturate(1.1)" }}
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}
