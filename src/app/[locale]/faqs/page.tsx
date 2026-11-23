import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { TransitionLink } from "@/components/ui/TransitionLink";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Common questions about Dairy Classic ice creams, ingredients, wholesale supply, and cold delivery in Uzbekistan.",
};

const FAQ_GROUPS = [
  {
    category: "Ingredients & Quality",
    items: [
      {
        q: "What kind of milk does Dairy Classic use in its ice cream?",
        a: "We use 100% real, fresh liquid milk and pure dairy cream collected daily from regional farms in Uzbekistan. We never use reconstituted milk powders, artificial milk solids, or hydrogenated palm oils.",
      },
      {
        q: "Are Dairy Classic ice creams Halal certified?",
        a: "Yes. All Dairy Classic ingredients, processing facilities, and manufacturing methods follow strict Halal food guidelines. Our chocolate contains pure cocoa butter and our vanilla is alcohol-free.",
      },
      {
        q: "Where is Dairy Classic ice cream made?",
        a: "All 44 of our ice cream flavours are made in our modern, certified facility in Tashkent, Uzbekistan, operating continuously since 1996 under strict HACCP and ISO food quality standards.",
      },
    ],
  },
  {
    category: "Storage & Shelf Life",
    items: [
      {
        q: "What is the recommended storage temperature?",
        a: "For optimal taste, creamy texture, and crisp cone crunch, our ice cream should be stored at -18°C (0°F) or colder. Avoid keeping ice cream in refrigerator doors where temperature fluctuates.",
      },
      {
        q: "What is the shelf life of Dairy Classic products?",
        a: "Our individually wrapped cones, bars, sandwiches, and family tubs maintain peak freshness for 12 months when continuously kept at -18°C.",
      },
      {
        q: "Why are Dairy Classic waffle cones so crispy?",
        a: "We bake our waffle cones fresh in-house and spray the inside with a delicate micro-layer of pure chocolate before filling. This moisture barrier keeps the waffle crisp until the very last bite.",
      },
    ],
  },
  {
    category: "Wholesale & Business Supply",
    items: [
      {
        q: "How can my grocery store or supermarket sell Dairy Classic?",
        a: "Contact our wholesale team via phone or WhatsApp. We provide competitive trade pricing, scheduled refrigerated delivery, and can install branded display freezers for qualified retailers.",
      },
      {
        q: "What is the minimum wholesale order quantity?",
        a: "Minimum order sizes depend on your location. Within Tashkent City, minimum orders start from just 3 cartons. For Samarkand and regional shipments, our sales team will recommend a starter bundle.",
      },
      {
        q: "Do you supply cafes, restaurants, and catering events?",
        a: "Yes. We offer 1-litre family tubs (Belgian Chocolate, Pistachio Delight, French Vanilla, Mango) and multi-layer Cassatta cakes that are ideal for dessert menus and celebratory banquets.",
      },
    ],
  },
];

export default async function FaqsPage() {
  const t = await getTranslations();

  return (
    <div className="bg-surface min-h-screen pt-28 pb-24 md:pt-36 md:pb-32">
      <div className="container-x max-w-4xl">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs font-semibold text-muted">
          <TransitionLink href="/" className="hover:text-primary transition-colors">
            Home
          </TransitionLink>
          <span>/</span>
          <span className="text-primary">{t("nav.faqs")}</span>
        </nav>

        {/* Header */}
        <div className="mb-14">
          <div className="inline-flex items-center gap-2">
            <span className="size-2 rounded-full bg-accent animate-pulse" />
            <p className="eyebrow tracking-[0.14em] text-accent-ink font-bold">
              {t("nav.faqs")} · HELPFUL INFORMATION
            </p>
          </div>
          <h1 className="display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-primary mt-3">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted max-w-xl leading-relaxed">
            Everything you need to know about our fresh milk ice creams, storage tips, wholesale orders, and distribution in Uzbekistan.
          </p>
        </div>

        {/* FAQ Groups */}
        <div className="space-y-12">
          {FAQ_GROUPS.map((group, gIdx) => (
            <div key={gIdx} className="space-y-6">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-primary border-b border-line pb-3">
                {group.category}
              </h2>
              <div className="space-y-4">
                {group.items.map((item, iIdx) => (
                  <details
                    key={iIdx}
                    className="group rounded-3xl border border-line/60 bg-white p-6 shadow-xs transition-all open:shadow-md"
                  >
                    <summary className="flex cursor-pointer items-center justify-between font-display text-base sm:text-lg font-bold text-primary select-none group-open:text-accent">
                      <span>{item.q}</span>
                      <span className="ml-4 flex size-7 shrink-0 items-center justify-center rounded-full bg-surface-2 text-primary group-open:rotate-180 transition-transform">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M2.5 4.5L6 8L9.5 4.5" />
                        </svg>
                      </span>
                    </summary>
                    <p className="mt-4 text-sm sm:text-base text-muted leading-relaxed border-t border-line/40 pt-4">
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Still have questions card */}
        <div className="mt-16 rounded-3xl border border-line/60 bg-white p-8 text-center shadow-xs">
          <h3 className="font-display text-xl font-bold text-primary">Still have questions?</h3>
          <p className="mt-2 text-sm text-muted">
            Our team in Tashkent is ready to assist you Monday to Saturday from 9:00 AM to 8:00 PM.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <TransitionLink
              href="/contact"
              className="rounded-full bg-primary px-6 py-2.5 font-display text-xs font-bold text-white transition hover:bg-primary/90"
            >
              Contact Us
            </TransitionLink>
            <TransitionLink
              href="/partner"
              className="rounded-full border border-line px-6 py-2.5 font-display text-xs font-bold text-primary transition hover:bg-surface-2"
            >
              Wholesale Inquiries
            </TransitionLink>
          </div>
        </div>
      </div>
    </div>
  );
}
