"use client";

import Image from "next/image";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap, useGSAP } from "@/lib/gsap";
import { MQ } from "@/lib/motion";
import { categories, categoryCount, pad2 } from "@/lib/catalog";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { Arrow } from "@/components/ui/TextRollButton";

/** §6 — six pastel category cards: clip-path reveal, packshot parallax, lift-and-tilt hover. */
export function Collection() {
  const t = useTranslations();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.fromTo(
          q("[data-card]"),
          { clipPath: "inset(18% 8% 18% 8% round 36px)", autoAlpha: 0 },
          {
            clipPath: "inset(0% 0% 0% 0% round 36px)",
            autoAlpha: 1,
            duration: 1.2,
            stagger: 0.08,
            ease: "expo.out",
            scrollTrigger: { trigger: q("[data-grid]")[0], start: "top 80%", once: true },
          },
        );
      });
      mm.add(`${MQ.motion} and ${MQ.desktop}`, () => {
        q<HTMLElement>("[data-parallax]").forEach((el) => {
          gsap.fromTo(el, { yPercent: 8 }, { yPercent: -8, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="collection-title" className="bg-white py-24 md:py-36">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">{t("collection.eyebrow")}</p>
            <SplitReveal id="collection-title" className="h2 mt-4 max-w-xl md:max-w-2xl">
              {t("collection.title")}
            </SplitReveal>
          </div>
          <TransitionLink href="/collection" className="group inline-flex items-center gap-2 font-display font-semibold text-primary">
            <span className="link-draw">{t("collection.seeAll")}</span>
            <Arrow className="transition-transform duration-300 ease-soft group-hover:translate-x-1" />
          </TransitionLink>
        </div>

        <ul
          data-grid
          className="mt-14 grid gap-5 max-sm:-mx-4 max-sm:snap-x max-sm:snap-mandatory max-sm:auto-cols-[80%] max-sm:grid-flow-col max-sm:overflow-x-auto max-sm:px-4 max-sm:pb-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6"
        >
          {categories.map((c, i) => (
            <li key={c.slug} data-card className="max-sm:snap-start">
              <TransitionLink
                href={`/collection/${c.slug}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] p-6 transition-[transform,box-shadow] duration-500 ease-soft hover:-translate-y-1.5 hover:shadow-[var(--shadow-lg)] focus-visible:-translate-y-1.5 md:p-8"
                style={{ background: c.tint }}
              >
                {/* Tint deepens on hover */}
                <span aria-hidden className="absolute inset-0 bg-primary opacity-0 transition-opacity duration-500 ease-soft group-hover:opacity-[0.05]" />
                <span className="relative flex items-start justify-between">
                  <span className="tabular font-display text-sm font-semibold text-muted">{pad2(i + 1)}</span>
                  <span className="rounded-full bg-white/70 px-3 py-1 font-display text-xs font-semibold text-primary">
                    {t("nav.flavours", { count: categoryCount(c.slug) })}
                  </span>
                </span>
                <span className="relative my-4 block aspect-[4/3]">
                  <span data-parallax className="absolute inset-0 block">
                    <Image
                      src={c.cover}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 80vw"
                      className="object-contain drop-shadow-[0_24px_24px_rgb(104_47_38/0.22)] transition-transform duration-700 ease-soft group-hover:scale-[1.06] group-hover:-rotate-3"
                    />
                  </span>
                </span>
                <span className="relative mt-auto flex items-end justify-between gap-4">
                  <span className="min-w-0">
                    <span className="block font-display text-[clamp(1.5rem,7.5vw,1.8rem)] leading-none break-words sm:text-[clamp(1.8rem,3vw,2.6rem)] font-extrabold tracking-[-0.03em] text-primary uppercase">
                      {t(`categories.${c.slug}`)}
                    </span>
                    <span className="mt-2 block text-[0.95rem] leading-snug text-primary/80">{t(`collection.taglines.${c.slug}`)}</span>
                  </span>
                  <span className="grid size-11 shrink-0 -translate-x-3 place-items-center rounded-full bg-primary text-[var(--color-on-primary)] opacity-0 transition-[transform,opacity] duration-500 ease-soft group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 max-md:translate-x-0 max-md:opacity-100">
                    <Arrow />
                  </span>
                </span>
              </TransitionLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
