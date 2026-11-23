import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { site } from "@/lib/site";
import { TransitionLink } from "@/components/ui/TransitionLink";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("partner");
  return {
    title: t("eyebrow"),
    description: t("body"),
  };
}

const BENEFITS = [
  {
    title: "44 Proven, High-Margin SKUs",
    description:
      "A complete portfolio spanning impulse cones, chocolate nut bars, mini cups, biscuit sandwiches, and family sharing tubs that drive reliable repeat footfall.",
    icon: "📈",
  },
  {
    title: "Guaranteed -18°C Cold Chain",
    description:
      "Our dedicated refrigerated fleet delivers weekly across Tashkent, Samarkand, and major regions, guaranteeing product integrity right to your doorstep.",
    icon: "🚛",
  },
  {
    title: "Branded Freezers & Point-of-Sale",
    description:
      "Qualified retail partners receive branded Dairy Classic glass-top display freezers, eye-catching price tags, and promotional marketing materials at zero upfront cost.",
    icon: "❄️",
  },
  {
    title: "Flexible Terms & Direct Support",
    description:
      "Work directly with our factory account managers. Enjoy reliable inventory availability, promotional co-funding, and transparent wholesale pricing.",
    icon: "🤝",
  },
];

const CITIES = [
  { name: "Tashkent City & Region", hub: "Central Factory & Same-Day Replenishment", status: "Active Daily" },
  { name: "Samarkand Hub", hub: "Regional Cold Logistics Terminal", status: "Active Daily" },
  { name: "Bukhara & Navoi", hub: "Bi-Weekly Scheduled Refrigerated Runs", status: "Active" },
  { name: "Fergana Valley (Andijan, Namangan)", hub: "Weekly Direct Fleet Distribution", status: "Active" },
];

export default async function PartnerPage() {
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
          <span className="text-primary">{t("nav.partner")}</span>
        </nav>

        {/* Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2">
            <span className="size-2 rounded-full bg-accent animate-pulse" />
            <p className="eyebrow tracking-[0.14em] text-accent-ink font-bold">
              {t("partner.eyebrow")} · ICE CREAM SUPPLY NETWORK
            </p>
          </div>
          <h1 className="display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-primary mt-3">
            Partner with Uzbekistan&apos;s Leading Ice Cream Maker
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted max-w-xl leading-relaxed">
            {t("partner.body")}
          </p>
        </div>

        {/* Key Stats Bar */}
        <div className="mb-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-3xl border border-line/60 bg-white p-6 text-center shadow-xs">
            <span className="font-display text-3xl sm:text-4xl font-extrabold text-primary">30+</span>
            <p className="mt-1 font-display text-xs font-semibold text-muted uppercase tracking-wider">Years of Heritage</p>
          </div>
          <div className="rounded-3xl border border-line/60 bg-white p-6 text-center shadow-xs">
            <span className="font-display text-3xl sm:text-4xl font-extrabold text-accent">44</span>
            <p className="mt-1 font-display text-xs font-semibold text-muted uppercase tracking-wider">Ice Cream Flavours</p>
          </div>
          <div className="rounded-3xl border border-line/60 bg-white p-6 text-center shadow-xs">
            <span className="font-display text-3xl sm:text-4xl font-extrabold text-primary">-18°C</span>
            <p className="mt-1 font-display text-xs font-semibold text-muted uppercase tracking-wider">Cold Chain Fleet</p>
          </div>
          <div className="rounded-3xl border border-line/60 bg-white p-6 text-center shadow-xs">
            <span className="font-display text-3xl sm:text-4xl font-extrabold text-accent">100%</span>
            <p className="mt-1 font-display text-xs font-semibold text-muted uppercase tracking-wider">Real Milk Quality</p>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="mb-20">
          <div className="max-w-2xl mb-10">
            <p className="eyebrow">Why Choose Dairy Classic</p>
            <h2 className="display text-3xl sm:text-4xl font-extrabold text-primary mt-2">
              Wholesale Advantages for Your Business
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map((b, i) => (
              <div
                key={i}
                className="flex flex-col justify-between rounded-3xl border border-line/60 bg-white p-7 shadow-xs hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div>
                  <span className="text-3xl mb-4 block">{b.icon}</span>
                  <h3 className="font-display text-lg font-bold text-primary mb-2.5">{b.title}</h3>
                  <p className="text-xs sm:text-sm text-muted leading-relaxed">{b.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Coverage */}
        <div className="mb-20 rounded-[2.5rem] border border-line/60 bg-white p-8 sm:p-12 shadow-xs">
          <div className="max-w-2xl mb-8">
            <p className="eyebrow">Distribution Coverage</p>
            <h2 className="display text-2xl sm:text-3xl font-extrabold text-primary mt-2">
              Refrigerated Cold Delivery Across Uzbekistan
            </h2>
            <p className="mt-2 text-sm text-muted leading-relaxed">
              Our temperature-monitored fleet runs weekly delivery cycles to ensure retail freezers never face stockouts during peak summer and holiday seasons.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {CITIES.map((c, i) => (
              <div key={i} className="flex items-center justify-between rounded-2xl border border-line/60 bg-surface-2 p-4 px-6">
                <div>
                  <h4 className="font-display text-base font-bold text-primary">{c.name}</h4>
                  <p className="text-xs text-muted mt-0.5">{c.hub}</p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA Box */}
        <div className="rounded-[2.5rem] bg-primary p-8 sm:p-14 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8">
          <div>
            <span className="text-accent font-display text-sm font-bold uppercase tracking-wider">
              Start Your Order
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold mt-2">
              Speak with Our Wholesale Sales Team
            </h2>
            <p className="mt-2 text-white/80 max-w-lg text-sm sm:text-base">
              Call our Tashkent distribution office directly or send a message via WhatsApp for pricing catalogs and freezers.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 shrink-0">
            <a
              href={site.phones[0].href}
              className="rounded-full bg-accent px-8 py-3.5 font-display text-sm font-bold text-white transition hover:bg-accent/90 shadow-md"
            >
              Call {site.phones[0].label}
            </a>
            <a
              href="https://wa.me/998901234567"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/30 px-8 py-3.5 font-display text-sm font-bold text-white transition hover:bg-white hover:text-primary"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
