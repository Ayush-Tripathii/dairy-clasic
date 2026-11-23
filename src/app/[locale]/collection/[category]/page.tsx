import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { categories, byCategory, type CategorySlug } from "@/lib/catalog";
import { CollectionClient } from "@/components/collection/CollectionClient";
import { TransitionLink } from "@/components/ui/TransitionLink";

type Props = {
  params: Promise<{ locale: string; category: string }>;
};

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = categories.find((c) => c.slug === category);
  if (!cat) return { title: "Collection" };

  return {
    title: `${cat.name} Collection`,
    description: `Discover all ${cat.name} ice cream flavours by Dairy Classic in Tashkent.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = categories.find((c) => c.slug === category);
  if (!cat) notFound();

  const t = await getTranslations();
  const items = byCategory(cat.slug as CategorySlug);

  return (
    <div className="bg-surface min-h-screen pt-28 pb-24 md:pt-36 md:pb-32">
      <div className="container-x">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs font-semibold text-muted">
          <TransitionLink href="/" className="hover:text-primary transition-colors">
            Home
          </TransitionLink>
          <span>/</span>
          <TransitionLink href="/collection" className="hover:text-primary transition-colors">
            Collection
          </TransitionLink>
          <span>/</span>
          <span className="text-primary">{cat.name}</span>
        </nav>

        {/* Header Section */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2">
            <span className="size-2 rounded-full bg-accent animate-pulse" />
            <p className="eyebrow tracking-[0.14em] text-accent-ink font-bold">
              {t(`categories.${cat.slug}`)} · {items.length} Flavours
            </p>
          </div>
          <h1 className="display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-primary mt-3">
            {cat.name}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted max-w-xl leading-relaxed">
            {t(`collection.taglines.${cat.slug}`)}
          </p>
        </div>

        {/* Filterable Catalog pre-selected to this category */}
        <CollectionClient
          initialCategory={cat.slug}
          translations={{
            title: cat.name,
            eyebrow: t("collection.eyebrow"),
            searchPlaceholder: `Search in ${cat.name}...`,
            allCategories: "All Categories",
            filterByMood: "Flavour Mood",
            allMoods: "All Moods",
            itemsCount: `${cat.name.toLowerCase()} flavours`,
            viewProduct: "View Details",
            noResults: `No ${cat.name.toLowerCase()} match your search.`,
          }}
        />
      </div>
    </div>
  );
}
