import { useEffect, useRef } from "react";
import { useI18n } from "../../lib/i18n";
import { Eyebrow, SunSigil } from "../Sun";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import { prefersReducedMotion } from "../../lib/motion";

/**
 * The process as a deck of fruit cards. Each full-screen wrapper is
 * position:sticky inside the shared deck, so a docked card stays pinned to
 * the viewport while the next one rides in and covers it (native scroll,
 * no pinning). The wrappers must be the sticky elements themselves — a
 * sticky card inside its own wrapper gets carried away with it and the
 * cards never overlap. Each card docks PEEK px lower than the previous
 * one, so the top edge of every covered card stays visible above the
 * current one — the deck reads as a physical stack. A light rAF scroll
 * layer adds the hand-made feel: cards arrive with a slight tilt that
 * straightens as they dock, and covered cards sink back (scale + dim,
 * origin-top so the shrink never swallows the peeking edge).
 *
 * One fruit per step, lithograph artwork on the card's own deep colour;
 * the text panel's gradient starts at the artwork's edge colour so the
 * two halves read as one printed card.
 */
/** How much of each covered card's top edge stays visible, px. */
const PEEK = 16;

const CARDS = [
  { img: "/img/process/apricot.webp", num: "01", tilt: -0.6, from: "#AC6315", to: "#945512" },
  { img: "/img/process/cherry.webp", num: "02", tilt: 0.5, from: "#711B22", to: "#61171E" },
  { img: "/img/process/plum.webp", num: "03", tilt: -0.4, from: "#4C2132", to: "#411C2B" },
  { img: "/img/process/grape.webp", num: "04", tilt: 0.6, from: "#3C4821", to: "#343D1C" },
];

export function Process() {
  const { t } = useI18n();
  const headerRef = useScrollReveal<HTMLDivElement>();
  const deckRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = deckRef.current;
    if (!root || prefersReducedMotion()) return;
    const wraps = Array.from(root.querySelectorAll<HTMLElement>("[data-deck-wrap]"));
    const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-deck-card]"));
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

  return (
    <section id="process" className="relative bg-cream pt-24 md:pt-32">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
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
          return (
            <div
              key={i}
              data-deck-wrap
              className="sticky flex h-screen items-center justify-center px-4 sm:px-8"
              style={{ top: i * PEEK }}
            >
                <article
                  data-deck-card
                  data-tilt={c.tilt}
                  className="grid h-[min(78vh,700px)] w-full max-w-[1150px] origin-top grid-rows-[44%_1fr] overflow-hidden rounded-jar shadow-warm-lg will-change-transform md:h-[min(74vh,620px)] md:grid-cols-[54%_46%] md:grid-rows-none"
                  style={{ backgroundColor: c.from }}
                >
                  {/* fruit lithograph */}
                  <div className="relative overflow-hidden">
                    <img
                      src={c.img}
                      alt=""
                      aria-hidden
                      loading={i === 0 ? "eager" : "lazy"}
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                    <span
                      aria-hidden
                      className="absolute -bottom-[0.16em] left-5 font-display text-[6rem] font-semibold leading-none text-cream/[0.13] md:left-7 md:text-[11.5rem]"
                    >
                      {c.num}
                    </span>
                  </div>

                  {/* step copy */}
                  <div
                    className="relative flex flex-col justify-center px-7 py-7 md:px-16"
                    style={{
                      background: `linear-gradient(115deg, ${c.from} 0%, ${c.to} 100%)`,
                    }}
                  >
                    <p className="eyebrow flex items-center gap-2.5 text-cream/65">
                      <SunSigil className="h-3.5 w-3.5 shrink-0 text-apricot-light" />
                      {c.num} / 04 · {s.f}
                    </p>
                    <h3 className="mt-4 font-display text-3xl font-semibold leading-tight text-cream md:mt-5 md:text-[2.75rem]">
                      {s.t}
                    </h3>
                    <p className="mt-4 max-w-[24rem] text-[0.95rem] leading-relaxed text-cream/80 md:mt-5 md:text-[1.05rem]">
                      {s.b}
                    </p>
                    <span aria-hidden className="absolute right-7 top-6 h-px w-11 bg-cream/30" />
                  </div>
                </article>
            </div>
          );
        })}
      </div>
    </section>
  );
}
