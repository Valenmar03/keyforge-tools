"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

const year = new Date().getFullYear();

export default function Footer() {
  const locale = useLocale(); // ✅ adentro del componente
  const tCommon = useTranslations("common");
  const tFooter = useTranslations("footer");

  return (
    <footer className="border-t border-slate-100 bg-slate-50/60 mt-12">
      <div className="max-w-6xl mx-auto px-6 py-10 grid gap-8 md:grid-cols-[2fr,1fr,1fr] text-sm text-slate-600">
        <div className="space-y-3">
          <div className="text-base font-semibold text-slate-900">
            {tCommon("brand")}
            <span className="text-blue-600">{tCommon("brandSuffix")}</span>
          </div>
          <p className="text-slate-500">{tFooter("tagline")}</p>
        </div>

        <div>
          <h3 className="text-xs font-semibold tracking-wide text-slate-400 uppercase mb-3">
            {tCommon("navigation")}
          </h3>

          <nav className="space-y-1">
            <Link
              href={`/${locale}`}
              className="block hover:text-slate-900 transition-colors"
            >
              {tCommon("home")}
            </Link>

            <Link
              href={`/${locale}/tools`}
              className="block hover:text-slate-900 transition-colors"
            >
              {tCommon("allTools")}
            </Link>

            <Link
              href={`/${locale}/faq`}
              className="block hover:text-slate-900 transition-colors"
            >
              {tCommon("faq")}
            </Link>
          </nav>
        </div>

        <div>
          <h3 className="text-xs font-semibold tracking-wide text-slate-400 uppercase mb-3">
            {tFooter("resources")}
          </h3>
          <div className="space-y-1">
            <p className="text-slate-500">
              {tFooter
                .raw("resourcesBody")
                .split("<line>")
                .map((part: string, index: number) => {
                  if (index === 0) return part;
                  const [line, rest] = part.split("</line>");
                  return (
                    <span key={index} className="block">
                      {line}
                      {rest}
                    </span>
                  );
                })}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between text-xs text-slate-500">
          <p>{tFooter("copyright", { year })}</p>

          <div className="flex flex-wrap items-center gap-4">
            <span className="text-slate-400">{tFooter("madeForDevelopers")}</span>

            <div className="flex items-center gap-3">
              <span className="text-slate-400">{tFooter("categoriesLabel")}</span>

              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/${locale}/tools?category=security`}
                  className="hover:text-slate-900 transition-colors"
                >
                  {tFooter("categorySecurity")}
                </Link>

                <span className="text-slate-300">•</span>

                <Link
                  href={`/${locale}/tools?category=dev-utilities`}
                  className="hover:text-slate-900 transition-colors"
                >
                  {tFooter("categoryDevUtilities")}
                </Link>

                <span className="text-slate-300">•</span>

                <Link
                  href={`/${locale}/tools?category=generators`}
                  className="hover:text-slate-900 transition-colors"
                >
                  {tFooter("categoryGenerators")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}