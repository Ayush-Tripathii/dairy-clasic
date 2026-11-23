import { getTranslations } from "next-intl/server";
import { getProduct } from "@/lib/catalog";
import { HeroClient, type BouquetSlide, type BouquetProduct } from "./HeroClient";

export async function Hero() {
  const t = await getTranslations();
  const lines = t.raw("hero.titleLines") as string[];

  const makeProduct = (slug: string, fallbackName?: string): BouquetProduct => {
    const p = getProduct(slug);
    return {
      slug,
      name: p?.name ?? fallbackName ?? slug,
      category: p ? t(`categories.${p.category}`) : "",
      categorySlug: p?.category ?? "cones",
      image: p?.render ?? p?.image ?? `/images/products/${slug}.webp`,
      alt: p?.name ?? slug,
    };
  };

  const slides: BouquetSlide[] = [
    {
      id: "bestsellers",
      title: "Most Popular",
      categorySlug: "bestsellers",
      tint: "var(--tint-cones)",
      summary: "SuperChoc · Super Twist · Vega",
      items: [
        makeProduct("super-choc", "SuperChoc"),
        makeProduct("super-twist", "Super Twist"),
        makeProduct("vega", "Vega"),
      ],
    },
    {
      id: "cones",
      title: t("categories.cones"),
      categorySlug: "cones",
      tint: "var(--tint-cones)",
      summary: "Golden Fantasy · Super Twist · Choco Boom",
      items: [
        makeProduct("golden-fantasy", "Golden Fantasy"),
        makeProduct("super-twist", "Super Twist"),
        makeProduct("choco-boom", "Choco Boom"),
      ],
    },
    {
      id: "biscuit",
      title: t("categories.biscuit"),
      categorySlug: "biscuit",
      tint: "var(--tint-biscuit)",
      summary: "Round Pie · Super Bricket · Sandwich",
      items: [
        makeProduct("round-pie", "Round Pie"),
        makeProduct("bricket", "Super Bricket"),
        makeProduct("sandwich", "Sandwich"),
      ],
    },
    {
      id: "sticks",
      title: t("categories.sticks"),
      categorySlug: "sticks",
      tint: "var(--tint-sticks)",
      summary: "Classic Vega · Vega · SuperChoc",
      items: [
        makeProduct("classic-vega", "Classic Vega"),
        makeProduct("vega", "Vega"),
        makeProduct("super-choc", "SuperChoc"),
      ],
    },
    {
      id: "cups",
      title: t("categories.cups"),
      categorySlug: "cups",
      tint: "var(--tint-cups)",
      summary: "Creamica Vanilla · Cheese Cake · Biscuiti",
      items: [
        makeProduct("creamica-vanilla", "Creamica Vanilla"),
        makeProduct("creamica-cheesecake", "Creamica Cheese Cake"),
        makeProduct("creamica-biscuiti", "Creamica Biscuiti"),
      ],
    },
    {
      id: "tubs",
      title: `${t("categories.tubs")} & ${t("categories.cassatta")}`,
      categorySlug: "tubs",
      tint: "var(--tint-tubs)",
      summary: "Pistachio · Classic Cassatta · Coffee Frenzy",
      items: [
        makeProduct("pistachio", "Pistachio"),
        makeProduct("classic-cassatta", "Classic Cassatta"),
        makeProduct("coffee-frenzy", "Coffee Frenzy"),
      ],
    },
  ];

  return (
    <HeroClient
      slides={slides}
      lines={lines}
      copy={{
        eyebrow: t("hero.eyebrow"),
        sub: t("hero.sub"),
        ctaPrimary: t("hero.ctaPrimary"),
        ctaSecondary: t("hero.ctaSecondary"),
        scroll: t("hero.scroll"),
        no: t("hero.no"),
        pause: t("a11y.pause"),
      }}
    />
  );
}
