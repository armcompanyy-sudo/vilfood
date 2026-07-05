import { useI18n } from "../../lib/i18n";
import { scrollToId } from "../../lib/SmoothScroll";
import { Wordmark } from "../Wordmark";
import { LangToggle } from "../LangToggle";

export function Footer() {
  const { t } = useI18n();
  const links = [
    { id: "story", label: t.nav.story },
    { id: "products", label: t.nav.products },
    { id: "process", label: t.nav.process },
    { id: "find", label: t.nav.find },
    { id: "contact", label: t.nav.contact },
  ];

  return (
    <footer className="relative overflow-hidden bg-ink pt-20 pb-10 text-cream">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, rgba(232,161,75,0.5), transparent)" }}
      />
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
        {/* closing line */}
        <p className="reveal max-w-3xl font-display text-display-sm font-semibold leading-[1.08] text-cream">{t.footer.tagline}</p>

        <div className="mt-16 flex flex-col gap-10 border-t border-cream/12 pt-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xs">
            <Wordmark variant="white" className="h-5 w-auto" loading="lazy" />
            <p className="mt-4 text-sm leading-relaxed text-cream/55">
              {t.contact.address}
              <br />
              <a href="mailto:info@vilfood.am" className="u-link">info@vilfood.am</a>
              {" · "}
              <a href="tel:+37494080000" className="u-link">+374 94 08 00 00</a>
            </p>
          </div>

          {/* nav */}
          <nav aria-label={t.a11y.footerNav} className="flex flex-col gap-3">
            {links.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId(l.id);
                }}
                className="u-link w-fit text-sm text-cream/70 hover:text-cream"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* social + lang */}
          <div className="flex flex-col gap-5">
            <div className="flex gap-3">
              {[
                { label: "Instagram", href: "https://www.instagram.com/vilfood/" },
                { label: "Facebook", href: "https://www.facebook.com/Vilfood/" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 items-center rounded-full border border-cream/20 px-4 text-xs font-medium text-cream/70 transition-colors duration-300 hover:border-cream/50 hover:text-cream"
                >
                  {s.label}
                </a>
              ))}
            </div>
            <LangToggle className="border-cream/20 [&_button]:text-cream/55 [&_button[aria-pressed='true']]:bg-cream [&_button[aria-pressed='true']]:text-ink" />
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 text-xs text-cream/40 sm:flex-row sm:items-center sm:justify-between">
          <span>{t.footer.rights}</span>
          <span className="eyebrow text-cream/30">{t.hero.badge}</span>
        </div>
      </div>
    </footer>
  );
}
