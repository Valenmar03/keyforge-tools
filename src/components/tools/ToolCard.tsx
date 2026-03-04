import React from "react";
import Link from "next/link";
import { Shield, Code, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Tool } from "@/lib/tools";

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

const categoryBgColors = {
  security: "bg-blue-50",
  "dev-utilities": "bg-emerald-50",
  generators: "bg-violet-50",
} as const;

type Props = {
  tool: Tool;
  compact?: boolean;
};

export default function ToolCard({ tool, compact = false }: Props) {
  const Icon = categoryIcons[tool.category];
  const href = `/tools/${tool.slug}`;

  if (compact) {
    return (
      <Link
        href={href}
        className="group flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl hover:shadow-md hover:border-slate-300 transition-all"
      >
        <div
          className={cn(
            "w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center shrink-0",
            categoryColors[tool.category]
          )}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors truncate">
            {tool.title}
          </h3>
          <p className="text-sm text-slate-500 truncate">{tool.description}</p>
        </div>

        <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="group bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg hover:shadow-slate-200/50 hover:border-slate-300 transition-all"
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0",
            categoryColors[tool.category]
          )}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors mb-1">
            {tool.title}
          </h3>

          <p className="text-sm text-slate-600 line-clamp-2 mb-3">
            {tool.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {tool.keywords.slice(0, 3).map((keyword) => (
              <span
                key={keyword}
                className={cn(
                  "px-2 py-0.5 text-xs rounded-md",
                  categoryBgColors[tool.category],
                  tool.category === "security" && "text-blue-700",
                  tool.category === "dev-utilities" && "text-emerald-700",
                  tool.category === "generators" && "text-violet-700"
                )}
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}