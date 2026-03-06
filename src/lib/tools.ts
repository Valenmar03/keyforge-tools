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
  },
  {
    slug: "password-strength-checker",
    category: "security",
    relatedSlugs: [
      "password-generator",
      "bcrypt-hash-generator",
      "random-token-generator",
    ],
  },
  {
    slug: "random-token-generator",
    category: "security",
    relatedSlugs: ["api-key-generator", "password-generator", "uuid-generator"],
  },
  {
    slug: "api-key-generator",
    category: "security",
    relatedSlugs: ["random-token-generator", "uuid-generator", "password-generator"],
  },
  {
    slug: "bcrypt-hash-generator",
    category: "security",
    relatedSlugs: [
      "password-generator",
      "password-strength-checker",
      "random-token-generator",
    ],
  },
  {
    slug: "jwt-decoder",
    category: "security",
    relatedSlugs: ["base64-encoder-decoder", "json-formatter", "api-key-generator"],
  },
  {
    slug: "sha256-hash-generator",
    category: "security",
    relatedSlugs: ["md5-hash-generator", "bcrypt-hash-generator", "password-strength-checker"],
  },
  {
    slug: "md5-hash-generator",
    category: "security",
    relatedSlugs: ["sha256-hash-generator", "bcrypt-hash-generator", "password-strength-checker"],
  },

  // DEV UTILITIES
  {
    slug: "uuid-generator",
    category: "dev-utilities",
    relatedSlugs: ["random-token-generator", "api-key-generator", "random-string-generator"],
  },
  {
    slug: "json-formatter",
    category: "dev-utilities",
    relatedSlugs: ["json-minify", "json-diff-compare", "base64-encoder-decoder"],
  },
  {
    slug: "json-minify",
    category: "dev-utilities",
    relatedSlugs: ["json-formatter", "json-to-csv-converter", "csv-to-json-converter"],
  },
  {
    slug: "json-to-csv-converter",
    category: "dev-utilities",
    relatedSlugs: ["csv-to-json-converter", "json-formatter", "json-minify"],
  },
  {
    slug: "csv-to-json-converter",
    category: "dev-utilities",
    relatedSlugs: ["json-to-csv-converter", "json-formatter", "json-minify"],
  },
  {
    slug: "json-diff-compare",
    category: "dev-utilities",
    relatedSlugs: ["json-formatter", "json-minify", "regex-tester"],
  },
  {
    slug: "base64-encoder-decoder",
    category: "dev-utilities",
    relatedSlugs: ["url-encoder-decoder", "jwt-decoder", "json-formatter"],
  },
  {
    slug: "url-encoder-decoder",
    category: "dev-utilities",
    relatedSlugs: ["base64-encoder-decoder", "html-encoder-decoder", "json-formatter"],
  },
  {
    slug: "html-encoder-decoder",
    category: "dev-utilities",
    relatedSlugs: ["url-encoder-decoder", "base64-encoder-decoder", "json-formatter"],
  },
  {
    slug: "timestamp-converter",
    category: "dev-utilities",
    relatedSlugs: ["uuid-generator", "json-formatter", "regex-tester"],
  },
  {
    slug: "regex-tester",
    category: "dev-utilities",
    relatedSlugs: ["json-formatter", "text-case-converter", "whitespace-cleaner"],
  },

  // GENERATORS
  {
    slug: "random-string-generator",
    category: "generators",
    relatedSlugs: ["password-generator", "uuid-generator", "random-token-generator"],
  },
  {
    slug: "lorem-ipsum-generator",
    category: "generators",
    relatedSlugs: ["random-string-generator", "markdown-preview", "text-case-converter"],
  },
  {
    slug: "random-number-generator",
    category: "generators",
    relatedSlugs: ["random-string-generator", "uuid-generator", "random-color-generator"],
  },
  {
    slug: "random-color-generator",
    category: "generators",
    relatedSlugs: ["random-string-generator", "random-number-generator", "lorem-ipsum-generator"],
  },
  {
    slug: "slugify-text",
    category: "generators",
    relatedSlugs: ["url-encoder-decoder", "text-case-converter", "whitespace-cleaner"],
  },
  {
    slug: "text-case-converter",
    category: "generators",
    relatedSlugs: ["slugify-text", "whitespace-cleaner", "regex-tester"],
  },
  {
    slug: "whitespace-cleaner",
    category: "generators",
    relatedSlugs: ["text-case-converter", "regex-tester", "json-formatter"],
  },
  {
    slug: "markdown-preview",
    category: "generators",
    relatedSlugs: ["lorem-ipsum-generator", "json-formatter", "text-case-converter"],
  },
  {
    slug: "qr-code-generator",
    category: "generators",
    relatedSlugs: ["url-encoder-decoder", "html-encoder-decoder", "random-string-generator"],
  },
  {
    slug: "word-counter",
    category: "generators",
    relatedSlugs: ["character-counter", "whitespace-cleaner", "text-case-converter"],
  },
  {
    slug: "character-counter",
    category: "generators",
    relatedSlugs: ["word-counter", "whitespace-cleaner", "text-case-converter"],
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

/** Tools localizadas completas (title/desc/keywords/seo/faq salen de i18n) */
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