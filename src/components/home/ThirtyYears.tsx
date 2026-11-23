"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { gsap, useGSAP } from "@/lib/gsap";
import { MQ } from "@/lib/motion";
import { ScrubOdometer, type ScrubOdometerHandle } from "@/components/motion/Odometer";
import { OutlineFillHeading } from "@/components/motion/OutlineFillHeading";
import { Reveal } from "@/components/motion/Reveal";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { Arrow } from "@/components/ui/TextRollButton";

const FIRST = 1996;
const LAST = 2026;

/** §8 — partitioned 30 Years section: video in 1st partition, anniversary counter & narrative in 2nd partition. */
export function ThirtyYears() {
  const t = useTranslations("thirty");
  const root = useRef<HTMLElement>(null);
  const odo = useRef<ScrubOdometerHandle>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoPaused, setIsVideoPaused] = useState(false);
  const pillars = t.raw("pillars") as string[];

  const toggleVideo = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsVideoPaused(false);
    } else {
      videoRef.current.pause();
      setIsVideoPaused(true);
    }
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ motion: MQ.motion, reduce: MQ.reduced }, (ctx) => {
        const { reduce } = ctx.conditions as { reduce: boolean };
        if (reduce) {
          odo.current?.set(LAST);
          gsap.set("[data-stamp]", { scale: 1, rotation: -8, autoAlpha: 1 });
          return;
        }
        const proxy = { v: FIRST };
        odo.current?.set(FIRST);
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: root.current,
              start: "top 75%",
              end: "top 25%",
              scrub: 0.6,
            },
          })
          .to(proxy, { v: LAST, duration: 1, ease: "power2.inOut", onUpdate: () => odo.current?.set(proxy.v) }, 0)
          .fromTo("[data-stamp]", { scale: 0, rotation: -40, autoAlpha: 0 }, { scale: 1, rotation: -8, autoAlpha: 1, duration: 0.25, ease: "back.out(2.2)" }, 0.8)
          .to({}, { duration: 0.08 });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="thirty-title" className="relative bg-surface-2 py-20 md:py-28 overflow-hidden">
      <div className="container-x grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        {/* 1st Part: Hero Video */}
        <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-line/60 bg-black/5 shadow-[var(--shadow-lg)] aspect-[4/3] md:aspect-[16/11] lg:aspect-[4/3.5]">
          <video
            ref={videoRef}
            src="/videos/hero-bricket.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="h-full w-full object-cover"
          />
          {/* Pause / Play Button */}
          <button
            type="button"
            onClick={toggleVideo}
            aria-label={isVideoPaused ? "Play video" : "Pause video"}
            className="absolute bottom-4 right-4 z-10 grid size-10 place-items-center rounded-full bg-white/90 text-primary shadow-md backdrop-blur-sm transition-transform duration-300 hover:scale-105 active:scale-95"
          >
            {isVideoPaused ? (
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden fill="currentColor">
                <path d="M3 1.8v10.4L12 7 3 1.8Z" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden fill="currentColor">
                <rect x="2.5" y="1.5" width="3" height="11" rx="1" />
                <rect x="8.5" y="1.5" width="3" height="11" rx="1" />
              </svg>
            )}
          </button>
        </div>

        {/* 2nd Part: Current Info */}
        <div className="flex flex-col items-start text-left max-lg:items-center max-lg:text-center">
          {/* Eyebrow */}
          <p className="eyebrow tabular">{t("eyebrow")}</p>

          {/* 1996 -> 2026 Odometer + 30 Years Stamp */}
          <div className="mt-3 flex items-center gap-4 sm:gap-6">
            <ScrubOdometer
              ref={odo}
              initial={FIRST}
              digits={4}
              label={String(LAST)}
              className="font-display text-[clamp(3.2rem,6vw,5.5rem)] font-extrabold tracking-[-0.04em] text-primary"
            />
            {/* The "30" stamp */}
            <div
              data-stamp
              aria-hidden
              className="grid aspect-square w-[clamp(3.8rem,5.5vw,5rem)] place-items-center rounded-full bg-accent-ink text-center text-white shadow-[var(--shadow-lg)] shrink-0"
              style={{ visibility: "hidden" }}
            >
              <span className="font-display leading-none font-extrabold">
                <span className="block text-[clamp(1.4rem,2.2vw,2rem)] tracking-[-0.04em]">30</span>
                <span className="block text-[clamp(0.48rem,0.65vw,0.6rem)] tracking-[0.2em] uppercase">{t("years")}</span>
              </span>
            </div>
          </div>

          {/* Story Narrative */}
          <div className="mt-8 flex flex-col items-start gap-4 max-lg:items-center">
            <OutlineFillHeading id="thirty-title" className="h2 text-primary">
              {t("title")}
            </OutlineFillHeading>
            <Reveal className="flex flex-col items-start gap-4 max-lg:items-center">
              <p data-reveal className="eyebrow">{t("kicker")}</p>
              <p data-reveal className="max-w-xl text-base text-muted leading-relaxed">{t("body")}</p>
              <ul data-reveal className="flex flex-wrap gap-2.5 pt-1 max-lg:justify-center">
                {pillars.map((p) => (
                  <li key={p} className="rounded-full bg-white/80 border border-line/60 px-3.5 py-1.5 font-display text-xs md:text-sm font-semibold text-primary shadow-xs">
                    {p}
                  </li>
                ))}
              </ul>
              <TransitionLink data-reveal href="/our-story" className="group mt-3 inline-flex items-center gap-2 font-display font-semibold text-primary">
                <span className="link-draw">{t("link")}</span>
                <Arrow className="transition-transform duration-300 ease-soft group-hover:translate-x-1" />
              </TransitionLink>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
