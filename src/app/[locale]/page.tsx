"use client";

import Link from "next/link";
import {
  Shield,
  Code,
  Sparkles,
  Search,
  ArrowRight,
  Lock,
  Zap,
  Eye,
  Key,
  CheckCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import {
  getCategories,
  getPopularTools,
  getTools,
  searchTools,
  type Locale,
  type Translator,
} from "@/lib/tools";
import ToolCard from "@/components/tools/ToolCard";

const categoryIcons = {
  security: Shield,
  "dev-utilities": Code,
  generators: Sparkles,
} as const;

const categoryColors = {
  security: "from-blue-500 to-indigo-600",
  "dev-utilities": "from-emerald-500 to-teal-600",
  generators: "from-violet-500 to-purple-600",
} as const;

export default function Home() {
  const t = useTranslations("home");
  const locale = useLocale() as Locale;
  const tTools = useTranslations("toolsData") as unknown as Translator;

  const withLocale = (path: string) =>
    `/${locale}${path.startsWith("/") ? path : `/${path}`}`;

  const [searchQuery, setSearchQuery] = useState("");

  const categories = useMemo(() => getCategories(tTools), [tTools]);
  const tools = useMemo(() => getTools(tTools), [tTools]);

  const popularTools = useMemo(() => getPopularTools(tTools, 6), [tTools]);

  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchTools(searchQuery, tTools).slice(0, 8);
  }, [searchQuery, tTools]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-100/40 to-indigo-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-28">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-sm text-blue-700 mb-8">
              <Lock className="w-4 h-4" />
              <span>{t("privacyBadge")}</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 tracking-tight mb-6">
              {t("headlinePrefix")}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {" "}
                {t("headlineHighlight")}
              </span>
            </h1>

            <p className="text-xl text-slate-600 mb-10 leading-relaxed">
              {t("subheadline")}
            </p>

            {/* Search Box */}
            <div className="relative max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder={t("searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-lg shadow-lg shadow-slate-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Search Results Dropdown */}
              {filteredTools.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50">
                  {filteredTools.map((tool) => (
                    <Link
                      key={tool.slug}
                      href={withLocale(`/tools/${tool.slug}`)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors"
                    >
                      <div
                        className={`w-8 h-8 rounded-lg bg-gradient-to-br ${categoryColors[tool.category]} flex items-center justify-center`}
                      >
                        <Key className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium text-slate-900">
                          {tool.title}
                        </div>
                        <div className="text-sm text-slate-500 truncate">
                          {tool.description}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-6 mt-8">
              <Link
                href={withLocale("/tools")}
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
              >
                {t("browseAllTools")}
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="#categories"
                className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
              >
                {t("viewCategories")}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Tools */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">
                {t("popularToolsTitle")}
              </h2>
              <p className="text-slate-600 mt-2">{t("popularToolsSubtitle")}</p>
            </div>

            <Link
              href={withLocale("/tools")}
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              {t("browseAllTools")}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">
              {t("toolCategoriesTitle")}
            </h2>
            <p className="text-slate-600 mt-2">{t("toolCategoriesSubtitle")}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {categories.map((cat) => {
              const Icon = categoryIcons[cat.id];
              const toolCount = tools.filter((tool) => tool.category === cat.id).length;

              return (
                <Link
                  key={cat.id}
                  href={withLocale(`/tools?category=${cat.id}`)}
                  className="group relative bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-lg hover:shadow-slate-200/50 hover:border-slate-300 transition-all"
                >
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${categoryColors[cat.id]} flex items-center justify-center mb-6`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    {cat.name}
                  </h3>
                  <p className="text-slate-600 mb-4">{cat.description}</p>

                  <div className="flex items-center text-sm text-slate-500">
                    <span>{`${toolCount} ${t("tools")}`}</span>
                    <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-10 md:p-14 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {t("privacyFirstTitle")}
            </h2>
            <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
              {t("privacyFirstBody")}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                t("privacyBadges.noServerCalls"),
                t("privacyBadges.noAnalytics"),
                t("privacyBadges.noCookies"),
                t("privacyBadges.openAlgorithms"),
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white text-sm"
                >
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">{t("whyTitle")}</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Zap, title: t("why.instantResultsTitle"), desc: t("why.instantResultsDesc") },
              { icon: Lock, title: t("why.cryptoSecureTitle"), desc: t("why.cryptoSecureDesc") },
              { icon: Eye, title: t("why.noTrackingTitle"), desc: t("why.noTrackingDesc") },
              { icon: Code, title: t("why.devFocusedTitle"), desc: t("why.devFocusedDesc") },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white border border-slate-200 rounded-xl p-6"
              >
                <item.icon className="w-8 h-8 text-blue-600 mb-4" />
                <h3 className="font-semibold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            {t("ctaTitle")}
          </h2>
          <p className="text-slate-600 mb-8">{t("ctaSubtitle")}</p>
          <Link
            href={withLocale("/tools")}
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors text-lg"
          >
            {t("ctaButton")}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}