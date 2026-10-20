"use server";

import { z } from "zod";

const consultationSchema = z.object({
  fullName: z.string().min(3, "الاسم الكامل مطلوب (3 أحرف على الأقل)"),
  phone: z
    .string()
    .min(10, "رقم الهاتف غير صالح")
    .regex(/^(01[0125][0-9]{8}|\+201[0125][0-9]{8})$/, "يرجى إدخال رقم هاتف مصري صحيح"),
  email: z.string().email("البريد الإلكتروني غير صالح").optional().or(z.literal("")),
  service: z.string().min(1, "يرجى اختيار الخدمة المطلوبة"),
  notes: z.string().min(10, "يرجى كتابة نبذة عن المشروع (10 أحرف على الأقل)"),
});

export type ConsultationFormData = z.infer<typeof consultationSchema>;

export interface ActionResult {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  whatsappUrl?: string;
}

function generateConsultationEmailHtml({
  fullName,
  phone,
  email,
  service,
  notes,
  dateString,
}: {
  fullName: string;
  phone: string;
  email?: string;
  service: string;
  notes: string;
  dateString: string;
}) {
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  const waNumber = cleanPhone.startsWith("01") ? `2${cleanPhone}` : cleanPhone;
  const waDirectUrl = `https://wa.me/${waNumber}`;

  return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="utf-8">
  <title>طلب استشارة هندسية جديد</title>
</head>
<body style="margin: 0; padding: 24px; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #1e293b; direction: rtl; text-align: right;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.06);">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #0B111E 0%, #152238 100%); padding: 30px 24px; text-align: center; border-bottom: 3px solid #C59341;">
      <h1 style="color: #ffffff; margin: 0; font-size: 21px; font-weight: bold; letter-spacing: -0.5px;">
        شركة سبارك للاستشارات الهندسية والمقاولات
      </h1>
      <p style="color: #C59341; margin: 8px 0 0; font-size: 14px; font-weight: 500;">
        طلب استشارة هندسية جديد عبر الموقع الإلكتروني
      </p>
    </div>

    <!-- Body -->
    <div style="padding: 28px;">
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 22px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 8px 0; color: #64748b; width: 130px; font-weight: 600;">اسم العميل:</td>
            <td style="padding: 8px 0; color: #0f172a; font-weight: bold; font-size: 16px;">${fullName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-weight: 600;">رقم الهاتف:</td>
            <td style="padding: 8px 0; direction: ltr; text-align: right;">
              <a href="tel:${phone}" style="color: #0284c7; text-decoration: none; font-weight: bold;">${phone}</a>
            </td>
          </tr>
          ${
            email
              ? `<tr>
            <td style="padding: 8px 0; color: #64748b; font-weight: 600;">البريد الإلكتروني:</td>
            <td style="padding: 8px 0; direction: ltr; text-align: right;">
              <a href="mailto:${email}" style="color: #0284c7; text-decoration: none;">${email}</a>
            </td>
          </tr>`
              : ""
          }
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-weight: 600;">الخدمة المطلوبة:</td>
            <td style="padding: 8px 0;">
              <span style="background-color: #fef3c7; color: #92400e; padding: 4px 10px; border-radius: 6px; font-weight: bold; font-size: 13px;">${service}</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-weight: 600;">تاريخ الطلب:</td>
            <td style="padding: 8px 0; color: #64748b; font-size: 13px;">${dateString}</td>
          </tr>
        </table>
      </div>

      <!-- Project Notes -->
      <div style="margin-bottom: 22px;">
        <h3 style="font-size: 15px; color: #0B111E; margin: 0 0 10px; font-weight: 700;">تفاصيل المشروع / الاستشارة:</h3>
        <div style="background-color: #f8fafc; border-right: 4px solid #C59341; padding: 16px; border-radius: 4px; font-size: 14px; line-height: 1.7; color: #334155; white-space: pre-line;">
          ${notes}
        </div>
      </div>

      <!-- Action Buttons -->
      <div style="text-align: center; padding-top: 10px;">
        <a href="tel:${phone}" style="display: inline-block; background-color: #0B111E; color: #ffffff; text-decoration: none; padding: 12px 22px; border-radius: 8px; font-size: 14px; font-weight: bold; margin: 6px;">
          📞 اتصال هاتفي بالعميل
        </a>
        <a href="${waDirectUrl}" style="display: inline-block; background-color: #25D366; color: #ffffff; text-decoration: none; padding: 12px 22px; border-radius: 8px; font-size: 14px; font-weight: bold; margin: 6px;">
          💬 بدء محادثة واتساب
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #f8fafc; padding: 16px 24px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8;">
      هذه الرسالة مرسلة تلقائياً من موقع شركة سبارك للاستشارات الهندسية والمقاولات.
    </div>
  </div>
</body>
</html>`;
}

export async function submitConsultationForm(
  data: ConsultationFormData
): Promise<ActionResult> {
  const validation = consultationSchema.safeParse(data);

  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
      message: "بيانات النموذج غير مكتملة أو تحتوي على أخطاء.",
    };
  }

  const { fullName, phone, email, service, notes } = validation.data;

  // Prefilled WhatsApp link directly to consultant's WhatsApp
  const whatsappMsg = `طلب استشارة هندسية جديد عبر موقع سبارك:
• الاسم: ${fullName}
• الهاتف: ${phone}
${email ? `• البريد: ${email}\n` : ""}• الخدمة: ${service}
• تفاصيل المشروع: ${notes}`;

  const whatsappUrl = `https://wa.me/201006299339?text=${encodeURIComponent(
    whatsappMsg
  )}`;

  // Resend API key and verified sender configuration
  const resendApiKey =
    process.env.RESEND_API_KEY;
  const recipient =
    process.env.CONTACT_EMAIL_RECIPIENT || "mohamedmohamedali87@yahoo.com";
  const fromEmail =
    process.env.RESEND_FROM_EMAIL ||
    "سبارك للهندسة والمقاولات <info@daidarsoluations.com>";

  const now = new Date();
  const dateString = now.toLocaleString("ar-EG", {
    timeZone: "Africa/Cairo",
    dateStyle: "full",
    timeStyle: "short",
  });

  if (resendApiKey) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [recipient],
          reply_to: email && email.trim().length > 0 ? email : undefined,
          subject: `طلب استشارة هندسية جديد: ${fullName} (${service})`,
          text: `طلب استشارة هندسية جديد عبر موقع سبارك:\n\nالاسم: ${fullName}\nالهاتف: ${phone}\nالبريد: ${
            email || "غير محدد"
          }\nالخدمة: ${service}\nالتاريخ: ${dateString}\n\nتفاصيل المشروع:\n${notes}`,
          html: generateConsultationEmailHtml({
            fullName,
            phone,
            email: email || undefined,
            service,
            notes,
            dateString,
          }),
        }),
      });

      if (response.ok) {
        return {
          success: true,
          message: "تم استلام طلبك بنجاح! سيتواصل معك فريق المهندس محمد شرارة.",
        };
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Resend API error:", errorData);
      }
    } catch (err) {
      console.error("Resend dispatch exception:", err);
    }
  }

  // Fallback to direct WhatsApp if email fails
  return {
    success: false,
    message: "تعذر إرسال الطلب عبر البريد حالياً. يمكنك المتابعة عبر واتساب مباشرة.",
    whatsappUrl,
  };
}
