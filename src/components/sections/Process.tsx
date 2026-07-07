import { useEffect, useRef } from "react";
import { useI18n } from "../../lib/i18n";
import { Eyebrow, SunSigil } from "../Sun";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import { gsap, prefersReducedMotion } from "../../lib/motion";

/**
 * The process as a deck of premium object cards. Each full-screen wrapper
 * is position:sticky inside the shared deck, so a docked card stays pinned
 * to the viewport while the next one rides in and covers it (native
 * scroll, no pinning). The wrappers must be the sticky elements themselves
 * — a sticky card inside its own wrapper gets carried away with it and the
 * cards never overlap. Each card docks PEEK px lower than the previous
 * one, so the top edge of every covered card stays visible above the
 * current one; earlier wrappers get extra height (as bottom padding, so
 * centering is unaffected) or the staircase would collapse against the
 * deck's containment limit as the stack scrolls away.
 *
 * Card anatomy: a solid brand-colour surface with an SVG noise grain, a
 * photoreal isolated object that pops out of the card's top edge (contour
 * drop-shadow, infinite CSS float, scroll parallax from the deck's rAF),
 * and the step copy. A GSAP magnetic hover tilts the inner wrapper so it
 * never fights the deck's own arrive/cover transforms on the article.
 */
const PEEK = 24;

/** Tactile paper grain, blended over each card's solid colour. */
const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const CARDS = [
  {
    obj: "/img/process/obj-apricot.webp",
    objClass: "right-[6%] w-[36%] md:right-[8%] md:w-[27%]",
    num: "01",
    tilt: -0.6,
    bg: "#A66B12",
  },
  {
    obj: "/img/process/obj-jar-3.webp",
    objClass: "right-[8%] w-[31%] md:right-[10%] md:w-[22%]",
    num: "02",
    tilt: 0.5,
    bg: "#6E1B22",
  },
  {
    obj: "/img/process/obj-spoon.webp",
    objClass: "right-[8%] w-[31%] md:right-[10%] md:w-[21%]",
    num: "03",
    tilt: -0.4,
    bg: "#47521F",
  },
  {
    obj: "/img/process/obj-crate-2.webp",
    objClass: "right-[5%] w-[42%] md:right-[6%] md:w-[28%]",
    num: "04",
    tilt: 0.6,
    bg: "#6B6355",
  },
];

export function Process() {
  const { t } = useI18n();
  const headerRef = useScrollReveal<HTMLDivElement>();
  const deckRef = useRef<HTMLDivElement>(null);

  // deck choreography: arriving tilt straightens as a card docks, a covered
  // card sinks back (scale + dim), and the object drifts on its own plane
  // (scroll parallax) — all from one rAF scroll handler.
  useEffect(() => {
    const root = deckRef.current;
    if (!root || prefersReducedMotion()) return;
    const wraps = Array.from(root.querySelectorAll<HTMLElement>("[data-deck-wrap]"));
    const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-deck-card]"));
    const objs = Array.from(root.querySelectorAll<HTMLElement>("[data-obj]"));
    let raf = 0;

    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      wraps.forEach((wrap, i) => {
        const card = cards[i];
        if (!card) return;
        // arriving: the hand-placed tilt straightens as the card docks
        // (a stuck wrap rests at its PEEK offset, not at 0)
        const top = wrap.getBoundingClientRect().top - i * PEEK;
        const arriving = Math.min(Math.max(top / (vh * 0.5), 0), 1);
        const tilt = Number(card.dataset.tilt) * arriving;
        // covered: the next card riding over pushes this one into the deck
        let cover = 0;
        const next = wraps[i + 1];
        if (next) {
          const nextTop = next.getBoundingClientRect().top - (i + 1) * PEEK;
          cover = Math.min(Math.max(1 - nextTop / vh, 0), 1);
        }
        card.style.transform = `rotate(${tilt}deg) scale(${1 - 0.05 * cover})`;
        card.style.filter = `brightness(${1 - 0.2 * cover})`;
        const obj = objs[i];
        if (obj) {
          obj.style.transform = `translateY(${(arriving * 16 - cover * 18).toFixed(1)}px)`;
        }
      });
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

  // magnetic hover: the inner wrapper leans toward the cursor (pointer
  // devices only) — the deck's own transforms live on the article, so the
  // two never fight over one style.transform.
  useEffect(() => {
    const root = deckRef.current;
    if (!root || prefersReducedMotion()) return;
    if (window.matchMedia("(hover: none)").matches) return;
    const cleanups: (() => void)[] = [];
    root.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
      gsap.set(el, { transformPerspective: 900 });
      const rx = gsap.quickTo(el, "rotationX", { duration: 0.55, ease: "power3.out" });
      const ry = gsap.quickTo(el, "rotationY", { duration: 0.55, ease: "power3.out" });
      const tx = gsap.quickTo(el, "x", { duration: 0.55, ease: "power3.out" });
      const ty = gsap.quickTo(el, "y", { duration: 0.55, ease: "power3.out" });
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        rx(-py * 3.5);
        ry(px * 4.5);
        tx(px * 10);
        ty(py * 8);
      };
      const leave = () => {
        rx(0);
        ry(0);
        tx(0);
        ty(0);
      };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      cleanups.push(() => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
      });
    });
    return () => cleanups.forEach((f) => f());
  }, []);

  return (
    <section id="process" className="relative bg-cream pt-24 md:pt-32">
      {/* 1214 = card column (1150) + the deck wrappers' px-8 gutters, so the
          header's left edge lines up with the cards at every width */}
      <div className="mx-auto max-w-[1214px] px-4 sm:px-8">
        <div ref={headerRef}>
          <div className="reveal">
            <Eyebrow>{t.process.eyebrow}</Eyebrow>
          </div>
          <h2 className="reveal mt-7 max-w-3xl font-display text-display-md font-semibold leading-[1.05] text-ink">
            {t.process.title}
          </h2>
          <p className="reveal mt-6 max-w-xl text-pretty text-ink/70 md:text-lg">
            {t.process.lede}
          </p>
        </div>
      </div>

      {/* the deck */}
      <div ref={deckRef}>
        {t.process.steps.map((s, i) => {
          const c = CARDS[i];
          if (!c) return null;
          const slack = (t.process.steps.length - 1 - i) * PEEK;
          return (
            <div
              key={i}
              data-deck-wrap
              className="sticky flex items-center justify-center px-4 sm:px-8"
              style={{
                top: i * PEEK,
                height: `calc(100vh + ${slack}px)`,
                paddingBottom: slack,
              }}
            >
              <article
                data-deck-card
                data-tilt={c.tilt}
                className="relative h-[min(78vh,700px)] w-full max-w-[1150px] origin-top will-change-transform md:h-[min(74vh,620px)]"
              >
                <div data-magnetic className="relative h-full w-full will-change-transform">
                  {/* card surface: solid brand colour + tactile noise */}
                  <div
                    aria-hidden
                    className="absolute inset-0 overflow-hidden rounded-jar"
                    style={{ backgroundColor: c.bg }}
                  >
                    <span
                      className="pointer-events-none absolute inset-0"
                      style={{ backgroundImage: NOISE, opacity: 0.09, mixBlendMode: "overlay" }}
                    />
                  </div>

                  {/* the object sits neatly on the card's right side; the
                      wrapper is a full-height flex so vertical centering
                      never competes with the parallax transform */}
                  <div
                    data-obj
                    aria-hidden
                    className={`pointer-events-none absolute inset-y-0 flex items-start pt-[9%] will-change-transform md:items-center md:pt-0 ${c.objClass}`}
                  >
                    <div className="obj-float" style={{ animationDelay: `${i * -0.9}s` }}>
                      <img
                        src={c.obj}
                        alt=""
                        draggable={false}
                        loading={i === 0 ? "eager" : "lazy"}
                        decoding="async"
                        className="h-auto w-full select-none [filter:drop-shadow(0_15px_25px_rgba(0,0,0,0.25))]"
                      />
                    </div>
                  </div>

                  {/* step copy */}
                  <div className="relative flex h-full flex-col justify-end px-7 pb-10 md:justify-center md:pb-0 md:pl-16 md:pr-[36%]">
                    <p className="eyebrow flex items-center gap-2.5 text-cream/65">
                      <SunSigil className="h-3.5 w-3.5 shrink-0 text-apricot-light" />
                      {c.num} / 04
                    </p>
                    <h3 className="mt-4 font-display text-[2.9rem] font-semibold leading-tight text-cream md:mt-5 md:text-[4rem]">
                      {s.t}
                    </h3>
                    <p className="mt-4 max-w-[26rem] text-[1.25rem] leading-relaxed text-cream/85 md:mt-6 md:max-w-[32rem] md:text-[1.45rem]">
                      {s.b}
                    </p>
                  </div>
                </div>
              </article>
            </div>
          );
        })}
        {/* rest beat: keeps the finished pile docked for a moment before
            the whole staircase rides off together */}
        <div aria-hidden className="h-[30vh]" />
      </div>
    </section>
  );
}
