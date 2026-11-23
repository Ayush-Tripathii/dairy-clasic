/**
 * QA for global UI interactions: menu overlay (+ hover swap), WhatsApp FAB, intro loader, locales, scrolled header.
 * Usage: node scripts/shoot-interactions.mjs <baseUrl> <outDir>
 */
import { chromium } from "playwright-core";
import fs from "node:fs";
import path from "node:path";

const [base, outDir] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });
const shot = (page, name) => page.screenshot({ path: path.join(outDir, `${name}.png`) }).then(() => console.log("saved", name));
const browser = await chromium.launch({ channel: "msedge", headless: true });
const errors = [];

async function ctx(viewport, { fresh = false, mobile = false } = {}) {
  const c = await browser.newContext({ viewport, isMobile: mobile, hasTouch: mobile });
  if (!fresh) await c.addInitScript(() => localStorage.setItem("dc-intro-seen", "1"));
  const page = await c.newPage();
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  return { c, page };
}

// Intro loader mid-roll (first visit)
{
  const { c, page } = await ctx({ width: 1440, height: 900 }, { fresh: true });
  await page.goto(base, { waitUntil: "domcontentloaded" });
  await page.waitForSelector(".intro-loader");
  await page.waitForTimeout(650);
  await shot(page, "loader-mid");
  await page.waitForTimeout(2600);
  await shot(page, "loader-after");
  const seen = await page.evaluate(() => localStorage.getItem("dc-intro-seen"));
  console.log("intro flag after first visit:", seen);
  await c.close();
}

// Menu overlay + hover swap + keyboard
{
  const { c, page } = await ctx({ width: 1440, height: 900 });
  await page.goto(base, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await page.click('[aria-controls="site-menu"]');
  await page.waitForTimeout(1300);
  await shot(page, "menu-open");
  await page.hover("#site-menu li:nth-child(5) a");
  await page.waitForTimeout(900);
  await shot(page, "menu-hover-tubs");
  const focusInMenu = await page.evaluate(() => document.getElementById("site-menu")?.contains(document.activeElement));
  console.log("focus moved into menu:", focusInMenu);
  await page.keyboard.press("Tab");
  console.log("Tab lands on:", await page.evaluate(() => document.activeElement?.textContent?.trim().slice(0, 30)));
  await page.keyboard.press("Escape");
  await page.waitForTimeout(1100);
  const closed = await page.evaluate(() => getComputedStyle(document.getElementById("site-menu")).display === "none");
  console.log("menu hidden after Esc:", closed);

  // WhatsApp
  await page.click('[aria-controls="wa-panel"]');
  await page.waitForTimeout(800);
  await shot(page, "whatsapp-open");
  await page.keyboard.press("Escape");

  // Scrolled header (scroll up a little to reveal it white)
  await page.mouse.wheel(0, 700);
  await page.waitForTimeout(1200);
  await page.mouse.wheel(0, -200);
  await page.waitForTimeout(1200);
  await shot(page, "header-scrolled");

  // Footer wordmark fill at the very bottom
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.mouse.wheel(0, 4000);
  await page.waitForTimeout(1800);
  await shot(page, "footer-bottom");
  await c.close();
}

// Locales
for (const l of ["uz", "ru"]) {
  for (const [name, vp, mobile] of [["desktop", { width: 1440, height: 900 }, false], ["mobile", { width: 375, height: 812 }, true]]) {
    const { c, page } = await ctx(vp, { mobile });
    await page.goto(`${base}${l}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(3000);
    const overflow = await page.evaluate(() => {
      const h = document.getElementById("hero-title");
      return { page: document.documentElement.scrollWidth - innerWidth, h1: h ? h.scrollWidth - h.clientWidth : null, size: h && getComputedStyle(h).fontSize };
    });
    console.log(`${l} ${name}:`, JSON.stringify(overflow));
    await shot(page, `${l}-${name}`);
    await c.close();
  }
}

console.log(errors.length ? "ERRORS:\n" + errors.join("\n") : "no console errors");
await browser.close();
