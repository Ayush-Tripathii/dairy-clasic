"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap, useGSAP } from "@/lib/gsap";
import { MQ } from "@/lib/motion";
import { site } from "@/lib/site";
import { UZ_CITIES, UZ_PATH, UZ_VIEWBOX } from "@/lib/uzbekistan-map";
import { CountUp } from "@/components/motion/CountUp";
import { OutlineFillHeading } from "@/components/motion/OutlineFillHeading";
import { Reveal } from "@/components/motion/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { TextRollButton } from "@/components/ui/TextRollButton";
import { WhatsAppGlyph } from "@/components/layout/WhatsAppFab";

const { tashkent: T, samarkand: S } = UZ_CITIES;
// Gentle arc between the two cities.
const route = `M${T.x} ${T.y} Q${(T.x + S.x) / 2 + 20} ${Math.min(T.y, S.y) - 70} ${S.x} ${S.y}`;

/** §9 — wholesale pitch with count-up stats, a self-drawing map of Uzbekistan, and the closing CTA. */
export function PartnerContact() {
  const t = useTranslations("partner");
  const root = useRef<HTMLElement>(null);
  const titleLines = t.raw("titleLines") as string[];
  const ctaLines = t.raw("ctaLines") as string[];

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap
          .timeline({ scrollTrigger: { trigger: q("[data-map]")[0], start: "top 75%", once: true } })
          .fromTo(q("[data-outline]"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2.2, ease: "power2.inOut" })
          .fromTo(q("[data-fill]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 }, 1.4)
          .fromTo(q("[data-mappin]"), { y: -60, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.18, ease: "bounce.out" }, 1.6)
          .fromTo(q("[data-route-mask]"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.2, ease: "power2.inOut" }, 2.2)
          .fromTo(q("[data-city]"), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.12 }, 2.1)
          .add(() => root.current?.querySelectorAll("[data-pulse]").forEach((el) => el.classList.add("map-pulse")));
      });
      mm.add(MQ.reduced, () => {
        gsap.set(q("[data-outline], [data-route-mask]"), { strokeDashoffset: 0 });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="partner-title" className="bg-white">
      <div className="container-x grid grid-cols-[minmax(0,1fr)] items-center gap-16 py-24 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:py-36">
        {/* Pitch */}
        <div>
          <p className="eyebrow">{t("eyebrow")}</p>
          <SplitReveal id="partner-title" className="mt-4 font-display text-[clamp(1.75rem,3.2vw,2.75rem)] leading-[1.05] font-extrabold tracking-[-0.03em] text-primary uppercase">
            {titleLines.map((l, i) => (
              <span key={i} className={`block ${i === 1 ? "text-accent" : ""}`}>
                {l}
              </span>
            ))}
          </SplitReveal>
          <Reveal className="mt-8">
            <p data-reveal className="max-w-md text-muted">{t("body")}</p>
            <dl data-reveal className="mt-10 grid grid-cols-[repeat(3,minmax(0,1fr))] gap-4 border-y max-[359px]:grid-cols-2 [&_dd]:[overflow-wrap:anywhere] border-line py-8">
              <div>
                <dt className="sr-only">{t("statDaily")}</dt>
                <dd className="font-display text-[clamp(1.05rem,2.3vw,2.2rem)] leading-none whitespace-nowrap font-extrabold text-primary">
                  <CountUp to={80000} group suffix=" L" />
                </dd>
                <dd aria-hidden className="mt-2 text-sm leading-snug text-muted">{t("statDaily")}</dd>
              </div>
              <div>
                <dt className="sr-only">{t("statSince")}</dt>
                <dd className="font-display text-[clamp(1.05rem,2.3vw,2.2rem)] leading-none whitespace-nowrap font-extrabold text-primary">
                  <CountUp to={1996} from={1900} pad={4} />
                </dd>
                <dd aria-hidden className="mt-2 text-sm leading-snug text-muted">{t("statSince")}</dd>
              </div>
              <div>
                <dt className="sr-only">{t("statFirst")}</dt>
                <dd className="font-display text-[clamp(1.05rem,2.3vw,2.2rem)] leading-none whitespace-nowrap font-extrabold text-accent-ink">
                  <CountUp to={1} prefix="#" duration={1.2} />
                </dd>
                <dd aria-hidden className="mt-2 text-sm leading-snug text-muted">{t("statFirst")}</dd>
              </div>
            </dl>
            <div data-reveal className="mt-10">
              <TextRollButton href="/partner" label={t("cta")} />
            </div>
          </Reveal>
        </div>

        {/* Map */}
        <figure data-map className="relative">
          <svg viewBox={UZ_VIEWBOX} role="img" aria-label={t("mapLabel")} className="h-auto w-full overflow-visible">
            <defs>
              <mask id="route-mask" maskUnits="userSpaceOnUse">
                <path data-route-mask d={route} pathLength={1} strokeDasharray="1" strokeDashoffset="1" stroke="#fff" strokeWidth="10" fill="none" />
              </mask>
            </defs>
            <path data-fill d={UZ_PATH} fill="var(--color-surface)" />
            <path
              data-outline
              d={UZ_PATH}
              pathLength={1}
              strokeDasharray="1"
              strokeDashoffset="1"
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="2"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
            <path d={route} mask="url(#route-mask)" fill="none" stroke="var(--color-accent-ink)" strokeWidth="3" strokeDasharray="2 12" strokeLinecap="round" />
            {[
              { c: T, label: t("tashkent"), dx: 18, anchor: "start" as const },
              { c: S, label: t("samarkand"), dx: -18, anchor: "end" as const },
            ].map(({ c, label, dx, anchor }) => (
              <g key={label}>
                <circle data-pulse cx={c.x} cy={c.y} r="10" fill="var(--color-accent)" opacity="0" />
                <g data-mappin>
                  <path
                    d={`M${c.x} ${c.y} c-4 -10 -16 -16 -16 -30 a16 16 0 1 1 32 0 c0 14 -12 20 -16 30Z`}
                    fill="var(--color-accent-ink)"
                    stroke="#fff"
                    strokeWidth="2.5"
                  />
                  <circle cx={c.x} cy={c.y - 30} r="6" fill="#fff" />
                </g>
                <text
                  data-city
                  x={c.x + dx}
                  y={c.y + 34}
                  textAnchor={anchor}
                  className="font-display"
                  fontSize="26"
                  fontWeight="700"
                  fill="var(--color-primary)"
                >
                  {label}
                </text>
              </g>
            ))}
          </svg>
        </figure>
      </div>

      {/* Closing CTA */}
      <div className="bg-bg py-24 text-center md:py-36">
        <div className="container-x flex flex-col items-center">
          <OutlineFillHeading className="font-display text-[clamp(1.85rem,4.2vw,3.5rem)] leading-[1.02] font-extrabold tracking-[-0.03em] text-primary uppercase" strokeWidth="1.5px">
            {ctaLines.map((l, i) => (
              <span key={i} className="block">
                {l}
              </span>
            ))}
          </OutlineFillHeading>
          <Reveal className="mt-8 flex flex-col items-center gap-8">
            <p data-reveal className="max-w-lg text-muted">{t("ctaSub")}</p>
            <div data-reveal className="flex flex-wrap justify-center gap-3">
              <TextRollButton href="/contact" label={t("contact")} />
              <TextRollButton
                href={site.whatsapp[0].href}
                external
                label={t("whatsapp")}
                variant="outline"
                arrow={false}
                icon={<WhatsAppGlyph className="h-5 w-5" />}
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
