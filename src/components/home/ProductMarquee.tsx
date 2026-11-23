"use client";

import Image from "next/image";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { MQ } from "@/lib/motion";
import { productHref, products, type Product } from "@/lib/catalog";
import { TransitionLink } from "@/components/ui/TransitionLink";

const withImages = products.filter((p) => p.image);
const rowA = withImages.filter((_, i) => i % 2 === 0);
const rowB = withImages.filter((_, i) => i % 2 === 1);

function Item({ p, hidden }: { p: Product; hidden?: boolean }) {
  return (
    <li className="flex shrink-0 items-center" aria-hidden={hidden}>
      <TransitionLink
        href={productHref(p)}
        tabIndex={hidden ? -1 : undefined}
        className="group/item flex items-center gap-4 px-4 md:gap-6 md:px-6"
      >
        <span className="font-display text-[clamp(1.35rem,2.4vw,2.1rem)] leading-none font-extrabold tracking-[-0.03em] whitespace-nowrap text-primary uppercase transition-colors duration-300 ease-soft group-hover/item:text-accent group-focus-visible/item:text-accent">
          {p.name}
        </span>
        <span className="relative block size-[clamp(2.2rem,3.8vw,3.2rem)] shrink-0 rounded-full bg-surface transition-transform duration-500 ease-soft group-hover/item:scale-[1.2] group-hover/item:rotate-[8deg] group-focus-visible/item:scale-[1.2] group-focus-visible/item:rotate-[8deg]">
          <Image src={p.image!} alt="" fill sizes="60px" className="object-contain p-1" />
        </span>
      </TransitionLink>
    </li>
  );
}

function Row({ items, dir }: { items: Product[]; dir: 1 | -1 }) {
  return (
    <div data-row data-dir={dir} className="overflow-hidden motion-reduce:overflow-x-auto">
      <ul data-track className="flex w-max will-change-transform">
        {items.map((p) => (
          <Item key={p.slug} p={p} />
        ))}
        {/* Seamless loop: an identical, inert copy */}
        {items.map((p) => (
          <Item key={`dup-${p.slug}`} p={p} hidden />
        ))}
      </ul>
    </div>
  );
}

/** §3 — two opposing rows; speed follows scroll velocity, direction flips with scroll direction. */
export function ProductMarquee() {
  const t = useTranslations("marquee");
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const ac = new AbortController();
        const on = { signal: ac.signal };
        const rows = gsap.utils.toArray<HTMLElement>("[data-row]", root.current).map((row) => {
          const track = row.querySelector<HTMLElement>("[data-track]")!;
          const state = { row, track, x: 0, dir: Number(row.dataset.dir), paused: false, half: track.scrollWidth / 2 };
          row.addEventListener("pointerenter", () => (state.paused = true), on);
          row.addEventListener("pointerleave", () => (state.paused = false), on);
          row.addEventListener("focusin", () => (state.paused = true), on);
          row.addEventListener("focusout", () => (state.paused = false), on);
          return state;
        });

        let scrollDir = 1;
        let boost = 0;
        let active = false;
        const st = ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => (active = self.isActive),
          onUpdate: (self) => {
            scrollDir = self.direction;
            boost = Math.min(Math.abs(self.getVelocity()) / 250, 10);
          },
          onRefresh: () => rows.forEach((r) => (r.half = r.track.scrollWidth / 2)),
        });

        const tick = (_t: number, dt: number) => {
          if (!active) return;
          boost *= 0.93;
          const step = (0.045 + boost * 0.06) * dt; // px per ms
          rows.forEach((r) => {
            if (r.paused) return;
            r.x -= step * r.dir * scrollDir;
            r.x = gsap.utils.wrap(-r.half, 0, r.x);
            r.track.style.transform = `translate3d(${r.x}px,0,0)`;
          });
        };
        gsap.ticker.add(tick);
        return () => {
          gsap.ticker.remove(tick);
          st.kill();
          ac.abort();
          rows.forEach((r) => (r.track.style.transform = ""));
        };
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-label={t("label")} className="flex flex-col gap-4 border-y border-line bg-white py-7 md:gap-5 md:py-10">
      <Row items={rowA} dir={1} />
      <Row items={rowB} dir={-1} />
    </section>
  );
}
