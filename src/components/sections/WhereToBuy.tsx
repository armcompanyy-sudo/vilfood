import { useI18n } from "../../lib/i18n";
import { Eyebrow } from "../Sun";
import { Button } from "../Button";
import { useScrollReveal } from "../../hooks/useScrollReveal";

// Armenian retail partners. Text wordmarks stand in for real logos —
// drop SVG logos into /public/img and swap the <span> for an <img>.
const RETAILERS = ["City", "Parma", "Fresh", "Yeritsyan", "Zovq", "Kaiser", "Tsiran"];

export function WhereToBuy() {
  const { t } = useI18n();
  const ref = useScrollReveal<HTMLElement>();

  return (
    <section id="find" ref={ref} className="relative bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <div className="reveal">
              <Eyebrow>{t.find.eyebrow}</Eyebrow>
            </div>
            <h2 className="reveal mt-7 max-w-2xl font-display text-display-md font-semibold leading-[1.05] text-ink">{t.find.title}</h2>
          </div>
          <p className="reveal max-w-sm text-pretty text-ink/70 md:text-right">
            {t.find.intro}
          </p>
        </div>

        {/* logo wall */}
        <ul className="reveal mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-jar border border-ink/10 bg-ink/10 sm:grid-cols-3 lg:grid-cols-4">
          {RETAILERS.map((name) => (
            <li key={name}>
              {/* wordmark tile — decorative until real logos link out */}
              <div className="group flex h-28 items-center justify-center bg-cream transition-colors duration-300 hover:bg-cream-deep md:h-32">
                <span className="font-display text-2xl font-semibold tracking-tight text-ink/35 transition-colors duration-300 group-hover:text-pomegranate md:text-3xl">
                  {name}
                </span>
              </div>
            </li>
          ))}
          {/* trailing CTA cell */}
          <li className="flex h-28 items-center justify-center bg-apricot/15 md:h-32">
            <span className="eyebrow text-apricot-deep">{t.find.more}</span>
          </li>
        </ul>

        {/* wholesale / export note */}
        <div className="reveal mt-12 flex flex-col items-start justify-between gap-5 rounded-jar bg-ink p-8 text-cream sm:flex-row sm:items-center md:p-10">
          <p className="max-w-lg font-display text-2xl italic leading-snug md:text-3xl">
            {t.find.note}
          </p>
          <Button href="#contact" variant="solid" className="shrink-0">
            {t.find.cta}
          </Button>
        </div>
      </div>
    </section>
  );
}
