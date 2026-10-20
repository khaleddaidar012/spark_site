import type { Metadata } from "next";
import { hasConsoleSession } from "@/lib/console-auth";
import { ConsolePanel } from "@/components/console/ConsolePanel";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Spark Console", robots: { index: false, follow: false } };

export default async function SparkConsolePage() {
  const authenticated = await hasConsoleSession();
  return <ConsolePanel authenticated={authenticated} />;
}
