import { useState } from "react";
import { useI18n } from "../../lib/i18n";
import { Eyebrow } from "../Sun";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import { PRODUCTS, PRODUCT_CATEGORIES, type ProductCategory } from "../../lib/products";

type Filter = "all" | ProductCategory;
const TABS: Filter[] = ["all", ...PRODUCT_CATEGORIES];

export function Products() {
  const { t, locale } = useI18n();
  const ref = useScrollReveal<HTMLElement>();
  const [cat, setCat] = useState<Filter>("all");

  const items = cat === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === cat);

  return (
    <section id="products" ref={ref} className="relative bg-cream-deep py-24 md:py-32">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
        {/* header */}
        <div className="reveal">
          <Eyebrow>{t.products.eyebrow}</Eyebrow>
        </div>
        <div className="mt-7 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <h2 className="reveal max-w-2xl font-display text-display-md font-semibold leading-[1.05] text-ink">
            {t.products.title}
          </h2>
          <p className="reveal max-w-sm text-pretty text-ink/70 md:text-right">
            {t.products.intro}
          </p>
        </div>

        {/* category filter */}
        <div className="reveal mt-10 flex flex-wrap gap-2">
          {TABS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              aria-pressed={cat === c}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                cat === c
                  ? "bg-ink text-cream"
                  : "border border-ink/15 text-ink/65 hover:border-ink/40 hover:text-ink"
              }`}
            >
              {t.products.cats[c]}
            </button>
          ))}
        </div>

        {/* product grid — re-keyed per filter so it re-animates in */}
        <ul
          key={cat}
          className="mt-10 grid animate-fade-up grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-7"
        >
          {items.map((p) => (
            <li key={p.id} className="group">
              <div className="overflow-hidden rounded-2xl bg-white shadow-warm transition-all duration-500 ease-editorial group-hover:-translate-y-1.5 group-hover:shadow-warm-lg">
                <img
                  src={p.img}
                  alt={p.name[locale]}
                  loading="lazy"
                  className="aspect-[4/5] w-full object-contain p-4 transition-transform duration-500 ease-editorial group-hover:scale-[1.04]"
                />
              </div>
              <h3 className="mt-3 text-sm font-semibold leading-snug text-ink sm:text-[0.95rem]">
                {p.name[locale]}
              </h3>
              <p className="mt-1 text-xs text-ink/45">
                {p.vol} {t.products.unit}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
