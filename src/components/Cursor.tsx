import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "../lib/motion";

/**
 * A small warm dot that trails the cursor and swells over interactive
 * elements. Desktop-only: on touch / coarse pointers it never mounts and
 * the native cursor is kept (see index.css `.has-custom-cursor`).
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const el = dot.current!;
    document.documentElement.classList.add("has-custom-cursor");
    gsap.set(el, { xPercent: -50, yPercent: -50, opacity: 0 });

    const xTo = gsap.quickTo(el, "x", { duration: 0.32, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.32, ease: "power3" });

    const move = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      gsap.to(el, { opacity: 1, duration: 0.2, overwrite: "auto" });
    };
    const interactive = "a, button, input, textarea, [data-cursor='grow']";
    const over = (e: Event) => {
      if ((e.target as HTMLElement).closest(interactive))
        gsap.to(el, { scale: 2.6, backgroundColor: "rgba(142,36,52,0.18)", duration: 0.3 });
    };
    const out = (e: Event) => {
      if ((e.target as HTMLElement).closest(interactive))
        gsap.to(el, { scale: 1, backgroundColor: "rgba(142,36,52,0.9)", duration: 0.3 });
    };
    const leave = () => gsap.to(el, { opacity: 0, duration: 0.2 });

    window.addEventListener("pointermove", move);
    document.addEventListener("pointerover", over);
    document.addEventListener("pointerout", out);
    document.addEventListener("pointerleave", leave);
    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.removeEventListener("pointerout", out);
      document.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div
      ref={dot}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[70] h-3 w-3 rounded-full"
      style={{ backgroundColor: "rgba(142,36,52,0.9)", mixBlendMode: "multiply" }}
    />
  );
}
