/**
 * Fixed film-grain + soft vignette overlay. Pure CSS/SVG, no JS cost.
 * Sits above everything but ignores pointer events.
 */
export function Grain() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      {/* warm vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 8%, transparent 55%, rgba(35,28,22,0.14) 100%)",
        }}
      />
      {/* grain */}
      <svg className="absolute left-[-10%] top-[-10%] h-[120%] w-[120%] opacity-[0.05] mix-blend-multiply animate-grain-shift">
        <filter id="vil-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.82"
            numOctaves="2"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#vil-grain)" />
      </svg>
    </div>
  );
}
