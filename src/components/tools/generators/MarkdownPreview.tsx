"use client";

import React, { useMemo, useState } from "react";
import { Eye, Code as CodeIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CopyButton } from "@/components/ui/CopyButton";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type ViewMode = "edit" | "preview" | "split";

const DEFAULT_MARKDOWN = `# Heading 1
## Heading 2
### Heading 3

This is a paragraph with **bold**, *italic*, and \`inline code\`.

- List item 1
- List item 2
  - Nested item

1. Numbered item
2. Another item

> This is a blockquote

\`\`\`javascript
const greeting = "Hello, World!";
console.log(greeting);
\`\`\`

[Link to Google](https://google.com)

---

- [x] Create proyect
- [ ] Install dependencies
---

| Column 1 | Column 2 |
|----------|----------|
| Cell 1   | Cell 2   |
`;

export default function MarkdownPreview() {
  const [markdown, setMarkdown] = useState<string>(DEFAULT_MARKDOWN);
  const [view, setView] = useState<ViewMode>("split");

  const quickRef = useMemo(
    () => [
      { syntax: "**bold**" },
      { syntax: "*italic*" },
      { syntax: "`code`" },
      { syntax: "[link](url)" },
      { syntax: "# Heading" },
      { syntax: "## Heading" },
      { syntax: "- item" },
      { syntax: "> quote" },
    ],
    []
  );

  const ViewButton = ({
    id,
    label,
    Icon,
  }: {
    id: ViewMode;
    label: string;
    Icon?: React.ComponentType<{ className?: string }>;
  }) => (
    <button
      type="button"
      onClick={() => setView(id)}
      className={cn(
        "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5",
        view === id ? "bg-white shadow-sm text-slate-900" : "text-slate-600 hover:text-slate-900"
      )}
    >
      {Icon ? <Icon className="w-4 h-4" /> : null}
      {label}
    </button>
  );

  const renderMarkdown = (content: string) => {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]} // <- descomentá si instalás remark-gfm
        components={{
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold mt-6 mb-4 text-slate-900">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-bold mt-5 mb-3 text-slate-900">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold mt-4 mb-2 text-slate-900">{children}</h3>
          ),
          p: ({ children }) => <p className="my-3 text-slate-700 leading-relaxed">{children}</p>,
          ul: ({ children }) => (
            <ul className="list-disc list-inside my-3 space-y-1 text-slate-700">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside my-3 space-y-1 text-slate-700">{children}</ol>
          ),
          li: ({ children }) => <li className="text-slate-700">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-slate-300 pl-4 my-4 italic text-slate-600">
              {children}
            </blockquote>
          ),
          code: ({ children, className, node, ...props }) => {
            // react-markdown v8+: no pasa "inline" directo en TS; se infiere por node/tag
            const isInline =
              (node as any)?.tagName === "code" && (node as any)?.position?.start?.line === (node as any)?.position?.end?.line;

            // Mejor heurística: si viene className = "language-xxx" => block
            const isBlock = typeof className === "string" && className.includes("language-");

            if (!isBlock && isInline) {
              return (
                <code className="px-1.5 py-0.5 bg-slate-100 rounded text-sm font-mono text-slate-800">
                  {children}
                </code>
              );
            }

            return (
              <pre className="bg-slate-900 rounded-xl p-4 my-4 overflow-x-auto">
                <code className="text-green-400 font-mono text-sm">{children}</code>
              </pre>
            );
          },
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          hr: () => <hr className="my-6 border-slate-200" />,
          table: ({ children }) => (
            <table className="w-full border-collapse border border-slate-200 mb-6">
              {children}
            </table>
          ),
          
          thead: ({ children }) => (
            <thead className="bg-slate-100">{children}</thead>
          ),
          
          th: ({ children }) => (
            <th className="border border-slate-200 px-3 py-2 text-left font-semibold text-slate-900">
              {children}
            </th>
          ),
          
          td: ({ children }) => (
            <td className="border border-slate-200 px-3 py-2 text-slate-600">
              {children}
            </td>
          ),
          strong: ({ children }) => <strong className="font-semibold text-slate-900">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
        }}
      >
        {content}
      </ReactMarkdown>
    );
  };

  return (
    <div className="space-y-4">
      {/* View Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center bg-slate-100 rounded-xl p-1">
          <ViewButton id="edit" label="Edit" Icon={CodeIcon} />
          <ViewButton id="split" label="Split" />
          <ViewButton id="preview" label="Preview" Icon={Eye} />
        </div>

        <CopyButton text={markdown} variant="outline" size="sm" className="h-8" />
      </div>

      {/* Content */}
      <div className={cn("grid gap-4", view === "split" && "md:grid-cols-2")}>
        {/* Editor */}
        {(view === "edit" || view === "split") && (
          <div className="space-y-2">
            {view === "split" && <Label className="text-sm font-medium text-slate-700">Markdown</Label>}
            <Textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="Write markdown here..."
              className="min-h-[400px] font-mono text-sm resize-none"
            />
          </div>
        )}

        {/* Preview */}
        {(view === "preview" || view === "split") && (
          <div className="space-y-2">
            {view === "split" && <Label className="text-sm font-medium text-slate-700">Preview</Label>}
            <div className="min-h-[400px] border border-slate-200 rounded-xl p-6 overflow-y-auto bg-white">
              {renderMarkdown(markdown)}
            </div>
          </div>
        )}
      </div>

      {/* Syntax Reference */}
      <div className="bg-slate-50 rounded-xl p-4">
        <h4 className="font-medium text-slate-700 text-sm mb-3">Quick Reference</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          {quickRef.map((item, i) => (
            <div key={i} className="bg-white rounded-lg p-2 border border-slate-200">
              <code className="text-slate-600">{item.syntax}</code>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}