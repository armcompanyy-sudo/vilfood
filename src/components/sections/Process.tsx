import { useEffect, useRef, useState } from "react";
import { useI18n } from "../../lib/i18n";
import { Eyebrow } from "../Sun";
import { useScrollReveal } from "../../hooks/useScrollReveal";

/**
 * One illustration per step (harvest → prepare → seal → deliver).
 * `pos` is the object-position focal point: with object-cover the container
 * crops the edges on resize, and `pos` keeps the grandmother / the action in
 * frame at every size. `bg` only shows for a beat while the image loads.
 */
const VISUALS = [
  { img: "/img/process-harvest-v3.webp", pos: "50% 40%", bg: "#cfe0c4" },
  { img: "/img/process-prepare-v3.webp", pos: "50% 45%", bg: "#d6e0c9" },
  { img: "/img/process-seal-v3.webp", pos: "50% 42%", bg: "#e6d6c2" },
  { img: "/img/process-deliver-v3.webp", pos: "50% 45%", bg: "#dfe4ea" },
];

export function Process() {
  const { t } = useI18n();
  const headerRef = useScrollReveal<HTMLDivElement>();
  const stepsRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // pick the step whose block is closest to the viewport centre
  useEffect(() => {
    const root = stepsRef.current;
    if (!root) return;
    const blocks = Array.from(root.querySelectorAll<HTMLElement>("[data-step]"));
    let raf = 0;
    const update = () => {
      raf = 0;
      const mid = window.innerHeight / 2;
      let best = 0;
      let bestDist = Infinity;
      blocks.forEach((b, i) => {
        const r = b.getBoundingClientRect();
        const d = Math.abs(r.top + r.height / 2 - mid);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      setActive(best);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="process" className="relative bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
        <div ref={headerRef}>
          <div className="reveal">
            <Eyebrow>{t.process.eyebrow}</Eyebrow>
          </div>
          <h2 className="reveal mt-7 max-w-3xl font-display text-display-md font-semibold leading-[1.05] text-ink">{t.process.title}</h2>
          <p className="reveal mt-6 max-w-xl text-pretty text-ink/70 md:text-lg">
            {t.process.lede}
          </p>
        </div>

        <div className="mt-8 grid gap-10 md:grid-cols-2 md:gap-16">
          {/* sticky visual (desktop) — crossfades through the four steps */}
          <div className="order-1 hidden md:block">
            <div className="sticky top-0 flex h-[82vh] items-center">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-jar shadow-warm-lg">
                {VISUALS.map((v, i) => (
                  <div
                    key={i}
                    className="absolute inset-0 transition-opacity duration-700 ease-editorial"
                    style={{ backgroundColor: v.bg, opacity: active === i ? 1 : 0 }}
                  >
                    <img
                      src={v.img}
                      alt=""
                      aria-hidden
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                      style={{ objectPosition: v.pos }}
                    />
                    {/* scrim keeps the step label readable over the artwork */}
                    <div
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(35,28,22,0.62), transparent)",
                      }}
                    />
                    <span className="absolute bottom-5 left-6 font-display text-2xl italic text-cream drop-shadow">
                      {t.process.steps[i]?.t}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* steps */}
          <div ref={stepsRef} className="order-2">
            {t.process.steps.map((s, i) => (
              <div
                key={i}
                data-step
                className="flex min-h-[52vh] flex-col justify-center border-t border-ink/10 py-10 first:border-t-0 md:min-h-[86vh] md:border-t-0"
              >
                {/* per-step illustration (mobile only — desktop uses the sticky visual) */}
                <div className="mb-7 overflow-hidden rounded-jar shadow-warm md:hidden">
                  <img
                    src={VISUALS[i]?.img}
                    alt=""
                    aria-hidden
                    loading="lazy"
                    decoding="async"
                    className="aspect-[4/3] w-full object-cover"
                    style={{ objectPosition: VISUALS[i]?.pos }}
                  />
                </div>

                <span
                  className={`eyebrow transition-colors duration-500 ${
                    active === i ? "text-apricot-deep" : "text-ink/40"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")} / {String(t.process.steps.length).padStart(2, "0")}
                </span>
                <h3
                  className={`mt-3 font-display text-[clamp(1.5rem,7.5vw,2.25rem)] font-semibold transition-colors duration-500 md:text-5xl ${
                    active === i ? "text-ink" : "text-ink/45"
                  }`}
                >
                  {s.t}
                </h3>
                <p className="mt-4 max-w-md text-pretty text-base leading-relaxed text-ink/70 md:text-lg">
                  {s.b}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
