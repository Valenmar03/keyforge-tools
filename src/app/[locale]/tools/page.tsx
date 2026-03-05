"use client";

import { useMemo, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Search,
  Shield,
  Code,
  Sparkles,
  Grid3X3,
  List,
  ChevronRight,
} from "lucide-react";

import {
  tools,
  categories,
  type CategoryId,
  type Locale,
  normalizeLocale,
  getToolText,
  getCategoryText,
} from "@/lib/tools";

import ToolCard from "@/components/tools/ToolCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";

const categoryIcons = {
  security: Shield,
  "dev-utilities": Code,
  generators: Sparkles,
} as const;

type ActiveCategory = "all" | CategoryId;
type ViewMode = "grid" | "list";

export default function ToolsPage() {
  // next-intl devuelve string, lo normalizamos
  const nextIntlLocale = useLocale();
  const locale = normalizeLocale(nextIntlLocale) as Locale;

  const withLocale = (path: string) =>
    `/${locale}${path.startsWith("/") ? path : `/${path}`}`;

  const searchParams = useSearchParams();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ActiveCategory>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const t = useTranslations("toolsPage");

  // Sync category from URL (?category=security) on load + when it changes
  useEffect(() => {
    const cat = searchParams.get("category") as CategoryId | null;
    if (cat && categories.some((c) => c.id === cat)) {
      setActiveCategory(cat);
    } else {
      setActiveCategory("all");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // When user clicks a category tab, update both state and URL
  const setCategory = (cat: ActiveCategory) => {
    setActiveCategory(cat);

    const params = new URLSearchParams(searchParams.toString());
    if (cat === "all") params.delete("category");
    else params.set("category", cat);

    router.push(
      withLocale(`/tools${params.toString() ? `?${params.toString()}` : ""}`)
    );
  };

  const filteredTools = useMemo(() => {
    let result = tools;

    if (activeCategory !== "all") {
      result = result.filter((t) => t.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((tool) => {
        const txt = getToolText(tool, locale);
        return (
          txt.title.toLowerCase().includes(q) ||
          txt.description.toLowerCase().includes(q) ||
          txt.keywords.some((k) => k.toLowerCase().includes(q))
        );
      });
    }

    return result;
  }, [searchQuery, activeCategory, locale]);

  const toolsByCategory = useMemo(() => {
    if (activeCategory !== "all" || searchQuery.trim()) return null;

    return categories.map((cat) => ({
      ...cat,
      tools: tools.filter((t) => t.category === cat.id),
    }));
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gradient-to-br from-slate-50 via-white to-blue-50 pt-10 pb-8 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <Link href={withLocale("/")} className="hover:text-slate-900">
              {t("breadcrumbsHome")}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-900 font-medium">
              {t("breadcrumbsCurrent")}
            </span>
          </nav>

          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            {t("title")}
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl">
            {t("description", { count: tools.length })}
          </p>

          {/* Search */}
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
      </section>

      {/* Filters & Content */}
      <section className="py-8">
        <div className="max-w-6xl mx-auto px-6">
          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            {/* Category Tabs */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setCategory("all")}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  activeCategory === "all"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                {t("allToolsTab", { count: tools.length })}
              </button>

              {categories.map((cat) => {
                const Icon = categoryIcons[cat.id];
                const count = tools.filter((t) => t.category === cat.id).length;
                const catText = getCategoryText(cat, locale);

                return (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                      activeCategory === cat.id
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {catText.name} ({count})
                  </button>
                );
              })}
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-2 rounded-md transition-all",
                  viewMode === "grid"
                    ? "bg-white shadow-sm"
                    : "hover:bg-slate-200"
                )}
                aria-label="Grid view"
              >
                <Grid3X3 className="w-4 h-4 text-slate-600" />
              </button>

              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-2 rounded-md transition-all",
                  viewMode === "list"
                    ? "bg-white shadow-sm"
                    : "hover:bg-slate-200"
                )}
                aria-label="List view"
              >
                <List className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </div>

          {/* Results Count */}
          {searchQuery && (
            <p className="text-sm text-slate-500 mb-6">
              {t("resultsFound", {
                count: filteredTools.length,
                suffix:
                  filteredTools.length !== 1 ? t("resultsSuffixPlural") : "",
                categoryPart:
                  activeCategory !== "all"
                    ? t("resultsInCategory", {
                        categoryName: getCategoryText(
                          categories.find((c) => c.id === activeCategory)!,
                          locale
                        ).name,
                      })
                    : "",
              })}
            </p>
          )}

          {/* Tools Grid/List */}
          {toolsByCategory && !searchQuery ? (
            <div className="space-y-12">
              {toolsByCategory.map((cat) => {
                const Icon = categoryIcons[cat.id];
                const catText = getCategoryText(cat, locale);

                return (
                  <div key={cat.id}>
                    <div className="flex items-center gap-3 mb-6">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center",
                          cat.id === "security" && "bg-blue-100",
                          cat.id === "dev-utilities" && "bg-emerald-100",
                          cat.id === "generators" && "bg-violet-100"
                        )}
                      >
                        <Icon
                          className={cn(
                            "w-5 h-5",
                            cat.id === "security" && "text-blue-600",
                            cat.id === "dev-utilities" && "text-emerald-600",
                            cat.id === "generators" && "text-violet-600"
                          )}
                        />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-slate-900">
                          {catText.name}
                        </h2>
                        <p className="text-sm text-slate-500">
                          {catText.description}
                        </p>
                      </div>
                    </div>

                    <div
                      className={cn(
                        viewMode === "grid"
                          ? "grid md:grid-cols-2 lg:grid-cols-3 gap-4"
                          : "space-y-3"
                      )}
                    >
                      {cat.tools.map((tool) => (
                        <ToolCard
                          key={tool.slug}
                          tool={tool}
                          compact={viewMode === "list"}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              className={cn(
                viewMode === "grid"
                  ? "grid md:grid-cols-2 lg:grid-cols-3 gap-4"
                  : "space-y-3"
              )}
            >
              {filteredTools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} compact={viewMode === "list"} />
              ))}
            </div>
          )}

          {/* No Results */}
          {filteredTools.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-7 h-7 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                {t("noResultsTitle")}
              </h3>
              <p className="text-slate-500 mb-4">{t("noResultsBody")}</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setCategory("all");
                }}
              >
                {t("clearFilters")}
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}