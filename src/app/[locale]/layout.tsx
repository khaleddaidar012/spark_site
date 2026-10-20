import type { Metadata } from "next";
import { Cairo, Outfit } from "next/font/google";
import "@/app/globals.css";
import { Locale, locales, defaultLocale, getDict } from "@/lib/i18n";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = (rawLocale === "en" ? "en" : "ar") as Locale;
  const dict = getDict(locale);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://spark-ec.com";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: dict.meta.home.title,
      template: "%s | سبارك للهندسة والمقاولات",
    },
    description: dict.meta.home.description,
    keywords: [
      "مقاولات دمياط",
      "مهندس استشاري دمياط",
      "محمد شرارة",
      "سبارك للهندسة",
      "عزل أساسات دمياط",
      "تشطيبات دمياط",
      "خرسانات وبناء",
      "Spark Engineering Damietta",
      "Consultant Engineer Mohamed Sharara",
    ],
    authors: [{ name: "Consultant Eng. Mohamed Sharara" }],
    creator: "Spark Engineering & Contracting",
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: {
        ar: `${siteUrl}/ar`,
        en: `${siteUrl}/en`,
        "x-default": `${siteUrl}/ar`,
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "ar" ? "ar_EG" : "en_US",
      url: `${siteUrl}/${locale}`,
      title: dict.meta.home.title,
      description: dict.meta.home.description,
      siteName: "Spark Engineering & Contracting",
      images: [
        {
          url: "/assets/brand/hero_bg.png",
          width: 1200,
          height: 630,
          alt: dict.meta.home.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.home.title,
      description: dict.meta.home.description,
      images: ["/assets/brand/hero_bg.png"],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = (rawLocale === "en" ? "en" : "ar") as Locale;
  const dir = locale === "ar" ? "rtl" : "ltr";

  // Verified JSON-LD Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    "@id": "https://spark-ec.com/#corporation",
    name: "سبارك للهندسة والمقاولات",
    alternateName: "Spark Engineering & Contracting",
    description:
      "شركة متخصصة في التصميم الهندسي، البناء والمقاولات، أعمال الأساسات والخرسانات، عزل الرطوبة، والتشطيبات الفاخرة تحت إشراف هندسي استشاري.",
    url: "https://spark-ec.com",
    logo: "https://spark-ec.com/assets/brand/logo.jpg",
    image: "https://spark-ec.com/assets/brand/hero_bg.png",
    telephone: "+201006299339",
    email: "mohamedmohamedali87@yahoo.com",
    founder: {
      "@type": "Person",
      name: "محمد شرارة",
      jobTitle: "مهندس استشاري (Consultant Engineer)",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "ميدان سرور - خلف الاستاد - أعلى بن جاد وكافيه العربي",
      addressLocality: "دمياط (Damietta)",
      addressRegion: "دمياط",
      addressCountry: "EG",
    },
    areaServed: [
      {
        "@type": "AdministrativeArea",
        name: "Damietta Governorate",
      },
      {
        "@type": "Country",
        name: "Egypt",
      },
    ],
  };

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${cairo.variable} ${outfit.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className="min-h-full flex flex-col bg-[#F8FAFC] text-[#0F172A] selection:bg-[#DEB86A] selection:text-[#0B111E]"
        suppressHydrationWarning
      >
        <Header locale={locale} />
        <main className="flex-1 w-full">{children}</main>
        <Footer locale={locale} />
        <WhatsAppButton locale={locale} />
      </body>
    </html>
  );
}
