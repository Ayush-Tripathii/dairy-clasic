"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { SplitText } from "gsap/SplitText";
import { gsap, useGSAP } from "@/lib/gsap";
import { MQ } from "@/lib/motion";

if (typeof window !== "undefined") gsap.registerPlugin(SplitText);

type Props = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  id?: string;
  delay?: number;
  start?: string;
};

/** Heading whose lines rise from behind a mask once, when scrolled into view. Re-splits on resize. */
export function SplitReveal({ children, as: Tag = "h2", className = "", id, delay = 0, start = "top 85%" }: Props) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        let played = false;
        const split = SplitText.create(el, {
          type: "lines",
          mask: "lines",
          linesClass: "split-line",
          autoSplit: true,
          onSplit(self) {
            // After the first play, re-splits (on resize) just show the text.
            if (played) return;
            return gsap.from(self.lines, {
              yPercent: 110,
              duration: 1.15,
              stagger: 0.08,
              ease: "expo.out",
              delay,
              scrollTrigger: { trigger: el, start, once: true, onEnter: () => (played = true) },
            });
          },
        });
        return () => split.revert();
      });
      mm.add(MQ.reduced, () => {
        gsap.from(el, { autoAlpha: 0, duration: 0.3, ease: "none", scrollTrigger: { trigger: el, start, once: true } });
      });
    },
    { scope: root },
  );

  return (
    <Tag ref={root} id={id} className={className}>
      {children}
    </Tag>
  );
}
