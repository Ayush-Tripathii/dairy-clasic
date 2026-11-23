"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const labels = { en: "EN", uz: "UZ", ru: "RU" } as const;
const names = { en: "English", uz: "Oʻzbekcha", ru: "Русский" } as const;

/** EN / UZ / RU pill with a sliding indicator. Real links, so crawlers can follow them. */
export function LangSwitch({ className = "" }: { className?: string }) {
  const t = useTranslations("a11y");
  const locale = useLocale() as keyof typeof labels;
  const pathname = usePathname();
  const index = routing.locales.indexOf(locale);

  return (
    <nav aria-label={t("language")} className={className}>
      <ul className="relative inline-flex rounded-full bg-white/70 p-1 shadow-[inset_0_0_0_1px_var(--color-line)] backdrop-blur">
        <span
          aria-hidden
          className="absolute top-1 bottom-1 left-1 w-10 rounded-full bg-primary transition-transform duration-500 ease-soft"
          style={{ transform: `translateX(${index * 100}%)` }}
        />
        {routing.locales.map((l) => (
          <li key={l} className="relative">
            <Link
              href={pathname}
              locale={l}
              hrefLang={l}
              lang={l}
              aria-current={l === locale ? "true" : undefined}
              aria-label={names[l]}
              className={`flex h-8 w-10 items-center justify-center rounded-full font-display text-xs font-semibold tracking-wider transition-colors duration-300 ${
                l === locale ? "text-[var(--color-on-primary)]" : "text-primary hover:text-accent-ink"
              }`}
            >
              {labels[l]}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
