/** The recurring sun sigil — a filled disc with short rays, in currentColor. */
export function SunSigil({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      aria-hidden
    >
      <circle cx="12" cy="12" r="4.2" fill="currentColor" stroke="none" />
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2;
        const x1 = 12 + Math.cos(a) * 7;
        const y1 = 12 + Math.sin(a) * 7;
        const x2 = 12 + Math.cos(a) * 9.4;
        const y2 = 12 + Math.sin(a) * 9.4;
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}

/** Small uppercase tracked label with the sun sigil — the editorial eyebrow. */
export function Eyebrow({
  children,
  className = "",
  tone = "apricot",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "apricot" | "pomegranate" | "cream";
}) {
  const color =
    tone === "cream"
      ? "text-cream/70"
      : tone === "pomegranate"
        ? "text-pomegranate"
        : "text-apricot-deep";
  return (
    <p className={`eyebrow inline-flex items-center gap-2.5 ${color} ${className}`}>
      <SunSigil className="h-3.5 w-3.5 shrink-0" />
      <span>{children}</span>
    </p>
  );
}
