import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { TransitionLink } from "@/components/ui/TransitionLink";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("blog");
  return {
    title: t("title"),
    description: t("eyebrow"),
  };
}

const ARTICLES = [
  {
    slug: "fresh-milk-process",
    title: "How We Make Ice Cream with 100% Real Fresh Milk",
    tag: "Behind the Scenes",
    date: "November 2026",
    readTime: "4 min read",
    author: "Dairy Classic Master Churner",
    image: "/images/story/factory.webp",
    excerpt:
      "A behind-the-scenes look inside our modern Tashkent plant, where fresh morning milk is churned into delicious, creamy ice cream without artificial powders or shortcuts.",
    content: [
      "Every morning at 5:00 AM, refrigerated milk tankers arrive at our Tashkent processing center directly from regional dairy farms. Before a single drop enters our churn, each shipment undergoes rigorous lab testing for purity, butterfat content, and natural freshness.",
      "Unlike mass-market brands that rehydrate skim milk powder with palm oil, Dairy Classic pasteurizes real liquid whole milk. This preserves natural milk sugars and delicate proteins, giving our ice creams their signature velvety mouthfeel.",
      "The milk is slowly blended with pure cream, natural fruit purees, and pure cane sugar before passing through our gentle continuous freezers at precisely -5°C, ensuring microscopic ice crystals for optimal smoothness.",
    ],
  },
  {
    slug: "chocolate-crunch-secret",
    title: "The Art of the Crunch: Pure Chocolate & Roasted Peanuts",
    tag: "Flavour Secrets",
    date: "October 2026",
    readTime: "3 min read",
    author: "Product Innovation Team",
    image: "/images/scenes/creamica-burst.webp",
    excerpt:
      "Discover why real cocoa butter and freshly roasted peanuts give our SuperChoc, Vega, and Sandwich their signature crisp, satisfying bite.",
    content: [
      "There is nothing quite as satisfying as the sound and feel of biting into a chocolate shell that shatters cleanly before melting luxuriously on your tongue.",
      "The secret lies in the fat composition. We use pure cocoa butter coatings rather than hydrogenated vegetable oils. Cocoa butter has a sharp melting point right at body temperature (36°C), so the shell remains snappy when cold but dissolves smoothly upon contact.",
      "Every morning, fresh peanuts are dry-roasted in small batches at 160°C until golden brown and aromatic. They are immediately folded into our warm chocolate bath, ensuring that every nut in SuperChoc and Golden Fantasy stays crispy and never becomes soggy.",
    ],
  },
  {
    slug: "thirty-years-tashkent",
    title: "30 Years of Sweet Memories Across Uzbekistan",
    tag: "Our Heritage",
    date: "September 2026",
    readTime: "5 min read",
    author: "Founding Family",
    image: "/images/story/founder.webp",
    excerpt:
      "From our very first vanilla cone in 1996 to 44 favourites today — the story of Uzbekistan's beloved family ice cream maker celebrating three decades.",
    content: [
      "In the spring of 1996, the streets of Tashkent were filled with the lively energy of independence and new beginnings. Our founders started in a modest workshop with a simple vow: never compromise on quality, and treat every child as if they were our own.",
      "Families quickly noticed that Dairy Classic tasted different — richer, cleaner, and full of natural milk flavor. Word of mouth spread from neighborhood mahallas across the entire city.",
      "Thirty years later, many of those children are now parents sharing SuperTwist cones and Classic Cassatta cakes with their own children. We are deeply humbled to be part of the nation's birthdays, family dinners, and sunny summer afternoons.",
    ],
  },
];

export default async function BlogPage() {
  const t = await getTranslations();

  return (
    <div className="bg-surface min-h-screen pt-28 pb-24 md:pt-36 md:pb-32">
      <div className="container-x">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs font-semibold text-muted">
          <TransitionLink href="/" className="hover:text-primary transition-colors">
            Home
          </TransitionLink>
          <span>/</span>
          <span className="text-primary">{t("nav.blog")}</span>
        </nav>

        {/* Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2">
            <span className="size-2 rounded-full bg-accent animate-pulse" />
            <p className="eyebrow tracking-[0.14em] text-accent-ink font-bold">
              {t("blog.eyebrow")}
            </p>
          </div>
          <h1 className="display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-primary mt-3">
            {t("blog.title")}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted max-w-xl leading-relaxed">
            Discover behind-the-scenes stories, artisanal crafting secrets, and updates from Uzbekistan&apos;s heritage ice cream brand.
          </p>
        </div>

        {/* Featured Story */}
        <div className="mb-16 rounded-[2.5rem] border border-line/60 bg-white p-6 sm:p-10 shadow-xs hover:shadow-xl transition-all">
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-surface-2">
              <Image
                src={ARTICLES[0].image}
                alt={ARTICLES[0].title}
                fill
                sizes="(min-width: 1024px) 45vw, 90vw"
                className="object-cover transition-transform duration-700 hover:scale-105"
                priority
              />
            </div>
            <div>
              <div className="flex items-center gap-3 text-xs font-semibold">
                <span className="rounded-full bg-accent/15 px-3 py-1 font-display text-accent font-bold uppercase tracking-wider">
                  {ARTICLES[0].tag}
                </span>
                <span className="text-muted">{ARTICLES[0].date}</span>
                <span className="text-muted">·</span>
                <span className="text-muted">{ARTICLES[0].readTime}</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-primary mt-4 leading-snug">
                {ARTICLES[0].title}
              </h2>
              <p className="mt-4 text-sm sm:text-base text-muted leading-relaxed">
                {ARTICLES[0].excerpt}
              </p>
              <div className="mt-6 border-t border-line/60 pt-6">
                <p className="text-xs font-semibold text-muted">Author: {ARTICLES[0].author}</p>
                <div className="mt-4 space-y-3 text-sm text-primary/80 leading-relaxed">
                  {ARTICLES[0].content.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Articles Grid */}
        <div className="grid gap-8 sm:grid-cols-2">
          {ARTICLES.slice(1).map((art) => (
            <article
              key={art.slug}
              className="flex flex-col justify-between rounded-3xl border border-line/60 bg-white p-6 sm:p-8 shadow-xs hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div>
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-surface-2 mb-6">
                  <Image
                    src={art.image}
                    alt={art.title}
                    fill
                    sizes="(min-width: 640px) 45vw, 90vw"
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold mb-3">
                  <span className="rounded-full bg-accent/15 px-3 py-0.5 font-display text-accent font-bold uppercase tracking-wider text-[11px]">
                    {art.tag}
                  </span>
                  <span className="text-muted">{art.date}</span>
                  <span className="text-muted">·</span>
                  <span className="text-muted">{art.readTime}</span>
                </div>
                <h3 className="font-display text-xl font-extrabold text-primary leading-snug">
                  {art.title}
                </h3>
                <p className="mt-3 text-sm text-muted leading-relaxed">
                  {art.excerpt}
                </p>
                <div className="mt-5 space-y-2.5 text-xs text-primary/80 leading-relaxed border-t border-line/50 pt-4">
                  {art.content.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-line/50 flex items-center justify-between text-xs text-muted">
                <span>By {art.author}</span>
                <span className="font-semibold text-accent">Dairy Classic Tashkent</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
