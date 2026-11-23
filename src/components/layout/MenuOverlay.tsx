"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { gsap, useGSAP } from "@/lib/gsap";
import { categories, categoryCount, pad2 } from "@/lib/catalog";
import { site } from "@/lib/site";
import { MQ } from "@/lib/motion";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { useLenis } from "@/components/providers/SmoothScroll";
import { LangSwitch } from "./LangSwitch";

type Props = { open: boolean; onClose: () => void };

/** Full-screen light menu. Clip-path wipe from the top; hovering a category swaps the preview. */
export function MenuOverlay({ open, onClose }: Props) {
  const t = useTranslations();
  const lenis = useLenis();
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const reduce = window.matchMedia(MQ.reduced).matches;
      // GSAP owns display: shown at play, removed from layout (and the a11y tree) when fully reversed.
      const t = gsap.timeline({
        paused: true,
        onStart: () => gsap.set(root.current, { display: "block" }),
        onReverseComplete: () => gsap.set(root.current, { display: "none" }),
        defaults: { ease: "expo.out" },
      });
      if (reduce) {
        // Opacity only, so the dialog stays focusable from the first frame.
        t.fromTo(root.current, { opacity: 0, visibility: "visible" }, { opacity: 1, duration: 0.3, ease: "none" });
      } else {
        t.fromTo(
          root.current,
          { autoAlpha: 1, clipPath: "inset(0% 0% 100% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.85, ease: "expo.inOut" },
        )
          .fromTo("[data-menu-item]", { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.06 }, 0.4)
          .fromTo("[data-menu-preview]", { autoAlpha: 0, scale: 1.08 }, { autoAlpha: 1, scale: 1, duration: 1.1 }, 0.45);
      }
      tl.current = t;
    },
    { scope: root },
  );

  // Open / close
  useEffect(() => {
    const main = document.getElementById("main");
    const footer = document.getElementById("site-footer");
    if (open) {
      gsap.set(root.current, { display: "block" });
      lenis?.stop();
      tl.current?.timeScale(1).play();
      main?.setAttribute("inert", "");
      footer?.setAttribute("inert", "");
      // Items are still mid-stagger (visibility: hidden), so focus the dialog itself; Tab reaches item 01 next.
      root.current?.focus({ preventScroll: true });
    } else if (tl.current && tl.current.progress() > 0) {
      tl.current.timeScale(2.2).reverse();
      lenis?.start();
      main?.removeAttribute("inert");
      footer?.removeAttribute("inert");
    }
  }, [open, lenis]);

  // Esc + focus trap (overlay + header toggle)
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        document.querySelector<HTMLElement>('[aria-controls="site-menu"]')?.focus();
        return;
      }
      if (e.key !== "Tab" || !root.current) return;
      const toggle = document.querySelector<HTMLElement>('[aria-controls="site-menu"]');
      const items = [
        ...(toggle ? [toggle] : []),
        ...root.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
      ];
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const secondary = [
    { href: "/our-story", label: t("nav.story"), id: "story" },
    { href: "/blog", label: t("nav.blog"), id: "blog" },
    { href: "/partner", label: t("nav.partner"), id: "partner" },
    { href: "/faqs", label: t("nav.faqs"), id: "faqs" },
    { href: "/contact", label: t("nav.contact"), id: "contact" },
  ];

  return (
    <div
      ref={root}
      id="site-menu"
      role="dialog"
      aria-modal="true"
      aria-label={t("nav.menu")}
      tabIndex={-1}
      // Lenis is stopped while the menu is open and would swallow wheel/touch; let the menu scroll natively.
      data-lenis-prevent
      className="fixed inset-0 z-[85] overflow-y-auto overscroll-contain bg-bg outline-none"
      style={{ display: "none", visibility: "hidden" }}
    >
      <div className="container-x grid min-h-full grid-rows-[1fr_auto] gap-10 pt-[calc(var(--header-h)+2rem)] pb-8 md:grid-cols-[1.1fr_1fr] md:gap-x-16">
        {/* Categories */}
        <nav aria-label={t("nav.collection")} className="self-center">
          <ol className="flex flex-col">
            {categories.map((c, i) => (
              <li key={c.slug} data-menu-item className="border-b border-line first:border-t">
                <TransitionLink
                  href={`/collection/${c.slug}`}
                  onClick={onClose}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className="group flex items-baseline gap-4 py-3 md:gap-6 md:py-4"
                >
                  <span
                    className={`tabular w-8 font-display text-sm font-semibold transition-[transform,color] duration-500 ease-soft ${
                      active === i ? "translate-x-1.5 text-accent-ink" : "text-muted"
                    }`}
                  >
                    {pad2(i + 1)}
                  </span>
                  <span className="font-display text-[clamp(1.5rem,3.2vw,2.8rem)] leading-none font-extrabold tracking-[-0.03em] text-primary uppercase transition-transform duration-500 ease-soft group-hover:translate-x-2">
                    {t(`categories.${c.slug}`)}
                  </span>
                  <span className="ml-auto text-sm text-muted">{t("nav.flavours", { count: categoryCount(c.slug) })}</span>
                </TransitionLink>
              </li>
            ))}
          </ol>
        </nav>

        {/* Preview */}
        <div data-menu-preview aria-hidden className="relative hidden aspect-square self-center md:block">
          <div className="absolute inset-[8%] rounded-full transition-colors duration-700" style={{ background: categories[active].tint }} />
          {categories.map((c, i) => (
            <Image
              key={c.slug}
              src={c.cover}
              alt=""
              fill
              sizes="(min-width: 768px) 40vw, 0px"
              className="object-contain p-[12%] drop-shadow-[0_30px_30px_rgb(104_47_38/0.25)] transition-[opacity,transform] duration-700 ease-soft"
              style={{ opacity: active === i ? 1 : 0, transform: `scale(${active === i ? 1 : 1.06})` }}
            />
          ))}
        </div>

        {/* Footer row */}
        <div className="flex flex-col gap-6 md:col-span-2 md:flex-row md:items-end md:justify-between">
          <ul data-menu-item className="flex flex-wrap gap-x-6 gap-y-2">
            {secondary.map((l) => (
              <li key={l.id}>
                <TransitionLink href={l.href} onClick={onClose} className="link-draw font-display font-semibold text-primary">
                  {l.label}
                </TransitionLink>
              </li>
            ))}
          </ul>
          <div data-menu-item className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
            <a href={site.phones[0].href} className="link-draw tabular font-semibold text-primary">
              {site.phones[0].label}
            </a>
            <ul className="flex gap-4" aria-label={t("nav.follow")}>
              {site.socials.slice(0, 4).map((s) => (
                <li key={s.name}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="link-draw text-muted hover:text-primary">
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
            <LangSwitch className="md:hidden" />
          </div>
        </div>
      </div>
    </div>
  );
}
