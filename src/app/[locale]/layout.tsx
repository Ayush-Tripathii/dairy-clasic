import type { Metadata, Viewport } from "next";
import { Montserrat, Poppins } from "next/font/google";
import { notFound } from "next/navigation";
import { locale as rootLocale } from "next/root-params";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { site } from "@/lib/site";
import { AppProviders } from "@/components/providers/AppProviders";
import { introHeadScript } from "@/components/providers/IntroProvider";
import { IntroLoader } from "@/components/layout/IntroLoader";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFab } from "@/components/layout/WhatsAppFab";
import "../globals.css";

const montserrat = Montserrat({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-montserrat",
  display: "swap",
});

// Poppins has no Cyrillic; Russian glyphs fall back to Montserrat via the font stack.
const poppins = Poppins({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-poppins",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#fff8f3",
  colorScheme: "light",
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta");
  return {
    metadataBase: new URL(site.url),
    title: { default: t("homeTitle"), template: "%s | Dairy Classic" },
    description: t("homeDescription"),
    applicationName: site.name,
    openGraph: { siteName: site.name, type: "website" },
  };
}

export default async function LocaleLayout({ children }: LayoutProps<"/[locale]">) {
  const locale = await rootLocale();
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations("a11y");

  return (
    <html lang={locale} className={`${montserrat.variable} ${poppins.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introHeadScript }} />
      </head>
      <body>
        <NextIntlClientProvider>
          <AppProviders>
            <a href="#main" className="skip-link">
              {t("skip")}
            </a>
            <IntroLoader />
            <SiteChrome />
            <main id="main" tabIndex={-1} className="outline-none">
              {children}
            </main>
            <Footer />
            <WhatsAppFab />
          </AppProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
