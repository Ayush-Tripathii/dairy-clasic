"use client";

import Lenis from "lenis";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { MQ } from "@/lib/motion";

const LenisContext = createContext<Lenis | null>(null);
export const useLenis = () => useContext(LenisContext);

/** Lenis smooth scroll driven by GSAP's ticker so ScrollTrigger stays in sync. Off for reduced motion. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(MQ.reduced);
    let instance: Lenis | null = null;
    let tick: ((time: number) => void) | null = null;

    const start = () => {
      instance = new Lenis({ autoRaf: false, lerp: 0.1, smoothWheel: true, syncTouch: false });
      instance.on("scroll", ScrollTrigger.update);
      tick = (time: number) => instance?.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      setLenis(instance);
    };
    const stop = () => {
      if (tick) gsap.ticker.remove(tick);
      instance?.destroy();
      instance = null;
      setLenis(null);
    };
    const onChange = () => (mq.matches ? stop() : start());

    if (!mq.matches) start();
    mq.addEventListener("change", onChange);
    return () => {
      mq.removeEventListener("change", onChange);
      stop();
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
