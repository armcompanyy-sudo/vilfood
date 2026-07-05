import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, EASE, prefersReducedMotion } from "../lib/motion";

/**
 * Attach the returned ref to a section. Every descendant carrying the
 * `.reveal` class (which starts hidden via CSS) rises + fades in with a
 * staggered, batched ScrollTrigger as it enters the viewport.
 * Reduced-motion users simply see them, no animation.
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

    const ctx = gsap.context(() => {
      const show = (batch: Element[]) =>
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: EASE,
          stagger: 0.09,
          overwrite: true,
        });
      // both directions — entering from below AND scrolling back up must
      // reveal; onEnter alone left content permanently invisible when a
      // section was first reached bottom-up
      ScrollTrigger.batch(items, {
        start: "top 86%",
        onEnter: show,
        onEnterBack: show,
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return ref;
}
