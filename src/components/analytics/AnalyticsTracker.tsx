"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function AnalyticsTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);
  useEffect(() => {
    if (pathname.split("/")[2] === "admin") return;
    const send = (type: "view" | "heartbeat") => {
      if (type === "heartbeat" && document.visibilityState !== "visible") return;
      void fetch("/api/analytics", {
        method: "POST",
        keepalive: true,
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
    };

    if (lastTrackedPath.current !== pathname) {
      lastTrackedPath.current = pathname;
      send("view");
    }
    const heartbeat = () => send("heartbeat");
    heartbeat();
    const timer = window.setInterval(heartbeat, 10_000);
    document.addEventListener("visibilitychange", heartbeat);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", heartbeat);
    };
  }, [pathname]);
  return null;
}
