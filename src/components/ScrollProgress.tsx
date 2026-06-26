import { useEffect, useRef } from "react";

/**
 * Signature motif: a slim amber "syrup level" on the right edge that fills
 * as you read down the page, with a soft glow at the leading meniscus.
 */
export function ScrollProgress() {
  const fill = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      if (fill.current) fill.current.style.transform = `scaleY(${p})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed right-0 top-0 z-50 hidden h-screen w-[3px] bg-ink/5 md:block"
    >
      <div
        ref={fill}
        className="h-full w-full origin-top"
        style={{
          transform: "scaleY(0)",
          background: "linear-gradient(to bottom, #F2BE78, #E8A14B 60%, #D2842B)",
          boxShadow: "0 0 14px 1px rgba(232,161,75,0.7)",
        }}
      />
    </div>
  );
}
