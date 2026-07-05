import { useState, type FormEvent } from "react";
import { useI18n } from "../../lib/i18n";
import { Eyebrow } from "../Sun";
import { Button } from "../Button";
import { useScrollReveal } from "../../hooks/useScrollReveal";

const PHONE = "+374 94 08 00 00";
const EMAIL = "info@vilfood.am";

interface Errors {
  name?: string;
  email?: string;
  message?: string;
}

export function Contact() {
  const { t } = useI18n();
  const ref = useScrollReveal<HTMLElement>();
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  const set = (k: keyof typeof values) => (e: { target: { value: string } }) =>
    setValues((v) => ({ ...v, [k]: e.target.value }));

  const validate = (): boolean => {
    const next: Errors = {};
    if (!values.name.trim()) next.name = t.contact.errName;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = t.contact.errEmail;
    if (values.message.trim().length < 4) next.message = t.contact.errMsg;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  // POST to the serverless function (api/contact.js), which emails info@vilfood.am.
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    if (!validate()) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("send failed");
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  const fieldClass = (err?: string) =>
    `w-full rounded-2xl border bg-cream px-4 py-3.5 text-ink placeholder-ink/35 outline-none transition-colors duration-200 focus:border-pomegranate ${
      err ? "border-pomegranate" : "border-ink/15"
    }`;

  return (
    <section id="contact" ref={ref} className="relative bg-cream-deep py-24 md:py-32">
      <div className="mx-auto grid max-w-[1320px] gap-14 px-5 sm:px-8 md:grid-cols-2 md:gap-20">
        {/* left — invitation + details */}
        <div>
          <div className="reveal">
            <Eyebrow>{t.contact.eyebrow}</Eyebrow>
          </div>
          <h2 data-ink className="mt-7 font-display text-display-md font-semibold leading-[1.05] text-ink">
            {t.contact.title}
          </h2>
          <p className="reveal mt-6 max-w-md text-pretty text-ink/70 md:text-lg">
            {t.contact.lede}
          </p>

          <dl className="reveal mt-12 grid grid-cols-1 gap-x-8 gap-y-7 sm:grid-cols-2">
            <div>
              <dt className="eyebrow text-ink/45">{t.contact.addrLabel}</dt>
              <dd className="mt-2 text-ink/85">{t.contact.address}</dd>
            </div>
            <div>
              <dt className="eyebrow text-ink/45">{t.contact.dirLabel}</dt>
              <dd className="mt-2 text-ink/85">{t.contact.director}</dd>
            </div>
            <div>
              <dt className="eyebrow text-ink/45">{t.contact.phoneLabel}</dt>
              <dd className="mt-2">
                <a href={`tel:${PHONE.replace(/\s/g, "")}`} className="u-link text-ink/85">
                  {PHONE}
                </a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow text-ink/45">{t.contact.emailLabel}</dt>
              <dd className="mt-2">
                <a href={`mailto:${EMAIL}`} className="u-link text-ink/85">
                  {EMAIL}
                </a>
              </dd>
            </div>
          </dl>
        </div>

        {/* right — form */}
        <div className="reveal">
          {status === "done" ? (
            <div
              role="status"
              className="flex h-full min-h-[20rem] flex-col items-center justify-center rounded-jar border border-ink/10 bg-cream p-10 text-center"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-orchard text-2xl text-cream">
                ✓
              </div>
              <p className="max-w-xs font-display text-2xl italic text-ink">
                {t.contact.thanks}
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
              <div>
                <label htmlFor="c-name" className="eyebrow mb-2 block text-ink/55">
                  {t.contact.name}
                </label>
                <input
                  id="c-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={values.name}
                  onChange={set("name")}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "c-name-err" : undefined}
                  className={fieldClass(errors.name)}
                />
                {errors.name && (
                  <p id="c-name-err" className="mt-1.5 text-sm text-pomegranate">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="c-email" className="eyebrow mb-2 block text-ink/55">
                  {t.contact.email}
                </label>
                <input
                  id="c-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={values.email}
                  onChange={set("email")}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "c-email-err" : undefined}
                  className={fieldClass(errors.email)}
                />
                {errors.email && (
                  <p id="c-email-err" className="mt-1.5 text-sm text-pomegranate">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="c-msg" className="eyebrow mb-2 block text-ink/55">
                  {t.contact.message}
                </label>
                <textarea
                  id="c-msg"
                  name="message"
                  rows={4}
                  value={values.message}
                  onChange={set("message")}
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? "c-msg-err" : undefined}
                  className={`${fieldClass(errors.message)} resize-none`}
                />
                {errors.message && (
                  <p id="c-msg-err" className="mt-1.5 text-sm text-pomegranate">
                    {errors.message}
                  </p>
                )}
              </div>

              {status === "error" && (
                <p role="alert" className="text-sm text-pomegranate">
                  {t.contact.errSend}
                </p>
              )}
              <Button type="submit" magnetic={false} className="mt-1 self-start">
                {status === "sending" ? t.contact.sending : t.contact.send}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
