"use client";

import Image from "next/image";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap, useGSAP } from "@/lib/gsap";
import { MQ } from "@/lib/motion";
import { getProduct, pad2, productHref } from "@/lib/catalog";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { Arrow } from "@/components/ui/TextRollButton";

/**
 * Callout layout (desktop), in % of the pinned stage.
 * side: which column the label sits in; y: label row; anchor: the point on the product the line ends at.
 */
const callouts = [
  { side: "left", y: 68, anchor: [44, 70] }, // 01 wafer cone
  { side: "right", y: 32, anchor: [57, 34] }, // 02 chocolate ice cream
  { side: "left", y: 30, anchor: [45, 36] }, // 03 cocoa core
  { side: "right", y: 60, anchor: [58, 50] }, // 04 chocolate shell
  { side: "left", y: 49, anchor: [43, 47] }, // 05 roasted peanuts
] as const;

const LABEL_EDGE = { left: 31, right: 69 }; // where the line leaves the label column (x %)

/** §4 — pinned exhibit: scrolling turns Choco Boom 360° and the callouts draw in one by one. */
export function Anatomy() {
  const t = useTranslations("anatomy");
  const root = useRef<HTMLElement>(null);
  const parts = t.raw("parts") as string[];
  const product = getProduct("choco-boom")!;

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(MQ.reduced, () => {
        gsap.set(q("[data-callout], [data-dot], [data-tagline], [data-mcallout]"), { autoAlpha: 1 });
        gsap.set(q("[data-line]"), { strokeDashoffset: 0 });
        q<HTMLElement>("[data-deg]").forEach((el) => (el.textContent = "360°"));
        gsap.set(q("[data-hint]"), { autoAlpha: 0 }); // nothing turns, so no "scroll to turn" hint
      });

      mm.add({ motion: MQ.motion, narrow: MQ.narrow }, (ctx) => {
        if (!ctx.conditions!.motion) return;
        const mobile = ctx.conditions!.narrow;
        gsap.set(q("[data-turn]"), { transformPerspective: 1400 });
        const deg = { v: 0 };
        const degEls = q<HTMLElement>("[data-deg]");
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: q("[data-pin]")[0], start: "top top", end: mobile ? "+=130%" : "+=200%", pin: true, scrub: 0.7 },
        });

        tl.to(deg, { v: 360, duration: 1, onUpdate: () => degEls.forEach((el) => (el.textContent = `${String(Math.round(deg.v)).padStart(3, "0")}°`)) }, 0)
          .to(q("[data-turn]"), { rotationY: 360, duration: 1, ease: "power2.inOut" }, 0)
          .to(q("[data-turn]"), { keyframes: { rotation: [0, -6, 4, -3, 0], scale: [1, 1.07, 1, 1.07, 1] }, duration: 1 }, 0)
          .to(q("[data-shadow]"), { keyframes: { scaleX: [1, 1.5, 0.8, 1.5, 1], opacity: [0.9, 0.55, 0.9, 0.55, 0.9] }, duration: 1, ease: "power2.inOut" }, 0)
          .fromTo(q("[data-circle]"), { scale: 0.55 }, { scale: 1.08, duration: 1 }, 0)
          .to(q("[data-hint]"), { autoAlpha: 0, duration: 0.08 }, 0.06);

        // Callouts appear as the turn passes set points.
        callouts.forEach((c, i) => {
          const at = 0.1 + i * 0.15;
          tl.fromTo(q(`[data-callout="${i}"]`), { autoAlpha: 0, x: c.side === "left" ? -30 : 30 }, { autoAlpha: 1, x: 0, duration: 0.08, ease: "power3.out" }, at)
            .fromTo(q(`[data-line="${i}"]`), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.09 }, at + 0.02)
            .fromTo(q(`[data-dot="${i}"]`), { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.04, ease: "back.out(3)" }, at + 0.1)
            .fromTo(q(`[data-mcallout="${i}"]`), { autoAlpha: 0.15, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.08 }, at);
        });
        tl.fromTo(q("[data-tagline]"), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.1, ease: "power3.out" }, 0.86);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="anatomy-title" className="relative bg-surface-2">
      {/*
        wide:  heading on top, product centred in a full-bleed stage, callouts drawn around it.
        stack: heading → stage (fills what's left) → numbered list → hint, so nothing overlaps on short phones.
        land:  heading + list + hint in the left half, stage in the right half.
      */}
      <div data-pin className="relative flex h-[100svh] flex-col overflow-hidden">
        {/* Heading */}
        <div className="relative z-10 shrink-0 land:w-1/2">
          <div className="container-x flex items-start justify-between gap-6 pt-[calc(var(--header-h)+1.5rem)] land:pt-[calc(var(--header-h)+0.25rem)]">
            <div>
              <p className="eyebrow">{t("eyebrow")}</p>
              <h2 id="anatomy-title" className="mt-3 font-display text-[clamp(1.75rem,4vw,3.6rem)] leading-none font-extrabold tracking-[-0.03em] text-primary uppercase land:mt-2 land:text-[clamp(1.4rem,3.2vw,2rem)]">
                {t("title")}
              </h2>
            </div>
            <div className="flex flex-col items-end gap-1 pt-1">
              <span data-deg aria-hidden className="tabular font-display text-[clamp(1.4rem,2.6vw,2.4rem)] leading-none font-extrabold text-primary land:text-xl">
                000°
              </span>
              <p data-hint className="eyebrow narrow:hidden">{t("hint")}</p>
            </div>
          </div>
        </div>

        {/* Stage — a size container so the product scales to whatever height it gets */}
        <div className="[container-type:size] wide:absolute wide:inset-0 stack:relative stack:min-h-0 stack:flex-1 land:absolute land:inset-y-0 land:right-0 land:left-1/2">
          <div data-circle className="absolute top-1/2 left-1/2 aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--tint-sticks)] wide:w-[min(62vh,46vw)] stack:w-[min(78vw,96cqh)] land:w-[min(80cqh,90cqw)]" />
          <div className="absolute top-1/2 left-1/2 aspect-[805/835] -translate-x-1/2 -translate-y-1/2 wide:w-[min(46vh,30vw)] stack:w-[min(56vw,66cqh)] land:w-[min(56cqh,70cqw)]">
            <div data-shadow aria-hidden className="absolute -bottom-[8%] left-1/2 h-[7%] w-[60%] -translate-x-1/2 rounded-[50%] bg-primary/30 blur-xl" />
            <div data-turn className="absolute inset-0">
              <Image
                src={product.render!}
                alt={product.name}
                fill
                sizes="(min-width: 768px) 30vw, 56vw"
                className="object-contain drop-shadow-[0_30px_30px_rgb(104_47_38/0.25)]"
              />
            </div>
          </div>

          {/* Leader lines (desktop) */}
          <svg aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full narrow:hidden">
            {callouts.map((c, i) => {
              const x0 = LABEL_EDGE[c.side];
              const elbow = c.side === "left" ? x0 + 5 : x0 - 5;
              return (
                <path
                  key={i}
                  data-line={i}
                  d={`M${x0} ${c.y} L${elbow} ${c.y} L${c.anchor[0]} ${c.anchor[1]}`}
                  pathLength={1}
                  strokeDasharray="1"
                  strokeDashoffset="1"
                  fill="none"
                  stroke="var(--color-primary)"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                  opacity="0.55"
                />
              );
            })}
          </svg>
          {callouts.map((c, i) => (
            <span
              key={i}
              data-dot={i}
              aria-hidden
              className="absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent ring-4 ring-white narrow:hidden"
              style={{ left: `${c.anchor[0]}%`, top: `${c.anchor[1]}%`, visibility: "hidden" }}
            />
          ))}
        </div>

        {/* Callout labels (desktop) */}
        <ol className="narrow:hidden">
          {callouts.map((c, i) => (
            <li
              key={i}
              data-callout={i}
              className={`absolute w-[22%] -translate-y-1/2 ${c.side === "left" ? "text-right" : "text-left"}`}
              style={{
                top: `${c.y}%`,
                ...(c.side === "left" ? { right: `${100 - LABEL_EDGE.left + 1}%` } : { left: `${LABEL_EDGE.right + 1}%` }),
                visibility: "hidden",
              }}
            >
              <span className="tabular block font-display text-sm font-semibold text-accent-ink">{pad2(i + 1)}</span>
              <span className="block font-display text-[clamp(1rem,1.5vw,1.35rem)] leading-tight font-semibold text-primary">{parts[i]}</span>
            </li>
          ))}
        </ol>

        {/* Callout list (narrow) */}
        <ol className="relative z-10 grid shrink-0 grid-cols-2 gap-x-4 gap-y-2 px-[var(--gutter)] pt-2 wide:hidden land:mt-auto land:w-1/2 land:grid-cols-1 land:gap-y-1">
          {parts.map((p, i) => (
            <li key={i} data-mcallout={i} className="flex gap-2 text-sm leading-snug text-primary">
              <span className="tabular font-display font-semibold text-accent-ink">{pad2(i + 1)}</span>
              {p}
            </li>
          ))}
        </ol>

        {/* Footer row: tagline (wide), hint (narrow) */}
        <div className="relative z-10 shrink-0 wide:absolute wide:inset-x-0 wide:bottom-10 land:w-1/2">
         <div className="container-x flex items-end justify-between gap-6 narrow:py-4 stack:pb-6">
          <div data-tagline style={{ visibility: "hidden" }} className="narrow:hidden">
            <p className="font-display text-[clamp(1.6rem,3.2vw,3rem)] leading-none font-extrabold tracking-[-0.03em] text-accent-ink">{t("tagline")}</p>
            <TransitionLink href={productHref(product)} className="group mt-3 inline-flex items-center gap-2 font-display text-sm font-semibold text-primary">
              <span className="link-draw">{t("view")}</span>
              <Arrow className="transition-transform duration-300 ease-soft group-hover:translate-x-1" />
            </TransitionLink>
          </div>
          <p data-hint className="eyebrow wide:hidden">{t("hint")}</p>
         </div>
        </div>
      </div>
    </section>
  );
}
