# Dairy Classic — website

A light, motion-rich redesign of dairyclassics.com. Built with Next.js 16 (App Router, Cache Components), Tailwind CSS 4, GSAP 3.15, Lenis and next-intl (EN / UZ / RU).

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start
```

On this machine Node is a portable install that isn't on PATH. Put it on PATH first:

```powershell
$env:Path = "$env:LOCALAPPDATA\node-portable\node-v26.13.1-win-x64;" + $env:Path
```

## Where things live

| Path | What |
|---|---|
| `src/styles/tokens.css` | **Design tokens**: brand colours taken from the live Elementor CSS, type scale, shadows, motion easing. Contrast ratios are noted inline. |
| `src/lib/motion.ts` | GSAP easing, duration and media-query constants |
| `src/lib/catalog.ts` | All 44 products and 6 categories (proofread copy from the current site) |
| `src/lib/site.ts` | Address, phones, WhatsApp, hours, socials |
| `messages/{en,uz,ru}.json` | UI copy. UZ and RU fall back to EN key by key. |
| `src/components/motion/` | Reusable motion pieces (`Odometer`, `OutlineFillHeading`, …) |
| `src/components/layout/` | Header, MenuOverlay, LangSwitch, Footer, WhatsAppFab, IntroLoader |
| `src/components/home/` | Homepage sections |
| `src/proxy.ts` | Locale routing (Next 16 "proxy", formerly middleware) |
| `next.config.ts` | 301 redirects from the old WordPress URLs |

## Images

All images are self-hosted in `public/images/`. They were downloaded from the current site and converted to trimmed WebP. The logo's outer white was flood-filled to transparency. To regenerate them from the originals:

```bash
node scripts/process-images.mjs <folder-of-original-downloads>
```

## Motion rules

- Every animation is created inside `useGSAP` or `gsap.matchMedia`, so it is reverted on unmount.
- `prefers-reduced-motion` turns off Lenis, pinning, scrubbing, parallax and auto-rotation. Entrances become 0.3s fades.
- Below 768px: no mouse parallax.

## QA scripts

These use the system Microsoft Edge through `playwright-core`, so there is no browser download.

```bash
node scripts/shoot.mjs http://localhost:3000/ ./shots          # desktop, 375px and reduced motion
node scripts/shoot-interactions.mjs http://localhost:3000/ ./shots   # menu, WhatsApp, loader, locales, footer
```

## Before launch

- [ ] Logo as SVG (the only source is a 150×174 JPG)
- [ ] Confirm the business email (`support@dairyclassic.uz`, taken from the About page)
- [ ] Confirm the claims "80,000 L daily" and "#1 consumers' first choice"
- [ ] Native-speaker review of the UZ and RU copy
- [ ] Photography: ingredient cut-outs (the hero uses SVG illustrations for now) and recipe photos with the tub in shot
- [ ] Tub packshots for **Ambroziya 1 L** and **Choco Chips 1 L** (none exist on the current site)
- [ ] Descriptions for **Tapo** and **Heart Delight** (missing on the current site, so they are hidden)
