"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { MQ } from "@/lib/motion";

type Props = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** "reveal": wipes once on enter. "scrub": fill tracks scroll between start/end. */
  mode?: "reveal" | "scrub";
  direction?: "ltr" | "btt";
  start?: string;
  end?: string;
  strokeWidth?: string;
  id?: string;
};

/**
 * An outline copy sits behind; a filled copy wipes over it with clip-path.
 * The filled copy is the accessible one; the outline is aria-hidden.
 */
export function OutlineFillHeading({
  children,
  as: Tag = "h2",
  className = "",
  mode = "reveal",
  direction = "ltr",
  start = "top 80%",
  end = "bottom 60%",
  strokeWidth = "1.5px",
  id,
}: Props) {
  const root = useRef<HTMLElement>(null);
  const hidden = direction === "ltr" ? "inset(0% 100% 0% 0%)" : "inset(100% 0% 0% 0%)";

  useGSAP(
    () => {
      const fill = root.current!.querySelector("[data-fill]");
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const vars = { clipPath: "inset(0% 0% 0% 0%)", ease: mode === "scrub" ? "none" : "expo.inOut" };
        if (mode === "scrub") {
          gsap.fromTo(fill, { clipPath: hidden }, { ...vars, scrollTrigger: { trigger: root.current, start, end, scrub: 0.6 } });
        } else {
          gsap.fromTo(fill, { clipPath: hidden }, { ...vars, duration: 1.4, scrollTrigger: { trigger: root.current, start, once: true } });
        }
      });
      mm.add(MQ.reduced, () => {
        gsap.set(fill, { clipPath: "inset(0% 0% 0% 0%)" });
      });
    },
    { scope: root },
  );

  return (
    <Tag ref={root} id={id} className={`relative ${className}`}>
      <span aria-hidden className="block text-transparent select-none" style={{ WebkitTextStroke: `${strokeWidth} currentColor` }}>
        {children}
      </span>
      <span data-fill className="absolute inset-0 block" style={{ clipPath: hidden }}>
        {children}
      </span>
    </Tag>
  );
}
