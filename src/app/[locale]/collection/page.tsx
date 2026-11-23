import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CollectionClient } from "@/components/collection/CollectionClient";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("collection");
  return {
    title: t("eyebrow"),
    description: t("title"),
  };
}

export default async function CollectionPage() {
  const t = await getTranslations();

  return (
    <div className="bg-surface min-h-screen pt-28 pb-24 md:pt-36 md:pb-32">
      <div className="container-x">
        {/* Header Section */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2">
            <span className="size-2 rounded-full bg-accent animate-pulse" />
            <p className="eyebrow tracking-[0.14em] text-accent-ink font-bold">
              {t("collection.eyebrow")}
            </p>
          </div>
          <h1 className="display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-primary mt-3">
            {t("collection.title")}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted max-w-xl leading-relaxed">
            Explore all 44 flavours made with 100% fresh milk, pure chocolate, and natural ingredients in Tashkent since 1996.
          </p>
        </div>

        {/* Interactive Filterable Catalog */}
        <CollectionClient
          translations={{
            title: t("collection.title"),
            eyebrow: t("collection.eyebrow"),
            searchPlaceholder: "Search ice creams by name or flavour...",
            allCategories: "All Products",
            filterByMood: "Flavour Mood",
            allMoods: "All Moods",
            itemsCount: "products",
            viewProduct: "View Details",
            noResults: "No ice creams found matching your filters.",
          }}
        />
      </div>
    </div>
  );
}
