import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { site } from "@/lib/site";
import { TransitionLink } from "@/components/ui/TransitionLink";

export const metadata: Metadata = {
  title: "Contact & Working Hours",
  description: "Get in touch with Dairy Classic in Tashkent and Samarkand. Phone numbers, office locations, wholesale inquiries, and WhatsApp support.",
};

export default async function ContactPage() {
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
          <span className="text-primary">{t("nav.contact")}</span>
        </nav>

        {/* Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2">
            <span className="size-2 rounded-full bg-accent animate-pulse" />
            <p className="eyebrow tracking-[0.14em] text-accent-ink font-bold">
              {t("nav.contact")} · REACH OUR TEAM
            </p>
          </div>
          <h1 className="display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-primary mt-3">
            Contact Dairy Classic
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted max-w-xl leading-relaxed">
            Whether you are ordering ice cream for your store, planning an event, or have a question about our flavours, our Tashkent and Samarkand teams are here to help.
          </p>
        </div>

        {/* Contact Info Cards Grid */}
        <div className="grid gap-8 lg:grid-cols-3 mb-16">
          {/* Tashkent Office & Factory */}
          <div className="rounded-3xl border border-line/60 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-3xl mb-4 block">📍</span>
              <span className="rounded-full bg-surface-2 px-3 py-1 font-display text-xs font-bold text-muted uppercase tracking-wider">
                Head Office & Plant
              </span>
              <h2 className="font-display text-2xl font-bold text-primary mt-3">Tashkent</h2>
              <address className="not-italic mt-4 text-sm text-muted leading-relaxed space-y-1">
                <p className="font-semibold text-primary">{site.address.street}</p>
                <p>{site.address.city}, {site.address.country}</p>
              </address>
              <div className="mt-6 border-t border-line/50 pt-4 space-y-2 text-sm">
                <p className="flex items-center gap-2">
                  <span className="text-muted">Direct:</span>
                  <a href={site.phones[0].href} className="font-bold text-primary hover:text-accent transition-colors">
                    {site.phones[0].label}
                  </a>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-muted">Wholesale:</span>
                  <a href={site.phones[1].href} className="font-bold text-primary hover:text-accent transition-colors">
                    {site.phones[1].label}
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Samarkand Hub */}
          <div className="rounded-3xl border border-line/60 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-3xl mb-4 block">🏢</span>
              <span className="rounded-full bg-surface-2 px-3 py-1 font-display text-xs font-bold text-muted uppercase tracking-wider">
                Regional Logistics
              </span>
              <h2 className="font-display text-2xl font-bold text-primary mt-3">Samarkand</h2>
              <address className="not-italic mt-4 text-sm text-muted leading-relaxed space-y-1">
                <p className="font-semibold text-primary">Registan Distribution Center</p>
                <p>Samarkand Region, Uzbekistan</p>
              </address>
              <div className="mt-6 border-t border-line/50 pt-4 space-y-2 text-sm">
                <p className="flex items-center gap-2">
                  <span className="text-muted">Regional Hub:</span>
                  <a href={site.phones[2].href} className="font-bold text-primary hover:text-accent transition-colors">
                    {site.phones[2].label}
                  </a>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-muted">Email:</span>
                  <a href={`mailto:${site.email}`} className="font-bold text-primary hover:text-accent transition-colors">
                    {site.email}
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Working Hours & Direct Messaging */}
          <div className="rounded-3xl border border-line/60 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-3xl mb-4 block">⏰</span>
              <span className="rounded-full bg-surface-2 px-3 py-1 font-display text-xs font-bold text-muted uppercase tracking-wider">
                Working Hours
              </span>
              <h2 className="font-display text-2xl font-bold text-primary mt-3">Schedule</h2>
              <div className="mt-4 space-y-2 text-sm text-muted">
                <p className="flex items-center justify-between border-b border-line/40 pb-2">
                  <span>Mon – Fri:</span>
                  <span className="font-bold text-primary">9:00 AM – 8:00 PM</span>
                </p>
                <p className="flex items-center justify-between border-b border-line/40 pb-2">
                  <span>Saturday:</span>
                  <span className="font-bold text-primary">9:00 AM – 6:00 PM</span>
                </p>
                <p className="flex items-center justify-between pt-1 text-accent font-semibold">
                  <span>Sunday:</span>
                  <span>Closed</span>
                </p>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-line/50">
              <a
                href="https://wa.me/998901234567"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3 font-display text-sm font-bold text-white transition hover:bg-emerald-700 shadow-sm"
              >
                <span>💬</span>
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Direct Inquiries Section */}
        <div className="rounded-[2.5rem] bg-primary p-8 sm:p-14 text-white">
          <div className="max-w-2xl">
            <span className="text-accent font-display text-xs font-bold uppercase tracking-wider">
              Wholesale & Business Orders
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold mt-2">
              Ready to Order Dairy Classic for Your Business?
            </h2>
            <p className="mt-3 text-white/80 text-sm sm:text-base leading-relaxed">
              Call our sales department or visit our wholesale portal to learn about refrigerated deliveries, display freezers, and volume discounts.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href={site.phones[0].href}
                className="rounded-full bg-accent px-8 py-3.5 font-display text-sm font-bold text-white transition hover:bg-accent/90"
              >
                Call {site.phones[0].label}
              </a>
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
    </div>
  );
}
