"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { MQ } from "@/lib/motion";

type Props = {
  to: number;
  from?: number;
  /** Zero-pad to this many digits, e.g. 6 → "080,000". */
  pad?: number;
  /** Insert thousands separators. */
  group?: boolean;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
};

const format = (n: number, pad: number, group: boolean) => {
  const s = String(Math.round(n)).padStart(pad, "0");
  return group ? s.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : s;
};

/** Counts up once when scrolled into view. Tabular figures; the final value is in the DOM for SEO/AT. */
export function CountUp({ to, from = 0, pad = 0, group = false, duration = 2, className = "", prefix = "", suffix = "" }: Props) {
  const el = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const node = el.current!;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const o = { v: from };
        node.textContent = prefix + format(from, pad, group) + suffix;
        gsap.to(o, {
          v: to,
          duration,
          ease: "power3.out",
          scrollTrigger: { trigger: node, start: "top 90%", once: true },
          onUpdate: () => (node.textContent = prefix + format(o.v, pad, group) + suffix),
        });
      });
    },
    { scope: el },
  );

  return (
    <span ref={el} className={`tabular ${className}`}>
      {prefix + format(to, pad, group) + suffix}
    </span>
  );
}
