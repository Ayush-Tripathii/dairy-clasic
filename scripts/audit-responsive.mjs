/**
 * Responsive audit: loads a URL at many viewports and reports layout problems.
 * Usage: node scripts/audit-responsive.mjs <url> <outDir> [--sizes=320x568,375x812] [--shots]
 *
 * Reports per viewport:
 *  - offscreen: visible elements whose box pokes past the viewport edge and aren't
 *    clipped by an overflow:hidden/clip ancestor (body's overflow-x:clip hides these from scrollWidth)
 *  - overflowX: elements whose content is wider than their box (text not wrapping / too big)
 *  - smallTargets: links/buttons under 40x40 on touch viewports
 *  - tinyText: rendered text under 12px
 */
import { chromium } from "playwright-core";
import fs from "node:fs";
import path from "node:path";

const [url, outDir, ...flags] = process.argv.slice(2);
const sizesFlag = flags.find((f) => f.startsWith("--sizes="));
const shots = flags.includes("--shots");
const sizes = (sizesFlag ? sizesFlag.slice(8) : "320x568,360x740,375x812,414x896,568x320,812x375,768x1024,1024x768,1280x800,1440x900,1920x1080")
  .split(",")
  .map((s) => s.split("x").map(Number));
fs.mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch({ channel: "msedge", headless: true });

for (const [w, h] of sizes) {
  const touch = w < 1024;
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: touch, hasTouch: touch });
  await ctx.addInitScript(() => localStorage.setItem("dc-intro-seen", "1"));
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);

  // Scroll through so ScrollTriggers / lazy content settle, then audit at several scroll points.
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  const findings = new Map();
  for (let y = 0; y < total; y += Math.round(h * 0.8)) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(350);
    const res = await page.evaluate(({ touch }) => {
      const vw = document.documentElement.clientWidth;
      const out = [];
      const desc = (el) => {
        let s = el.tagName.toLowerCase();
        if (el.id) s += "#" + el.id;
        const cls = typeof el.className === "string" ? el.className.trim().split(/\s+/).slice(0, 4).join(".") : "";
        if (cls) s += "." + cls;
        const sec = el.closest("section,header,footer,nav,[role=dialog]");
        const secName = sec ? sec.getAttribute("aria-labelledby") || sec.getAttribute("aria-label") || sec.tagName.toLowerCase() : "";
        const txt = (el.innerText || el.getAttribute("aria-label") || "").trim().slice(0, 40).replace(/\s+/g, " ");
        return `[${secName}] ${s}${txt ? ` "${txt}"` : ""}`;
      };
      const visible = (el, r) => {
        if (r.width === 0 || r.height === 0) return false;
        const cs = getComputedStyle(el);
        return cs.visibility !== "hidden" && cs.display !== "none" && Number(cs.opacity) > 0.05;
      };
      const clippedByAncestor = (el) => {
        for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
          const cs = getComputedStyle(p);
          if (/(hidden|clip|auto|scroll)/.test(cs.overflowX) || cs.clipPath !== "none") {
            const pr = p.getBoundingClientRect();
            if (pr.right <= vw + 1 && pr.left >= -1) return true;
          }
          if (cs.position === "fixed") return false;
        }
        return false;
      };
      const ariaHidden = (el) => !!el.closest("[aria-hidden=true],[inert]");
      for (const el of document.body.querySelectorAll("*")) {
        if (["SCRIPT", "STYLE", "NOSCRIPT", "svg"].includes(el.tagName) || el.closest("svg")) continue;
        const r = el.getBoundingClientRect();
        if (!visible(el, r)) continue;
        if ((r.right > vw + 1 || r.left < -1) && !clippedByAncestor(el) && !ariaHidden(el)) out.push(["offscreen", `${desc(el)} L${Math.round(r.left)} R${Math.round(r.right)} vw${vw}`]);
        const cs = getComputedStyle(el);
        if (el.scrollWidth > el.clientWidth + 2 && el.clientWidth > 0 && !/(hidden|clip|auto|scroll)/.test(cs.overflowX) && /^H[1-6]$|^P$|^A$|^BUTTON$|^SPAN$/.test(el.tagName))
          out.push(["overflowX", `${desc(el)} content ${el.scrollWidth} > box ${el.clientWidth}`]);
        if (touch && (el.tagName === "A" || el.tagName === "BUTTON") && !ariaHidden(el) && r.top < innerHeight && r.bottom > 0) {
          if (r.width < 40 || r.height < 40) out.push(["smallTargets", `${desc(el)} ${Math.round(r.width)}x${Math.round(r.height)}`]);
        }
        const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
        if (hasText && parseFloat(cs.fontSize) < 12 && !ariaHidden(el)) out.push(["tinyText", `${desc(el)} ${cs.fontSize}`]);
      }
      return out;
    }, { touch });
    for (const [k, v] of res) {
      if (!findings.has(k)) findings.set(k, new Set());
      findings.get(k).add(v);
    }
  }
  const docOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  console.log(`\n=== ${w}x${h}  docOverflow=${docOverflow}px  errors=${errors.length}`);
  for (const [k, set] of findings) {
    console.log(`  ${k} (${set.size}):`);
    [...set].slice(0, 25).forEach((v) => console.log("    " + v));
  }
  if (shots) {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
    for (let y = 0, n = 0; y < total; y += h, n++) {
      await page.evaluate((y) => window.scrollTo(0, y), y);
      await page.waitForTimeout(700);
      await page.screenshot({ path: path.join(outDir, `${w}x${h}-${String(n).padStart(2, "0")}.png`) });
    }
  }
  await ctx.close();
}
await browser.close();
