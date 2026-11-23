import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { site } from "@/lib/site";
import { TransitionLink } from "@/components/ui/TransitionLink";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("thirty");
  return {
    title: t("title"),
    description: t("body"),
  };
}

const MILESTONES = [
  {
    year: "1996",
    title: "The First Scoop in Tashkent",
    description:
      "Dairy Classic was founded with a single artisanal ice cream machine and a simple dream: to bring rich, natural ice cream made with real milk to local families.",
  },
  {
    year: "2005",
    title: "Modern Churning Plant",
    description:
      "We built our flagship plant in Tashkent, introducing state-of-the-art cold-chain pasteurization and continuous churning systems to ensure unmatched texture and hygiene.",
  },
  {
    year: "2014",
    title: "Signature Bars & Cones Launch",
    description:
      "Created Uzbekistan's favorite crunch with SuperChoc, Vega, and the crispy Golden Fantasy waffle cone line, introducing pure cocoa butter coatings and farm-roasted peanuts.",
  },
  {
    year: "2020",
    title: "Nationwide Cold Fleet",
    description:
      "Expanded our dedicated refrigerated fleet across Uzbekistan, guaranteeing temperature-controlled delivery at -18°C from Tashkent to Samarkand, Bukhara, and beyond.",
  },
  {
    year: "2026",
    title: "Celebrating 30 Years & 44 Flavours",
    description:
      "Today, Dairy Classic produces 44 distinctive ice creams across 6 categories, trusted by thousands of grocery stores, cafes, and millions of families every year.",
  },
];

const PILLARS = [
  {
    title: "100% Real Fresh Milk",
    description:
      "We never use artificial milk substitutes or cheap oils. Our ice cream begins with fresh morning dairy collected daily from trusted local farms.",
    icon: "🥛",
  },
  {
    title: "Pure Cocoa & Roasted Peanuts",
    description:
      "From genuine Belgian cocoa butter to golden freshly roasted peanuts, our toppings and swirls deliver an unmistakable artisan crunch in every bite.",
    icon: "🍫",
  },
  {
    title: "Certified Modern Facility",
    description:
      "Every batch is crafted under international food safety standards (HACCP / ISO) in our ultra-clean, temperature-monitored facility in Tashkent.",
    icon: "🏆",
  },
];

export default async function OurStoryPage() {
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
          <span className="text-primary">{t("nav.story")}</span>
        </nav>

        {/* Hero Section */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2">
            <span className="size-2 rounded-full bg-accent animate-pulse" />
            <p className="eyebrow tracking-[0.14em] text-accent-ink font-bold">
              {t("thirty.eyebrow")} · 30 YEARS OF PASSION
            </p>
          </div>
          <h1 className="display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-primary mt-3">
            {t("thirty.title")}
          </h1>
          <p className="mt-5 text-lg sm:text-xl text-muted leading-relaxed">
            {t("thirty.body")}
          </p>
        </div>

        {/* Visual Story Banner */}
        <div className="relative mb-24 overflow-hidden rounded-[2.5rem] border border-line/60 bg-surface-2 aspect-[16/9] sm:aspect-[21/9]">
          <Image
            src="/images/story/factory.webp"
            alt="Dairy Classic modern ice cream plant in Tashkent"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent flex items-end p-6 sm:p-12">
            <div className="text-white max-w-xl">
              <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                Made in Tashkent
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold mt-3">
                Crafted with Real Milk & Pure Ingredients Since 1996
              </h2>
            </div>
          </div>
        </div>

        {/* Pillars of Quality */}
        <div className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="eyebrow">Our Uncompromising Standards</p>
            <h2 className="display text-3xl sm:text-4xl font-extrabold text-primary mt-2">
              The 3 Pillars of Dairy Classic
            </h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {PILLARS.map((p, i) => (
              <div
                key={i}
                className="rounded-3xl border border-line/60 bg-white p-8 shadow-xs hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <span className="text-4xl mb-4 block">{p.icon}</span>
                <h3 className="font-display text-xl font-bold text-primary mb-3">{p.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{p.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Heritage Timeline */}
        <div className="mb-24">
          <div className="max-w-xl mb-12">
            <p className="eyebrow">Three Decades of Growth</p>
            <h2 className="display text-3xl sm:text-4xl font-extrabold text-primary mt-2">
              Our Journey Over 30 Years
            </h2>
          </div>
          <div className="relative border-l-2 border-line/80 pl-6 sm:pl-10 space-y-12 ml-4 sm:ml-6">
            {MILESTONES.map((m, idx) => (
              <div key={idx} className="relative group">
                <span className="absolute -left-[31px] sm:-left-[47px] top-1.5 size-4 rounded-full border-2 border-white bg-accent shadow-xs group-hover:scale-125 transition-transform" />
                <span className="font-display text-sm font-bold text-accent tracking-wider uppercase">
                  {m.year}
                </span>
                <h3 className="font-display text-xl font-extrabold text-primary mt-1">
                  {m.title}
                </h3>
                <p className="mt-2 text-sm sm:text-base text-muted max-w-2xl leading-relaxed">
                  {m.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="rounded-[2.5rem] bg-primary p-8 sm:p-14 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8">
          <div>
            <span className="text-accent font-display text-sm font-bold uppercase tracking-wider">
              Taste the Tradition
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold mt-2">
              Explore Our 44 Signature Flavours
            </h2>
            <p className="mt-2 text-white/80 max-w-lg text-sm sm:text-base">
              From crispy cones to rich family tubs, find your next sweet moment with Dairy Classic.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 shrink-0">
            <TransitionLink
              href="/collection"
              className="rounded-full bg-accent px-8 py-3.5 font-display text-sm font-bold text-white transition hover:bg-accent/90 shadow-md"
            >
              Browse Collection
            </TransitionLink>
            <TransitionLink
              href="/partner"
              className="rounded-full border border-white/30 px-8 py-3.5 font-display text-sm font-bold text-white transition hover:bg-white hover:text-primary"
            >
              Wholesale Portal
            </TransitionLink>
          </div>
        </div>
      </div>
    </div>
  );
}
