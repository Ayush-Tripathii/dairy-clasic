"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { gsap, useGSAP } from "@/lib/gsap";
import { site } from "@/lib/site";

export function WhatsAppGlyph({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.23 8.23 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.13-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48a.92.92 0 0 0-.66.31c-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.29Z" />
    </svg>
  );
}

/** Bottom-right WhatsApp button that expands into Tashkent and Samarkand chats. */
export function WhatsAppFab() {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      gsap.from(root.current, { scale: 0, autoAlpha: 0, duration: 0.8, delay: 1.6, ease: "back.out(1.8)" });
      tl.current = gsap
        .timeline({ paused: true, defaults: { ease: "expo.out" } })
        .fromTo("[data-wa-panel]", { autoAlpha: 0, y: 12, scale: 0.94 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.45 })
        .fromTo("[data-wa-option]", { autoAlpha: 0, x: 16 }, { autoAlpha: 1, x: 0, duration: 0.5, stagger: 0.07 }, 0.08);
    },
    { scope: root },
  );

  useEffect(() => {
    if (open) tl.current?.timeScale(1).play();
    else tl.current?.timeScale(1.8).reverse();
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  return (
    <div ref={root} className="fixed right-4 bottom-4 z-[80] flex flex-col items-end gap-3 md:right-6 md:bottom-6">
      <div
        id="wa-panel"
        data-wa-panel
        style={{ visibility: "hidden" }}
        className="w-64 origin-bottom-right rounded-[var(--radius-md)] bg-white p-3 shadow-[var(--shadow-lg)]"
      >
        <p className="px-2 pt-1 pb-2 font-display text-sm font-semibold text-primary">{t("whatsapp.title")}</p>
        <ul className="flex flex-col gap-1.5">
          {site.whatsapp.map((w) => (
            <li key={w.city} data-wa-option>
              <a
                href={w.href}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={open ? 0 : -1}
                className="group flex items-center justify-between gap-3 rounded-2xl bg-surface-2 px-3 py-2.5 transition-colors duration-300 hover:bg-surface"
              >
                <span>
                  <span className="block font-display text-sm font-semibold text-primary">
                    {t(`whatsapp.${w.city.toLowerCase() as "tashkent" | "samarkand"}`)}
                  </span>
                  <span className="tabular block text-xs text-muted">{w.label}</span>
                </span>
                <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden className="text-primary transition-transform duration-300 ease-soft group-hover:translate-x-1">
                  <path d="M3 9h11.5M10 4.5 14.5 9 10 13.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </li>
          ))}
        </ul>
      </div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="wa-panel"
        aria-label={t("a11y.whatsappToggle")}
        className="group flex h-14 items-center gap-0 overflow-hidden rounded-full bg-primary pr-4 pl-4 text-[var(--color-on-primary)] shadow-[var(--shadow-md)] transition-[gap,box-shadow] duration-500 ease-soft hover:gap-2.5 hover:shadow-[var(--shadow-lg)] focus-visible:gap-2.5"
      >
        <WhatsAppGlyph className={`h-6 w-6 shrink-0 transition-transform duration-500 ease-soft ${open ? "rotate-[360deg]" : ""}`} />
        <span className="max-w-0 overflow-hidden font-display text-sm font-semibold whitespace-nowrap transition-[max-width] duration-500 ease-soft group-hover:max-w-28 group-focus-visible:max-w-28">
          {t("whatsapp.label")}
        </span>
      </button>
    </div>
  );
}
