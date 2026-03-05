"use client";

import React, { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CopyButton } from "@/components/ui/CopyButton";

const STOP_WORDS = [
  // EN
  "a","an","the","and","or","but","in","on","at","to","for","of","with","by",
  // ES
  "el","la","los","las","un","una","unos","unas","y","o","pero","en","de","del","al","para","por","con",
];

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeText(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics
    .replace(/[^\w\s-]/g, " ")       // special chars => space
    .trim();
}

export default function SlugifyText() {
  const [input, setInput] = useState<string>("");
  const [separator, setSeparator] = useState<string>("-");
  const [lowercase, setLowercase] = useState<boolean>(true);
  const [removeStopWords, setRemoveStopWords] = useState<boolean>(false);
  const [maxLength, setMaxLength] = useState<number>(0);

  const slug = useMemo(() => {
    const raw = input.trim();
    if (!raw) return "";

    const normalized = normalizeText(raw);

    // If separator is empty, we use spaces as joiner and then remove spaces.
    // Better UX: treat "none" as: collapse to alphanumerics (no join char).
    const sep = separator; // could be ""

    let result: string;

    if (sep === "") {
      // collapse whitespace then remove it
      result = normalized
        .replace(/\s+/g, " ")
        .replace(/[-\s]+/g, "") // remove spaces and dashes
        .trim();
    } else {
      const sepEsc = escapeRegExp(sep);

      result = normalized
        .replace(/\s+/g, sep) // whitespace => sep
        .replace(new RegExp(`${sepEsc}+`, "g"), sep) // dup sep
        .replace(new RegExp(`^${sepEsc}|${sepEsc}$`, "g"), ""); // trim sep
    }

    if (lowercase) result = result.toLowerCase();

    if (removeStopWords && result) {
      if (sep === "") {
        // With no separator, stopwords removal is ambiguous; skip it safely.
        // (You can choose to implement tokenization differently if you want.)
      } else {
        const sepEsc = escapeRegExp(sep);
        const words = STOP_WORDS.map(escapeRegExp).join("|");

        // remove stopwords that are full tokens between separators
        const re = new RegExp(`(^|${sepEsc})(${words})(${sepEsc}|$)`, "gi");
        result = result
          .replace(re, sep)
          .replace(new RegExp(`${sepEsc}+`, "g"), sep)
          .replace(new RegExp(`^${sepEsc}|${sepEsc}$`, "g"), "");
      }
    }

    if (maxLength > 0 && result.length > maxLength) {
      result = result.slice(0, maxLength);

      // remove partial token at end only if we have a separator
      if (sep !== "") {
        const lastSep = result.lastIndexOf(sep);
        if (lastSep > Math.floor(maxLength * 0.5)) {
          result = result.slice(0, lastSep);
        }
        // trim again
        const sepEsc = escapeRegExp(sep);
        result = result.replace(new RegExp(`^${sepEsc}|${sepEsc}$`, "g"), "");
      }
    }

    return result;
  }, [input, separator, lowercase, removeStopWords, maxLength]);

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-slate-700">Input Text</Label>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to slugify..."
          className="text-lg"
        />
      </div>

      {/* Arrow */}
      <div className="flex justify-center">
        <ArrowRight className="w-6 h-6 text-slate-300" />
      </div>

      {/* Output */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-slate-700">Slug</Label>
          {slug && (
            <CopyButton text={slug} variant="outline" size="sm" className="h-7" />
          )}
        </div>

        <div className="bg-slate-900 rounded-xl p-4">
          <code className="text-green-400 font-mono text-lg break-all">
            {slug || <span className="text-slate-500">slug-will-appear-here</span>}
          </code>
        </div>

        {slug && <p className="text-xs text-slate-500">{slug.length} characters</p>}
      </div>

      {/* Options */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        {/* Separator */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-slate-700">Separator</Label>
          <div className="flex gap-2 flex-wrap">
            {[
              { value: "-", label: "-" },
              { value: "_", label: "_" },
              { value: ".", label: "." },
              { value: "", label: "none" },
            ].map((sep) => (
              <button
                key={sep.label}
                onClick={() => setSeparator(sep.value)}
                className={`px-4 py-2 rounded-lg text-sm font-mono border transition-all ${
                  separator === sep.value
                    ? "bg-blue-50 border-blue-200 text-blue-700"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {sep.label}
              </button>
            ))}
          </div>
          {separator === "" && (
            <p className="text-xs text-slate-500">
              “none” removes separators entirely (tokens are concatenated).
            </p>
          )}
        </div>

        {/* Toggles */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <Label className="text-sm text-slate-700">Lowercase</Label>
            <Switch checked={lowercase} onCheckedChange={setLowercase} />
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <Label className="text-sm text-slate-700">Remove stop words</Label>
            <Switch
              checked={removeStopWords}
              onCheckedChange={setRemoveStopWords}
              disabled={separator === ""}
            />
          </div>
        </div>

        {/* Max Length */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-slate-700">
            Max length (0 = unlimited)
          </Label>
          <Input
            type="number"
            min={0}
            value={maxLength}
            onChange={(e) => setMaxLength(Math.max(0, Number(e.target.value) || 0))}
            className="font-mono"
          />
        </div>
      </div>
    </div>
  );
}