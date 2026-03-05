"use client";

import React, { useMemo, useState } from "react";
import { CheckCircle, AlertCircle, Minimize2, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CopyButton } from "@/components/ui/CopyButton";

type IndentSize = 1 | 2 | 4;
type JsonValue =
  | null
  | boolean
  | number
  | string
  | JsonValue[]
  | { [key: string]: JsonValue };

function safeStringify(value: JsonValue, indent: IndentSize) {
  return JSON.stringify(value, null, indent);
}

function minifyStringify(value: JsonValue) {
  return JSON.stringify(value);
}

function sortJson(value: JsonValue): JsonValue {
  if (Array.isArray(value)) return value.map(sortJson);
  if (value && typeof value === "object") {
    const obj = value as Record<string, JsonValue>;
    return Object.keys(obj)
      .sort((a, b) => a.localeCompare(b))
      .reduce<Record<string, JsonValue>>((acc, key) => {
        acc[key] = sortJson(obj[key]);
        return acc;
      }, {});
  }
  return value;
}

function getErrorMessage(err: unknown) {
  if (err instanceof Error) return err.message;
  return "Invalid JSON";
}

function computeStats(value: JsonValue) {
  let properties = 0;
  let arrays = 0;
  let nodes = 0; // objects + arrays
  let maxDepth = 0;

  const walk = (v: JsonValue, depth: number) => {
    maxDepth = Math.max(maxDepth, depth);

    if (Array.isArray(v)) {
      arrays += 1;
      nodes += 1;
      for (const item of v) walk(item, depth + 1);
      return;
    }

    if (v && typeof v === "object") {
      nodes += 1;
      const obj = v as Record<string, JsonValue>;
      const keys = Object.keys(obj);
      properties += keys.length;
      for (const k of keys) walk(obj[k], depth + 1);
      return;
    }
  };

  walk(value, 1);

  return { properties, arrays, nodes, maxDepth };
}

export default function JsonFormatter() {
  const [input, setInput] = useState<string>("");
  const [indentSize, setIndentSize] = useState<IndentSize>(2);

  const result = useMemo(() => {
    if (!input.trim()) {
      return {
        valid: null as null | boolean,
        parsed: null as JsonValue | null,
        output: "",
        error: "",
      };
    }

    try {
      const parsed = JSON.parse(input) as JsonValue;
      const output = safeStringify(parsed, indentSize);
      return { valid: true as const, parsed, output, error: "" };
    } catch (e) {
      return {
        valid: false as const,
        parsed: null,
        output: "",
        error: getErrorMessage(e),
      };
    }
  }, [input, indentSize]);

  const stats = useMemo(() => {
    if (!result.parsed || !result.valid) return null;

    const s = computeStats(result.parsed);
    return {
      ...s,
      formattedChars: result.output.length,
      minifiedChars: minifyStringify(result.parsed).length,
    };
  }, [result]);

  const handleMinify = () => {
    if (!result.parsed || !result.valid) return;
    setInput(minifyStringify(result.parsed));
  };

  const handlePrettify = () => {
    if (!result.parsed || !result.valid) return;
    setInput(safeStringify(result.parsed, indentSize));
  };

  const handleSortKeys = () => {
    if (!result.parsed || !result.valid) return;
    const sorted = sortJson(result.parsed);
    setInput(safeStringify(sorted, indentSize));
  };

  return (
    <div className="space-y-6">
      {/* Status Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {result.valid === true && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Valid JSON</span>
            </div>
          )}
          {result.valid === false && (
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Invalid JSON</span>
            </div>
          )}
        </div>

        <Select
          value={String(indentSize)}
          onValueChange={(v) => setIndentSize(Number(v) as IndentSize)}
        >
          <SelectTrigger className="w-28 h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2">2 spaces</SelectItem>
            <SelectItem value="4">4 spaces</SelectItem>
            <SelectItem value="1">1 space</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <Label className="text-sm font-medium text-slate-700">Input JSON</Label>

          <div className="flex items-center gap-1">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={handleMinify}
              disabled={!result.valid}
              className="h-7 text-xs"
            >
              <Minimize2 className="w-3 h-3 mr-1" />
              Minify
            </Button>

            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={handlePrettify}
              disabled={!result.valid}
              className="h-7 text-xs"
            >
              <Maximize2 className="w-3 h-3 mr-1" />
              Prettify
            </Button>

            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={handleSortKeys}
              disabled={!result.valid}
              className="h-7 text-xs"
            >
              Sort Keys
            </Button>
          </div>
        </div>

        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`{"example":"Paste your JSON here","items":[1,2,3]}`}
          className="font-mono text-sm min-h-[200px]"
        />
      </div>

      {/* Error */}
      {result.error && result.valid === false && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
          <p className="text-sm text-red-800 font-mono">{result.error}</p>
        </div>
      )}

      {/* Output */}
      {result.valid && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-slate-700">
              Formatted Output
            </Label>
            <CopyButton
              text={result.output}
              variant="outline"
              size="sm"
              className="h-7"
            />
          </div>

          <pre className="bg-slate-900 rounded-xl p-4 overflow-auto max-h-[400px]">
            <code className="text-green-400 font-mono text-sm">
              {result.output}
            </code>
          </pre>
        </div>
      )}

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-50 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-slate-900">
              {stats.properties.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500">Properties</div>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-slate-900">
              {stats.nodes.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500">Objects/Arrays</div>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-slate-900">
              {stats.formattedChars.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500">Formatted chars</div>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-slate-900">
              {stats.minifiedChars.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500">Minified chars</div>
          </div>
        </div>
      )}
    </div>
  );
}