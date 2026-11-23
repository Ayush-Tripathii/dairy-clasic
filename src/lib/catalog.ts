/**
 * Product catalogue — names and descriptions from dairyclassics.com category pages,
 * proofread and tightened. A missing description or image is `undefined` and the UI hides it.
 */
export type CategorySlug = "cones" | "sticks" | "cups" | "biscuit" | "tubs" | "cassatta";
export type Mood = "chocolatey" | "fruity" | "nutty" | "coffee" | "creamy" | "vanilla";

export type Product = {
  slug: string;
  name: string;
  category: CategorySlug;
  description?: string;
  image?: string;
  /** Larger unwrapped render, where the brand has one. */
  render?: string;
  pack?: string;
  isNew?: boolean;
  moods: Mood[];
};

export type Category = {
  slug: CategorySlug;
  name: string;
  tint: string;
  cover: string;
};

const p = (slug: string) => `/images/products/${slug}.webp`;

export const categories: Category[] = [
  { slug: "cones", name: "Cones", tint: "var(--tint-cones)", cover: p("golden-fantasy") },
  { slug: "sticks", name: "Sticks", tint: "var(--tint-sticks)", cover: p("vega") },
  { slug: "cups", name: "Cups", tint: "var(--tint-cups)", cover: p("creamica-cheesecake") },
  { slug: "biscuit", name: "Biscuit", tint: "var(--tint-biscuit)", cover: p("round-pie") },
  { slug: "tubs", name: "Tubs", tint: "var(--tint-tubs)", cover: p("pistachio") },
  { slug: "cassatta", name: "Cassatta", tint: "var(--tint-cassatta)", cover: p("classic-cassatta") },
];

export const products: Product[] = [
  // ---------- Cones (7) ----------
  { slug: "golden-fantasy", name: "Golden Fantasy", category: "cones", image: p("golden-fantasy"), render: "/images/renders/golden-fantasy.webp", moods: ["chocolatey", "vanilla", "nutty"],
    description: "Vanilla and chocolate ice cream in a crispy waffle cone, topped with chocolate and roasted peanuts." },
  { slug: "choco-boom", name: "Choco Boom", category: "cones", image: p("choco-boom"), render: "/images/renders/choco-boom.webp", moods: ["chocolatey", "nutty"],
    description: "Rich chocolate ice cream in a crispy waffle cone, topped with crunchy roasted peanuts." },
  { slug: "super-twist", name: "Super Twist", category: "cones", image: p("super-twist"), render: "/images/renders/super-twist.webp", moods: ["fruity", "vanilla"],
    description: "Vanilla ice cream with sweet raspberry sauce inside a crispy waffle cone." },
  { slug: "dice-n-slice", name: "Dice n Slice", category: "cones", image: p("dice-n-slice"), moods: ["nutty", "creamy"],
    description: "Smooth hazelnut and rose ice cream in a crispy waffle cone." },
  { slug: "twin-cone", name: "Twin Cone", category: "cones", image: p("twin-cone"), moods: ["nutty", "vanilla"],
    description: "Honey and vanilla pecan ice cream in a crispy waffle cone." },
  { slug: "top-fun", name: "Top Fun", category: "cones", image: p("top-fun"), pack: "Big", moods: ["fruity", "creamy"],
    description: "Creamy ice cream in a large waffle cone with a sweet orange fruit sauce." },
  { slug: "capicon", name: "Capicon", category: "cones", image: p("capicon"), pack: "Big", moods: ["coffee"],
    description: "Real cappuccino coffee ice cream in a large waffle cone." },

  // ---------- Sticks (10) ----------
  { slug: "super-choc", name: "Super Choc", category: "sticks", image: p("super-choc"), render: "/images/renders/super-choc.webp", moods: ["chocolatey", "nutty"],
    description: "Creamy chocolate ice cream bar with a thick chocolate coating and peanuts." },
  { slug: "vega", name: "Vega", category: "sticks", image: p("vega"), render: "/images/renders/vega.webp", moods: ["vanilla", "chocolatey", "nutty"],
    description: "Vanilla ice cream bar with a crunchy chocolate shell and roasted peanuts." },
  { slug: "classic-vega", name: "Classic Vega", category: "sticks", image: p("classic-vega"), moods: ["vanilla", "chocolatey"],
    description: "Creamy vanilla ice cream bar coated in milk chocolate." },
  { slug: "new-classic", name: "New Classic", category: "sticks", image: p("new-classic"), moods: ["vanilla", "chocolatey"],
    description: "Half vanilla and half chocolate ice cream bar coated in milk chocolate." },
  { slug: "koffee-mokko", name: "Koffee Mokko", category: "sticks", image: p("koffee-mokko"), moods: ["coffee", "chocolatey"],
    description: "Smooth coffee and chocolate ice cream bar." },
  { slug: "delizia", name: "Delizia", category: "sticks", image: p("delizia"), isNew: true, moods: ["fruity", "chocolatey"],
    description: "Three-layer ice cream bar with chocolate coating and sweet mixed berries inside." },
  { slug: "royal-fun", name: "Royal Fun", category: "sticks", image: p("royal-fun"), isNew: true, moods: ["fruity", "chocolatey"],
    description: "Three-layer ice cream bar with chocolate coating and tangy orange inside." },
  { slug: "pango", name: "Pango", category: "sticks", image: p("pango"), isNew: true, moods: ["fruity"],
    description: "Refreshing mixed berry ice cream bar." },
  { slug: "frutonia", name: "Frutonia", category: "sticks", image: p("frutonia"), isNew: true, moods: ["fruity", "creamy"],
    description: "Fruity tropical ice cream bar made with real milk and cream." },
  { slug: "tapo", name: "Tapo", category: "sticks", image: p("tapo"), isNew: true, moods: ["fruity"] },

  // ---------- Cups (7) ----------
  { slug: "creamica-cheesecake", name: "Creamica Cheesecake", category: "cups", image: p("creamica-cheesecake"), moods: ["fruity", "creamy"],
    description: "Creamy blueberry cheesecake ice cream with blueberry sauce in a cup." },
  { slug: "creamica-vanilla", name: "Creamica Vanilla", category: "cups", image: p("creamica-vanilla"), moods: ["vanilla", "nutty", "creamy"],
    description: "Vanilla ice cream in a cup topped with chocolate and roasted peanuts." },
  { slug: "creamica-biscuiti", name: "Creamica Biscuiti", category: "cups", image: p("creamica-biscuiti"), moods: ["creamy"],
    description: "Sweet biscuit-flavoured ice cream in a cup." },
  { slug: "ambroziya-mini-cup", name: "Ambroziya Mini Cup", category: "cups", image: p("ambroziya-mini-cup"), moods: ["fruity"],
    description: "Fruity ice cream with pieces of sweet papaya in a small cup." },
  { slug: "orange-mini-cup", name: "Orange Mini Cup", category: "cups", image: p("orange-mini-cup"), moods: ["fruity"],
    description: "Orange ice cream with sweet orange fruit sauce in a small cup." },
  { slug: "choco-chips-mini-cup", name: "Choco Chips Mini Cup", category: "cups", image: p("choco-chips-mini-cup"), moods: ["vanilla", "chocolatey"],
    description: "Vanilla ice cream with crunchy chocolate chips in a small cup." },
  { slug: "cappuccino-mini-cup", name: "Cappuccino Mini Cup", category: "cups", image: p("cappuccino-mini-cup"), moods: ["coffee"],
    description: "Rich cappuccino coffee ice cream in a small cup." },

  // ---------- Biscuit (4) ----------
  { slug: "round-pie", name: "Round Pie", category: "biscuit", image: p("round-pie"), moods: ["vanilla", "chocolatey"],
    description: "Round vanilla ice cream sandwich with chocolate cookies and chocolate coating." },
  { slug: "sandwich", name: "Sandwich", category: "biscuit", image: p("sandwich"), moods: ["vanilla", "chocolatey", "nutty"],
    description: "Vanilla and chocolate ice cream between two biscuits, dipped in chocolate and peanuts." },
  { slug: "bricket", name: "Bricket", category: "biscuit", image: p("bricket"), moods: ["vanilla", "chocolatey"],
    description: "Vanilla and chocolate ice cream between two crispy biscuits." },
  { slug: "olino", name: "Olino", category: "biscuit", image: p("olino"), moods: ["creamy", "chocolatey"],
    description: "Biscuit-flavoured ice cream sandwich coated in milk chocolate." },

  // ---------- Tubs (14) ----------
  { slug: "pistachio", name: "Pistachio", category: "tubs", image: p("pistachio"), pack: "1 L", moods: ["nutty", "creamy"],
    description: "Creamy pistachio ice cream in a 1-litre tub for the whole family." },
  { slug: "french-vanilla", name: "French Vanilla", category: "tubs", image: p("french-vanilla"), pack: "1 L", moods: ["vanilla", "creamy"],
    description: "Classic French vanilla ice cream in a 1-litre tub." },
  { slug: "ambroziya", name: "Ambroziya", category: "tubs", pack: "1 L", moods: ["fruity"],
    description: "Fruity ice cream with sweet papaya pieces in a 1-litre tub." },
  { slug: "choco-chips", name: "Choco Chips", category: "tubs", pack: "1 L", moods: ["vanilla", "chocolatey"],
    description: "Vanilla ice cream filled with chocolate chips in a 1-litre tub." },
  { slug: "coffee-frenzy", name: "Coffee Frenzy", category: "tubs", image: p("coffee-frenzy"), pack: "1 L", moods: ["coffee", "creamy"],
    description: "Rich and creamy coffee ice cream in a 1-litre tub." },
  { slug: "super-vanilla", name: "Super Vanilla", category: "tubs", image: p("super-vanilla"), pack: "1 L", moods: ["vanilla", "creamy"],
    description: "Smooth and creamy vanilla ice cream in a 1-litre tub." },
  { slug: "chocolate-dream", name: "Chocolate Dream", category: "tubs", image: p("chocolate-dream"), pack: "1 L", moods: ["chocolatey"],
    description: "Rich and delicious chocolate ice cream in a 1-litre tub." },
  { slug: "premium-chocolate", name: "Premium Chocolate", category: "tubs", image: p("premium-chocolate"), pack: "1 L", moods: ["chocolatey"],
    description: "Dark cocoa chocolate ice cream in a 1-litre tub." },
  { slug: "mango", name: "Mango", category: "tubs", image: p("mango"), pack: "1 L", moods: ["fruity"],
    description: "Sweet and fruity mango ice cream in a 1-litre tub." },
  { slug: "heart-delight", name: "Heart Delight", category: "tubs", image: p("heart-delight"), pack: "1 L", moods: ["creamy", "fruity"] },
  { slug: "classic-delight", name: "Classic Delight", category: "tubs", image: p("classic-delight"), pack: "1 L", moods: ["creamy", "vanilla"],
    description: "Three popular ice cream flavours together in one 1-litre tub." },
  { slug: "raspberry-swirl", name: "Raspberry Swirl", category: "tubs", image: p("raspberry-swirl"), pack: "1 L", moods: ["fruity", "vanilla"],
    description: "Vanilla ice cream swirled with sweet raspberry sauce in a 1-litre tub." },
  { slug: "orange-swirl", name: "Orange Swirl", category: "tubs", image: p("orange-swirl"), pack: "1 L", moods: ["fruity"],
    description: "Vanilla ice cream swirled with sweet orange sauce in a 1-litre tub." },
  { slug: "chocolate-curls", name: "Chocolate Curls", category: "tubs", image: p("chocolate-curls"), pack: "1 L", moods: ["chocolatey", "vanilla"],
    description: "Vanilla ice cream swirled with rich chocolate sauce in a 1-litre tub." },

  // ---------- Cassatta (2) ----------
  { slug: "classic-cassatta", name: "Classic Cassatta", category: "cassatta", image: p("classic-cassatta"), pack: "1 L", moods: ["creamy", "nutty", "fruity"],
    description: "Traditional multi-layer ice cream cake topped with roasted peanuts." },
  { slug: "galaxy-cassatta", name: "Galaxy Cassatta", category: "cassatta", image: p("galaxy-cassatta"), pack: "1 L", moods: ["creamy", "nutty", "chocolatey"],
    description: "Rich multi-layer ice cream cake topped with chocolate and roasted peanuts." },
];

export const TOTAL = products.length; // 44

export const productNumber = (slug: string) => products.findIndex((x) => x.slug === slug) + 1;
export const getProduct = (slug: string) => products.find((x) => x.slug === slug);
export const byCategory = (c: CategorySlug) => products.filter((x) => x.category === c);
export const categoryCount = (c: CategorySlug) => byCategory(c).length;
export const getCategory = (c: string) => categories.find((x) => x.slug === c);

export const pad2 = (n: number) => String(n).padStart(2, "0");

export const productHref = (p: Pick<Product, "category" | "slug">) => `/collection/${p.category}/${p.slug}`;

/** The seven hero products, in rotation order. */
export const heroSlugs = [
  "golden-fantasy",
  "choco-boom",
  "vega",
  "creamica-cheesecake",
  "round-pie",
  "pistachio",
  "classic-cassatta",
] as const;
