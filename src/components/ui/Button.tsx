import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "gold";
  size?: "sm" | "md" | "lg";
  href?: string;
  external?: boolean;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  href,
  external,
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer rounded-lg disabled:opacity-50 disabled:pointer-events-none select-none focus-visible:outline-2 focus-visible:outline-[#C59341] focus-visible:outline-offset-2";

  const sizeStyles = {
    sm: "px-3.5 py-1.5 text-sm gap-1.5",
    md: "px-5 py-2.5 text-base gap-2",
    lg: "px-7 py-3.5 text-lg gap-2.5 font-semibold",
  }[size];

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-[#DEB86A] via-[#C59341] to-[#AA7B2F] text-[#0B111E] font-bold shadow-md hover:shadow-lg hover:brightness-105 active:scale-[0.98]",
    secondary:
      "bg-[#0B111E] text-white border border-[#C59341]/30 hover:border-[#C59341] hover:bg-[#1E293B] shadow-sm active:scale-[0.98]",
    gold:
      "bg-[#C59341] text-[#0B111E] font-bold hover:bg-[#AA7B2F] hover:text-white shadow-md active:scale-[0.98]",
    outline:
      "border-2 border-[#C59341] text-[#C59341] hover:bg-[#C59341] hover:text-[#0B111E] font-semibold active:scale-[0.98]",
    ghost:
      "text-slate-700 hover:text-[#C59341] hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800",
  }[variant];

  const combinedClasses = cn(baseStyles, sizeStyles, variantStyles, className);

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={combinedClasses}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={combinedClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
}
