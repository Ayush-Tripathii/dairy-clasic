import { getTranslations } from "next-intl/server";
import { categories, categoryCount } from "@/lib/catalog";
import { site } from "@/lib/site";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { LangSwitch } from "./LangSwitch";

const colTitle = "mb-4 font-display text-xs font-semibold tracking-[0.18em] text-muted uppercase";
const linkCls = "link-draw text-primary";

function currentYear() {
  return new Date().getFullYear();
}

export async function Footer() {
  const t = await getTranslations();
  const year = await currentYear();

  return (
    <footer id="site-footer" className="relative overflow-clip bg-surface pt-20 pb-12 md:pb-16 text-primary">
      <div className="container-x">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.3fr_1fr]">
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="max-w-xs font-display text-xl leading-snug font-semibold">{t("footer.tagline")}</p>
            <a href={`mailto:${site.email}`} className={`${linkCls} mt-6 text-sm`}>
              {site.email}
            </a>
          </div>

          <nav aria-label={t("footer.collection")}>
            <h2 className={colTitle}>{t("footer.collection")}</h2>
            <ul className="space-y-2">
              {categories.map((c) => (
                <li key={c.slug}>
                  <TransitionLink href={`/collection/${c.slug}`} className={linkCls}>
                    {t(`categories.${c.slug}`)}
                  </TransitionLink>{" "}
                  <span className="tabular text-xs text-muted">{categoryCount(c.slug)}</span>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t("footer.company")}>
            <h2 className={colTitle}>{t("footer.company")}</h2>
            <ul className="space-y-2">
              <li><TransitionLink href="/our-story" className={linkCls}>{t("nav.story")}</TransitionLink></li>
              <li><TransitionLink href="/partner" className={linkCls}>{t("footer.wholesale")}</TransitionLink></li>
              <li><TransitionLink href="/blog" className={linkCls}>{t("nav.blog")}</TransitionLink></li>
              <li><TransitionLink href="/faqs" className={linkCls}>{t("nav.faqs")}</TransitionLink></li>
              <li><TransitionLink href="/contact" className={linkCls}>{t("nav.contact")}</TransitionLink></li>
            </ul>
          </nav>

          <div>
            <h2 className={colTitle}>{t("footer.contact")}</h2>
            <address className="space-y-2 not-italic">
              <p>
                {site.address.street}, {site.address.city}
              </p>
              <p className="tabular">
                <a href={site.phones[0].href} className={linkCls}>{site.phones[0].label}</a>
                {" / "}
                <a href={site.phones[1].href} aria-label={site.phones[1].label} className={`${linkCls} min-w-6 text-center`}>78</a>
              </p>
              <p className="tabular">
                <a href={site.phones[2].href} className={linkCls}>{site.phones[2].label}</a>
              </p>
              <p className="tabular pt-2">{t("footer.hours")}</p>
              <p className="text-sm text-muted">{t("footer.closed")}</p>
            </address>
          </div>

          <div className="flex flex-col gap-8">
            <div>
              <h2 className={colTitle}>{t("footer.socials")}</h2>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-2 lg:grid-cols-1">
                {site.socials.map((s) => (
                  <li key={s.name}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className={linkCls}>
                      {s.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className={colTitle}>{t("footer.language")}</h2>
              <LangSwitch />
            </div>
          </div>
        </div>

        <p className="mt-16 flex flex-wrap justify-between gap-2 border-t border-line pt-6 text-sm text-muted">
          <span>{t("footer.rights", { year })}</span>
          <span className="tabular">Est. {site.founded} · Tashkent</span>
        </p>
      </div>
    </footer>
  );
}
