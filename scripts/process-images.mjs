/**
 * Converts original dairyclassics.com uploads into self-hosted, trimmed WebP files.
 * Usage: node scripts/process-images.mjs <path-to-raw-downloads>
 * Raw files are named like "2025_03_golden-f.webp" (year_month_original-name).
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const raw = process.argv[2];
if (!raw) throw new Error('Pass the raw download folder');
const pub = path.resolve('public/images');

/** [source, destination (relative to public/images), max edge, trim transparent padding] */
const jobs = [
  // Brand
  ['2024_09_355502536_242259618554440_5289971157363252706_n.jpg', 'brand/dairy-classic-logo.png', 600, false],
  // Cones
  ['2025_03_twist-x.webp', 'products/super-twist.webp', 900, true],
  ['2025_03_boom-c.webp', 'products/choco-boom.webp', 900, true],
  ['2025_03_golden-f.webp', 'products/golden-fantasy.webp', 900, true],
  ['2025_03_dice-s.webp', 'products/dice-n-slice.webp', 900, true],
  ['2025_03_twin-c.webp', 'products/twin-cone.webp', 900, true],
  ['2025_03_top-f.webp', 'products/top-fun.webp', 900, true],
  ['2025_03_copico.webp', 'products/capicon.webp', 900, true],
  // Sticks
  ['2025_03_super-choco.webp', 'products/super-choc.webp', 900, true],
  ['2025_03_bera-n.webp', 'products/vega.webp', 900, true],
  ['2025_03_bera-class.webp', 'products/classic-vega.webp', 900, true],
  ['2025_03_new-classic.webp', 'products/new-classic.webp', 900, true],
  ['2025_03_mokko.webp', 'products/koffee-mokko.webp', 900, true],
  ['2025_03_delizia.webp', 'products/delizia.webp', 900, true],
  ['2025_03_royal-f.webp', 'products/royal-fun.webp', 900, true],
  ['2025_03_pango-n.webp', 'products/pango.webp', 900, true],
  ['2025_03_frutonia.webp', 'products/frutonia.webp', 900, true],
  ['2025_03_tapo.webp', 'products/tapo.webp', 900, true],
  // Cups
  ['2024_10_Layer-1.webp', 'products/creamica-cheesecake.webp', 900, true],
  ['2024_10_Cremica-Vanilla.webp', 'products/creamica-vanilla.webp', 900, true],
  ['2024_10_Cremica-Biscuit.webp', 'products/creamica-biscuiti.webp', 900, true],
  ['2025_03_AMBROZIYA.webp', 'products/ambroziya-mini-cup.webp', 900, true],
  ['2025_03_orange.webp', 'products/orange-mini-cup.webp', 900, true],
  ['2025_03_choco.webp', 'products/choco-chips-mini-cup.webp', 900, true],
  ['2025_03_cappu.webp', 'products/cappuccino-mini-cup.webp', 900, true],
  // Biscuit
  ['2024_10_sandwich.webp', 'products/sandwich.webp', 900, true],
  ['2024_10_bricket.webp', 'products/bricket.webp', 900, true],
  ['2024_10_olino.webp', 'products/olino.webp', 900, true],
  ['2024_10_round.webp', 'products/round-pie.webp', 900, true],
  // Cassatta
  ['2024_10_Classic-Cassata.png', 'products/classic-cassatta.webp', 900, true],
  ['2024_10_Cassata-Cookies-N-Icre-Cream.webp', 'products/galaxy-cassatta.webp', 900, true],
  // Tubs
  ['2024_10_White-Tub-French-Vanilla.webp', 'products/french-vanilla.webp', 900, true],
  ['2024_10_Classic-Black-Tub-Coffee-Frenzy.webp', 'products/coffee-frenzy.webp', 900, true],
  ['2024_10_Classic-Black-Tub-Super-Vanilla.webp', 'products/super-vanilla.webp', 900, true],
  ['2024_10_Classic-Black-Tub-Chocolate-Dreams.webp', 'products/chocolate-dream.webp', 900, true],
  ['2024_10_White-Tub-Pistachio.webp', 'products/pistachio.webp', 900, true],
  ['2025_03_premium.webp', 'products/premium-chocolate.webp', 900, true],
  ['2024_10_White-Tub-Mango.webp', 'products/mango.webp', 900, true],
  ['2024_10_White-Tub-Heart-Delight.webp', 'products/heart-delight.webp', 900, true],
  ['2024_10_White-Tub-Classic-Delight.webp', 'products/classic-delight.webp', 900, true],
  ['2024_10_Swirls-Raspberry.webp', 'products/raspberry-swirl.webp', 900, true],
  ['2024_10_Swirls-Orange.webp', 'products/orange-swirl.webp', 900, true],
  ['2024_10_Swirls-Chocolate-Curls.webp', 'products/chocolate-curls.webp', 900, true],
  // Large unwrapped renders (hero / exhibit)
  ['2024_10_Muzqaymoq-Golden-Fantasy-1.png', 'renders/golden-fantasy.webp', 1100, true],
  ['2024_10_Muzqaymoq-Choco-Boom-1.png', 'renders/choco-boom.webp', 1100, true],
  ['2024_10_Muzqaymoq-supper-twist-1.png', 'renders/super-twist.webp', 1100, true],
  ['2024_10_Bera.png', 'renders/vega.webp', 1100, true],
  ['2025_03_chocolates-box-1.webp', 'scenes/creamica-burst.webp', 1200, true],
  ['2025_05_Group-1261152800.png', 'scenes/bricket-ring.webp', 1000, true],
  // About / story
  ['2025_03_developments.webp', 'story/factory.webp', 1600, false],
  ['2025_03_founder.webp', 'story/founder.webp', 900, false],
];

let total = 0;
for (const [src, dest, max, trim] of jobs) {
  const input = path.join(raw, src);
  const out = path.join(pub, dest);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  let img = sharp(input, { limitInputPixels: false });
  if (trim) img = img.trim({ threshold: 2 });
  img = img.resize({ width: max, height: max, fit: 'inside', withoutEnlargement: true });
  if (dest.endsWith('.png')) {
    // Logo (JPG on white): flood-fill the outer white from the edges to transparent,
    // leaving the white type inside the shield untouched.
    const { data, info } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const { width: w, height: h } = info;
    const light = (i) => Math.min(data[i * 4], data[i * 4 + 1], data[i * 4 + 2]);
    const seen = new Uint8Array(w * h);
    const stack = [];
    for (let x = 0; x < w; x++) stack.push(x, (h - 1) * w + x);
    for (let y = 0; y < h; y++) stack.push(y * w, y * w + w - 1);
    while (stack.length) {
      const i = stack.pop();
      if (seen[i]) continue;
      seen[i] = 1;
      const l = light(i);
      if (l < 200) continue; // reached the shield edge
      // 200–235 is the anti-aliased rim: fade it instead of cutting it.
      data[i * 4 + 3] = l > 235 ? 0 : Math.round(255 * (1 - (l - 200) / 35));
      if (l <= 235) continue;
      const x = i % w;
      if (x > 0) stack.push(i - 1);
      if (x < w - 1) stack.push(i + 1);
      if (i >= w) stack.push(i - w);
      if (i < w * (h - 1)) stack.push(i + w);
    }
    await sharp(data, { raw: info }).trim({ threshold: 1 }).png({ compressionLevel: 9 }).toFile(out);
  } else {
    await img.webp({ quality: 84, alphaQuality: 90, effort: 6 }).toFile(out);
  }
  const size = fs.statSync(out).size;
  total += size;
  const meta = await sharp(out).metadata();
  console.log(`${dest.padEnd(42)} ${meta.width}x${meta.height}  ${(size / 1024).toFixed(0)} KB`);
}
console.log(`\n${jobs.length} files, ${(total / 1024 / 1024).toFixed(1)} MB`);
