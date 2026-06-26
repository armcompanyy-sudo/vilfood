import { LOCALES, useI18n } from "../lib/i18n";

export function LangToggle({ className = "" }: { className?: string }) {
  const { locale, setLocale, t } = useI18n();
  return (
    <div
      role="group"
      aria-label={t.footer.lang}
      className={`inline-flex items-center rounded-full border border-ink/15 p-0.5 ${className}`}
    >
      {LOCALES.map(({ code, label, long }) => {
        const active = code === locale;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLocale(code)}
            aria-pressed={active}
            aria-label={long}
            className={`rounded-full px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-wider transition-colors duration-300 ${
              active
                ? "bg-ink text-cream"
                : "text-ink/55 hover:text-ink"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
