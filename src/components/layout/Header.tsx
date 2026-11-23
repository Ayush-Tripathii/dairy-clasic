"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { LangSwitch } from "./LangSwitch";

type Props = { menuOpen: boolean; onToggleMenu: () => void };

/**
 * Transparent at the top → white + blur after 40px. Hides on scroll down, returns on scroll up.
 * Desktop: Collection · Our Story | logo | Recipes · Partner · EN/UZ/RU · Menu.
 */
export function Header({ menuOpen, onToggleMenu }: Props) {
  const t = useTranslations();
  const pathname = usePathname();
  const root = useRef<HTMLElement>(null);
  const openRef = useRef(menuOpen);
  useEffect(() => {
    openRef.current = menuOpen;
  }, [menuOpen]);

  useGSAP(
    () => {
      const el = root.current!;
      const show = gsap.quickTo(el, "yPercent", { duration: 0.45, ease: "power3.out" });
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate(self) {
          const y = self.scroll();
          el.dataset.scrolled = String(y > 40);
          if (openRef.current) return show(0);
          show(self.direction === 1 && y > 160 ? -110 : 0);
        },
      });
    },
    { scope: root },
  );

  useGSAP(() => {
    if (menuOpen) gsap.to(root.current, { yPercent: 0, duration: 0.3 });
  }, [menuOpen]);

  const navLink = (href: string, label: string) => (
    <TransitionLink
      href={href}
      aria-current={pathname.startsWith(href) ? "page" : undefined}
      className="link-draw font-display text-[0.92rem] font-semibold text-primary"
    >
      {label}
    </TransitionLink>
  );

  return (
    <header
      ref={root}
      data-scrolled="false"
      data-menu={menuOpen}
      className="group/header fixed inset-x-0 top-0 z-[90] h-[var(--header-h)] transition-[background-color,box-shadow,backdrop-filter] duration-500 ease-soft data-[scrolled=true]:bg-white/85 data-[scrolled=true]:shadow-[0_1px_0_var(--color-line)] data-[scrolled=true]:backdrop-blur-xl data-[menu=true]:!bg-transparent data-[menu=true]:!shadow-none data-[menu=true]:!backdrop-blur-none"
    >
      <div className="container-x grid h-full grid-cols-[1fr_auto_1fr] items-center">
        <nav aria-label={t("a11y.mainNav")} className="hidden items-center gap-8 md:flex">
          {navLink("/collection", t("nav.collection"))}
          {navLink("/our-story", t("nav.story"))}
        </nav>
        <div className="md:hidden" />

        <TransitionLink href="/" aria-label={t("a11y.home")} className="justify-self-center rounded-lg">
          <Image
            src="/images/brand/dairy-classic-logo.png"
            alt="Dairy Classic"
            width={116}
            height={133}
            priority
            sizes="60px"
            className="h-[54px] w-auto transition-transform duration-500 ease-soft hover:scale-[1.04] max-md:h-[46px]"
          />
        </TransitionLink>

        <div className="flex items-center justify-end gap-6 lg:gap-8">
          <div className="hidden items-center gap-8 lg:flex">
            {navLink("/our-story", t("nav.blog"))}
            {navLink("/partner", t("nav.partner"))}
          </div>
          <LangSwitch className="hidden md:block" />
          <button
            type="button"
            onClick={onToggleMenu}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            aria-label={menuOpen ? t("a11y.closeMenu") : t("a11y.openMenu")}
            className="group flex h-11 items-center gap-3 rounded-full bg-primary pr-2 pl-4 text-[var(--color-on-primary)] transition-shadow duration-300 hover:shadow-[var(--shadow-md)]"
          >
            <span className="roll font-display text-sm font-semibold max-sm:hidden" aria-hidden>
              <span className="roll__inner">
                <span>{menuOpen ? t("nav.close") : t("nav.menu")}</span>
                <span className="roll__clone">{menuOpen ? t("nav.close") : t("nav.menu")}</span>
              </span>
            </span>
            <span className="relative block h-7 w-7 rounded-full bg-[var(--color-on-primary)]" aria-hidden>
              <span
                className={`absolute top-1/2 left-1/2 h-[1.5px] w-3.5 -translate-x-1/2 bg-primary transition-transform duration-500 ease-soft ${
                  menuOpen ? "rotate-45" : "-translate-y-[3px]"
                }`}
              />
              <span
                className={`absolute top-1/2 left-1/2 h-[1.5px] w-3.5 -translate-x-1/2 bg-primary transition-transform duration-500 ease-soft ${
                  menuOpen ? "-rotate-45" : "translate-y-[3px]"
                }`}
              />
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
