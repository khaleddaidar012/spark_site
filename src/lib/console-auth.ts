import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export const SESSION_COOKIE = "spark_console_session";
const SESSION_SECONDS = 60 * 60 * 12;

function getSecret(name: "SPARK_ADMIN_PASSWORD" | "SPARK_SESSION_SECRET") {
  try {
    const env = getCloudflareContext().env as Record<string, unknown>;
    const value = env[name];
    if (typeof value === "string" && value) return value;
  } catch {
    // Fall back to process.env for regular Next.js development outside Workers.
  }
  return process.env[name];
}

function signature(expiresAt: string, secret: string) {
  return createHmac("sha256", secret).update(`spark-console-v2:${expiresAt}`).digest("hex");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

export function verifyPassword(password: string) {
  const expected = getSecret("SPARK_ADMIN_PASSWORD");
  return Boolean(expected && safeEqual(password, expected));
}

export function createSession() {
  const secret = getSecret("SPARK_SESSION_SECRET");
  if (!secret) throw new Error("SPARK_SESSION_SECRET is not configured.");
  const expiresAt = String(Math.floor(Date.now() / 1000) + SESSION_SECONDS);
  return { value: `${expiresAt}.${signature(expiresAt, secret)}` };
}

export function isValidSession(value: string | undefined) {
  const secret = getSecret("SPARK_SESSION_SECRET");
  if (!secret || !value) return false;
  const [expiresAt, providedSignature] = value.split(".");
  if (!expiresAt || !providedSignature || Number(expiresAt) <= Math.floor(Date.now() / 1000)) return false;
  return safeEqual(providedSignature, signature(expiresAt, secret));
}

export async function hasConsoleSession() {
  const cookieStore = await cookies();
  return isValidSession(cookieStore.get(SESSION_COOKIE)?.value);
}

export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  const requestUrl = new URL(request.url);
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() ?? requestUrl.protocol.slice(0, -1);
  const requestOrigin = host ? `${protocol}://${host}` : requestUrl.origin;
  return origin === requestUrl.origin || origin === requestOrigin;
}
