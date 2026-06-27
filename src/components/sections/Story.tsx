import { useI18n } from "../../lib/i18n";
import { Eyebrow } from "../Sun";
import { Counter } from "../Counter";
import { useScrollReveal } from "../../hooks/useScrollReveal";

export function Story() {
  const { t } = useI18n();
  const ref = useScrollReveal<HTMLElement>();

  return (
    <section id="story" ref={ref} className="relative overflow-hidden py-24 md:py-36">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
        <div className="reveal">
          <Eyebrow>{t.story.eyebrow}</Eyebrow>
        </div>

        <div className="mt-8 grid gap-10 md:grid-cols-12 md:gap-8">
          <h2 className="reveal font-display text-display-md font-semibold leading-[1.05] text-ink md:col-span-7">
            {t.story.title}
          </h2>

          <div className="flex flex-col gap-5 self-end md:col-span-5">
            <p className="reveal text-pretty text-base leading-relaxed text-ink/75 md:text-lg">
              {t.story.p1}
            </p>
            <p className="reveal text-pretty text-base leading-relaxed text-ink/75 md:text-lg">
              {t.story.p2}
            </p>
          </div>
        </div>

        {/* stat row */}
        <div className="mt-20 grid grid-cols-1 gap-px overflow-hidden rounded-jar border border-ink/10 bg-ink/10 sm:grid-cols-3">
          {t.story.stats.map((s, i) => {
            const num = parseInt(s.n, 10);
            const isYear = num > 1900;
            return (
              <div key={i} className="reveal flex flex-col gap-2 bg-cream p-7 md:p-9">
                <span className="font-display text-5xl font-semibold text-pomegranate md:text-6xl">
                  {Number.isNaN(num) ? (
                    s.n
                  ) : (
                    <Counter value={num} from={isYear ? 1990 : 0} />
                  )}
                </span>
                <span className="eyebrow text-ink/55">{s.l}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
