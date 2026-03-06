"use client";

import React, { useCallback, useMemo, useState } from "react";
import { AlertCircle, CheckCircle, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/ui/CopyButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type JsonValue =
  | null
  | boolean
  | number
  | string
  | JsonValue[]
  | { [key: string]: JsonValue };

function getErrorMessage(err: unknown) {
  if (err instanceof Error) return err.message;
  return "Invalid JSON";
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

type Delimiter = "," | ";" | "\t";

function toCsvCell(value: unknown, delimiter: Delimiter) {
  let s = "";
  if (value === null || value === undefined) s = "";
  else if (typeof value === "string") s = value;
  else if (typeof value === "number" || typeof value === "boolean") s = String(value);
  else s = JSON.stringify(value);

  const needsQuotes =
    /["\r\n]/.test(s) || (delimiter === "," ? s.includes(",") : delimiter === ";" ? s.includes(";") : s.includes("\t"));
  const escaped = s.replace(/"/g, '""');
  return needsQuotes ? `"${escaped}"` : escaped;
}

function downloadText(filename: string, text: string, mime: string) {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function JsonToCsvConverter() {
  const [input, setInput] = useState<string>("");
  const [delimiter, setDelimiter] = useState<Delimiter>(",");

  const result = useMemo(() => {
    if (!input.trim()) {
      return {
        valid: null as null | boolean,
        error: "",
        csv: "",
        headers: [] as string[],
        rows: 0,
      };
    }

    try {
      const parsed = JSON.parse(input) as JsonValue;

      const arr: unknown[] = Array.isArray(parsed) ? parsed : [parsed];
      if (!arr.length) {
        return { valid: true as const, error: "", csv: "", headers: [], rows: 0 };
      }

      const objects = arr.filter((x) => x !== null && x !== undefined);
      if (!objects.every((x) => isPlainObject(x))) {
        return {
          valid: false as const,
          error: "Expected an array of objects (or a single object).",
          csv: "",
          headers: [],
          rows: 0,
        };
      }

      const rows = objects as Record<string, unknown>[];
      const headers: string[] = [];
      const seen = new Set<string>();
      for (const row of rows) {
        for (const key of Object.keys(row)) {
          if (!seen.has(key)) {
            seen.add(key);
            headers.push(key);
          }
        }
      }

      const headerLine = headers.map((h) => toCsvCell(h, delimiter)).join(delimiter);
      const lines = rows.map((row) =>
        headers.map((h) => toCsvCell(row[h], delimiter)).join(delimiter)
      );
      const csv = [headerLine, ...lines].join("\r\n");

      return { valid: true as const, error: "", csv, headers, rows: rows.length };
    } catch (e) {
      return {
        valid: false as const,
        error: getErrorMessage(e),
        csv: "",
        headers: [],
        rows: 0,
      };
    }
  }, [delimiter, input]);

  const handleClear = () => setInput("");

  const handleDownload = useCallback(() => {
    if (!result.valid || !result.csv) return;
    const ext = delimiter === "\t" ? "tsv" : "csv";
    const mime = delimiter === "\t" ? "text/tab-separated-values;charset=utf-8" : "text/csv;charset=utf-8";
    downloadText(`data.${ext}`, result.csv, mime);
  }, [delimiter, result.csv, result.valid]);

  return (
    <div className="space-y-6">
      {/* Status Bar */}
      <div className="flex items-center justify-between gap-3">
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

        <div className="flex items-center gap-2">
          <Select value={delimiter} onValueChange={(v) => setDelimiter(v as Delimiter)}>
            <SelectTrigger className="w-28 h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=",">Comma (,)</SelectItem>
              <SelectItem value=";">Semicolon (;)</SelectItem>
              <SelectItem value="\t">Tab (TSV)</SelectItem>
            </SelectContent>
          </Select>

          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={handleClear}
            className="h-7 text-xs"
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Clear
          </Button>
        </div>
      </div>

      {/* Input */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-slate-700">Input JSON</Label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`[{"name":"Ada","age":36},{"name":"Linus","age":55}]`}
          className="font-mono text-sm min-h-[200px]"
        />
      </div>

      {/* Error */}
      {result.error && result.valid === false && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-100 rounded-xl">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <p className="text-sm text-red-800 font-mono">{result.error}</p>
        </div>
      )}

      {/* Output */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <Label className="text-sm font-medium text-slate-700">CSV Output</Label>
          <div className="flex items-center gap-2">
            {result.valid && !!result.csv && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  className="h-7"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <CopyButton text={result.csv} variant="outline" size="sm" className="h-7" />
              </>
            )}
          </div>
        </div>

        <pre className="bg-slate-900 rounded-xl p-4 overflow-auto max-h-[320px]">
          <code className="text-green-400 font-mono text-sm whitespace-pre">
            {result.valid && result.csv ? (
              result.csv
            ) : (
              <span className="text-slate-500">CSV will appear here...</span>
            )}
          </code>
        </pre>

        {result.valid && result.csv && (
          <p className="text-xs text-slate-500">
            {result.headers.length} columns • {result.rows.toLocaleString()} row
            {result.rows === 1 ? "" : "s"}
          </p>
        )}
      </div>
    </div>
  );
}

