import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "./motion";

let lenisRef: Lenis | null = null;

/** The live Lenis instance (null before mount / with reduced motion). */
export function getLenis() {
  return lenisRef;
}

/** Smooth-scroll to an element id (used by nav + anchor links). */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenisRef) {
    lenisRef.scrollTo(el, { offset: 0, duration: 1.2 });
  } else {
    el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }
}

/**
 * Initializes Lenis inertia scrolling and drives it from GSAP's ticker so
 * Lenis and ScrollTrigger share a single clock (no jitter, no double rAF).
 * Reduced-motion users get native scrolling with no smoothing.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1,
      smoothWheel: true,
    });
    lenisRef = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    // Dev-only handle so the preview harness can drive scrolling directly
    // (the headless tab throttles rAF, which otherwise stalls Lenis).
    if (import.meta.env.DEV) (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    // Recalculate pin/reveal positions once fonts, images and the lazy 3D
    // hero have settled — otherwise triggers can be measured too early.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh);
    const t = window.setTimeout(refresh, 1500);

    return () => {
      gsap.ticker.remove(onTick);
      window.removeEventListener("load", refresh);
      window.clearTimeout(t);
      lenis.destroy();
      lenisRef = null;
    };
  }, []);

  return <>{children}</>;
}
