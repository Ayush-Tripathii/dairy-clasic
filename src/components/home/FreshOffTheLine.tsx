"use client";

import Image from "next/image";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap, useGSAP } from "@/lib/gsap";
import { MQ } from "@/lib/motion";
import { pad2, productHref, products } from "@/lib/catalog";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { Arrow } from "@/components/ui/TextRollButton";

const fresh = products.filter((p) => p.isNew);
const tints = ["var(--tint-sticks)", "var(--tint-cones)", "var(--tint-cassatta)", "var(--tint-biscuit)", "var(--tint-cups)"];

/** §7 — desktop: pinned horizontal scroll with a progress bar. Mobile: native swipe carousel. */
export function FreshOffTheLine() {
  const t = useTranslations("fresh");
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        // Sticks float and tilt, each at its own pace.
        q<HTMLElement>("[data-stick]").forEach((el, i) => {
          gsap.fromTo(
            el,
            { y: -8, rotation: -3 },
            { y: 8, rotation: 3, duration: 2.6 + i * 0.35, ease: "sine.inOut", yoyo: true, repeat: -1, delay: i * 0.2 },
          );
        });
      });

      mm.add(MQ.motion, () => {
        const track = q<HTMLElement>("[data-track]")[0];
        const pinEl = q<HTMLElement>("[data-pin]")[0];
        const progressEl = q<HTMLElement>("[data-progress]")[0];
        if (!track || !pinEl) return;

        const distance = () => track.scrollWidth - track.clientWidth;

        // Single unified pin timeline for both mobile and desktop
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            pin: pinEl,
            start: "top top",
            end: () => `+=${Math.max(distance(), 600)}`,
            scrub: 0.5,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.to(
          track,
          {
            x: () => -distance(),
            ease: "none",
          },
          0,
        );

        if (progressEl) {
          tl.fromTo(
            progressEl,
            { scaleX: 0 },
            { scaleX: 1, ease: "none" },
            0,
          );
        }

        // Animate badges on section reveal
        gsap.from(q("[data-badge]"), {
          scale: 0,
          rotation: -25,
          duration: 0.6,
          stagger: 0.08,
          ease: "back.out(2.2)",
          scrollTrigger: {
            trigger: root.current,
            start: "top 70%",
            once: true,
          },
        });
      });
    },
    { scope: root },
  );

  const scrollPrev = () => {
    const track = root.current?.querySelector<HTMLElement>("[data-track]");
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-card]");
    const width = card ? card.offsetWidth + 20 : 320;
    track.scrollBy({ left: -width, behavior: "smooth" });
  };

  const scrollNext = () => {
    const track = root.current?.querySelector<HTMLElement>("[data-track]");
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-card]");
    const width = card ? card.offsetWidth + 20 : 320;
    track.scrollBy({ left: width, behavior: "smooth" });
  };

  return (
    <section ref={root} aria-labelledby="fresh-title" className="bg-bg">
      <div data-pin className="flex min-h-[100svh] flex-col justify-center gap-6 sm:gap-8 overflow-hidden py-16 sm:py-24 wide:h-[100svh] wide:py-0 wide:pt-[calc(var(--header-h)*0.6)]">
        <div className="container-x flex flex-wrap items-end justify-between gap-4 sm:gap-6">
          <div>
            <p className="eyebrow">{t("eyebrow")}</p>
            <SplitReveal id="fresh-title" className="h2 mt-3 sm:mt-4">
              {t("title")}
            </SplitReveal>
          </div>
          <div className="flex items-center gap-3">
            <p className="max-w-xs text-xs sm:text-sm text-muted hidden sm:block">{t("sub")}</p>
            {/* Mobile / Desktop Manual Slide Controls */}
            <div className="flex items-center gap-1.5 ml-auto">
              <button
                type="button"
                onClick={scrollPrev}
                aria-label="Previous ice cream"
                className="cursor-pointer grid size-8 sm:size-9 place-items-center rounded-full border border-line bg-white shadow-xs hover:bg-surface-2 active:scale-95 transition"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7.5 9L4.5 6L7.5 3" />
                </svg>
              </button>
              <button
                type="button"
                onClick={scrollNext}
                aria-label="Next ice cream"
                className="cursor-pointer grid size-8 sm:size-9 place-items-center rounded-full border border-line bg-white shadow-xs hover:bg-surface-2 active:scale-95 transition"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4.5 3L7.5 6L4.5 9" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <ul
          data-track
          data-lenis-prevent
          className="flex gap-4 sm:gap-5 overflow-x-auto px-[var(--gutter)] max-sm:px-6 max-sm:scroll-pl-6 pb-3 will-change-transform wide:gap-8 wide:overflow-visible [&::-webkit-scrollbar]:hidden overscroll-x-contain"
          style={{ scrollbarWidth: "none", touchAction: "pan-x" }}
        >
          {fresh.map((p, i) => (
            <li
              key={p.slug}
              data-card
              className="relative flex w-[min(80vw,360px)] shrink-0 flex-col overflow-hidden rounded-[var(--radius-lg)] p-5 sm:p-6 land:w-[min(42vw,320px)] wide:w-[min(28vw,400px)] wide:p-7"
              style={{ background: tints[i % tints.length] }}
            >
              <div className="flex items-center justify-between">
                <span className="tabular font-display text-sm font-semibold text-muted">
                  {pad2(i + 1)} / {pad2(fresh.length)}
                </span>
                <span data-badge className="rounded-full bg-accent-ink px-3 py-1 font-display text-xs font-bold tracking-wider text-white uppercase">
                  {t("new")}
                </span>
              </div>
              <div className="relative my-4 sm:my-5 aspect-[5/6] land:aspect-[4/3] wide:aspect-auto wide:h-[clamp(180px,34vh,340px)]">
                <div data-stick className="absolute inset-0">
                  <Image src={p.image!} alt={p.name} fill sizes="(min-width: 768px) 28vw, 70vw" className="object-contain drop-shadow-[0_26px_26px_rgb(104_47_38/0.25)]" />
                </div>
              </div>
              <h3 className="font-display text-[clamp(1.35rem,2vw,1.85rem)] leading-none font-extrabold tracking-[-0.03em] text-primary uppercase">{p.name}</h3>
              {p.description && <p className="mt-2.5 sm:mt-3 line-clamp-3 text-[0.92rem] leading-snug text-primary/80">{p.description}</p>}
              <TransitionLink href={productHref(p)} className="group mt-auto inline-flex items-center gap-2 pt-4 sm:pt-5 font-display text-sm font-semibold text-primary">
                <span className="link-draw">{t("view")}</span>
                <span className="sr-only">{p.name}</span>
                <Arrow className="transition-transform duration-300 ease-soft group-hover:translate-x-1" />
              </TransitionLink>
            </li>
          ))}
        </ul>

        <div className="container-x">
          <div className="h-[3px] w-full overflow-hidden rounded-full bg-primary/10">
            <div data-progress className="h-full w-full origin-left bg-primary" />
          </div>
        </div>
      </div>
    </section>
  );
}
