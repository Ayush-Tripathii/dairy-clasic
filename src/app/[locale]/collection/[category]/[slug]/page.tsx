import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { products, categories, getCategory, pad2, type Product } from "@/lib/catalog";
import { TransitionLink } from "@/components/ui/TransitionLink";

type Props = {
  params: Promise<{ locale: string; category: string; slug: string }>;
};

export function generateStaticParams() {
  return products.map((p) => ({
    category: p.category,
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) return { title: "Product | Dairy Classic" };

  return {
    title: `${product.name} | Dairy Classic Ice Cream`,
    description:
      product.description ||
      `Delicious ${product.name} ice cream by Dairy Classic. Crafted with fresh whole milk in Tashkent since 1996.`,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { category, slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();

  const cat = getCategory(product.category) || categories[0];
  const related = products.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 4);

  const productIndex = products.findIndex((p) => p.slug === slug) + 1;

  return (
    <div className="bg-surface min-h-screen pt-28 pb-24 md:pt-36 md:pb-32">
      <div className="container-x">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-2 text-xs font-semibold text-muted">
          <TransitionLink href="/" className="hover:text-primary transition-colors">
            Home
          </TransitionLink>
          <span>/</span>
          <TransitionLink href="/collection" className="hover:text-primary transition-colors">
            Collection
          </TransitionLink>
          <span>/</span>
          <TransitionLink href={`/collection/${cat.slug}`} className="hover:text-primary transition-colors">
            {cat.name}
          </TransitionLink>
          <span>/</span>
          <span className="text-primary truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* Product Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Visual Showcase */}
          <div className="lg:col-span-6">
            <div
              className="relative aspect-square max-w-[520px] mx-auto rounded-[2.5rem] border border-line p-8 sm:p-12 flex items-center justify-center overflow-hidden shadow-sm"
              style={{ background: `linear-gradient(145deg, #fff 0%, ${cat.tint} 100%)` }}
            >
              <div className="absolute top-6 left-6 flex items-center gap-2">
                <span className="font-display text-xs font-bold text-muted tabular">
                  NO. {pad2(productIndex)} / {pad2(products.length)}
                </span>
                {product.isNew && (
                  <span className="rounded-full bg-accent-ink px-3 py-0.5 font-display text-[11px] font-bold tracking-wider text-white uppercase">
                    NEW
                  </span>
                )}
              </div>

              {product.pack && (
                <div className="absolute top-6 right-6 rounded-full border border-line/60 bg-white/80 backdrop-blur-xs px-3 py-1 text-xs font-bold text-primary">
                  {product.pack}
                </div>
              )}

              {/* Product Pack / Render */}
              <div className="relative size-full max-h-[360px] max-w-[360px]">
                <Image
                  src={product.render || product.image || cat.cover}
                  alt={product.name}
                  fill
                  priority
                  sizes="(min-width: 1024px) 480px, 80vw"
                  className="object-contain drop-shadow-[0_28px_28px_rgba(104,47,38,0.25)] transition-transform duration-700 hover:scale-105"
                />
              </div>
            </div>
          </div>

          {/* Details & Action */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="text-xs font-bold tracking-widest text-accent uppercase font-display">
                {cat.name} Collection
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-primary uppercase">
              {product.name}
            </h1>

            {product.description && (
              <p className="mt-5 text-base sm:text-lg text-primary/80 leading-relaxed max-w-xl">
                {product.description}
              </p>
            )}

            {/* Flavor Mood Pills */}
            <div className="mt-6 flex flex-wrap gap-2">
              {product.moods.map((m) => (
                <span
                  key={m}
                  className="rounded-full border border-line bg-white/90 px-3.5 py-1 text-xs font-medium text-primary capitalize"
                >
                  #{m}
                </span>
              ))}
            </div>

            {/* Quality Pillars */}
            <div className="mt-8 grid grid-cols-2 gap-4 border-y border-line py-6 max-w-xl">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted font-display">Crafted With</p>
                <p className="mt-1 text-sm font-semibold text-primary">100% Fresh Milk</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted font-display">Origin</p>
                <p className="mt-1 text-sm font-semibold text-primary">Tashkent, Uzbekistan</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted font-display">Heritage</p>
                <p className="mt-1 text-sm font-semibold text-primary">Since 1996 (30 Years)</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted font-display">Standard</p>
                <p className="mt-1 text-sm font-semibold text-primary">ISO & Halal Certified</p>
              </div>
            </div>

            {/* Direct Wholesale / Order CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={`https://wa.me/998909982019?text=Hello%20Dairy%20Classic%2C%20I%20am%20interested%20in%20ordering%20${encodeURIComponent(product.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-bold text-white shadow-sm hover:opacity-90 active:scale-95 transition"
              >
                <span>Inquire on WhatsApp</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z" />
                </svg>
              </a>

              <TransitionLink
                href={`/collection/${cat.slug}`}
                className="inline-flex items-center justify-center rounded-full border border-line bg-white px-6 py-3.5 text-sm font-bold text-primary hover:bg-surface-2 active:scale-95 transition"
              >
                Back to {cat.name}
              </TransitionLink>
            </div>
          </div>
        </div>

        {/* Related Products from this Category */}
        {related.length > 0 && (
          <div className="mt-24 pt-16 border-t border-line">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold tracking-widest text-accent uppercase font-display">More From</span>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-primary uppercase">
                  {cat.name} Collection
                </h2>
              </div>
              <TransitionLink
                href={`/collection/${cat.slug}`}
                className="font-display text-sm font-bold text-primary link-draw"
              >
                View all ({products.filter((p) => p.category === product.category).length}) →
              </TransitionLink>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {related.map((rel) => (
                <TransitionLink
                  key={rel.slug}
                  href={`/collection/${rel.category}/${rel.slug}`}
                  className="group flex flex-col rounded-2xl border border-line bg-white p-4 sm:p-5 transition hover:shadow-md"
                >
                  <div className="relative aspect-square w-full rounded-xl bg-surface-2 p-4 flex items-center justify-center overflow-hidden">
                    <Image
                      src={rel.image || cat.cover}
                      alt={rel.name}
                      fill
                      sizes="(min-width: 768px) 25vw, 45vw"
                      className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="mt-3 font-display text-sm sm:text-base font-bold text-primary uppercase line-clamp-1">
                    {rel.name}
                  </h3>
                  <p className="mt-1 text-xs text-muted capitalize">{rel.moods.slice(0, 2).join(", ")}</p>
                </TransitionLink>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
