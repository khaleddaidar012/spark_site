import React from "react";
import { ShieldCheck, UserCheck, CalendarCheck, KeyRound } from "lucide-react";
import { Locale, getDict } from "@/lib/i18n";

interface WhyUsProps {
  locale: Locale;
}

const itemIcons = [UserCheck, ShieldCheck, CalendarCheck, KeyRound];

export function WhyUs({ locale }: WhyUsProps) {
  const dict = getDict(locale);

  return (
    <section className="section-py bg-white text-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs sm:text-sm font-bold tracking-widest text-[#AA7B2F] uppercase block">
            {dict.whyUs.overline}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0B111E] tracking-tight">
            {dict.whyUs.heading}{" "}
            <span className="text-[#C59341]">{dict.whyUs.headingAccent}</span>
          </h2>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {dict.whyUs.items.map((item, idx) => {
            const Icon = itemIcons[idx] || ShieldCheck;
            return (
              <div
                key={item.title}
                className="bg-[#F8FAFC] rounded-2xl p-7 border border-slate-200 hover:border-[#C59341] hover:bg-white hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#0B111E] text-[#DEB86A] flex items-center justify-center mb-6 shadow-md group-hover:bg-[#C59341] group-hover:text-[#0B111E] transition-colors">
                  <Icon className="w-7 h-7" />
                </div>

                <h3 className="text-lg font-bold text-[#0B111E] mb-3 group-hover:text-[#AA7B2F] transition-colors">
                  {item.title}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed flex-1">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
