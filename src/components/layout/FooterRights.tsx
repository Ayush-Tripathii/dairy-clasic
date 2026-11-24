"use client";

import { useTranslations } from "next-intl";

export function FooterRights() {
  const t = useTranslations();
  const year = new Date().getFullYear();
  return <span>{t("footer.rights", { year })}</span>;
}
