import React from "react";
import { PhoneCall, MessageCircle, ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { Locale, getDict } from "@/lib/i18n";
import { PHONE_NUMBER, WHATSAPP_NUMBER, buildWhatsAppUrl } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface CtaStripProps {
  locale: Locale;
}

export function CtaStrip({ locale }: Locale extends string ? { locale: Locale } : CtaStripProps) {
  const dict = getDict(locale);
  const isRtl = locale === "ar";
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const whatsappUrl = buildWhatsAppUrl(dict.contact.channels.whatsapp.prefill);

  return (
    <section className="bg-[#0B111E] text-white py-16 sm:py-20 border-t border-[#C59341]/30 relative overflow-hidden">
      {/* Decorative Radial Backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(197,147,65,0.15)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-[#DEB86A]/40 text-[#DEB86A] text-xs font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>
            {locale === "ar"
              ? "استشارة هندسية أولية ومعاينة للموقع"
              : "Initial Engineering Consultation & Site Visit"}
          </span>
        </div>

        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-3xl mx-auto">
          {locale === "ar" ? (
            <>
              هل تخطط لمشروع جديد أو تحتاج إلى{" "}
              <span className="text-gradient-gold">إشراف هندسي استشاري؟</span>
            </>
          ) : (
            <>
              Planning a new project or requiring{" "}
              <span className="text-gradient-gold">
                expert engineering supervision?
              </span>
            </>
          )}
        </h2>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {locale === "ar"
            ? "تواصل مباشرة مع المهندس الاستشاري محمد شرارة لبحث متطلباتك الهندسية وتحديد الخطوات التنفيذية الصحيحة."
            : "Connect directly with Consultant Eng. Mohamed Sharara to evaluate your engineering requirements and execution strategy."}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button
            href={`/${locale}/contact`}
            variant="primary"
            size="lg"
            className="w-full sm:w-auto shadow-xl group justify-center"
          >
            <span>{dict.nav.requestConsultation}</span>
            <ArrowIcon className="w-5 h-5 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 shrink-0" />
          </Button>

          <Button
            href={whatsappUrl}
            external
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto border-[#25D366]/40 hover:border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10 shadow-md group justify-center"
          >
            <MessageCircle className="w-5 h-5 fill-current shrink-0 group-hover:scale-110 transition-transform" />
            <span>{dict.contact.channels.whatsapp.action}</span>
          </Button>

          <a
            href={`tel:${WHATSAPP_NUMBER}`}
            aria-label={locale === "ar" ? "اتصل بنا الآن" : "Call Us Now"}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-base sm:text-lg font-semibold rounded-lg bg-[#0F172A] border border-[#DEB86A]/40 hover:border-[#DEB86A] text-slate-100 hover:text-white hover:bg-[#1E293B] shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.98] group whitespace-nowrap cursor-pointer"
          >
            <PhoneCall className="w-5 h-5 text-[#DEB86A] group-hover:scale-110 group-hover:rotate-12 transition-transform shrink-0" />
            <span>
              {locale === "ar" ? "اتصل بنا الآن" : "Call Us Now"}
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
