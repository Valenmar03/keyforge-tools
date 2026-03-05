import { getRequestConfig } from "next-intl/server";

export const defaultLocale = "es";
export const locales = ["es", "en"] as const;

export type AppLocale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
  const resolvedLocale: AppLocale =
    (locales as readonly string[]).includes(locale ?? "")
      ? (locale as AppLocale)
      : defaultLocale;

  const messages = {
    es: (await import("../../messages/es.json")).default,
    en: (await import("../../messages/en.json")).default,
  } satisfies Record<AppLocale, any>;

  return {
    locale: resolvedLocale,
    messages: messages[resolvedLocale],
  };
});