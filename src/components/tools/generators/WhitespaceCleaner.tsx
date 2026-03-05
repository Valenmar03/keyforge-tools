"use client";

import React, { useMemo, useState } from "react";
import { Eraser } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CopyButton } from "@/components/ui/CopyButton";

type Options = {
  trim: boolean;
  collapseSpaces: boolean;
  removeEmptyLines: boolean;
  trimLines: boolean;
  normalizeLineEndings: boolean;
  removeAllWhitespace: boolean;
};

const DEFAULT_OPTIONS: Options = {
  trim: true,
  collapseSpaces: true,
  removeEmptyLines: false,
  trimLines: true,
  normalizeLineEndings: true,
  removeAllWhitespace: false,
};

export default function WhitespaceCleaner() {
  const [input, setInput] = useState<string>("");
  const [options, setOptions] = useState<Options>(DEFAULT_OPTIONS);

  const output = useMemo(() => {
    if (!input) return "";

    let result = input;

    if (options.removeAllWhitespace) {
      // remove ALL whitespace, including newlines, tabs, spaces
      return result.replace(/\s/g, "");
    }

    if (options.normalizeLineEndings) {
      result = result.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    }

    if (options.trimLines) {
      result = result
        .split("\n")
        .map((line) => line.trim())
        .join("\n");
    }

    if (options.collapseSpaces) {
      // collapse spaces/tabs (but preserve newlines)
      result = result.replace(/[ \t]+/g, " ");
    }

    if (options.removeEmptyLines) {
      result = result
        .split("\n")
        .filter((line) => line.trim() !== "")
        .join("\n");
    }

    if (options.trim) {
      result = result.trim();
    }

    return result;
  }, [input, options]);

  const stats = useMemo(() => {
    if (!input) return null;

    const inputSpaces = (input.match(/ /g) || []).length;
    const outputSpaces = (output.match(/ /g) || []).length;

    const inputLines = input.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n").length;
    const outputLines = output ? output.split("\n").length : 0;

    return {
      charsBefore: input.length,
      charsAfter: output.length,
      charsRemoved: Math.max(0, input.length - output.length),
      linesBefore: inputLines,
      linesAfter: outputLines,
      spacesBefore: inputSpaces,
      spacesAfter: outputSpaces,
    };
  }, [input, output]);

  const toggleOption = (key: keyof Options) => {
    if (key === "removeAllWhitespace") {
      setOptions((prev) => {
        const nextEnabled = !prev.removeAllWhitespace;
        return {
          ...prev,
          removeAllWhitespace: nextEnabled,
          // if enabling "removeAllWhitespace", disable the rest
          trim: nextEnabled ? false : prev.trim,
          collapseSpaces: nextEnabled ? false : prev.collapseSpaces,
          removeEmptyLines: nextEnabled ? false : prev.removeEmptyLines,
          trimLines: nextEnabled ? false : prev.trimLines,
          normalizeLineEndings: nextEnabled ? false : prev.normalizeLineEndings,
        };
      });
      return;
    }

    setOptions((prev) => ({
      ...prev,
      [key]: !prev[key],
      removeAllWhitespace: false,
    }));
  };

  const clearAll = () => {
    setInput("");
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-slate-700">Input Text</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={clearAll}
            disabled={!input}
            className="h-8"
          >
            <Eraser className="w-4 h-4 mr-2" />
            Clear
          </Button>
        </div>

        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste text with messy whitespace..."
          className="min-h-[140px] font-mono text-sm"
        />
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3">
        {(
          [
            { key: "trim", label: "Trim ends" },
            { key: "collapseSpaces", label: "Collapse spaces/tabs" },
            { key: "removeEmptyLines", label: "Remove empty lines" },
            { key: "trimLines", label: "Trim each line" },
            { key: "normalizeLineEndings", label: "Normalize line endings" },
            { key: "removeAllWhitespace", label: "Remove ALL whitespace" },
          ] as const
        ).map((opt) => {
          const disabled =
            options.removeAllWhitespace && opt.key !== "removeAllWhitespace";

          return (
            <div
              key={opt.key}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                opt.key === "removeAllWhitespace" && options.removeAllWhitespace
                  ? "bg-red-50 border-red-100"
                  : "bg-slate-50 border-slate-200"
              } ${disabled ? "opacity-50" : ""}`}
            >
              <Label className="text-sm text-slate-700">{opt.label}</Label>
              <Switch
                checked={options[opt.key]}
                onCheckedChange={() => toggleOption(opt.key)}
                disabled={disabled}
              />
            </div>
          );
        })}
      </div>

      {/* Output */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-slate-700">Cleaned Output</Label>
          {output && <CopyButton text={output} variant="outline" size="sm" className="h-7" />}
        </div>

        <div className="bg-slate-900 rounded-xl p-4 min-h-[140px]">
          <code className="text-green-400 font-mono text-sm break-all whitespace-pre-wrap">
            {output || <span className="text-slate-500">Output will appear here...</span>}
          </code>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-50 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-slate-900">{stats.charsRemoved}</div>
            <div className="text-xs text-slate-500">Chars removed</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-slate-900">
              {stats.linesBefore} → {stats.linesAfter}
            </div>
            <div className="text-xs text-slate-500">Lines</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-slate-900">
              {stats.spacesBefore} → {stats.spacesAfter}
            </div>
            <div className="text-xs text-slate-500">Spaces</div>
          </div>
        </div>
      )}
    </div>
  );
}