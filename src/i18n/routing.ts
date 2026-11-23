import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "uz", "ru"],
  defaultLocale: "en",
  // EN lives at "/", UZ and RU at "/uz" and "/ru".
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
