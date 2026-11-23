"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { MQ } from "@/lib/motion";
import { pad2 } from "@/lib/catalog";
import { useIntro } from "@/components/providers/IntroProvider";
import { Odometer } from "@/components/motion/Odometer";
import { TextRollButton } from "@/components/ui/TextRollButton";

export type BouquetProduct = {
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  image: string;
  alt: string;
};

export type BouquetSlide = {
  id: string;
  title: string;
  categorySlug: string;
  tint: string;
  summary: string;
  items: BouquetProduct[];
};

type HeroSlide = {
  id: string;
  name: string;
  badge: string;
  subtitle: string;
  image: string;
  glow: string;
};

const HERO_SLIDES: HeroSlide[] = [
  {
    id: "gold-bowl-bouquet",
    name: "Grand Bouquet Collection",
    badge: "Signature Collection",
    subtitle: "Complete bouquet of Dairy Classic cones, bars, sandwiches & family tubs.",
    image: "/images/hero/hero-gold-bowl-bouquet-nobg.png",
    glow: "rgba(184, 93, 25, 0.28)",
  },
  {
    id: "luxury-tubs-goblet",
    name: "Artisan Family Tubs & Sundae",
    badge: "Family Tubs",
    subtitle: "Belgian Chocolate, Pistachio Delight, Orange Delight & crystal sundae goblet.",
    image: "/images/hero/hero-luxury-tubs-goblet-nobg.png",
    glow: "rgba(120, 53, 15, 0.28)",
  },
  {
    id: "tubs-bars-pedestal",
    name: "Royale Tubs & Crunchy Bars",
    badge: "Dessert Pedestal",
    subtitle: "Belgian Chocolate tub, Singapore Dairy, and roasted nut bars.",
    image: "/images/hero/hero-tubs-bars-pedestal-nobg.png",
    glow: "rgba(184, 93, 25, 0.26)",
  },
  {
    id: "crystal-bowl-tubs",
    name: "Crystal Bowl & Tubs Feast",
    badge: "Artisan Sundae",
    subtitle: "Hand-scooped chocolate, mango, and pistachio in a gilded crystal bowl.",
    image: "/images/hero/hero-crystal-bowl-tubs-nobg.png",
    glow: "rgba(217, 119, 6, 0.26)",
  },
];

type Props = {
  slides?: unknown;
  lines: string[];
  copy: { eyebrow: string; sub: string; ctaPrimary: string; ctaSecondary: string; scroll: string; no: string; pause: string };
};

export function HeroClient({ lines, copy }: Props) {
  const { done } = useIntro();
  const root = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const current = HERO_SLIDES[activeIdx];
  const longest = Math.max(...lines.map((l) => l.length));

  // Fit display headline to container width
  useEffect(() => {
    const h1 = root.current?.querySelector<HTMLElement>("#hero-title");
    const box = h1?.parentElement;
    if (!h1 || !box) return;
    const fit = () => {
      h1.style.fontSize = "";
      const fs = parseFloat(getComputedStyle(h1).fontSize);
      const widest = Math.max(...Array.from(h1.querySelectorAll<HTMLElement>("[data-hero-line]"), (l) => l.offsetWidth));
      const cap = Math.min(68, window.innerWidth * 0.048);
      const floor = Math.min(32, (fs * box.clientWidth) / widest);
      const target = Math.min(cap, (fs * box.clientWidth) / widest);
      h1.style.fontSize = `${Math.max(floor, target).toFixed(2)}px`;
    };
    document.fonts.ready.then(fit);
    const ro = new ResizeObserver(fit);
    ro.observe(box);
    return () => ro.disconnect();
  }, [lines]);

  // Auto cycle every 5s unless paused
  useEffect(() => {
    if (userPaused) return;
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [userPaused]);

  // GSAP Animations
  useGSAP(
    () => {
      if (!done) return;
      const q = gsap.utils.selector(root);
      const stage = stageRef.current;
      const reduce = window.matchMedia(MQ.reduced).matches;

      gsap.set(q("[data-hide-until-anim]"), { visibility: "visible" });

      const mm = gsap.matchMedia();

      mm.add(MQ.reduced, () => {
        gsap.from(q("[data-hero-line], [data-hero-fade], [data-hero-stage]"), {
          autoAlpha: 0,
          duration: 0.4,
          ease: "none",
        });
      });

      mm.add(MQ.motion, () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.fromTo(
          q("[data-hero-line]"),
          { yPercent: 105, autoAlpha: 0, skewY: 2 },
          { yPercent: 0, autoAlpha: 1, skewY: 0, duration: 1.1, stagger: 0.12 },
          0.1
        );

        tl.fromTo(
          q("[data-hero-fade]"),
          { y: 24, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.08 },
          0.35
        );

        // Ambient gentle floating motion on stage
        if (stage) {
          gsap.to(stage, {
            y: -10,
            duration: 4.2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        }

        // Mouse 3D perspective tilt
        const onMove = (e: MouseEvent) => {
          if (!stage) return;
          const rect = root.current?.getBoundingClientRect();
          if (!rect) return;
          const nx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
          const ny = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

          gsap.to(stage, {
            rotateY: nx * 6,
            rotateX: -ny * 5,
            transformPerspective: 1000,
            duration: 0.7,
            ease: "power2.out",
            overwrite: "auto",
          });
        };

        window.addEventListener("pointermove", onMove);
        return () => window.removeEventListener("pointermove", onMove);
      });

      return () => mm.revert();
    },
    { scope: root, dependencies: [done] }
  );

  const prevSlide = useCallback(() => {
    setActiveIdx((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
  }, []);

  const nextSlide = useCallback(() => {
    setActiveIdx((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const togglePause = useCallback(() => {
    setUserPaused((p) => !p);
  }, []);

  return (
    <section
      ref={root}
      aria-labelledby="hero-title"
      className="relative flex min-h-[calc(100svh-var(--header-h))] flex-col justify-center overflow-x-clip bg-surface pt-[var(--header-h)] py-6 md:py-10"
    >
      {/* Dynamic Ambient Background Glow matched to active slide */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-[10%] lg:right-[20%] top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full blur-3xl transition-colors duration-1000 ease-soft"
        style={{
          background: `radial-gradient(circle, ${current.glow} 0%, rgba(217,119,6,0.04) 50%, transparent 70%)`,
        }}
      />

      <div className="container-x relative grid flex-1 items-center gap-8 py-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:gap-6 xl:gap-8">
        {/* Left Column: Brand Story */}
        <div className="relative z-10 max-w-xl max-lg:pt-2">
          {/* Eyebrow */}
          <div data-hero-fade data-hide-until-anim className="inline-flex items-center gap-2">
            <span className="size-2 rounded-full bg-accent animate-pulse" />
            <p className="eyebrow tracking-[0.14em] text-accent-ink font-bold">
              {copy.eyebrow}
            </p>
          </div>

          {/* Large Title */}
          <div className="fit-box mt-3 max-w-[540px] md:mt-4">
            <h1
              id="hero-title"
              data-hero-title
              data-hide-until-anim
              className="display display-fit font-extrabold tracking-[-0.03em] text-primary"
              style={{ ["--longest" as string]: longest }}
            >
              {lines.map((line, i) => (
                <span key={i} className="split-line block">
                  <span
                    data-hero-line
                    className={`inline-block whitespace-nowrap ${i === 1 ? "text-accent" : ""}`}
                  >
                    {line}
                  </span>
                </span>
              ))}
            </h1>
          </div>

          {/* Description */}
          <p
            data-hero-fade
            data-hide-until-anim
            className="mt-5 max-w-[34rem] text-base md:text-lg text-muted leading-relaxed"
          >
            {copy.sub}
          </p>

          {/* CTA Buttons */}
          <div data-hero-fade data-hide-until-anim className="mt-8 flex flex-wrap items-center gap-4">
            <TextRollButton href="/collection" label={copy.ctaPrimary} />
            <TextRollButton href="/partner" label={copy.ctaSecondary} variant="outline" />
          </div>
        </div>

        {/* Right Column: Hero Products Showcase - Shifted Left to match user's marked area */}
        <div className="relative flex flex-col items-center lg:items-start justify-center w-full lg:pl-1 xl:pl-3">
          <div
            ref={stageRef}
            data-hero-stage
            data-hide-until-anim
            className="relative w-full max-w-[360px] sm:max-w-[420px] md:max-w-[480px] lg:max-w-[520px] xl:max-w-[550px] aspect-[4/5] select-none flex items-center justify-center"
            style={{ visibility: "hidden" }}
          >
            {/* Ground shadow beneath floating pedestal */}
            <div
              aria-hidden
              className="pointer-events-none absolute bottom-4 left-1/2 h-8 w-3/4 -translate-x-1/2 rounded-[50%] bg-primary/15 blur-xl"
            />

            {/* Slides Presentation - Isolated transparent product pedestals */}
            {HERO_SLIDES.map((slide, idx) => {
              const isCurrent = idx === activeIdx;
              return (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-all duration-700 ease-soft ${
                    isCurrent
                      ? "opacity-100 scale-100 pointer-events-auto z-10"
                      : "opacity-0 scale-95 pointer-events-none z-0"
                  }`}
                >
                  <div className="relative h-full w-full">
                    <Image
                      src={slide.image}
                      alt={slide.name}
                      fill
                      priority={idx === 0}
                      sizes="(min-width: 1024px) 550px, 90vw"
                      className="object-contain object-bottom drop-shadow-[0_20px_35px_rgba(59,24,18,0.20)]"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Controls & Slide Info */}
          <div className="mt-4 flex w-full max-w-[360px] sm:max-w-[420px] md:max-w-[480px] lg:max-w-[520px] xl:max-w-[550px] items-center justify-between gap-3 px-2">
            {/* Slide title & counter */}
            <div className="min-w-0 flex-1">
              <div className="tabular flex items-baseline gap-1.5 font-display text-xs font-semibold text-muted">
                {copy.no}
                <Odometer value={activeIdx + 1} digits={2} initial={1} className="font-bold text-primary" />
                <span>/ {pad2(HERO_SLIDES.length)}</span>
              </div>
              <p className="truncate font-display text-sm font-bold text-primary mt-0.5">
                {current.name}
              </p>
            </div>

            {/* Prev / Next / Pause Controls */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous image"
                className="cursor-pointer grid size-8 place-items-center rounded-full border border-line bg-white/80 text-primary transition hover:bg-white hover:border-line-hover active:scale-95 shadow-2xs"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7.5 9L4.5 6L7.5 3" />
                </svg>
              </button>
              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next image"
                className="cursor-pointer grid size-8 place-items-center rounded-full border border-line bg-white/80 text-primary transition hover:bg-white hover:border-line-hover active:scale-95 shadow-2xs"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4.5 3L7.5 6L4.5 9" />
                </svg>
              </button>
              <button
                type="button"
                onClick={togglePause}
                aria-label={userPaused ? "Play rotation" : copy.pause}
                className="cursor-pointer grid size-8 place-items-center rounded-full border border-line bg-white/80 text-primary transition hover:bg-white hover:border-line-hover active:scale-95 shadow-2xs"
              >
                {userPaused ? (
                  <svg width="10" height="10" viewBox="0 0 12 12" aria-hidden fill="currentColor">
                    <path d="M2.5 1.5v9L10 6 2.5 1.5Z" />
                  </svg>
                ) : (
                  <svg width="10" height="10" viewBox="0 0 12 12" aria-hidden fill="currentColor">
                    <rect x="2" y="1.5" width="2.5" height="9" rx="0.75" />
                    <rect x="7.5" y="1.5" width="2.5" height="9" rx="0.75" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
