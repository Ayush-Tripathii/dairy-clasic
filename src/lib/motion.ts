/** Motion system constants — one source of truth for every GSAP timeline. */
export const EASE = {
  entrance: "expo.out",
  entranceSoft: "power3.out",
  scrub: "power2.inOut",
  css: "cubic-bezier(0.22, 1, 0.36, 1)",
} as const;

export const DUR = {
  hover: 0.4,
  entrance: 1.1,
  entranceShort: 0.8,
  stagger: 0.08,
  staggerTight: 0.05,
  curtain: 0.6,
} as const;

/** gsap.matchMedia conditions used across components. */
export const MQ = {
  motion: "(prefers-reduced-motion: no-preference)",
  reduced: "(prefers-reduced-motion: reduce)",
  desktop: "(min-width: 768px)",
  mobile: "(max-width: 767px)",
  /** Full-viewport stages: wide enough AND tall enough (see the `wide`/`narrow` CSS variants in globals.css). */
  wide: "(min-width: 768px) and (min-height: 560px)",
  narrow: "(max-width: 767px), (max-height: 559px)",
  finePointer: "(hover: hover) and (pointer: fine)",
} as const;
