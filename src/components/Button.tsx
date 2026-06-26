import type { ReactNode } from "react";
import { useMagnetic } from "../hooks/useMagnetic";
import { scrollToId } from "../lib/SmoothScroll";

type Variant = "solid" | "outline" | "ghost";

interface ButtonProps {
  children: ReactNode;
  href?: string; // "#id" scrolls smoothly; anything else is a normal link
  onClick?: () => void;
  variant?: Variant;
  magnetic?: boolean;
  className?: string;
  type?: "button" | "submit";
  ariaLabel?: string;
}

const base =
  "group relative inline-flex min-h-[2.75rem] items-center justify-center gap-2 rounded-full px-7 py-3 text-center text-[0.92rem] font-semibold leading-tight tracking-tight transition-colors duration-300 ease-editorial focus-visible:outline-offset-4";

const variants: Record<Variant, string> = {
  solid:
    "bg-pomegranate text-cream hover:bg-pomegranate-light shadow-warm",
  outline:
    "border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-cream",
  ghost: "text-ink hover:text-pomegranate",
};

export function Button({
  children,
  href,
  onClick,
  variant = "solid",
  magnetic = true,
  className = "",
  type = "button",
  ariaLabel,
}: ButtonProps) {
  const ref = useMagnetic<HTMLElement>(magnetic ? 0.35 : 0);
  const cls = `${base} ${variants[variant]} ${className}`;

  const arrow =
    variant === "ghost" ? (
      <span className="transition-transform duration-300 ease-editorial group-hover:translate-x-1">
        →
      </span>
    ) : null;

  if (href) {
    const isAnchor = href.startsWith("#");
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        aria-label={ariaLabel}
        onClick={(e) => {
          if (isAnchor) {
            e.preventDefault();
            scrollToId(href.slice(1));
          }
          onClick?.();
        }}
        className={cls}
      >
        {children}
        {arrow}
      </a>
    );
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type}
      aria-label={ariaLabel}
      onClick={onClick}
      className={cls}
    >
      {children}
      {arrow}
    </button>
  );
}
