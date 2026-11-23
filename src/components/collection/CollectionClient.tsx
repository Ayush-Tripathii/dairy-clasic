"use client";

import Image from "next/image";
import { useState, useMemo } from "react";
import { categories, products, type CategorySlug, type Mood, productHref } from "@/lib/catalog";
import { TransitionLink } from "@/components/ui/TransitionLink";

type Props = {
  initialCategory?: CategorySlug;
  translations: {
    title: string;
    eyebrow: string;
    searchPlaceholder: string;
    allCategories: string;
    filterByMood: string;
    allMoods: string;
    itemsCount: string;
    viewProduct: string;
    noResults: string;
  };
};

const MOODS: { slug: Mood; label: string; icon: string }[] = [
  { slug: "chocolatey", label: "Chocolatey", icon: "🍫" },
  { slug: "fruity", label: "Fruity", icon: "🍓" },
  { slug: "nutty", label: "Nutty", icon: "🥜" },
  { slug: "coffee", label: "Coffee", icon: "☕" },
  { slug: "creamy", label: "Creamy", icon: "🥛" },
  { slug: "vanilla", label: "Vanilla", icon: "🍦" },
];

export function CollectionClient({ initialCategory, translations: t }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<CategorySlug | "all">(initialCategory ?? "all");
  const [selectedMood, setSelectedMood] = useState<Mood | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCat = selectedCategory === "all" || p.category === selectedCategory;
      const matchMood = selectedMood === "all" || p.moods.includes(selectedMood);
      const matchQuery =
        !searchQuery.trim() ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchMood && matchQuery;
    });
  }, [selectedCategory, selectedMood, searchQuery]);

  return (
    <div className="space-y-10">
      {/* Category Pills & Search Bar */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-line pb-8">
        {/* Categories Tab */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`cursor-pointer rounded-full px-4 py-2 font-display text-sm font-semibold transition-all ${
              selectedCategory === "all"
                ? "bg-primary text-white shadow-sm"
                : "bg-surface-2 text-primary hover:bg-surface-2/80 border border-line/60"
            }`}
          >
            {t.allCategories} ({products.length})
          </button>
          {categories.map((c) => {
            const count = products.filter((p) => p.category === c.slug).length;
            const active = selectedCategory === c.slug;
            return (
              <button
                key={c.slug}
                type="button"
                onClick={() => setSelectedCategory(c.slug)}
                className={`cursor-pointer rounded-full px-4 py-2 font-display text-sm font-semibold transition-all ${
                  active
                    ? "bg-primary text-white shadow-sm"
                    : "bg-surface-2 text-primary hover:bg-surface-2/80 border border-line/60"
                }`}
              >
                {c.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full max-w-xs">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full rounded-full border border-line bg-surface-2 px-4 py-2 pl-10 text-sm text-primary placeholder:text-muted focus:border-accent focus:bg-white focus:outline-none transition-colors"
          />
          <svg
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        </div>
      </div>

      {/* Mood Flavor Tags */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-display text-xs font-semibold tracking-wider uppercase text-muted mr-1">
          {t.filterByMood}:
        </span>
        <button
          type="button"
          onClick={() => setSelectedMood("all")}
          className={`cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition ${
            selectedMood === "all"
              ? "bg-accent text-white"
              : "bg-surface-2 text-primary hover:bg-line/60"
          }`}
        >
          {t.allMoods}
        </button>
        {MOODS.map((m) => (
          <button
            key={m.slug}
            type="button"
            onClick={() => setSelectedMood(m.slug)}
            className={`cursor-pointer inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition ${
              selectedMood === m.slug
                ? "bg-accent text-white"
                : "bg-surface-2 text-primary hover:bg-line/60"
            }`}
          >
            <span>{m.icon}</span>
            <span>{m.label}</span>
          </button>
        ))}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-sm text-muted">
        <p>
          Showing <span className="font-bold text-primary">{filtered.length}</span> {t.itemsCount}
        </p>
      </div>

      {/* Product Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-line/60 bg-surface-2 p-12 text-center">
          <p className="font-display text-lg font-semibold text-primary">{t.noResults}</p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("all");
              setSelectedMood("all");
              setSearchQuery("");
            }}
            className="mt-4 cursor-pointer inline-block rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((item) => {
            const cat = categories.find((c) => c.slug === item.category);
            return (
              <div
                key={item.slug}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-line/60 bg-white p-5 shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-line"
              >
                <div>
                  {/* Category Tag & New Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-surface-2 px-2.5 py-1 font-display text-[11px] font-semibold tracking-wider uppercase text-muted">
                      {cat?.name}
                    </span>
                    {item.isNew && (
                      <span className="rounded-full bg-accent/15 px-2.5 py-0.5 font-display text-[10px] font-bold text-accent uppercase tracking-wider">
                        NEW
                      </span>
                    )}
                  </div>

                  {/* Packshot Image */}
                  <div className="relative my-4 aspect-square w-full flex items-center justify-center overflow-hidden">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 25vw, (min-width: 640px) 45vw, 90vw"
                        className="object-contain p-2 transition-transform duration-500 ease-soft group-hover:scale-108"
                      />
                    ) : (
                      <div className="grid size-full place-items-center text-3xl opacity-20">🍦</div>
                    )}
                  </div>

                  {/* Name & Description */}
                  <h3 className="font-display text-lg font-bold text-primary group-hover:text-accent transition-colors">
                    {item.name}
                  </h3>
                  {item.description && (
                    <p className="mt-1.5 line-clamp-2 text-xs text-muted leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Mood Tags & Pack Size */}
                <div className="mt-5 border-t border-line/50 pt-3 flex items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1">
                    {item.moods.slice(0, 2).map((m) => (
                      <span
                        key={m}
                        className="rounded-full bg-surface-2 px-2 py-0.5 text-[10px] font-medium text-muted capitalize"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                  {item.pack && (
                    <span className="font-display text-xs font-semibold text-primary/70">
                      {item.pack}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
