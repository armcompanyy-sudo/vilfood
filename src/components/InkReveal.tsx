import { useEffect } from "react";
import { useI18n } from "../lib/i18n";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../lib/motion";

/**
 * Ink-fill choreography for `[data-ink]` display titles: the glyphs sit in a
 * faded state and fill with full-strength ink as the title climbs the
 * viewport, scrubbed to the scroll (see the matching CSS in index.css).
 *
 * Deliberately paint-only — we animate background-position on a gradient
 * clipped to the text, so layout, font metrics and line breaks are never
 * touched in any locale. Reduced motion gets fully-inked titles via CSS.
 */
export function InkReveal() {
  const { locale } = useI18n();

  useEffect(() => {
    const els = gsap.utils.toArray<HTMLElement>("[data-ink]");
    if (!els.length || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      els.forEach((el) => {
        // Trigger on the title's SECTION, not the element: the products title
        // lives inside a pinned section, and an element-based trigger
        // re-created mid-pin (locale switch while the shelf is pinned)
        // measures against the pinned layout and strands the title in its
        // faded state. The section's start is stable in both worlds: the
        // fill runs as the section scrolls in, and a mid-pin re-creation
        // lands at progress 1 — fully inked.
        const section = el.closest("section") ?? el;
        gsap.fromTo(
          el,
          { backgroundPosition: "100% 0" },
          {
            backgroundPosition: "0% 0",
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top 75%",
              end: "top 12%",
              scrub: 0.6,
            },
          },
        );
      });
    });

    // locale swaps change title heights — re-measure once the DOM settles
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(raf);
      ctx.revert();
    };
  }, [locale]);

  return null;
}
