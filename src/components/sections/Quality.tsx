import { useI18n } from "../../lib/i18n";
import { Eyebrow, SunSigil } from "../Sun";
import { useScrollReveal } from "../../hooks/useScrollReveal";

export function Quality() {
  const { t } = useI18n();
  const ref = useScrollReveal<HTMLElement>();

  return (
    <section
      id="quality"
      ref={ref}
      className="relative overflow-hidden bg-ink py-24 text-cream md:py-36"
    >
      {/* warm sun-glow */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 120% at 85% 0%, rgba(232,161,75,0.22), transparent 60%)",
        }}
      />

      {/* wavy edges — layered cream waves lap over the ink like syrup */}
      {["top-0", "bottom-0 rotate-180"].map((pos) => (
        <svg
          key={pos}
          aria-hidden
          className={`absolute inset-x-0 ${pos} h-12 w-full text-cream md:h-20`}
          viewBox="0 0 1440 90"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          {/* back swell */}
          <path
            fillOpacity="0.14"
            d="M0,0 L1440,0 L1440,64 C1240,86 1080,56 880,66 C680,76 560,88 360,78 C220,71 120,80 0,72 Z"
          />
          {/* mid swell */}
          <path
            fillOpacity="0.3"
            d="M0,0 L1440,0 L1440,52 C1300,72 1210,42 1080,50 C940,58 880,76 740,68 C600,60 540,34 400,42 C280,49 180,68 0,60 Z"
          />
          {/* solid crest */}
          <path d="M0,0 L1440,0 L1440,40 C1352,55 1288,30 1180,36 C1064,43 1006,63 900,58 C788,53 744,26 620,30 C500,34 452,58 340,60 C232,62 156,40 0,48 Z" />
        </svg>
      ))}

      <div className="relative mx-auto max-w-[1100px] px-5 text-center sm:px-8">
        <div className="reveal flex justify-center">
          <Eyebrow tone="cream">{t.quality.eyebrow}</Eyebrow>
        </div>
        <h2 className="reveal mx-auto mt-7 max-w-3xl font-display text-display-md font-semibold leading-[1.05] text-cream">{t.quality.title}</h2>
        <p className="reveal mx-auto mt-8 max-w-2xl text-pretty text-lg leading-relaxed text-cream/75">
          {t.quality.body}
        </p>

        <ul className="reveal mx-auto mt-14 flex max-w-3xl flex-col items-stretch justify-center gap-3 sm:flex-row sm:gap-5">
          {t.quality.points.map((p) => (
            <li
              key={p}
              className="flex flex-1 items-center justify-center gap-2.5 rounded-full border border-cream/15 px-5 py-4 text-sm font-medium text-cream/85"
            >
              <SunSigil className="h-4 w-4 shrink-0 text-apricot" />
              {p}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
