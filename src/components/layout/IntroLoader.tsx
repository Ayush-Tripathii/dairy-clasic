"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { gsap, useGSAP } from "@/lib/gsap";
import { INTRO_KEY, useIntro } from "@/components/providers/IntroProvider";
import { useLenis } from "@/components/providers/SmoothScroll";
import { Odometer } from "@/components/motion/Odometer";

/** First visit only, ≤1.5s: logo → 1996 rolls to 2026 → light curtain lifts. */
export function IntroLoader() {
  const t = useTranslations("a11y");
  const { finish } = useIntro();
  const lenis = useLenis();
  const root = useRef<HTMLDivElement>(null);
  const [year, setYear] = useState(1996);
  const [gone, setGone] = useState(false);
  const lenisRef = useRef(lenis);

  // Lenis mounts after us; keep it paused while the loader is up.
  useEffect(() => {
    lenisRef.current = lenis;
    if (!gone) lenis?.stop();
  }, [lenis, gone]);

  useGSAP(
    () => {
      const el = root.current;
      if (!el || document.documentElement.classList.contains("intro-seen")) {
        setGone(true);
        return;
      }
      const tl = gsap.timeline({
        onComplete: () => {
          try {
            localStorage.setItem(INTRO_KEY, "1");
          } catch {}
          lenisRef.current?.start();
          setGone(true);
        },
      });
      tl.from("[data-intro-logo]", { autoAlpha: 0, scale: 0.9, duration: 0.45, ease: "power3.out" })
        .from("[data-intro-year]", { autoAlpha: 0, y: 12, duration: 0.3, ease: "power3.out" }, 0.15)
        .call(() => setYear(2026), [], 0.3)
        // Curtain lifts at 1.05s; let the page start its entrance as it goes.
        .call(finish, [], 1.05)
        .to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.45, ease: "power3.inOut" }, 1.05);
    },
    { scope: root },
  );

  if (gone) return null;

  return (
    <div
      ref={root}
      role="status"
      aria-label={t("loading")}
      className="intro-loader fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-bg"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
    >
      <Image
        data-intro-logo
        src="/images/brand/dairy-classic-logo.png"
        alt=""
        width={116}
        height={133}
        priority
        className="h-auto w-[92px]"
      />
      <div data-intro-year className="font-display text-4xl font-bold text-primary">
        <Odometer value={year} initial={1996} digits={4} duration={0.75} stagger={0.05} />
      </div>
    </div>
  );
}
