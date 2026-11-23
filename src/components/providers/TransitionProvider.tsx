"use client";

import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { MQ } from "@/lib/motion";
import { useLenis } from "./SmoothScroll";

type Ctx = { navigate: (href: string) => void };
const TransitionContext = createContext<Ctx>({ navigate: () => {} });
export const usePageTransition = () => useContext(TransitionContext);

/**
 * Light curtain wipe between routes: 0.3s cover → route change → 0.3s reveal (0.6s total).
 * Reduced motion: navigates immediately.
 */
export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const lenis = useLenis();
  const curtain = useRef<HTMLDivElement>(null);
  const pending = useRef(false);
  const fallback = useRef<number | undefined>(undefined);

  const reveal = useCallback(() => {
    window.clearTimeout(fallback.current);
    pending.current = false;
    lenis?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
    ScrollTrigger.refresh();
    gsap.to(curtain.current, {
      clipPath: "inset(0% 0% 100% 0%)",
      duration: 0.3,
      ease: "power3.out",
      onComplete: () => gsap.set(curtain.current, { visibility: "hidden" }),
    });
  }, [lenis]);

  const navigate = useCallback(
    (href: string) => {
      const reduce = window.matchMedia(MQ.reduced).matches;
      if (reduce || !curtain.current) {
        router.push(href);
        return;
      }
      pending.current = true;
      gsap.fromTo(
        curtain.current,
        { visibility: "visible", clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.3,
          ease: "power3.in",
          onComplete: () => {
            router.push(href);
            // Same-route clicks never change the pathname; don't strand the curtain.
            fallback.current = window.setTimeout(reveal, 1200);
          },
        },
      );
    },
    [router, reveal],
  );

  useEffect(() => {
    if (pending.current) reveal();
  }, [pathname, reveal]);

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}
      <div
        ref={curtain}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[95] grid place-items-center bg-surface"
        style={{ visibility: "hidden", clipPath: "inset(100% 0% 0% 0%)" }}
      >
        <span className="font-display text-sm font-semibold tracking-[0.3em] text-primary uppercase">
          Dairy Classic
        </span>
      </div>
    </TransitionContext.Provider>
  );
}
