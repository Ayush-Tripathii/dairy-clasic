"use client";

import { Children, useRef, useState, type ReactNode } from "react";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { gsap, useGSAP } from "@/lib/gsap";
import { MQ } from "@/lib/motion";
import { Arrow } from "./TextRollButton";

if (typeof window !== "undefined") gsap.registerPlugin(Draggable, InertiaPlugin);

type Props = {
  children: ReactNode;
  prevLabel: string;
  nextLabel: string;
  /** Tailwind width classes for each slide. */
  slideClass?: string;
  className?: string;
};

/** Drag/swipe slider with inertia, branded circular arrows and a thin progress bar (never dots). */
export function BrandSlider({ children, prevLabel, nextLabel, slideClass = "w-[86%] md:w-[calc(50%-0.75rem)]", className = "" }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const api = useRef<{ go: (dir: 1 | -1) => void; to: (i: number) => void } | null>(null);
  const [edge, setEdge] = useState({ start: true, end: false });
  const slides = Children.toArray(children);

  useGSAP(
    () => {
      const el = track.current!;
      const bar = root.current!.querySelector<HTMLElement>("[data-progress]")!;
      let positions: number[] = [];
      let max = 0;

      const measure = () => {
        const viewport = el.parentElement!.clientWidth;
        max = Math.max(0, el.scrollWidth - viewport);
        positions = Array.from(el.children, (c) => -Math.min((c as HTMLElement).offsetLeft, max));
        positions = positions.filter((p, i) => i === 0 || p !== positions[i - 1]);
      };
      const sync = () => {
        const x = gsap.getProperty(el, "x") as number;
        const p = max ? -x / max : 1;
        gsap.set(bar, { scaleX: Math.max(0.04, Math.min(1, p)) });
        setEdge({ start: x > -2, end: x < -max + 2 });
      };
      const nearest = () => {
        const x = gsap.getProperty(el, "x") as number;
        return positions.reduce((best, p, i) => (Math.abs(p - x) < Math.abs(positions[best] - x) ? i : best), 0);
      };

      measure();
      const [d] = Draggable.create(el, {
        type: "x",
        inertia: true,
        bounds: { minX: -max, maxX: 0 },
        edgeResistance: 0.85,
        dragClickables: true,
        minimumMovement: 6,
        snap: (v: number) => positions.reduce((a, b) => (Math.abs(b - v) < Math.abs(a - v) ? b : a), positions[0]),
        onDrag: sync,
        onThrowUpdate: sync,
        onThrowComplete: sync,
      });

      const to = (i: number) => {
        const reduce = window.matchMedia(MQ.reduced).matches;
        const target = positions[Math.max(0, Math.min(positions.length - 1, i))];
        gsap.to(el, { x: target, duration: reduce ? 0.3 : 0.85, ease: "expo.out", onUpdate: sync, onComplete: () => d.update() });
      };
      api.current = { go: (dir) => to(nearest() + dir), to };

      const ro = new ResizeObserver(() => {
        measure();
        d.applyBounds({ minX: -max, maxX: 0 });
        to(nearest());
      });
      ro.observe(el.parentElement!);

      // Keyboard users: a focused slide is brought into view.
      const onFocus = (e: FocusEvent) => {
        const slide = (e.target as HTMLElement).closest("[data-slide]");
        if (slide) to(Array.prototype.indexOf.call(el.children, slide));
      };
      el.addEventListener("focusin", onFocus);
      sync();
      return () => {
        ro.disconnect();
        el.removeEventListener("focusin", onFocus);
        d.kill();
      };
    },
    { scope: root },
  );

  const arrowBtn = (dir: 1 | -1, label: string, disabled: boolean) => (
    <button
      type="button"
      onClick={() => api.current?.go(dir)}
      aria-label={label}
      aria-disabled={disabled}
      className={`slider-arrow grid size-14 place-items-center overflow-hidden rounded-full border-[1.5px] border-primary text-primary transition-[background-color,color,opacity] duration-300 ease-soft hover:bg-primary hover:text-[var(--color-on-primary)] aria-disabled:pointer-events-none aria-disabled:opacity-30 ${dir === -1 ? "slider-arrow--prev" : ""}`}
    >
      <Arrow className={dir === -1 ? "rotate-180" : ""} />
    </button>
  );

  return (
    <div ref={root} className={className}>
      <div className="overflow-hidden">
        <ul ref={track} className="flex cursor-grab gap-6 active:cursor-grabbing">
          {slides.map((s, i) => (
            <li key={i} data-slide className={`shrink-0 ${slideClass}`}>
              {s}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-10 flex items-center gap-6">
        <div className="h-[2px] flex-1 overflow-hidden rounded-full bg-primary/10">
          <div data-progress className="h-full w-full origin-left bg-primary" style={{ transform: "scaleX(0.04)" }} />
        </div>
        <div className="flex gap-3">
          {arrowBtn(-1, prevLabel, edge.start)}
          {arrowBtn(1, nextLabel, edge.end)}
        </div>
      </div>
    </div>
  );
}
