import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

// Dev-only handle for the preview harness.
if (import.meta.env.DEV)
  (window as unknown as { __ST?: typeof ScrollTrigger }).__ST = ScrollTrigger;

/** True when the user has asked for reduced motion (SSR-safe). */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** The page's signature easing — slow-out, used everywhere for cohesion. */
export const EASE = "power3.out";

export { gsap, ScrollTrigger, SplitText };
