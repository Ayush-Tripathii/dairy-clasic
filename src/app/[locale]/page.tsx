import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Hero } from "@/components/home/Hero";
import { ThirtyYears } from "@/components/home/ThirtyYears";
import { ProductMarquee } from "@/components/home/ProductMarquee";
import { FlavourWheel } from "@/components/home/FlavourWheel";
import { Collection } from "@/components/home/Collection";
import { FreshOffTheLine } from "@/components/home/FreshOffTheLine";
import { Blog } from "@/components/home/Blog";
import { PartnerContact } from "@/components/home/PartnerContact";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta");
  return {
    title: { absolute: t("homeTitle") },
    description: t("homeDescription"),
    alternates: {
      canonical: "/",
      languages: { en: "/", uz: "/uz/", ru: "/ru/", "x-default": "/" },
    },
  };
}

/** Homepage — nine sections, one idea per screen. */
export default function HomePage() {
  return (
    <>
      <Hero />
      <ProductMarquee />
      <FlavourWheel />
      <Collection />
      <FreshOffTheLine />
      <Blog />
      <ThirtyYears />
      <PartnerContact />
    </>
  );
}
