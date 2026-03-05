"use client";

import React, { useMemo, useState } from "react";
import { AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Flag = "g" | "i" | "m" | "s";

type MatchItem = {
  value: string;
  index: number;
  length: number;
  groups: Array<string | undefined>;
};

type Result =
  | { valid: null; matches: MatchItem[]; error: null }
  | { valid: true; matches: MatchItem[]; error: null }
  | { valid: false; matches: MatchItem[]; error: string };

type HighlightPart =
  | { type: "text"; content: string }
  | { type: "match"; content: string; matchIndex: number };

const FLAG_OPTIONS: Array<{ value: Flag; label: string; desc: string }> = [
  { value: "g", label: "Global", desc: "Find all matches" },
  { value: "i", label: "Case Insensitive", desc: "Ignore case" },
  { value: "m", label: "Multiline", desc: "^/$ match line boundaries" },
  { value: "s", label: "Dotall", desc: ". matches newlines" },
];

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return "Invalid regular expression";
}

function normalizeFlags(flags: string): string {
  // de-dupe y orden estable gims
  const allowed: Flag[] = ["g", "i", "m", "s"];
  const set = new Set<Flag>();
  for (const ch of flags) {
    if (allowed.includes(ch as Flag)) set.add(ch as Flag);
  }
  return allowed.filter((f) => set.has(f)).join("");
}

export default function RegexTester() {
  const [pattern, setPattern] = useState<string>("");
  const [flags, setFlags] = useState<string>("g");
  const [testString, setTestString] = useState<string>("");

  const safeFlags = useMemo(() => normalizeFlags(flags), [flags]);

  const result: Result = useMemo(() => {
    const p = pattern.trim();
    if (!p || testString.length === 0) {
      return { valid: null, matches: [], error: null };
    }

    try {
      const regex = new RegExp(p, safeFlags);
      const matches: MatchItem[] = [];

      if (safeFlags.includes("g")) {
        let match: RegExpExecArray | null;
        while ((match = regex.exec(testString)) !== null) {
          matches.push({
            value: match[0],
            index: match.index,
            length: match[0].length,
            groups: match.slice(1),
          });

          // Prevent infinite loops with zero-width matches
          if (match[0].length === 0) regex.lastIndex++;
          if (regex.lastIndex > testString.length) break;
        }
      } else {
        const match = regex.exec(testString);
        if (match) {
          matches.push({
            value: match[0],
            index: match.index,
            length: match[0].length,
            groups: match.slice(1),
          });
        }
      }

      return { valid: true, matches, error: null };
    } catch (e) {
      return { valid: false, matches: [], error: getErrorMessage(e) };
    }
  }, [pattern, safeFlags, testString]);

  const highlightedString: HighlightPart[] | null = useMemo(() => {
    if (result.valid !== true) return null;
    if (result.matches.length === 0) return null;

    // Ordenar por index asc; si hay empates, el más largo primero
    const sorted = [...result.matches].sort((a, b) => {
      if (a.index !== b.index) return a.index - b.index;
      return b.length - a.length;
    });

    const parts: HighlightPart[] = [];
    let cursor = 0;

    for (let i = 0; i < sorted.length; i++) {
      const m = sorted[i];

      // Si hay solapamiento (match arranca antes del cursor), lo salteamos
      // para evitar pintar doble raro.
      if (m.index < cursor) continue;

      if (m.index > cursor) {
        parts.push({ type: "text", content: testString.slice(cursor, m.index) });
      }

      const end = m.index + m.length;
      parts.push({ type: "match", content: testString.slice(m.index, end), matchIndex: i });

      cursor = end;
    }

    if (cursor < testString.length) {
      parts.push({ type: "text", content: testString.slice(cursor) });
    }

    return parts;
  }, [result, testString]);

  const toggleFlag = (flag: Flag) => {
    setFlags((prev) => {
      const normalized = normalizeFlags(prev);
      if (normalized.includes(flag)) {
        return normalizeFlags(normalized.replace(flag, ""));
      }
      return normalizeFlags(normalized + flag);
    });
  };

  const matchCount =
    result.valid === true ? result.matches.length : 0;

  return (
    <div className="space-y-6">
      {/* Pattern Input */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-slate-700">Regular Expression</Label>
        <div className="flex items-center">
          <span className="px-3 py-2 bg-slate-100 border border-r-0 border-slate-200 rounded-l-lg text-slate-500 font-mono">
            /
          </span>

          <Input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="Enter regex pattern..."
            className="rounded-none border-x-0 font-mono"
          />

          <span className="px-3 py-2 bg-slate-100 border border-l-0 border-slate-200 rounded-r-lg text-slate-500 font-mono">
            /{safeFlags}
          </span>
        </div>
      </div>

      {/* Flags */}
      <div className="flex flex-wrap gap-2">
        {FLAG_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => toggleFlag(opt.value)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm font-medium border transition-all",
              safeFlags.includes(opt.value)
                ? "bg-blue-50 border-blue-200 text-blue-700"
                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
            )}
            title={opt.desc}
          >
            {opt.label} ({opt.value})
          </button>
        ))}
      </div>

      {/* Error */}
      {result.valid === false && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-800 font-mono">{result.error}</p>
        </div>
      )}

      {/* Test String */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-slate-700">Test String</Label>

          {result.valid !== null && (
            <span
              className={cn(
                "text-sm font-medium",
                result.valid === true && matchCount > 0
                  ? "text-green-600"
                  : "text-slate-500"
              )}
            >
              {result.valid === true ? (
                <>
                  {matchCount} match{matchCount !== 1 ? "es" : ""}
                </>
              ) : (
                "—"
              )}
            </span>
          )}
        </div>

        <Textarea
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          placeholder="Enter text to test against the pattern..."
          className="font-mono text-sm min-h-[120px]"
        />
      </div>

      {/* Highlighted Result */}
      {highlightedString && (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-slate-700">Matches Highlighted</Label>
          <div className="bg-slate-900 rounded-xl p-4 font-mono text-sm whitespace-pre-wrap">
            {highlightedString.map((part, i) =>
              part.type === "match" ? (
                <span
                  key={i}
                  className="bg-yellow-500/30 text-yellow-300 rounded px-0.5"
                >
                  {part.content}
                </span>
              ) : (
                <span key={i} className="text-slate-300">
                  {part.content}
                </span>
              )
            )}
          </div>
        </div>
      )}

      {/* Match Details */}
      {result.valid === true && result.matches.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-slate-700">Match Details</Label>

          <div className="bg-slate-50 rounded-xl p-4 space-y-2 max-h-48 overflow-y-auto">
            {result.matches.map((match, i) => (
              <div
                key={i}
                className="bg-white rounded-lg p-3 border border-slate-200 text-sm"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-slate-700">Match {i + 1}</span>
                  <span className="text-xs text-slate-500">
                    Index: {match.index}, Length: {match.length}
                  </span>
                </div>

                <code className="text-blue-600 font-mono break-all">{match.value}</code>

                {match.groups.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-slate-100">
                    <span className="text-xs text-slate-500">Groups:</span>
                    <div className="mt-1 flex flex-col gap-1">
                      {match.groups.map((group, gi) => (
                        <code
                          key={gi}
                          className="text-violet-600 font-mono text-xs"
                        >
                          ${gi + 1}: {group && group.length ? group : "(empty)"}
                        </code>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Patterns */}
      <div className="bg-slate-50 rounded-xl p-4">
        <h4 className="font-medium text-slate-700 text-sm mb-3">Quick Patterns</h4>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          {[
            {
              name: "Email",
              pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}",
              flags: "gi",
            },
            {
              name: "Phone",
              pattern: "\\d{3}[-.]?\\d{3}[-.]?\\d{4}",
              flags: "g",
            },
            {
              name: "URL",
              pattern: "https?://[\\w.-]+",
              flags: "gi",
            },
            {
              name: "Date",
              pattern: "\\d{4}-\\d{2}-\\d{2}",
              flags: "g",
            },
          ].map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => {
                setPattern(p.pattern);
                setFlags(p.flags);
              }}
              className="bg-white rounded-lg p-2 border border-slate-200 text-left hover:bg-slate-100 transition-colors"
            >
              <div className="font-medium text-slate-700">{p.name}</div>
              <div className="text-slate-500 truncate font-mono">{p.pattern}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}