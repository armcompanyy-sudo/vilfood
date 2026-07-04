import { useEffect } from "react";
import { useI18n } from "../lib/i18n";
import {
  gsap,
  ScrollTrigger,
  SplitText,
  prefersReducedMotion,
} from "../lib/motion";

/**
 * Display-title choreography, applied to every `[data-choreo]` element.
 *
 * Two layers, both scroll-driven:
 *  1. The title splits into lines (SplitText, masked) that rise in with a
 *     stagger as the title enters the viewport — re-split automatically on
 *     resize, and re-built when the locale swaps the copy.
 *  2. The variable axes of Fraunces "ripen" while the title travels up the
 *     screen: weight 430→600 and SOFT 100→0, so letters land crisp exactly
 *     as the line settles. Cyrillic/Armenian fallback fonts have no SOFT
 *     axis and simply ignore it — the line reveal still carries the effect.
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

    const ctx = gsap.context(() => {
      els.forEach((el) => {
        SplitText.create(el, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          linesClass: "choreo-line",
          onSplit(self) {
            // extend each mask below the tight line-height so descenders
            // (Fraunces italic tails, Armenian below-base strokes) survive
            const masks = (self as unknown as { masks?: HTMLElement[] }).masks ?? [];
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

        // variable-font ripening, scrubbed to the title's climb up the screen
        gsap.fromTo(
          el,
          { fontVariationSettings: '"wght" 430, "SOFT" 100' },
          {
            fontVariationSettings: '"wght" 600, "SOFT" 0',
            ease: "none",
            scrollTrigger: { trigger: el, start: "top 98%", end: "top 40%", scrub: true },
          },
        );
      });
    });

    // line breaks depend on the webfont — re-measure once it settles
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => ctx.revert();
  }, [locale]);

  return null;
}
