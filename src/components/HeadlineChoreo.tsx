import { useEffect } from "react";
import { useI18n } from "../lib/i18n";
import {
  gsap,
  ScrollTrigger,
  SplitText,
  prefersReducedMotion,
} from "../lib/motion";

/**
 * Section-title choreography: every `[data-choreo]` element splits into
 * masked lines (SplitText) that rise in with a stagger as it enters the
 * viewport. Splitting waits for webfonts so the measured line breaks match
 * the real metrics, `autoSplit` re-splits on resize, and titles are keyed
 * by locale upstream so language switches re-split fresh copy.
 *
 * Deliberately NO font-variation scrubbing here: animating wght/SOFT changes
 * glyph advances, which invalidates the measured line breaks and makes text
 * rewrap inside its clipped masks (the hero headline can ripen safely — its
 * lines are single words that never rewrap).
 *
 * Titles are hidden by CSS until the split runs (no unstyled flash);
 * reduced-motion users get them shown immediately, untouched.
 */
export function HeadlineChoreo() {
  const { locale } = useI18n();

  useEffect(() => {
    const els = gsap.utils.toArray<HTMLElement>("[data-choreo]");
    if (!els.length) return;

    if (prefersReducedMotion()) {
      gsap.set(els, { visibility: "visible" });
      return;
    }

    let cancelled = false;
    let ctx: gsap.Context | null = null;

    const build = () => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        els.forEach((el) => {
          SplitText.create(el, {
            type: "lines",
            mask: "lines",
            autoSplit: true,
            linesClass: "choreo-line",
            onSplit(self) {
              // extend each mask below the tight line-height so descenders
              // (Fraunces italic tails, Armenian below-base strokes) survive
              const masks =
                (self as unknown as { masks?: HTMLElement[] }).masks ?? [];
              masks.forEach((m) => {
                m.style.paddingBottom = "0.18em";
                m.style.marginBottom = "-0.18em";
              });
              gsap.set(el, { visibility: "visible" });
              return gsap.from(self.lines, {
                yPercent: 120,
                duration: 1.05,
                ease: "power4.out",
                stagger: 0.09,
                scrollTrigger: { trigger: el, start: "top 86%" },
              });
            },
          });
        });
      });
      ScrollTrigger.refresh();
    };

    // measure lines only with the real display font in place
    if (document.fonts && document.fonts.status !== "loaded") {
      document.fonts.ready.then(build);
    } else {
      build();
    }

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [locale]);

  return null;
}
