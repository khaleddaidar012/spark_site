import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  variant?: "surface" | "navy" | "goldBorder";
}

export function Card({
  className,
  hoverEffect = false,
  variant = "surface",
  children,
  ...props
}: CardProps) {
  const variantStyles = {
    surface: "bg-white text-slate-900 border border-slate-200/80 shadow-sm",
    navy: "bg-[#0B111E] text-white border border-[#C59341]/20 shadow-md",
    goldBorder: "bg-white text-slate-900 border-2 border-[#DEB86A]/40 shadow-sm",
  }[variant];

  return (
    <div
      className={cn(
        "rounded-xl overflow-hidden transition-all duration-300",
        variantStyles,
        hoverEffect && "hover:shadow-xl hover:-translate-y-1 hover:border-[#C59341]/60",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
