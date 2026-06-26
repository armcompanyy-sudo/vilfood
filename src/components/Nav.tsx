import { useEffect, useState } from "react";
import { useI18n } from "../lib/i18n";
import { scrollToId } from "../lib/SmoothScroll";
import { Wordmark } from "./Wordmark";
import { LangToggle } from "./LangToggle";
import { Button } from "./Button";

export function Nav() {
  const { t } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // lock body scroll while the mobile sheet is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const links = [
    { id: "story", label: t.nav.story },
    { id: "products", label: t.nav.products },
    { id: "process", label: t.nav.process },
    { id: "find", label: t.nav.find },
    { id: "contact", label: t.nav.contact },
  ];

  const go = (id: string) => {
    setOpen(false);
    scrollToId(id);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-editorial ${
        scrolled || open
          ? "border-b border-ink/10 bg-cream/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-[68px] max-w-[1320px] items-center justify-between gap-6 px-5 sm:px-8">
        {/* wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            scrollToId("top");
          }}
          aria-label={t.a11y.home}
          className="shrink-0"
        >
          <Wordmark variant="dark" className="h-[22px] w-auto" />
        </a>

        {/* center links (desktop) */}
        <ul className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  go(l.id);
                }}
                className="u-link text-[0.86rem] font-medium text-ink/80 hover:text-ink"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* right cluster */}
        <div className="flex items-center gap-3">
          <span className="eyebrow hidden text-ink/45 xl:inline-block">{t.nav.since}</span>
          <LangToggle className="hidden sm:inline-flex" />
          <Button href="#find" variant="solid" className="hidden px-5 py-2.5 text-sm md:inline-flex" magnetic={false}>
            {t.nav.cta}
          </Button>

          {/* mobile menu button */}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? t.a11y.menuClose : t.a11y.menuOpen}
            aria-expanded={open}
            className="relative h-10 w-10 lg:hidden"
          >
            <span
              className={`absolute left-1/2 top-1/2 h-px w-5 -translate-x-1/2 bg-ink transition-transform duration-300 ${
                open ? "rotate-45" : "-translate-y-1"
              }`}
            />
            <span
              className={`absolute left-1/2 top-1/2 h-px w-5 -translate-x-1/2 bg-ink transition-transform duration-300 ${
                open ? "-rotate-45" : "translate-y-1"
              }`}
            />
          </button>
        </div>
      </nav>

      {/* mobile sheet */}
      <div
        className={`overflow-hidden bg-cream/95 backdrop-blur-md transition-[max-height] duration-500 ease-editorial lg:hidden ${
          open ? "max-h-[80vh] border-t border-ink/10" : "max-h-0"
        }`}
      >
        <ul className="flex flex-col gap-1 px-6 py-6">
          {links.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  go(l.id);
                }}
                className="block py-3 font-display text-2xl text-ink"
              >
                {l.label}
              </a>
            </li>
          ))}
          <li className="mt-4 flex items-center justify-between">
            <LangToggle />
            <span className="eyebrow text-ink/45">{t.nav.since}</span>
          </li>
        </ul>
      </div>
    </header>
  );
}
