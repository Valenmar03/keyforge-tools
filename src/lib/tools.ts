import type { LucideIcon } from "lucide-react";

export type Locale = "es" | "en";

export type CategoryId = "security" | "dev-utilities" | "generators";

export type Category = {
  id: CategoryId;
  name: string;
  description: string;
};

export type FAQItem = {
  question: string;
  answer: string;
};

export type Tool = {
  slug: string;
  title: string;
  description: string;
  category: CategoryId;
  keywords: string[];
  relatedSlugs: string[];
  seoContent: string;
  faqItems: FAQItem[];
  icon?: LucideIcon;
  popularityScore?: number;
};

/**
 * Definición "sin texto" (solo IDs + relaciones).
 * El texto se resuelve desde i18n: toolsData.*
 */
type CategoryDef = { id: CategoryId };

type ToolDef = {
  slug: string;
  category: CategoryId;
  relatedSlugs: string[];
  icon?: LucideIcon;
  popularityScore?: number;
};

export const categoryDefs: CategoryDef[] = [
  { id: "security" },
  { id: "dev-utilities" },
  { id: "generators" },
];

export const toolDefs: ToolDef[] = [
  // SECURITY
  {
    slug: "password-generator",
    category: "security",
    relatedSlugs: [
      "password-strength-checker",
      "random-token-generator",
      "api-key-generator",
    ],
    popularityScore: 100,
  },
  {
    slug: "password-strength-checker",
    category: "security",
    relatedSlugs: [
      "password-generator",
      "bcrypt-hash-generator",
      "random-token-generator",
    ],
    popularityScore: 88,
  },
  {
    slug: "random-token-generator",
    category: "security",
    relatedSlugs: ["api-key-generator", "password-generator", "uuid-generator"],
    popularityScore: 82,
  },
  {
    slug: "api-key-generator",
    category: "security",
    relatedSlugs: ["random-token-generator", "uuid-generator", "password-generator"],
    popularityScore: 78,
  },
  {
    slug: "bcrypt-hash-generator",
    category: "security",
    relatedSlugs: [
      "password-generator",
      "password-strength-checker",
      "random-token-generator",
    ],
    popularityScore: 92,
  },
  {
    slug: "jwt-decoder",
    category: "security",
    relatedSlugs: ["base64-encoder-decoder", "json-formatter", "api-key-generator"],
    popularityScore: 95,
  },
  {
    slug: "sha256-hash-generator",
    category: "security",
    relatedSlugs: ["md5-hash-generator", "bcrypt-hash-generator", "password-strength-checker"],
    popularityScore: 85,
  },
  {
    slug: "md5-hash-generator",
    category: "security",
    relatedSlugs: ["sha256-hash-generator", "bcrypt-hash-generator", "password-strength-checker"],
    popularityScore: 80,
  },

  // DEV UTILITIES
  {
    slug: "uuid-generator",
    category: "dev-utilities",
    relatedSlugs: ["random-token-generator", "api-key-generator", "random-string-generator"],
    popularityScore: 94,
  },
  {
    slug: "json-formatter",
    category: "dev-utilities",
    relatedSlugs: ["json-minify", "json-diff-compare", "base64-encoder-decoder"],
    popularityScore: 99,
  },
  {
    slug: "json-minify",
    category: "dev-utilities",
    relatedSlugs: ["json-formatter", "json-to-csv-converter", "csv-to-json-converter"],
    popularityScore: 84,
  },
  {
    slug: "json-to-csv-converter",
    category: "dev-utilities",
    relatedSlugs: ["csv-to-json-converter", "json-formatter", "json-minify"],
    popularityScore: 83,
  },
  {
    slug: "csv-to-json-converter",
    category: "dev-utilities",
    relatedSlugs: ["json-to-csv-converter", "json-formatter", "json-minify"],
    popularityScore: 81,
  },
  {
    slug: "json-diff-compare",
    category: "dev-utilities",
    relatedSlugs: ["json-formatter", "json-minify", "regex-tester"],
    popularityScore: 79,
  },
  {
    slug: "base64-encoder-decoder",
    category: "dev-utilities",
    relatedSlugs: ["url-encoder-decoder", "jwt-decoder", "json-formatter"],
    popularityScore: 93,
  },
  {
    slug: "url-encoder-decoder",
    category: "dev-utilities",
    relatedSlugs: ["base64-encoder-decoder", "html-encoder-decoder", "json-formatter"],
    popularityScore: 86,
  },
  {
    slug: "html-encoder-decoder",
    category: "dev-utilities",
    relatedSlugs: ["url-encoder-decoder", "base64-encoder-decoder", "json-formatter"],
    popularityScore: 76,
  },
  {
    slug: "timestamp-converter",
    category: "dev-utilities",
    relatedSlugs: ["uuid-generator", "json-formatter", "regex-tester"],
    popularityScore: 91,
  },
  {
    slug: "regex-tester",
    category: "dev-utilities",
    relatedSlugs: ["json-formatter", "text-case-converter", "whitespace-cleaner"],
    popularityScore: 90,
  },

  // GENERATORS
  {
    slug: "random-string-generator",
    category: "generators",
    relatedSlugs: ["password-generator", "uuid-generator", "random-token-generator"],
    popularityScore: 74,
  },
  {
    slug: "lorem-ipsum-generator",
    category: "generators",
    relatedSlugs: ["random-string-generator", "markdown-preview", "text-case-converter"],
    popularityScore: 72,
  },
  {
    slug: "random-number-generator",
    category: "generators",
    relatedSlugs: ["random-string-generator", "uuid-generator", "random-color-generator"],
    popularityScore: 70,
  },
  {
    slug: "random-color-generator",
    category: "generators",
    relatedSlugs: ["random-string-generator", "random-number-generator", "lorem-ipsum-generator"],
    popularityScore: 73,
  },
  {
    slug: "slugify-text",
    category: "generators",
    relatedSlugs: ["url-encoder-decoder", "text-case-converter", "whitespace-cleaner"],
    popularityScore: 87,
  },
  {
    slug: "text-case-converter",
    category: "generators",
    relatedSlugs: ["slugify-text", "whitespace-cleaner", "regex-tester"],
    popularityScore: 77,
  },
  {
    slug: "whitespace-cleaner",
    category: "generators",
    relatedSlugs: ["text-case-converter", "regex-tester", "json-formatter"],
    popularityScore: 75,
  },
  {
    slug: "markdown-preview",
    category: "generators",
    relatedSlugs: ["lorem-ipsum-generator", "json-formatter", "text-case-converter"],
    popularityScore: 71,
  },
  {
    slug: "qr-code-generator",
    category: "generators",
    relatedSlugs: ["url-encoder-decoder", "html-encoder-decoder", "random-string-generator"],
    popularityScore: 89,
  },
  {
    slug: "word-counter",
    category: "generators",
    relatedSlugs: ["character-counter", "whitespace-cleaner", "text-case-converter"],
    popularityScore: 68,
  },
  {
    slug: "character-counter",
    category: "generators",
    relatedSlugs: ["word-counter", "whitespace-cleaner", "text-case-converter"],
    popularityScore: 67,
  },
];

export type Translator = ((key: string, values?: Record<string, any>) => string) & {
  raw?: (key: string, values?: Record<string, any>) => any;
};

function rawOrString(t: Translator, key: string) {
  if (typeof t.raw === "function") {
    const v = t.raw(key);
    return typeof v === "string" ? v : String(v);
  }
  return t(key);
}

/** Categories localizadas (name/description salen de i18n) */
export function getCategories(t: Translator): Category[] {
  return categoryDefs.map((c) => ({
    id: c.id,
    name: t(`categories.${c.id}.name`),
    description: t(`categories.${c.id}.description`),
  }));
}

export function getTools(t: Translator): Tool[] {
  return toolDefs.map((d) => {
    const faqRaw = t.raw?.(`tools.${d.slug}.faq`) ?? [];
    const faqItems: FAQItem[] = Array.isArray(faqRaw)
      ? faqRaw.map((x: any) => ({
          question: String(x?.q ?? ""),
          answer: String(x?.a ?? ""),
        }))
      : [];

    const keywordsRaw = t.raw?.(`tools.${d.slug}.keywords`) ?? [];
    const keywords: string[] = Array.isArray(keywordsRaw)
      ? keywordsRaw.map((k: any) => String(k))
      : [];

    return {
      slug: d.slug,
      category: d.category,
      relatedSlugs: d.relatedSlugs,
      icon: d.icon,
      popularityScore: d.popularityScore ?? 0,
      title: t(`tools.${d.slug}.title`),
      description: t(`tools.${d.slug}.description`),
      keywords,
      seoContent: rawOrString(t, `tools.${d.slug}.seoContent`),
      faqItems,
    };
  });
}

/** Find a tool by slug (localizado) */
export function getToolBySlug(slug: string, t: Translator): Tool | undefined {
  return getTools(t).find((x) => x.slug === slug);
}

/** Resolve related tools safely (localizado) */
export function getRelatedTools(tool: Tool, t: Translator): Tool[] {
  const all = getTools(t);
  return tool.relatedSlugs.map((s) => all.find((x) => x.slug === s)).filter(Boolean) as Tool[];
}

export function getPopularTools(t: Translator, limit = 6): Tool[] {
  return [...getTools(t)]
    .sort((a, b) => {
      const scoreDiff = (b.popularityScore ?? 0) - (a.popularityScore ?? 0);
      if (scoreDiff !== 0) return scoreDiff;

      return a.title.localeCompare(b.title);
    })
    .slice(0, limit);
}

/**
 * ✅ Para tu error: "has no exported member 'getToolText'"
 * Esto te devuelve el texto listo (sin necesidad de armar Tool completo).
 * Útil para metadata o lugares donde solo querés título/desc.
 */
export function getToolText(slug: string, t: Translator) {
  const tool = getToolBySlug(slug, t);
  if (!tool) return null;

  const categories = getCategories(t);
  const cat = categories.find((c) => c.id === tool.category);

  return {
    title: tool.title,
    description: tool.description,
    keywords: tool.keywords,
    seoContent: tool.seoContent,
    faqItems: tool.faqItems,
    categoryName: cat?.name ?? tool.category,
    categoryDescription: cat?.description ?? "",
  };
}

/** Filter tools by category (localizado) */
export function getToolsByCategory(categoryId: CategoryId, t: Translator): Tool[] {
  return getTools(t).filter((x) => x.category === categoryId);
}

/** Search tools by title/description/keywords (localizado) */
export function searchTools(query: string, t: Translator): Tool[] {
  const q = query.trim().toLowerCase();
  if (!q) return getTools(t);

  return getTools(t).filter(
    (tool) =>
      tool.title.toLowerCase().includes(q) ||
      tool.description.toLowerCase().includes(q) ||
      tool.keywords.some((k) => k.toLowerCase().includes(q))
  );
}