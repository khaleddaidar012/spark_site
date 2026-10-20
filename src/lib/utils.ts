// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/201006299339?text=${encodeURIComponent(message)}`;
}

export const WHATSAPP_NUMBER = "+201006299339";
export const PHONE_NUMBER = "01006299339";
export const EMAIL = "mohamedmohamedali87@yahoo.com";
export const ADDRESS_AR = "دمياط - ميدان سرور - خلف الاستاد - أعلى بن جاد وكافيه العربي";
export const ADDRESS_EN = "Damietta – Sorour Square, behind the stadium, above Ben Gad & Al Araby Café";
export const FACEBOOK_URL = "https://www.facebook.com/eng.mohamedsharara";
