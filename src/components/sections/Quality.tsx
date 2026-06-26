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
      className="relative overflow-hidden bg-ink py-28 text-cream md:py-36"
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
      <div className="relative mx-auto max-w-[1100px] px-5 text-center sm:px-8">
        <div className="reveal flex justify-center">
          <Eyebrow tone="cream">{t.quality.eyebrow}</Eyebrow>
        </div>
        <h2 className="reveal mx-auto mt-7 max-w-3xl font-display text-display-md font-semibold leading-[1.05] text-cream">
          {t.quality.title}
        </h2>
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
