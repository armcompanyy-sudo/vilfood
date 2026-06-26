import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../lib/motion";

/** A number that counts up once when scrolled into view. */
export function Counter({
  value,
  from = 0,
  className = "",
}: {
  value: number;
  from?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.textContent = String(value);
      return;
    }
    const obj = { v: from };
    el.textContent = String(Math.round(from));
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      once: true,
      onEnter: () =>
        gsap.to(obj, {
          v: value,
          duration: 1.6,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = String(Math.round(obj.v));
          },
        }),
    });
    return () => st.kill();
  }, [value, from]);

  return <span ref={ref} className={className}>{value}</span>;
}
