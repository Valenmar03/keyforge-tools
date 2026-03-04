import React from "react";
import Link from "next/link";
import { ChevronRight, Shield, Code, Sparkles, ArrowRight } from "lucide-react";
import { categories, getRelatedTools, type Tool } from "@/lib/tools";
import ReactMarkdown from "react-markdown";
import { Accordion,  AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";

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

function absoluteUrl(path: string) {
  // Seteá esto con un env en producción:
  // NEXT_PUBLIC_SITE_URL=https://tudominio.com
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

type Props = {
  tool: Tool;
  children: React.ReactNode;
};

export default function ToolLayout({ tool, children }: Props) {
  const relatedTools = getRelatedTools(tool);
  const category = categories.find((c) => c.id === tool.category);
  const CategoryIcon = categoryIcons[tool.category];

  // JSON-LD FAQ Schema
  const faqSchema =
    tool.faqItems?.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: tool.faqItems.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }
      : null;

  // JSON-LD Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: absoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Tools",
        item: absoluteUrl("/tools"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: tool.title,
        item: absoluteUrl(`/tools/${tool.slug}`),
      },
    ],
  };

  // Convert internal markdown links like [text](/tools/some-slug) to Next routes
  // (si ya tus textos usan /tools/<slug>, no hace falta esto, pero lo dejamos safe)
  const processedSeoContent = tool.seoContent?.replace(
    /\[([^\]]+)\]\(\/tools\/([^)]+)\)/g,
    (_match, text, slug) => `[${text}](/tools/${slug})`
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Schema Scripts */}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50 pt-8 pb-12 border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-6">
          {/* Breadcrumbs */}
          <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-500 mb-6">
            <Link href="/" className="hover:text-slate-900">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/tools" className="hover:text-slate-900">
              Tools
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link
              href={`/tools?category=${tool.category}`}
              className="hover:text-slate-900"
            >
              {category?.name ?? tool.category}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-900 font-medium">{tool.title}</span>
          </nav>

          {/* Title */}
          <div className="flex items-start gap-4">
            <div
              className={`w-14 h-14 rounded-xl bg-gradient-to-br ${categoryColors[tool.category]} flex items-center justify-center shrink-0`}
            >
              <CategoryIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                {tool.title}
              </h1>
              <p className="text-lg text-slate-600">{tool.description}</p>

              {!!tool.keywords?.length && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {tool.keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-full"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Tool UI */}
      <section className="py-10">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-8">
            {children}
          </div>
        </div>
      </section>

      {/* SEO Content */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="prose prose-slate prose-lg max-w-none">
            <ReactMarkdown
              components={{
                a: ({ href, children, ...props }) => {
                  if (!href) return <a {...props}>{children}</a>;

                  const isInternal = href.startsWith("/") && !href.startsWith("//");
                  if (isInternal) {
                    return (
                      <Link
                        href={href}
                        className="text-blue-600 hover:text-blue-700 no-underline hover:underline"
                      >
                        {children}
                      </Link>
                    );
                  }

                  return (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      {...props}
                    >
                      {children}
                    </a>
                  );
                },
                h2: ({ children }) => (
                  <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4 first:mt-0">
                    {children}
                  </h2>
                ),
                p: ({ children }) => (
                  <p className="text-slate-600 leading-relaxed mb-4">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside space-y-2 text-slate-600 mb-4">
                    {children}
                  </ul>
                ),
                li: ({ children }) => <li className="text-slate-600">{children}</li>,
                strong: ({ children }) => (
                  <strong className="font-semibold text-slate-900">{children}</strong>
                ),
                code: ({ children }) => (
                  <code className="px-1.5 py-0.5 bg-slate-200 rounded text-sm font-mono text-slate-800">
                    {children}
                  </code>
                ),
              }}
            >
              {processedSeoContent || ""}
            </ReactMarkdown>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      {tool.faqItems?.length ? (
        <section className="py-12 border-t border-slate-100">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-end justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Frequently Asked Questions
                </h2>
                <p className="text-slate-600 mt-1">
                  Quick answers about usage, privacy, and best practices.
                </p>
              </div>

              {/* opcional: link a FAQ general */}
              <Link
                href="/faq"
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                View all FAQs
              </Link>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
              <Accordion type="single" collapsible className="divide-y divide-slate-200">
                {tool.faqItems.map((item, idx) => (
                  <AccordionItem
                    key={idx}
                    value={`faq-${idx}`}
                    className="px-4 md:px-6"
                  >
                    <AccordionTrigger className="py-5 text-left hover:no-underline group">
                      <div className="flex items-start gap-3">
                        {/* Badge opcional */}
                        <span className="mt-0.5 inline-flex h-6 min-w-6 items-center justify-center rounded-md bg-slate-100 text-xs font-semibold text-slate-600">
                          {idx + 1}
                        </span>

                        <span className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                          {item.question}
                        </span>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="pb-5">
                      <div className="pl-9 md:pl-10 text-slate-600 leading-relaxed">
                        {item.answer}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

              {/* mini nota opcional abajo */}
              <div className="mt-6 flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <Shield className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-600">
                  <span className="font-semibold text-slate-800">Privacy:</span>{" "}
                  Everything runs locally in your browser. No data is sent to a server.
                </p>
              </div>
            </div>
          </section>
        ) : null}

      {/* Related Tools */}
      {!!relatedTools.length && (
        <section className="py-12 bg-slate-50 border-t border-slate-100">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Related Tools</h2>
              <Link
                href="/tools"
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {relatedTools.map((relatedTool) => {
                const Icon = categoryIcons[relatedTool.category];
                return (
                  <Link
                    key={relatedTool.slug}
                    href={`/tools/${relatedTool.slug}`}
                    className="group bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md hover:border-slate-300 transition-all"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`w-10 h-10 rounded-lg bg-gradient-to-br ${categoryColors[relatedTool.category]} flex items-center justify-center`}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {relatedTool.title}
                      </h3>
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {relatedTool.description}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Privacy Note */}
      <section className="py-8 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <Shield className="w-5 h-5 text-green-500" />
            <span>
              <strong className="text-slate-700">Privacy First:</strong> This tool
              runs entirely in your browser. No data is sent to any server.
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}