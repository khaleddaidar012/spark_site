import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "gold" | "navy" | "completed" | "render" | "outline";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "gold",
  size = "md",
  children,
  ...props
}: BadgeProps) {
  const sizeStyles = {
    sm: "px-2.5 py-0.5 text-xs font-medium",
    md: "px-3 py-1 text-sm font-semibold",
  }[size];

  const variantStyles = {
    gold: "bg-[#F5EACF] text-[#8C611E] border border-[#DEB86A]/40",
    navy: "bg-[#0B111E] text-[#DEB86A] border border-[#C59341]/30",
    completed: "bg-emerald-50 text-emerald-700 border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
    render: "bg-amber-50 text-amber-800 border border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
    outline: "border border-slate-300 text-slate-700 bg-white/70 dark:border-slate-700 dark:text-slate-200 dark:bg-slate-900/50",
  }[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full select-none transition-colors",
        sizeStyles,
        variantStyles,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
