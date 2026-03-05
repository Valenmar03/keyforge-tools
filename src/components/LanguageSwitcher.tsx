"use client";

import { useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import type { AppLocale } from "../i18n/request";

export default function LanguageSwitcher() {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("header");
  const router = useRouter();
  const pathname = usePathname() || "/";

  const nextLocale: AppLocale = locale === "en" ? "es" : "en";

  const handleToggle = useCallback(() => {
    const segments = pathname.split("/");
    // pathname is like /en/... or /es/...
    if (segments.length > 1) {
      segments[1] = nextLocale;
    }
    const newPath = segments.join("/") || `/${nextLocale}`;
    router.push(newPath);
  }, [pathname, nextLocale, router]);

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
      aria-label={t("language")}
    >
      <Globe className="w-4 h-4" />
      <span>{locale.toUpperCase()}</span>
    </button>
  );
}

