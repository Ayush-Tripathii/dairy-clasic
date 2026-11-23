"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const LOOPS = 3; // each reel holds 0–9 three times so it can always roll forward
const ROWS = LOOPS * 10;

type Props = {
  value: number;
  /** Minimum digits; pads with leading zeros. */
  digits?: number;
  /** Value shown before the first animation. Defaults to `value`. */
  initial?: number;
  duration?: number;
  delay?: number;
  stagger?: number;
  className?: string;
  /** When false the reel stays put (driven externally via scrubTween). */
  animate?: boolean;
};

const toDigits = (n: number, len: number) => String(Math.max(0, Math.round(n))).padStart(len, "0").split("").map(Number);

/** Mechanical odometer. Visible digits are aria-hidden; the real number is read once. */
export function Odometer({
  value,
  digits = 1,
  initial,
  duration = 0.9,
  delay = 0,
  stagger = 0.06,
  className = "",
  animate = true,
}: Props) {
  const root = useRef<HTMLSpanElement>(null);
  const len = Math.max(digits, String(Math.round(Math.max(value, initial ?? value))).length);
  const startDigits = toDigits(initial ?? value, len);
  // Absolute reel position per column (0..ROWS-1); kept in the first loop between animations.
  const pos = useRef<number[]>(startDigits);

  const reels = () => gsap.utils.toArray<HTMLElement>("[data-reel]", root.current);
  const place = (el: HTMLElement, p: number) => gsap.set(el, { yPercent: (-p * 100) / ROWS });

  useGSAP(
    () => {
      reels().forEach((el, i) => place(el, pos.current[i] ?? 0));
    },
    { scope: root },
  );

  useGSAP(
    () => {
      if (!animate) return;
      const target = toDigits(value, len);
      const els = reels();
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      els.forEach((el, i) => {
        const cur = pos.current[i] ?? 0;
        const d = target[i];
        if (cur % 10 === d) return;
        // Roll forward to the next occurrence of the digit.
        const next = cur + ((d - (cur % 10) + 10) % 10);
        pos.current[i] = d;
        if (reduce) return place(el, d);
        gsap.to(el, {
          yPercent: (-next * 100) / ROWS,
          duration,
          delay: delay + (els.length - 1 - i) * stagger,
          ease: "expo.out",
          onComplete: () => place(el, d),
        });
      });
    },
    { scope: root, dependencies: [value, animate] },
  );

  return (
    <span ref={root} className={`tabular relative inline-flex leading-none ${className}`}>
      <span className="sr-only">{String(Math.round(value)).padStart(digits, "0")}</span>
      {startDigits.map((_, i) => (
        <span key={i} aria-hidden className="relative inline-block h-[1em] overflow-hidden" style={{ width: "0.68em" }}>
          <span data-reel className="absolute top-0 left-0 flex w-full flex-col items-center will-change-transform">
            {Array.from({ length: ROWS }, (_, r) => (
              <span key={r} className="block h-[1em] leading-none">
                {r % 10}
              </span>
            ))}
          </span>
        </span>
      ))}
    </span>
  );
}

/* ------------------------------------------------------------------ */

export type ScrubOdometerHandle = { set: (value: number) => void };

/**
 * Scroll-driven odometer: each digit is a 0–9 reel (plus a trailing 0 for the wrap).
 * The ones digit rolls continuously; higher digits only turn while the digit below passes 9 → 0,
 * exactly like a mechanical counter. Drive it with `ref.set(value)` from a scrubbed tween.
 */
export const ScrubOdometer = forwardRef<ScrubOdometerHandle, { initial: number; digits: number; className?: string; label?: string }>(
  function ScrubOdometer({ initial, digits, className = "", label }, ref) {
    const root = useRef<HTMLSpanElement>(null);
    const ROWS_S = 11;

    const apply = (v: number) => {
      const els = root.current?.querySelectorAll<HTMLElement>("[data-sreel]");
      if (!els) return;
      els.forEach((el, i) => {
        const place = 10 ** (digits - 1 - i);
        const below = v % place; // value of the lower digits
        const carry = place === 1 ? v % 1 : Math.max(0, below - (place - 1)); // 0..1 while the lower digits roll over
        const pos = (Math.floor(v / place) % 10) + carry;
        el.style.transform = `translate3d(0, ${(-pos * 100) / ROWS_S}%, 0)`;
      });
    };

    useImperativeHandle(ref, () => ({ set: apply }));
    useGSAP(() => apply(initial), { scope: root });

    return (
      <span ref={root} className={`tabular relative inline-flex leading-none ${className}`} aria-label={label} role={label ? "img" : undefined}>
        {Array.from({ length: digits }, (_, i) => (
          <span key={i} aria-hidden className="relative inline-block h-[1em] overflow-hidden" style={{ width: "0.72em" }}>
            <span data-sreel className="absolute top-0 left-0 flex w-full flex-col items-center will-change-transform">
              {Array.from({ length: ROWS_S }, (_, r) => (
                <span key={r} className="block h-[1em] leading-none">
                  {r % 10}
                </span>
              ))}
            </span>
          </span>
        ))}
      </span>
    );
  },
);
