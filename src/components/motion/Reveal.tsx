"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { MQ } from "@/lib/motion";

type Props = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Animate direct children marked [data-reveal] in sequence; otherwise the wrapper itself. */
  stagger?: number;
  y?: number;
  start?: string;
};

/** Fade-up entrance that plays once. Reduced motion: a 0.3s fade. */
export function Reveal({ children, as: Tag = "div", className = "", stagger = 0.08, y = 36, start = "top 85%" }: Props) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const items = root.current!.querySelectorAll("[data-reveal]");
      const targets = items.length ? items : root.current;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.from(targets, {
          y,
          autoAlpha: 0,
          duration: 1,
          stagger,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start, once: true },
        });
      });
      mm.add(MQ.reduced, () => {
        gsap.from(targets, { autoAlpha: 0, duration: 0.3, ease: "none", scrollTrigger: { trigger: root.current, start, once: true } });
      });
    },
    { scope: root },
  );

  return (
    <Tag ref={root} className={className}>
      {children}
    </Tag>
  );
}
