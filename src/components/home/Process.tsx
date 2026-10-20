import React from "react";
import { CheckCircle, Search, Compass, HardHat, Key } from "lucide-react";
import { Locale, getDict } from "@/lib/i18n";

interface ProcessProps {
  locale: Locale;
}

const stepIcons = [Search, Compass, HardHat, Key];

export function Process({ locale }: ProcessProps) {
  const dict = getDict(locale);

  return (
    <section className="section-py bg-[#F8FAFC] text-slate-900 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs sm:text-sm font-bold tracking-widest text-[#AA7B2F] uppercase block">
            {dict.process.overline}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0B111E] tracking-tight">
            {dict.process.heading}{" "}
            <span className="text-[#C59341]">{dict.process.headingAccent}</span>
          </h2>
        </div>

        {/* 4-Stage Connected Process Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {dict.process.steps.map((step, idx) => {
            const Icon = stepIcons[idx] || CheckCircle;
            return (
              <div
                key={step.num}
                className="relative bg-white rounded-2xl p-7 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-[#C59341]/60 transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Step Top Bar: Number & Icon */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl font-black text-slate-200 group-hover:text-[#DEB86A] transition-colors font-mono">
                    {step.num}
                  </span>
                  <div className="w-12 h-12 rounded-xl bg-[#0B111E] text-[#DEB86A] flex items-center justify-center shadow-md group-hover:bg-[#C59341] group-hover:text-[#0B111E] transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-[#0B111E] group-hover:text-[#AA7B2F] transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                {/* Subdued Bottom Accent */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C59341]" />
                  <span>
                    {locale === "ar" ? `المرحلة ${step.num}` : `Phase ${step.num}`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
