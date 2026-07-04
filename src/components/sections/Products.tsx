import { useEffect, useRef, useState } from "react";
import { useI18n } from "../../lib/i18n";
import { Eyebrow } from "../Sun";
import { Button } from "../Button";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import { gsap, ScrollTrigger, EASE, prefersReducedMotion } from "../../lib/motion";
import { getLenis, scrollToId } from "../../lib/SmoothScroll";
import {
  PRODUCTS,
  PRODUCT_CATEGORIES,
  type CatalogueProduct,
} from "../../lib/products";

type ST = InstanceType<typeof ScrollTrigger>;

/* Shelf geometry (px from the bottom of the shelf area). */
const BASELINE = 88; // where jars stand
const PLANK_H = 16;

/** Display height: bigger volumes read as bigger jars on the shelf. */
function jarHeight(vol: string): number {
  const max = Math.max(...vol.split("/").map((v) => parseInt(v, 10) || 0), 0);
  if (max >= 900) return 300;
  if (max >= 700) return 264;
  if (max >= 450) return 236;
  return 198;
}

const GROUPS = PRODUCT_CATEGORIES.map((cat) => ({
  cat,
  items: PRODUCTS.filter((p) => p.category === cat),
}));

export function Products() {
  const { t, locale } = useI18n();
  const headerRef = useScrollReveal<HTMLDivElement>();

  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const stRef = useRef<ST | null>(null);

  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const [selected, setSelected] = useState<CatalogueProduct | null>(null);

  // Enhanced = pinned horizontal scrub (desktop pointers, motion allowed).
  // Otherwise the shelf is a native horizontal scroller — same look, no pin.
  const [enhanced, setEnhanced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setEnhanced(mq.matches && !prefersReducedMotion());
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  /* ---- pinned horizontal scroll (desktop) ---- */
  useEffect(() => {
    if (!enhanced) return;
    const section = sectionRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!section || !viewport || !track) return;

    const groups = Array.from(track.querySelectorAll<HTMLElement>("[data-group]"));
    const dist = () => Math.max(1, track.scrollWidth - viewport.clientWidth);

    const ctx = gsap.context(() => {
      const tween = gsap.to(track, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => "+=" + dist(),
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate(self) {
            if (progressRef.current)
              gsap.set(progressRef.current, { scaleX: self.progress });
            const x = self.progress * dist();
            let idx = 0;
            groups.forEach((g, i) => {
              if (g.offsetLeft - viewport.clientWidth * 0.35 <= x) idx = i;
            });
            if (idx !== activeRef.current) {
              activeRef.current = idx;
              setActive(idx);
            }
          },
        },
      });
      stRef.current = (tween.scrollTrigger as ST) ?? null;

      // jars settle onto the plank as they enter from the right
      track.querySelectorAll<HTMLElement>("[data-jar]").forEach((el) => {
        gsap.from(el, {
          y: 26,
          rotation: 2.5,
          duration: 0.7,
          ease: EASE,
          scrollTrigger: {
            containerAnimation: tween,
            trigger: el,
            start: "left 98%",
          },
        });
      });
    }, section);

    // jar images size the track — refresh measurements once they've loaded
    const imgs = Array.from(track.querySelectorAll("img"));
    let left = imgs.filter((i) => !i.complete).length;
    const onLoad = () => {
      if (--left <= 0) ScrollTrigger.refresh();
    };
    imgs.forEach((i) => !i.complete && i.addEventListener("load", onLoad, { once: true }));

    return () => {
      ctx.revert();
      stRef.current = null;
      imgs.forEach((i) => i.removeEventListener("load", onLoad));
    };
  }, [enhanced]);

  /* ---- active tab on the native scroller (mobile / reduced motion) ---- */
  useEffect(() => {
    if (enhanced) return;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;
    const groups = Array.from(track.querySelectorAll<HTMLElement>("[data-group]"));
    const onScroll = () => {
      let idx = 0;
      groups.forEach((g, i) => {
        if (g.offsetLeft - 90 <= viewport.scrollLeft) idx = i;
      });
      if (idx !== activeRef.current) {
        activeRef.current = idx;
        setActive(idx);
      }
    };
    viewport.addEventListener("scroll", onScroll, { passive: true });
    return () => viewport.removeEventListener("scroll", onScroll);
  }, [enhanced]);

  /* ---- category tabs jump along the shelf ---- */
  const goCat = (i: number) => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    const group = track?.querySelectorAll<HTMLElement>("[data-group]")[i];
    if (!track || !viewport || !group) return;
    if (enhanced && stRef.current) {
      const st = stRef.current;
      const dist = Math.max(1, track.scrollWidth - viewport.clientWidth);
      const targetX = gsap.utils.clamp(0, dist, group.offsetLeft - 48);
      const y = st.start + (targetX / dist) * (st.end - st.start);
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(y, { duration: 1.4 });
      else window.scrollTo({ top: y, behavior: "smooth" });
    } else {
      viewport.scrollTo({ left: group.offsetLeft - 24, behavior: "smooth" });
    }
  };

  /* ---- drag the shelf directly (desktop; wheel still works) ---- */
  const drag = useRef({ on: false, startX: 0, lastX: 0, lastT: 0, v: 0, moved: 0, from: 0 });
  const onPointerDown = (e: React.PointerEvent) => {
    if (!enhanced || !stRef.current || e.pointerType === "touch") return;
    const d = drag.current;
    d.on = true;
    d.startX = d.lastX = e.clientX;
    d.lastT = performance.now();
    d.v = 0;
    d.moved = 0;
    d.from = getLenis()?.scroll ?? window.scrollY;
    viewportRef.current?.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    const st = stRef.current;
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!d.on || !st || !track || !viewport) return;
    const dx = e.clientX - d.startX;
    d.moved = Math.max(d.moved, Math.abs(dx));
    const now = performance.now();
    d.v = 0.8 * d.v + (0.2 * (e.clientX - d.lastX)) / Math.max(1, now - d.lastT);
    d.lastX = e.clientX;
    d.lastT = now;
    const ratio = (st.end - st.start) / Math.max(1, track.scrollWidth - viewport.clientWidth);
    const target = gsap.utils.clamp(st.start, st.end, d.from - dx * ratio);
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(target, { immediate: true });
    else window.scrollTo(0, target);
  };
  const onPointerUp = () => {
    const d = drag.current;
    const st = stRef.current;
    if (!d.on || !st) return;
    d.on = false;
    const fling = d.v * 260; // px of momentum from release velocity
    if (Math.abs(fling) > 40) {
      const cur = getLenis()?.scroll ?? window.scrollY;
      const target = gsap.utils.clamp(st.start, st.end, cur - fling);
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(target, { duration: 1.1 });
      else window.scrollTo({ top: target, behavior: "smooth" });
    }
  };
  const openJar = (p: CatalogueProduct) => {
    if (drag.current.moved > 8) return; // it was a drag, not a click
    setSelected(p);
  };

  return (
    <section
      id="products"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#241B13] text-cream"
    >
      {/* cellar ambience: warm vignette + a soft spotlight over the shelf */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 0%, #2E241B 0%, #241B13 55%, #1D150E 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 45% at 50% 46%, rgba(232,161,75,0.11), transparent 70%)",
        }}
      />

      <div className="relative flex flex-col md:h-screen">
        {/* header */}
        <div
          ref={headerRef}
          className="mx-auto w-full max-w-[1320px] px-5 pt-24 sm:px-8 md:pt-[5.5rem]"
        >
          <div className="reveal">
            <Eyebrow>{t.products.eyebrow}</Eyebrow>
          </div>
          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <h2 className="reveal max-w-2xl font-display text-display-md font-semibold leading-[1.05] text-cream">
              {t.products.title}
            </h2>
            <p className="reveal max-w-sm text-pretty text-cream/65 md:text-right">
              {t.products.intro}
            </p>
          </div>
        </div>

        {/* shelf */}
        <div className="relative mt-6 h-[420px] md:mt-0 md:h-auto md:flex-1">
          {/* plank — fixed in the stage; the jars glide along it */}
          <div
            aria-hidden
            className="absolute inset-x-0 z-0"
            style={{
              bottom: BASELINE - PLANK_H,
              height: PLANK_H,
              background: "linear-gradient(#7C5E40 0%, #5B432D 45%, #3C2B1C 100%)",
              boxShadow:
                "inset 0 1px 0 rgba(255,215,160,0.28), 0 20px 32px -8px rgba(0,0,0,0.6)",
            }}
          />
          <div
            aria-hidden
            className="absolute inset-x-0 z-0 opacity-70 blur-lg"
            style={{
              bottom: BASELINE - PLANK_H - 30,
              height: 30,
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)",
            }}
          />

          {/* viewport */}
          <div
            ref={viewportRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            className={`relative z-10 h-full select-none ${
              enhanced
                ? "overflow-visible cursor-grab active:cursor-grabbing"
                : "no-scrollbar overflow-x-auto overflow-y-hidden"
            }`}
          >
            <div
              ref={trackRef}
              className="flex h-full w-max items-end gap-8 pl-5 pr-16 [--jar-scale:0.68] sm:pl-8 md:gap-11 md:pl-[max(2rem,calc((100vw-1320px)/2+2rem))] md:pr-[18vw] md:[--jar-scale:1]"
              style={{ paddingBottom: BASELINE }}
            >
              {GROUPS.map(({ cat, items }, gi) => (
                <div
                  key={cat}
                  data-group
                  className="relative flex shrink-0 items-end gap-8 md:gap-11"
                >
                  {/* group index chip — etched into the shadow under the plank */}
                  <span
                    className="eyebrow absolute left-1 whitespace-nowrap text-[0.62rem] text-apricot/75"
                    style={{ bottom: -52 }}
                  >
                    {String(gi + 1).padStart(2, "0")} · {t.products.cats[cat]}
                  </span>

                  {items.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      data-jar
                      onClick={() => openJar(p)}
                      aria-label={p.name[locale]}
                      className="group/jar relative shrink-0 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-apricot"
                      style={{ height: `calc(${jarHeight(p.vol)}px * var(--jar-scale))` }}
                    >
                      <img
                        src={p.img}
                        alt=""
                        draggable={false}
                        decoding="async"
                        className="h-full w-auto max-w-none select-none drop-shadow-[0_20px_26px_rgba(0,0,0,0.55)] transition-transform duration-500 ease-editorial group-hover/jar:-translate-y-3 group-hover/jar:rotate-[1.6deg] group-hover/jar:scale-[1.04]"
                      />
                      {/* grounding shadow on the plank */}
                      <span
                        aria-hidden
                        className="absolute -bottom-1.5 left-1/2 h-3 w-[68%] -translate-x-1/2 rounded-full bg-black/55 blur-md transition-all duration-500 ease-editorial group-hover/jar:scale-x-90 group-hover/jar:bg-black/35"
                      />
                      {/* name whispered on the plank face */}
                      <span className="eyebrow pointer-events-none absolute left-1/2 top-full mt-5 -translate-x-1/2 whitespace-nowrap text-[0.6rem] text-cream/0 transition-colors duration-300 group-hover/jar:text-cream/75">
                        {p.name[locale]}
                      </span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* tabs + progress */}
        <div className="mx-auto w-full max-w-[1320px] px-5 pb-9 pt-5 sm:px-8 md:pb-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {GROUPS.map(({ cat }, i) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => goCat(i)}
                  aria-pressed={active === i}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                    active === i
                      ? "bg-cream text-ink"
                      : "border border-cream/20 text-cream/60 hover:border-cream/50 hover:text-cream"
                  }`}
                >
                  {t.products.cats[cat]}
                </button>
              ))}
            </div>
            <span className="eyebrow hidden items-center gap-3 text-cream/40 md:flex">
              {t.products.hint}
              <span aria-hidden className="inline-block h-px w-10 bg-cream/35" />
              <span aria-hidden>⟶</span>
            </span>
          </div>
          {enhanced && (
            <div className="relative mt-6 hidden h-px w-full overflow-hidden bg-cream/10 md:block">
              <div
                ref={progressRef}
                className="absolute inset-0 origin-left bg-apricot/70"
                style={{ transform: "scaleX(0)" }}
              />
            </div>
          )}
        </div>
      </div>

      {selected && <JarOverlay p={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}

/* ---------------- product detail overlay ---------------- */

function JarOverlay({ p, onClose }: { p: CatalogueProduct; onClose: () => void }) {
  const { t, locale } = useI18n();
  const rootRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const closingRef = useRef(false);

  const close = () => {
    if (closingRef.current) return;
    closingRef.current = true;
    const tl = tlRef.current;
    if (tl && !prefersReducedMotion()) {
      tl.eventCallback("onReverseComplete", onClose);
      tl.timeScale(1.7).reverse();
    } else {
      onClose();
    }
  };
  const closeFn = useRef(close);
  closeFn.current = close;

  useEffect(() => {
    const lenis = getLenis();
    lenis?.stop();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeFn.current();
    window.addEventListener("keydown", onKey);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from("[data-ov-back]", { opacity: 0, duration: 0.4 })
        .from("[data-ov-jar]", { y: 48, rotation: -5, scale: 0.92, opacity: 0, duration: 0.8 }, 0.06)
        .from("[data-ov-item]", { y: 24, opacity: 0, stagger: 0.07, duration: 0.55 }, 0.2);
      tlRef.current = tl;
    }, rootRef);
    closeRef.current?.focus();

    return () => {
      ctx.revert();
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      lenis?.start();
    };
  }, []);

  const whereToBuy = () => {
    close();
    window.setTimeout(() => scrollToId("find"), 420);
  };

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label={p.name[locale]}
      className="fixed inset-0 z-[80] flex items-center justify-center p-5"
    >
      <button
        type="button"
        data-ov-back
        onClick={close}
        aria-label={t.a11y.close}
        className="absolute inset-0 cursor-default bg-[#170F09]/90 backdrop-blur-md"
      />
      <div className="relative z-10 grid w-full max-w-4xl items-center gap-8 md:grid-cols-[0.9fr_1.1fr] md:gap-12">
        <div className="relative flex items-center justify-center">
          <span
            aria-hidden
            className="absolute h-64 w-64 rounded-full opacity-90 blur-3xl md:h-80 md:w-80"
            style={{
              background:
                "radial-gradient(circle, rgba(232,161,75,0.28), transparent 70%)",
            }}
          />
          <img
            data-ov-jar
            src={p.img}
            alt={p.name[locale]}
            className="relative h-[38vh] w-auto object-contain drop-shadow-[0_44px_60px_rgba(0,0,0,0.65)] md:h-[min(52vh,460px)]"
          />
        </div>
        <div className="text-center md:text-left">
          <span data-ov-item className="eyebrow block text-apricot/85">
            {t.products.cats[p.category]}
          </span>
          <h3
            data-ov-item
            className="mt-4 text-balance font-display text-3xl font-semibold leading-tight text-cream md:text-5xl"
          >
            {p.name[locale]}
          </h3>
          <p data-ov-item className="mt-4 text-cream/60">
            {p.vol} {t.products.unit}
          </p>
          <div
            data-ov-item
            aria-hidden
            className="mx-auto mt-7 h-px w-24 bg-cream/15 md:mx-0 md:w-32"
          />
          <div
            data-ov-item
            className="mt-8 flex flex-wrap items-center justify-center gap-5 md:justify-start"
          >
            <Button onClick={whereToBuy} variant="solid" magnetic={false}>
              {t.nav.cta}
            </Button>
            <button type="button" onClick={close} className="u-link text-sm text-cream/65">
              {t.a11y.close}
            </button>
          </div>
        </div>
      </div>
      <button
        ref={closeRef}
        type="button"
        onClick={close}
        aria-label={t.a11y.close}
        className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-cream/25 text-cream transition-colors duration-300 hover:border-cream/70"
      >
        <span aria-hidden>✕</span>
      </button>
    </div>
  );
}
