"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { gsap, useGSAP } from "@/lib/gsap";
import { MQ } from "@/lib/motion";
import { productHref, products, type Mood } from "@/lib/catalog";
import { Odometer } from "@/components/motion/Odometer";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { TransitionLink } from "@/components/ui/TransitionLink";

if (typeof window !== "undefined") gsap.registerPlugin(Draggable, InertiaPlugin);

const MOODS: Mood[] = ["chocolatey", "fruity", "nutty", "coffee", "creamy", "vanilla"];
const SEG = 360 / MOODS.length;
const SHOW = 6;

const mod = (n: number, m: number) => ((n % m) + m) % m;
/** Which segment sits under the top pointer for a given wheel rotation. */
const indexAt = (rotation: number) => mod(Math.round(-rotation / SEG), MOODS.length);

// Rounded so server and browser produce identical SVG attributes (float last-digit drift breaks hydration).
const round = (n: number) => Math.round(n * 100) / 100;
const polar = (deg: number, r: number) => {
  const a = (deg * Math.PI) / 180;
  return [round(r * Math.sin(a)), round(-r * Math.cos(a))] as const;
};
const segmentPath = (i: number, rOuter = 97, rInner = 31) => {
  const a0 = i * SEG - SEG / 2;
  const a1 = i * SEG + SEG / 2;
  const [x0, y0] = polar(a0, rOuter);
  const [x1, y1] = polar(a1, rOuter);
  const [x2, y2] = polar(a1, rInner);
  const [x3, y3] = polar(a0, rInner);
  return `M${x0} ${y0}A${rOuter} ${rOuter} 0 0 1 ${x1} ${y1}L${x2} ${y2}A${rInner} ${rInner} 0 0 0 ${x3} ${y3}Z`;
};

const matchesFor = (m: Mood) => products.filter((p) => p.moods.includes(m));

/** §5 — draggable flavour wheel with inertia + snapping; results fly out of the wheel. */
export function FlavourWheel() {
  const t = useTranslations("wheel");
  const tc = useTranslations("categories");
  const root = useRef<HTMLElement>(null);
  const wheel = useRef<HTMLDivElement>(null);
  const drag = useRef<Draggable | null>(null);
  const [index, setIndex] = useState(0);
  const [announce, setAnnounce] = useState("");
  const indexRef = useRef(0);
  const busy = useRef(false);
  const flyIn = useRef(false);

  const mood = MOODS[index];
  const all = matchesFor(mood);
  const shown = all.filter((p) => p.image).slice(0, SHOW);

  const highlight = useCallback((i: number) => {
    wheel.current?.querySelectorAll("[data-seg]").forEach((el, k) => el.toggleAttribute("data-active", k === i));
  }, []);

  /** Swap results: old cards drop out, then state changes and the new cards fly from the wheel. */
  const commit = useCallback(
    (i: number) => {
      highlight(i);
      if (i === indexRef.current) return;
      indexRef.current = i;
      const old = root.current?.querySelectorAll("[data-result]");
      const reduce = window.matchMedia(MQ.reduced).matches;
      const swap = () => {
        flyIn.current = true;
        setIndex(i);
        setAnnounce(t("announce", { mood: t(`moods.${MOODS[i]}`), count: matchesFor(MOODS[i]).length }));
      };
      if (!old?.length || reduce) return swap();
      gsap.to(old, { y: -18, scale: 0.94, autoAlpha: 0, duration: 0.25, stagger: 0.025, ease: "power2.in", onComplete: swap });
    },
    [highlight, t],
  );

  const rotateTo = useCallback(
    (rotation: number, duration: number, ease: string) => {
      const el = wheel.current;
      if (!el || busy.current) return;
      busy.current = true;
      const reduce = window.matchMedia(MQ.reduced).matches;
      gsap.to(el, {
        rotation,
        duration: reduce ? 0.3 : duration,
        ease: reduce ? "none" : ease,
        onUpdate: () => highlight(indexAt(gsap.getProperty(el, "rotation") as number)),
        onComplete: () => {
          busy.current = false;
          drag.current?.update();
          commit(indexAt(rotation));
        },
      });
    },
    [commit, highlight],
  );

  const goTo = useCallback(
    (i: number) => {
      const r = gsap.getProperty(wheel.current, "rotation") as number;
      const desired = -i * SEG;
      const delta = mod(desired - r + 180, 360) - 180; // shortest way round
      rotateTo(r + delta, 0.9, "expo.out");
    },
    [rotateTo],
  );

  const spin = () => {
    const r = gsap.getProperty(wheel.current, "rotation") as number;
    const turns = 720 + Math.floor(Math.random() * MOODS.length) * SEG + (Math.random() < 0.5 ? 360 : 0);
    rotateTo(Math.round((r - turns) / SEG) * SEG, 3.2, "power4.out");
  };

  // Draggable with inertia + snap
  useGSAP(
    () => {
      highlight(0);
      const [d] = Draggable.create(wheel.current, {
        type: "rotation",
        inertia: true,
        snap: (v: number) => Math.round(v / SEG) * SEG,
        onDrag() {
          highlight(indexAt(this.rotation));
        },
        onThrowUpdate() {
          highlight(indexAt(this.rotation));
        },
        onThrowComplete() {
          commit(indexAt(this.rotation));
        },
        onClick(e: PointerEvent) {
          const seg = (e.target as Element).closest<HTMLElement>("[data-seg]");
          if (seg) goTo(Number(seg.dataset.seg));
        },
      });
      drag.current = d;
      return () => d.kill();
    },
    { scope: root },
  );

  // New results fly out of the wheel centre, one after another.
  useGSAP(
    () => {
      if (!flyIn.current) return;
      flyIn.current = false;
      const cards = gsap.utils.toArray<HTMLElement>("[data-result]", root.current);
      if (window.matchMedia(MQ.reduced).matches) {
        gsap.from(cards, { autoAlpha: 0, duration: 0.3, ease: "none" });
        return;
      }
      const w = wheel.current!.getBoundingClientRect();
      const cx = w.left + w.width / 2;
      const cy = w.top + w.height / 2;
      cards.forEach((card, i) => {
        const r = card.getBoundingClientRect();
        gsap.fromTo(
          card,
          { x: cx - (r.left + r.width / 2), y: cy - (r.top + r.height / 2), scale: 0.2, rotation: gsap.utils.random(-30, 30), autoAlpha: 0 },
          { x: 0, y: 0, scale: 1, rotation: 0, autoAlpha: 1, duration: 1.05, delay: i * 0.07, ease: "expo.out" },
        );
      });
    },
    { scope: root, dependencies: [index] },
  );

  const onKey = (e: React.KeyboardEvent) => {
    if (["ArrowRight", "ArrowDown"].includes(e.key)) {
      e.preventDefault();
      goTo(mod(indexRef.current + 1, MOODS.length));
    } else if (["ArrowLeft", "ArrowUp"].includes(e.key)) {
      e.preventDefault();
      goTo(mod(indexRef.current - 1, MOODS.length));
    }
  };

  return (
    <section ref={root} aria-labelledby="wheel-title" className="overflow-clip bg-bg py-24 md:py-36">
      <div className="container-x grid items-center gap-14 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] md:gap-16">
        {/* Wheel */}
        <div>
          <p className="eyebrow">{t("eyebrow")}</p>
          <SplitReveal id="wheel-title" className="h2 mt-4">
            {t("title")}
          </SplitReveal>
          <p className="mt-5 max-w-md text-muted">{t("instruction")}</p>

          <div className="relative mx-auto mt-12 aspect-square w-full max-w-[min(460px,80svh)] [container-type:inline-size]">
            {/* Pointer */}
            <svg aria-hidden viewBox="0 0 24 20" className="absolute -top-3 left-1/2 z-10 w-7 -translate-x-1/2 drop-shadow-[0_4px_6px_rgb(104_47_38/0.3)]">
              <path d="M12 20 0 0h24Z" fill="var(--color-accent-ink)" />
            </svg>
            <div
              ref={wheel}
              tabIndex={0}
              role="slider"
              aria-label={t("label")}
              aria-valuemin={1}
              aria-valuemax={MOODS.length}
              aria-valuenow={index + 1}
              aria-valuetext={t(`moods.${mood}`)}
              onKeyDown={onKey}
              className="absolute inset-0 cursor-grab touch-none rounded-full shadow-[var(--shadow-lg)] select-none active:cursor-grabbing"
            >
              <svg viewBox="-100 -100 200 200" className="h-full w-full overflow-visible">
                {MOODS.map((m, i) => {
                  const [lx, ly] = polar(i * SEG, 64);
                  return (
                    <g key={m} data-seg={i} className="wheel-seg">
                      <path d={segmentPath(i)} fill={`var(--mood-${m})`} stroke="#fff" strokeWidth="1.2" />
                      <text
                        x={lx}
                        y={ly}
                        transform={`rotate(${i * SEG} ${lx} ${ly})`}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="pointer-events-none font-display"
                        fontSize="8.4"
                        fontWeight="700"
                        letterSpacing="0.6"
                        fill="var(--color-primary)"
                      >
                        {t(`moods.${m}`).toUpperCase()}
                      </text>
                    </g>
                  );
                })}
                <circle r="30" fill="#fff" />
              </svg>
            </div>
            <button
              type="button"
              onClick={spin}
              className="absolute top-1/2 left-1/2 z-10 grid size-[29%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-primary px-1 font-display text-[clamp(0.75rem,4.4cqi,0.875rem)] font-bold tracking-wide text-[var(--color-on-primary)] uppercase shadow-[var(--shadow-md)] transition-transform duration-300 ease-soft hover:scale-105 active:scale-95"
            >
              {t("spin")}
            </button>
          </div>
        </div>

        {/* Results */}
        <div>
          <p className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-line pb-5">
            <span className="font-display text-[clamp(2rem,4vw,3.4rem)] leading-none font-extrabold tracking-[-0.03em] text-accent-ink uppercase">
              {t(`moods.${mood}`)}
            </span>
            <span className="flex items-baseline gap-2 font-display font-semibold text-primary">
              <span aria-hidden>·</span>
              <Odometer value={all.length} digits={2} className="text-xl" />
              <span className="text-muted">{t("matches", { count: all.length })}</span>
            </span>
          </p>
          <p aria-live="polite" className="sr-only">
            {announce}
          </p>
          <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {shown.map((p) => (
              <li key={`${mood}-${p.slug}`} data-result>
                <TransitionLink
                  href={productHref(p)}
                  className="group block rounded-[var(--radius-md)] p-3 transition-[transform,box-shadow] duration-500 ease-soft hover:-translate-y-1.5 hover:shadow-[var(--shadow-md)]"
                  style={{ background: `var(--tint-${p.category})` }}
                >
                  <span className="relative block aspect-square">
                    <Image
                      src={p.image!}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 14vw, 40vw"
                      className="object-contain transition-transform duration-500 ease-soft group-hover:scale-[1.06] group-hover:-rotate-3"
                    />
                  </span>
                  <span className="mt-2 block font-display text-sm leading-tight font-bold text-primary">{p.name}</span>
                  <span className="block text-xs text-muted">{tc(p.category)}</span>
                </TransitionLink>
              </li>
            ))}
          </ul>
          {all.length > shown.length && (
            <TransitionLink href="/collection" className="link-draw mt-6 inline-block font-display text-sm font-semibold text-primary">
              {t("more", { count: all.length - shown.length })}
            </TransitionLink>
          )}
        </div>
      </div>
    </section>
  );
}
