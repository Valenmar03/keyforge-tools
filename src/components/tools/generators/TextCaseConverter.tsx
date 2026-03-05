"use client";

import React, { useMemo, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CopyButton } from "@/components/ui/CopyButton";

type ConversionId =
  | "lowercase"
  | "uppercase"
  | "titlecase"
  | "sentence"
  | "camelcase"
  | "pascalcase"
  | "snakecase"
  | "kebabcase"
  | "constant"
  | "dotcase"
  | "pathcase"
  | "toggle";

type Conversion = {
  id: ConversionId;
  label: string;
  fn: (s: string) => string;
};

function stripDiacritics(s: string) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function toWords(input: string): string[] {
  // transliterate accents, keep letters+numbers, split by non-alnum
  const cleaned = stripDiacritics(input)
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim();
  if (!cleaned) return [];
  return cleaned.split(/\s+/g).filter(Boolean);
}

function capitalizeWord(w: string) {
  if (!w) return w;
  return w.charAt(0).toUpperCase() + w.slice(1);
}

function titleCaseSmart(input: string) {
  // Keeps punctuation, capitalizes word starts (incl after apostrophes/hyphens)
  // Example: "don't-stop" -> "Don't-Stop"
  const lower = input.toLowerCase();
  return lower.replace(
    /(^|[\s([{'"`-])([a-zà-ÿ])/giu,
    (_m, p1: string, p2: string) => p1 + p2.toUpperCase()
  );
}

function sentenceCaseSmart(input: string) {
  // Lowercase everything, then capitalize after start or after . ! ? + spaces/newlines
  const lower = input.toLowerCase();
  return lower.replace(
    /(^|[.!?]\s+|\n\s*)([a-zà-ÿ])/giu,
    (_m, p1: string, p2: string) => p1 + p2.toUpperCase()
  );
}

function camelCase(input: string) {
  const words = toWords(input);
  if (words.length === 0) return "";
  const [first, ...rest] = words.map((w) => w.toLowerCase());
  return first + rest.map(capitalizeWord).join("");
}

function pascalCase(input: string) {
  return toWords(input)
    .map((w) => capitalizeWord(w.toLowerCase()))
    .join("");
}

function joinWith(input: string, sep: string, upper = false) {
  const words = toWords(input).map((w) => (upper ? w.toUpperCase() : w.toLowerCase()));
  return words.join(sep);
}

function toggleCase(input: string) {
  return input
    .split("")
    .map((c) => {
      const upper = c.toUpperCase();
      const lower = c.toLowerCase();
      // if not a letter, swapping doesn't change => return as-is
      if (upper === lower) return c;
      return c === upper ? lower : upper;
    })
    .join("");
}

const conversions: Conversion[] = [
  { id: "lowercase", label: "lowercase", fn: (s) => s.toLowerCase() },
  { id: "uppercase", label: "UPPERCASE", fn: (s) => s.toUpperCase() },
  { id: "titlecase", label: "Title Case", fn: titleCaseSmart },
  { id: "sentence", label: "Sentence case", fn: sentenceCaseSmart },
  { id: "camelcase", label: "camelCase", fn: camelCase },
  { id: "pascalcase", label: "PascalCase", fn: pascalCase },
  { id: "snakecase", label: "snake_case", fn: (s) => joinWith(s, "_") },
  { id: "kebabcase", label: "kebab-case", fn: (s) => joinWith(s, "-") },
  { id: "constant", label: "CONSTANT_CASE", fn: (s) => joinWith(s, "_", true) },
  { id: "dotcase", label: "dot.case", fn: (s) => joinWith(s, ".") },
  { id: "pathcase", label: "path/case", fn: (s) => joinWith(s, "/") },
  { id: "toggle", label: "tOGGLE cASE", fn: toggleCase },
];

export default function TextCaseConverter() {
  const [input, setInput] = useState<string>("");
  const [selectedCase, setSelectedCase] = useState<ConversionId>("titlecase");

  const results = useMemo<Record<ConversionId, string>>(() => {
    const trimmed = input.trim();
    if (!trimmed) {
      // return empty map with all keys so TS is happy and UI doesn’t crash
      return conversions.reduce((acc, c) => {
        acc[c.id] = "";
        return acc;
      }, {} as Record<ConversionId, string>);
    }

    return conversions.reduce((acc, conv) => {
      acc[conv.id] = conv.fn(input);
      return acc;
    }, {} as Record<ConversionId, string>);
  }, [input]);

  const selectedLabel = conversions.find((c) => c.id === selectedCase)?.label ?? selectedCase;

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-slate-700">Input Text</Label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to convert..."
          className="min-h-[100px]"
        />
      </div>

      {/* Conversions Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {conversions.map((conv) => (
          <button
            key={conv.id}
            onClick={() => setSelectedCase(conv.id)}
            className={`p-3 rounded-xl border text-left transition-all ${
              selectedCase === conv.id
                ? "bg-blue-50 border-blue-200"
                : "bg-slate-50 border-slate-200 hover:bg-slate-100"
            }`}
          >
            <div className="text-xs text-slate-500 mb-1">{conv.label}</div>
            <div className="font-mono text-sm text-slate-900 truncate">
              {results[conv.id] || conv.label}
            </div>
          </button>
        ))}
      </div>

      {/* Selected Output */}
      {input.trim() && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-slate-700">{selectedLabel}</Label>
            <CopyButton
              text={results[selectedCase] || ""}
              variant="outline"
              size="sm"
              className="h-7"
            />
          </div>
          <div className="bg-slate-900 rounded-xl p-4">
            <code className="text-green-400 font-mono break-all whitespace-pre-wrap">
              {results[selectedCase]}
            </code>
          </div>
        </div>
      )}

      {/* Quick Reference */}
      <div className="bg-slate-50 rounded-xl p-4">
        <h4 className="font-medium text-slate-700 text-sm mb-3">Common Use Cases</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-white rounded-lg p-2 border border-slate-200">
            <span className="font-mono">camelCase</span>
            <span className="text-slate-500 ml-2">→ JS variables</span>
          </div>
          <div className="bg-white rounded-lg p-2 border border-slate-200">
            <span className="font-mono">PascalCase</span>
            <span className="text-slate-500 ml-2">→ Classes</span>
          </div>
          <div className="bg-white rounded-lg p-2 border border-slate-200">
            <span className="font-mono">snake_case</span>
            <span className="text-slate-500 ml-2">→ Python/Ruby</span>
          </div>
          <div className="bg-white rounded-lg p-2 border border-slate-200">
            <span className="font-mono">kebab-case</span>
            <span className="text-slate-500 ml-2">→ URLs/CSS</span>
          </div>
        </div>
      </div>
    </div>
  );
}