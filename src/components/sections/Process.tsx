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
 * current one — the deck reads as a physical stack. Earlier wrappers get
 * extra height (as bottom padding, so centering is unaffected): without
 * it every wrapper clamps to the same containment limit at the deck's
 * end, the staircase collapses and the last card hides all the others as
 * the stack scrolls away. A light rAF scroll layer adds the hand-made
 * feel: cards arrive with a slight tilt that straightens as they dock,
 * and covered cards sink back (scale + dim, origin-top so the shrink
 * never swallows the peeking edge).
 *
 * One fruit per step, lithograph artwork on the card's own deep colour;
 * the text panel's gradient starts at the artwork's edge colour so the
 * two halves read as one printed card.
 */
/** How much of each covered card's top edge stays visible, px. */
const PEEK = 24;

/**
 * Video cards play a wide 16:9 Seedance clip generated from the card's own
 * lithograph (start frame = end frame, so the loop is seamless): the art
 * cell shows the clip's left window, the text panel projects the clean
 * right side of the SAME file — one codec, one canvas, no seams. `img` is
 * the clip's first frame (poster / reduced-motion still); `rate` tunes the
 * gesture's tempo without re-encoding.
 */
const CARDS: {
  img: string;
  video?: string;
  rate?: number;
  /** object-position override for the art window (subject fit vs clean seam) */
  artClass?: string;
  num: string;
  tilt: number;
  from: string;
  to: string;
}[] = [
  {
    img: "/img/process/harvest-poster-wide.webp",
    video: "/video/harvest-toss-wide.mp4",
    rate: 1.25,
    num: "01",
    tilt: -0.6,
    from: "#AD6009",
    to: "#955308",
  },
  {
    img: "/img/process/prepare-poster-wide-2.webp",
    video: "/video/prepare-cherries-wide-2.mp4",
    rate: 1.15,
    num: "02",
    tilt: 0.5,
    from: "#511C1D",
    to: "#441718",
  },
  {
    img: "/img/process/seal-poster-wide.webp",
    video: "/video/seal-press-wide.mp4",
    rate: 1.15,
    num: "03",
    tilt: -0.4,
    from: "#371A23",
    to: "#2E161D",
  },
  {
    img: "/img/process/deliver-poster-wide-2.webp",
    video: "/video/deliver-crate-wide-2.mp4",
    rate: 1.1,
    // the crate is wide: on lg+ the window fits it whole AND still ends in
    // quiet wall; below lg the pool crops at the card edge instead
    artClass: "object-[35%_55%] lg:object-[22%_55%]",
    num: "04",
    tilt: 0.6,
    from: "#403F15",
    to: "#363512",
  },
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

  // Video cards: play a card's pair of projections while that card is near
  // the viewport, pause it when it leaves; never plays for reduced motion.
  useEffect(() => {
    const root = deckRef.current;
    if (!root || prefersReducedMotion()) return;
    const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-deck-card]")).filter(
      (c) => c.querySelector("video"),
    );
    if (!cards.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          e.target.querySelectorAll<HTMLVideoElement>("video").forEach((v) => {
            if (e.isIntersecting) {
              const rate = Number(v.dataset.rate ?? 1);
              v.defaultPlaybackRate = rate;
              v.playbackRate = rate;
              v.play().catch(() => {});
            } else v.pause();
          });
        }
      },
      { rootMargin: "25% 0px" },
    );
    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
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
                  className="grid h-[min(78vh,700px)] w-full max-w-[1150px] origin-top grid-rows-[1fr_44%] overflow-hidden rounded-jar will-change-transform md:h-[min(74vh,620px)] md:grid-cols-[54%_46%] md:grid-rows-none"
                  style={{ backgroundColor: c.from }}
                >
                  {/* step lithograph — below the copy on mobile, left of it on md+ */}
                  <div className="order-last relative overflow-hidden md:order-none">
                    {c.video ? (
                      <video
                        data-rate={c.rate ?? 1}
                        src={c.video}
                        poster={c.img}
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        aria-hidden
                        className={`h-full w-full object-cover ${c.artClass ?? "object-[35%_55%]"}`}
                      />
                    ) : (
                      <img
                        src={c.img}
                        alt=""
                        aria-hidden
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>

                  {/* step copy — a video card's panel shows the same wide
                      clip's clean right side, so art and text literally share
                      one canvas and one codec: the tones cannot diverge */}
                  <div
                    className="relative flex flex-col justify-center overflow-hidden px-7 py-7 md:px-16"
                    style={
                      c.video
                        ? { backgroundColor: c.from }
                        : { background: `linear-gradient(115deg, ${c.from} 0%, ${c.to} 100%)` }
                    }
                  >
                    {c.video && (
                      <video
                        data-rate={c.rate ?? 1}
                        src={c.video}
                        poster={c.img}
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        aria-hidden
                        className="absolute -inset-px h-[calc(100%+2px)] w-[calc(100%+2px)] object-cover object-right [transform-origin:100%_12%] [transform:scale(2)] md:[transform:scale(1.7)]"
                      />
                    )}
                    <div className="relative">
                      <p className="eyebrow flex items-center gap-2.5 text-cream/65">
                        <SunSigil className="h-3.5 w-3.5 shrink-0 text-apricot-light" />
                        {c.num} / 04 · {s.f}
                      </p>
                      <h3 className="mt-4 font-display text-4xl font-semibold leading-tight text-cream md:mt-5 md:text-[3rem]">
                        {s.t}
                      </h3>
                      <p className="mt-4 max-w-[26rem] text-[1.05rem] leading-relaxed text-cream/80 md:mt-5 md:text-[1.15rem]">
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
