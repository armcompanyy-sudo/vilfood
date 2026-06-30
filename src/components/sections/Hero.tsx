import { useEffect, useRef } from "react";
import { useI18n } from "../../lib/i18n";
import { Button } from "../Button";
import { Eyebrow } from "../Sun";
import { gsap, prefersReducedMotion } from "../../lib/motion";

/** Headline / sub / CTAs. The line masks carry the descender-safe padding. */
function HeroCopy() {
  const { t, locale } = useI18n();
  // Armenian sets wider and its second line ("բանկայում.") is one long,
  // unbreakable word — size the headline down a step for HY so it stays on a
  // single line at every width. EN/RU keep the full display size.
  const titleSize =
    locale === "hy"
      ? "text-[clamp(2.4rem,8vw,6rem)] leading-[0.95] tracking-[-0.01em]"
      : "text-display-lg";
  return (
    <div className="max-w-[42rem]">
      <span data-hero-eyebrow className="mb-6 inline-block">
        <Eyebrow>{t.hero.eyebrow}</Eyebrow>
      </span>

      {/* Each line is masked (overflow-hidden) for the slide-up reveal. The
          pb/-mb pair extends the clip box below the tight 0.9 line-height so
          descenders + commas aren't sliced, with no change to composition. */}
      <h1 className={`font-display ${titleSize} font-semibold text-ink`}>
        <span className="block overflow-hidden pb-[0.2em] -mb-[0.2em]">
          <span data-hero-line className="block">
            {t.hero.titleA}
          </span>
        </span>
        <span className="block overflow-hidden pb-[0.2em] -mb-[0.2em]">
          <span data-hero-line className="block italic text-pomegranate">
            {t.hero.titleB}
          </span>
        </span>
      </h1>

      <p
        data-hero-sub
        className="mt-7 max-w-md text-pretty text-base font-medium leading-relaxed text-ink/80 sm:text-lg"
      >
        {t.hero.sub}
      </p>

      <div className="mt-9 flex flex-wrap items-center gap-3">
        <span data-hero-cta>
          <Button href="#products" variant="solid">
            {t.hero.cta1}
          </Button>
        </span>
        <span data-hero-cta>
          <Button href="#find" variant="outline" magnetic={false}>
            {t.hero.cta2}
          </Button>
        </span>
      </div>
    </div>
  );
}

export function Hero() {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);

  // headline entrance — unaffected by reduced motion (which skips it entirely)
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.set("[data-hero-line]", { yPercent: 130 });
      const tl = gsap.timeline({ delay: 0.15, defaults: { ease: "power4.out" } });
      tl.to("[data-hero-line]", { yPercent: 0, duration: 1.1, stagger: 0.12 })
        .from("[data-hero-eyebrow]", { opacity: 0, y: 16, duration: 0.8 }, 0.2)
        .from("[data-hero-sub]", { opacity: 0, y: 20, duration: 0.9 }, 0.5)
        .from("[data-hero-cta]", { opacity: 0, y: 20, duration: 0.8, stagger: 0.1 }, 0.7)
        .from("[data-hero-scroll]", { opacity: 0, duration: 0.8 }, 1.0);
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative flex min-h-[100svh] items-center overflow-hidden"
    >
      {/* full-bleed landscape */}
      <picture>
        <source
          type="image/webp"
          srcSet="/img/hero-1024.webp 1024w, /img/hero-1536.webp 1536w, /img/hero-2560.webp 2560w"
          sizes="100vw"
        />
        <img
          src="/img/hero-1536.jpg"
          alt={t.a11y.heroImage}
          className="absolute inset-0 -z-20 h-full w-full object-cover object-[68%_96%]"
        />
      </picture>

      {/* legibility scrims */}
      {/* desktop: cream wash on the left, landscape revealed to the right */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 hidden md:block"
        style={{
          background:
            "linear-gradient(100deg, rgba(244,237,225,0.97) 0%, rgba(244,237,225,0.9) 26%, rgba(244,237,225,0.55) 44%, rgba(244,237,225,0.12) 60%, transparent 72%)",
        }}
      />
      {/* mobile: soft overall wash so centered text stays readable */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 md:hidden"
        style={{
          background:
            "linear-gradient(180deg, rgba(244,237,225,0.78) 0%, rgba(244,237,225,0.5) 32%, rgba(244,237,225,0.72) 72%, #F4EDE1 100%)",
        }}
      />
      {/* blend into the Story section below + soften under the nav */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 -z-10 h-28"
        style={{ background: "linear-gradient(to bottom, transparent, #F4EDE1)" }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-24"
        style={{ background: "linear-gradient(to bottom, rgba(244,237,225,0.7), transparent)" }}
      />

      {/* copy */}
      <div className="mx-auto w-full max-w-[1320px] px-5 sm:px-8">
        <HeroCopy />
      </div>

      {/* scroll hint */}
      <div
        data-hero-scroll
        className="absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-ink/55"
      >
        <span className="eyebrow">{t.hero.scroll}</span>
        <span className="h-9 w-px animate-sun-drift bg-ink/35" />
      </div>
    </section>
  );
}
