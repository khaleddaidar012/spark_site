"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, CheckCircle2, AlertTriangle, MessageCircle, RefreshCw } from "lucide-react";
import { Locale, getDict } from "@/lib/i18n";
import { submitConsultationForm } from "@/actions/contact";
import { Button } from "@/components/ui/Button";

interface ContactFormProps {
  locale: Locale;
}

export function ContactForm({ locale }: ContactFormProps) {
  const dict = getDict(locale);
  const isRtl = locale === "ar";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<
    "idle" | "success" | "fallback"
  >("idle");
  const [fallbackWhatsappUrl, setFallbackWhatsappUrl] = useState<string>("");

  const formSchema = z.object({
    fullName: z.string().min(3, dict.contact.form.fullNameError),
    phone: z
      .string()
      .min(10, dict.contact.form.phoneError)
      .regex(/^(01[0125][0-9]{8}|\+201[0125][0-9]{8})$/, dict.contact.form.phoneError),
    email: z
      .string()
      .email(dict.contact.form.emailError)
      .optional()
      .or(z.literal("")),
    service: z.string().min(1, dict.contact.form.serviceError),
    notes: z.string().min(10, dict.contact.form.notesError),
  });

  type FormValues = z.infer<typeof formSchema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      service: "",
      notes: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const result = await submitConsultationForm(values);
      if (result.success) {
        setSubmissionStatus("success");
        reset();
      } else {
        setSubmissionStatus("fallback");
        if (result.whatsappUrl) {
          setFallbackWhatsappUrl(result.whatsappUrl);
        }
      }
    } catch {
      // Direct WhatsApp fallback
      const fallbackMsg = `طلب استشارة هندسية جديد:\n• الاسم: ${values.fullName}\n• الهاتف: ${values.phone}\n• الخدمة: ${values.service}\n• التفاصيل: ${values.notes}`;
      setFallbackWhatsappUrl(
        `https://wa.me/201006299339?text=${encodeURIComponent(fallbackMsg)}`
      );
      setSubmissionStatus("fallback");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl p-6 sm:p-8 lg:p-10">
      <div className="mb-8">
        <h3 className="text-xl sm:text-2xl font-bold text-[#0B111E] tracking-tight">
          {dict.contact.form.heading}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {locale === "ar"
            ? "املأ النموذج وسنتواصل معك لتحديد موعد المعاينة أو مناقشة المخططات."
            : "Fill out the form and our engineering team will get back to you promptly."}
        </p>
      </div>

      {/* Success State */}
      {submissionStatus === "success" && (
        <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-4 text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h4 className="text-lg font-bold">{dict.contact.form.successTitle}</h4>
          <p className="text-sm text-emerald-700">{dict.contact.form.successBody}</p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setSubmissionStatus("idle")}
          >
            {dict.contact.form.newRequest}
          </Button>
        </div>
      )}

      {/* Honest Fallback to Direct WhatsApp State */}
      {submissionStatus === "fallback" && (
        <div className="p-6 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 space-y-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-base font-bold text-amber-900">
                {dict.contact.form.errorTitle}
              </h4>
              <p className="text-xs sm:text-sm text-amber-800 mt-1 leading-relaxed">
                {dict.contact.form.errorBody}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <Button
              href={fallbackWhatsappUrl}
              external
              variant="gold"
              size="md"
              className="w-full sm:w-auto gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white border-none shadow-md"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>{dict.contact.form.whatsappFallback}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSubmissionStatus("idle")}
              className="text-xs text-slate-600"
            >
              <RefreshCw className="w-3.5 h-3.5 me-1" />
              <span>{dict.contact.form.newRequest}</span>
            </Button>
          </div>
        </div>
      )}

      {/* Standard Form */}
      {submissionStatus === "idle" && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Full Name */}
          <div>
            <label
              htmlFor="fullName"
              className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5"
            >
              {dict.contact.form.fullName} *
            </label>
            <input
              id="fullName"
              type="text"
              placeholder={dict.contact.form.fullNamePlaceholder}
              {...register("fullName")}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-900 bg-[#F8FAFC] focus:bg-white transition-all ${
                errors.fullName
                  ? "border-red-400 focus:border-red-500"
                  : "border-slate-300 focus:border-[#C59341]"
              }`}
            />
            {errors.fullName && (
              <p className="mt-1 text-xs text-red-600">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Phone & Email Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="phone"
                className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5"
              >
                {dict.contact.form.phone} *
              </label>
              <input
                id="phone"
                type="tel"
                placeholder={dict.contact.form.phonePlaceholder}
                {...register("phone")}
                className={`bidi-isolate w-full px-4 py-2.5 rounded-xl border text-sm text-slate-900 bg-[#F8FAFC] focus:bg-white transition-all ${
                  errors.phone
                    ? "border-red-400 focus:border-red-500"
                    : "border-slate-300 focus:border-[#C59341]"
                }`}
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5"
              >
                {dict.contact.form.email}
              </label>
              <input
                id="email"
                type="email"
                placeholder={dict.contact.form.emailPlaceholder}
                {...register("email")}
                className={`bidi-isolate w-full px-4 py-2.5 rounded-xl border text-sm text-slate-900 bg-[#F8FAFC] focus:bg-white transition-all ${
                  errors.email
                    ? "border-red-400 focus:border-red-500"
                    : "border-slate-300 focus:border-[#C59341]"
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          {/* Service Dropdown */}
          <div>
            <label
              htmlFor="service"
              className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5"
            >
              {dict.contact.form.service} *
            </label>
            <select
              id="service"
              {...register("service")}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-900 bg-[#F8FAFC] focus:bg-white transition-all ${
                errors.service
                  ? "border-red-400 focus:border-red-500"
                  : "border-slate-300 focus:border-[#C59341]"
              }`}
            >
              <option value="">{dict.contact.form.servicePlaceholder}</option>
              {dict.services.items.map((srv) => (
                <option key={srv.id} value={srv.title}>
                  {srv.title}
                </option>
              ))}
            </select>
            {errors.service && (
              <p className="mt-1 text-xs text-red-600">
                {errors.service.message}
              </p>
            )}
          </div>

          {/* Project Details & Location */}
          <div>
            <label
              htmlFor="notes"
              className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5"
            >
              {dict.contact.form.notes} *
            </label>
            <textarea
              id="notes"
              rows={4}
              placeholder={dict.contact.form.notesPlaceholder}
              {...register("notes")}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-900 bg-[#F8FAFC] focus:bg-white transition-all resize-y ${
                errors.notes
                  ? "border-red-400 focus:border-red-500"
                  : "border-slate-300 focus:border-[#C59341]"
              }`}
            />
            {errors.notes && (
              <p className="mt-1 text-xs text-red-600">
                {errors.notes.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              variant="primary"
              size="lg"
              className="w-full gap-2 shadow-lg"
            >
              <Send className="w-4 h-4" />
              <span>
                {isSubmitting
                  ? dict.contact.form.submitting
                  : dict.contact.form.submit}
              </span>
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
