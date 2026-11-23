/**
 * QA screenshots via the system Edge (no browser download).
 * Usage: node scripts/shoot.mjs <url> <outDir> [--scroll=px] [--wait=ms] [--fresh]
 * Captures desktop 1440×900 and mobile 375×812, normal + reduced motion, and logs console errors.
 */
import { chromium } from "playwright-core";
import fs from "node:fs";
import path from "node:path";

const [url, outDir, ...flags] = process.argv.slice(2);
const opt = Object.fromEntries(flags.map((f) => f.replace(/^--/, "").split("=")).map(([k, v]) => [k, v ?? true]));
const wait = Number(opt.wait ?? 2600);
const scrolls = String(opt.scroll ?? "0").split(",").map(Number);
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ channel: "msedge", headless: true });
const variants = [
  { name: "desktop", viewport: { width: 1440, height: 900 }, motion: "no-preference" },
  { name: "mobile", viewport: { width: 375, height: 812 }, motion: "no-preference", isMobile: true, hasTouch: true },
  { name: "desktop-reduced", viewport: { width: 1440, height: 900 }, motion: "reduce" },
].filter((v) => !opt.only || String(opt.only).split(",").includes(v.name));

for (const v of variants) {
  const ctx = await browser.newContext({ viewport: v.viewport, reducedMotion: v.motion, isMobile: v.isMobile, hasTouch: v.hasTouch, deviceScaleFactor: 1 });
  if (!opt.fresh) await ctx.addInitScript(() => localStorage.setItem("dc-intro-seen", "1"));
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(wait);
  for (const y of scrolls) {
    if (y) {
      await page.mouse.wheel(0, y);
      await page.waitForTimeout(1600);
    }
    const file = path.join(outDir, `${v.name}${y ? `-y${y}` : ""}.png`);
    await page.screenshot({ path: file });
    console.log("saved", file);
  }
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  console.log(`${v.name}: horizontal overflow ${overflow}px; errors: ${errors.length ? "\n  " + errors.join("\n  ") : "none"}`);
  await ctx.close();
}
await browser.close();
