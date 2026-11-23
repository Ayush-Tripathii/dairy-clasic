"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Reveal } from "@/components/motion/Reveal";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { Arrow } from "@/components/ui/TextRollButton";

type BlogPost = {
  slug: string;
  image: string;
  imageAlt: string;
};

const POSTS: BlogPost[] = [
  {
    slug: "fresh-milk-process",
    image: "/images/story/factory.webp",
    imageAlt: "Dairy Classic modern ice cream plant in Tashkent",
  },
  {
    slug: "chocolate-crunch-secret",
    image: "/images/scenes/creamica-burst.webp",
    imageAlt: "Creamy chocolate ice cream ingredients and toppings",
  },
  {
    slug: "thirty-years-tashkent",
    image: "/images/story/founder.webp",
    imageAlt: "Dairy Classic 30 years heritage in Uzbekistan",
  },
];

/** §7 — Blog & Stories section with article cards and responsive mobile swipe */
export function Blog() {
  const t = useTranslations("blog");

  return (
    <section aria-labelledby="blog-title" className="overflow-clip bg-bg py-20 md:py-28">
      <div className="container-x">
        {/* Section Header */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">{t("eyebrow")}</p>
            <SplitReveal id="blog-title" className="h2 mt-4 max-w-[20ch]">
              {t("title")}
            </SplitReveal>
          </div>
          <TransitionLink href="/blog" className="group inline-flex items-center gap-2 font-display font-semibold text-primary">
            <span className="link-draw">{t("all")}</span>
            <Arrow className="transition-transform duration-300 ease-soft group-hover:translate-x-1" />
          </TransitionLink>
        </div>

        {/* Blog Cards Grid */}
        <Reveal className="mt-12">
          <div
            data-reveal
            className="grid gap-6 max-sm:-mx-4 max-sm:snap-x max-sm:snap-mandatory max-sm:auto-cols-[85%] max-sm:grid-flow-col max-sm:overflow-x-auto max-sm:px-4 max-sm:pb-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {POSTS.map((post) => (
              <article
                key={post.slug}
                className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border border-line/60 bg-white shadow-xs transition-[transform,box-shadow] duration-500 ease-soft hover:-translate-y-1.5 hover:shadow-[var(--shadow-md)] max-sm:snap-start"
              >
                <TransitionLink href="/our-story" className="flex h-full flex-col">
                  {/* Article Image Container */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface">
                    <Image
                      src={post.image}
                      alt={post.imageAlt}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 85vw"
                      className="object-cover transition-transform duration-700 ease-soft group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>

                  {/* Article Content */}
                  <div className="flex flex-1 flex-col p-6 md:p-7">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="rounded-full bg-surface px-2.5 py-1 font-display font-semibold text-accent-ink">
                        {t(`items.${post.slug}.tag`)}
                      </span>
                      <span className="text-muted">·</span>
                      <span className="text-muted">{t(`items.${post.slug}.readTime`)}</span>
                    </div>

                    <h3 className="mt-3.5 font-display text-lg font-bold leading-snug tracking-[-0.02em] text-primary transition-colors duration-300 ease-soft group-hover:text-accent md:text-xl">
                      {t(`items.${post.slug}.title`)}
                    </h3>

                    <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-muted">
                      {t(`items.${post.slug}.excerpt`)}
                    </p>

                    <div className="mt-auto pt-5">
                      <span className="inline-flex items-center gap-2 font-display text-xs font-semibold tracking-wider text-primary uppercase transition-colors duration-300 group-hover:text-accent">
                        <span>{t("readMore")}</span>
                        <Arrow className="transition-transform duration-300 ease-soft group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </TransitionLink>
              </article>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
