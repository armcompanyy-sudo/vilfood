import { useEffect, useRef } from "react";
import { gsap, EASE, prefersReducedMotion } from "../lib/motion";

/**
 * Attach the returned ref to a section. Every descendant carrying the
 * `.reveal` class (which starts hidden via CSS) rises + fades in as it
 * enters the viewport. Reduced-motion users simply see them, no animation.
 *
 * Two stages, deliberately not driven by the scroll-position ScrollTrigger:
 *   1. Anything already within the viewport at mount is revealed synchronously
 *      — a reload that lands mid-page never leaves on-screen copy invisible.
 *   2. The rest are watched with an IntersectionObserver, which fires reliably
 *      on scroll, on an anchor/teleport jump and after a post-load layout
 *      shift. A ScrollTrigger.batch, by contrast, measures against the tall
 *      sections above and its enter callback is skipped when Lenis flings past
 *      the start — which is what left the far-down Quality section stranded at
 *      opacity 0 until the user nudged the scroll.
 */
export function useScrollReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const items = gsap.utils.toArray<HTMLElement>(".reveal", root);
    if (!items.length) return;

    if (prefersReducedMotion()) {
      gsap.set(items, { opacity: 1, y: 0 });
      return;
    }

    const play = (el: Element, delay = 0) =>
      gsap.to(el, { opacity: 1, y: 0, duration: 1.1, ease: EASE, delay, overwrite: true });

    // 1) Reveal immediately whatever is already on screen at mount.
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const pending: HTMLElement[] = [];
    let shown = 0;
    items.forEach((el) => {
      if (el.getBoundingClientRect().top < vh * 0.9) play(el, shown++ * 0.09);
      else pending.push(el);
    });
    if (!pending.length) return;

    if (typeof IntersectionObserver === "undefined") {
      pending.forEach((el) => play(el));
      return;
    }

    // 2) Watch the rest. Stagger whichever items cross in together (a jump
    //    reveals the group at once; a slow scroll reveals them one at a time).
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
          .forEach((e, i) => {
            play(e.target, i * 0.09);
            obs.unobserve(e.target);
          });
      },
      // reveal once the item is ~10% up from the bottom edge (≈ "top 90%")
      { rootMargin: "0px 0px -10% 0px" },
    );
    pending.forEach((el) => io.observe(el));

    return () => io.disconnect();
  }, []);

  return ref;
}
