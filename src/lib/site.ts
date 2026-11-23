/** Business facts — single source for header, footer, menu, contact page and JSON-LD. */
export const site = {
  name: "Dairy Classic",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://dairyclassics.com",
  founded: 1996,
  address: {
    street: "БУТ 5",
    city: "Tashkent",
    region: "Tashkent Region",
    country: "UZ",
  },
  // NOTE: confirm before launch — taken from the current About page.
  email: "support@dairyclassic.uz",
  phones: [
    { label: "+998 78 120 33 77", href: "tel:+998781203377" },
    { label: "+998 78 120 33 78", href: "tel:+998781203378" },
    { label: "+998 90 992 29 99", href: "tel:+998909922999" },
  ],
  whatsapp: [
    { city: "Tashkent", label: "+998 90 998 20 19", href: "https://wa.me/998909982019" },
    { city: "Samarkand", label: "+998 90 502 92 92", href: "https://wa.me/998905029292" },
  ],
  hours: { weekdays: "Mon–Sat", open: "09:00", close: "20:00", closed: "Sun" },
  socials: [
    { name: "Instagram", handle: "@dairyclassic.uz", href: "https://www.instagram.com/dairyclassic.uz/" },
    { name: "Facebook", handle: "DairyClassicsIceCream", href: "https://www.facebook.com/DairyClassicsIceCream" },
    { name: "X", handle: "@dairyclassicUz", href: "https://x.com/dairyclassicUz" },
    { name: "Pinterest", handle: "dairyclassic_1990", href: "https://www.pinterest.com/dairyclassic_1990/" },
    { name: "TikTok", handle: "@dairyclassic.uz", href: "https://www.tiktok.com/@dairyclassic.uz" },
    { name: "YouTube", handle: "@dairyclassic.uz.official", href: "https://www.youtube.com/@dairyclassic.uz.official" },
  ],
} as const;
