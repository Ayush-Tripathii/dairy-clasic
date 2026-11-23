/**
 * Homepage walk-through: screenshots each section (and points inside pinned sections).
 * Usage: node scripts/shoot-home.mjs <url> <outDir> [--only=desktop,mobile,reduced]
 */
import { chromium } from "playwright-core";
import fs from "node:fs";
import path from "node:path";

const [url, outDir, ...flags] = process.argv.slice(2);
const only = (flags.find((f) => f.startsWith("--only=")) ?? "--only=desktop,mobile").slice(7).split(",");
fs.mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch({ channel: "msedge", headless: true });

const variants = {
  desktop: { viewport: { width: 1440, height: 900 }, reducedMotion: "no-preference" },
  mobile: { viewport: { width: 375, height: 812 }, reducedMotion: "no-preference", isMobile: true, hasTouch: true },
  reduced: { viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" },
};

for (const name of only) {
  const ctx = await browser.newContext(variants[name]);
  await ctx.addInitScript(() => localStorage.setItem("dc-intro-seen", "1"));
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);

  // Section stops: top of each section; for pinned sections also 50% and 95% through the pin.
  const stops = await page.evaluate(() => {
    const out = [];
    const vh = innerHeight;
    document.querySelectorAll("main > section").forEach((s, i) => {
      const label = s.getAttribute("aria-labelledby") ?? s.getAttribute("aria-label") ?? `s${i}`;
      const spacer = s.querySelector(".pin-spacer");
      const top = s.getBoundingClientRect().top + scrollY;
      out.push({ label, y: top });
      if (spacer) {
        const span = spacer.getBoundingClientRect().height - vh;
        const st = spacer.getBoundingClientRect().top + scrollY;
        out.push({ label: `${label}-50`, y: st + span * 0.5 }, { label: `${label}-95`, y: st + span * 0.95 });
      } else if (s.offsetHeight > vh * 1.3) {
        out.push({ label: `${label}-b`, y: top + s.offsetHeight - vh });
      }
    });
    return out;
  });

  let n = 0;
  for (const s of stops) {
    await page.evaluate((y) => window.scrollTo(0, y), Math.round(s.y));
    await page.waitForTimeout(1500);
    const file = path.join(outDir, `${name}-${String(++n).padStart(2, "0")}-${s.label}.png`);
    await page.screenshot({ path: file });
  }
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  console.log(`${name}: ${n} shots, page height ${height}px, horizontal overflow ${overflow}px, errors: ${errors.length ? "\n  " + errors.join("\n  ") : "none"}`);
  await ctx.close();
}
await browser.close();
