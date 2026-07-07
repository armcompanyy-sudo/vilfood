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
      className="relative overflow-hidden bg-ink py-20 text-cream md:py-36"
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
        <h2 className="reveal mx-auto mt-6 max-w-3xl font-display text-[2.15rem] font-semibold leading-[1.08] text-cream md:mt-7 md:text-display-md md:leading-[1.05]">{t.quality.title}</h2>
        <p className="reveal mx-auto mt-5 max-w-[19rem] text-pretty text-[0.95rem] leading-[1.65] text-cream/75 sm:max-w-2xl sm:text-lg sm:leading-relaxed md:mt-8">
          {t.quality.body}
        </p>

        <ul className="reveal mx-auto mt-9 flex max-w-[19rem] flex-col items-stretch justify-center gap-2.5 sm:mt-14 sm:max-w-3xl sm:flex-row sm:gap-5">
          {t.quality.points.map((p) => (
            <li
              key={p}
              className="flex flex-1 items-center gap-3 rounded-2xl border border-cream/15 px-5 py-3.5 text-left text-[0.9rem] font-medium leading-snug text-cream/85 sm:justify-center sm:rounded-full sm:px-5 sm:py-4 sm:text-center sm:text-sm"
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
