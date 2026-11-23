"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { getProduct } from "@/lib/catalog";
import { recipes } from "@/lib/recipes";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Reveal } from "@/components/motion/Reveal";
import { BrandSlider } from "@/components/ui/BrandSlider";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { Arrow } from "@/components/ui/TextRollButton";

/** §8 — London Dairy-style recipe cards in a branded slider (2 up on desktop, 1 on mobile). */
export function Recipes() {
  const t = useTranslations("recipes");

  return (
    <section aria-labelledby="recipes-title" className="overflow-clip bg-bg py-24 md:py-36">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">{t("eyebrow")}</p>
            <SplitReveal id="recipes-title" className="h2 mt-4 max-w-[16ch]">
              {t("title")}
            </SplitReveal>
          </div>
          <TransitionLink href="/recipes" className="group inline-flex items-center gap-2 font-display font-semibold text-primary">
            <span className="link-draw">{t("all")}</span>
            <Arrow className="transition-transform duration-300 ease-soft group-hover:translate-x-1" />
          </TransitionLink>
        </div>

        <Reveal className="mt-14">
          <BrandSlider prevLabel={t("prev")} nextLabel={t("next")}>
            {recipes.map((r) => {
              const p = getProduct(r.product)!;
              return (
                <article key={r.slug} data-reveal className="group h-full">
                  <TransitionLink href={`/recipes/${r.slug}`} draggable={false} className="block h-full">
                    {/* Plate: product on a pastel plate, London Dairy style */}
                    <div className="relative aspect-[16/9] overflow-hidden rounded-[var(--radius-lg)]" style={{ background: r.tint }}>
                      <div className="absolute top-1/2 left-1/2 aspect-square h-[84%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80 shadow-[inset_0_-14px_30px_rgb(104_47_38/0.08),var(--shadow-md)]" />
                      <div className="absolute inset-[16%] transition-transform duration-700 ease-soft group-hover:scale-[1.06]">
                        <Image src={p.image!} alt="" fill sizes="(min-width: 768px) 30vw, 70vw" className="object-contain drop-shadow-[0_22px_22px_rgb(104_47_38/0.25)]" draggable={false} />
                      </div>
                    </div>
                    <div className="mt-6 flex items-start justify-between gap-6">
                      <div>
                        <p className="font-display text-xs font-semibold tracking-[0.14em] text-accent-ink uppercase">{t(`items.${r.slug}.tags`)}</p>
                        <h3 className="mt-2 font-display text-[clamp(1.25rem,1.8vw,1.65rem)] leading-tight font-extrabold tracking-[-0.02em] text-primary">
                          {t(`items.${r.slug}.title`)}
                        </h3>
                        <p className="mt-2 line-clamp-2 max-w-[44ch] text-muted">{t(`items.${r.slug}.description`)}</p>
                      </div>
                      <span className="mt-1 grid size-11 shrink-0 place-items-center rounded-full bg-primary text-[var(--color-on-primary)] transition-transform duration-500 ease-soft group-hover:translate-x-1 group-hover:-rotate-12">
                        <Arrow />
                      </span>
                    </div>
                  </TransitionLink>
                </article>
              );
            })}
          </BrandSlider>
        </Reveal>
      </div>
    </section>
  );
}
