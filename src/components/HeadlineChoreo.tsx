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
 * viewport.
 *
 * Line breaks are only valid for the metrics they were measured with, so we
 * are strict about fonts:
 *  - the Google Fonts stylesheet loads async (media=print swap), so
 *    `fonts.ready` can resolve before the display face even starts loading —
 *    we poll `fonts.check()` for the actual display family (per locale)
 *    before splitting, with a timeout fallback;
 *  - if font files land later anyway, `loadingdone` rebuilds the split once
 *    (debounced), self-healing any measure/render mismatch.
 *
 * Titles are keyed by locale upstream so language switches re-split fresh
 * copy. No font-variation scrubbing here — animating wght/SOFT changes glyph
 * advances and rewraps text inside the clipped masks (the hero can ripen
 * safely: its lines are single words).
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

    // the face that actually renders these titles in the current locale
    const displayFace =
      locale === "ru"
        ? '"Playfair Display"'
        : locale === "hy"
          ? '"Noto Serif Armenian"'
          : '"Fraunces"';
    const fontUsable = () => {
      try {
        return document.fonts.check(`700 24px ${displayFace}`);
      } catch {
        return true;
      }
    };

    const build = () => {
      if (cancelled) return;
      ctx?.revert();
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

    // split only once the display face is truly usable (or after ~5s give up
    // and split with fallback metrics — the loadingdone rebuild corrects it)
    let tries = 0;
    const attempt = () => {
      if (cancelled) return;
      if (fontUsable() || tries++ > 50) build();
      else window.setTimeout(attempt, 100);
    };
    if (document.fonts) document.fonts.ready.then(attempt);
    else attempt();

    // late-arriving font files (async stylesheet, other subsets) → re-split
    let debounce = 0;
    const onLoadingDone = () => {
      window.clearTimeout(debounce);
      debounce = window.setTimeout(() => {
        if (!cancelled && ctx) build();
      }, 150);
    };
    document.fonts?.addEventListener("loadingdone", onLoadingDone);

    return () => {
      cancelled = true;
      window.clearTimeout(debounce);
      document.fonts?.removeEventListener("loadingdone", onLoadingDone);
      ctx?.revert();
    };
  }, [locale]);

  return null;
}
