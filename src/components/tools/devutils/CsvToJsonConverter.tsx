"use client";

import React, { useMemo, useState } from "react";
import { AlertCircle, CheckCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/ui/CopyButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Delimiter = "," | ";" | "\t";

function parseCsv(text: string, delimiter: Delimiter) {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let i = 0;
  let inQuotes = false;

  const pushField = () => {
    row.push(field);
    field = "";
  };
  const pushRow = () => {
    // skip fully empty trailing line
    const isAllEmpty = row.every((c) => !c) && !field;
    if (!isAllEmpty) rows.push(row);
    row = [];
  };

  while (i < text.length) {
    const c = text[i];

    if (inQuotes) {
      if (c === '"') {
        const next = text[i + 1];
        if (next === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i += 1;
        continue;
      }
      field += c;
      i += 1;
      continue;
    }

    if (c === '"') {
      inQuotes = true;
      i += 1;
      continue;
    }

    if (c === delimiter) {
      pushField();
      i += 1;
      continue;
    }

    if (c === "\r") {
      // treat CRLF or CR as newline
      pushField();
      pushRow();
      if (text[i + 1] === "\n") i += 2;
      else i += 1;
      continue;
    }

    if (c === "\n") {
      pushField();
      pushRow();
      i += 1;
      continue;
    }

    field += c;
    i += 1;
  }

  pushField();
  pushRow();

  if (inQuotes) {
    return { ok: false as const, error: "Unclosed quote in CSV." };
  }

  return { ok: true as const, rows };
}

function inferScalar(v: string): unknown {
  const trimmed = v.trim();
  if (trimmed === "") return "";
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (trimmed === "null") return null;
  if (!Number.isNaN(Number(trimmed)) && /^-?\d+(\.\d+)?([eE][+-]?\d+)?$/.test(trimmed)) {
    return Number(trimmed);
  }
  return v;
}

export default function CsvToJsonConverter() {
  const [input, setInput] = useState<string>("");
  const [inferTypes, setInferTypes] = useState<boolean>(false);
  const [delimiter, setDelimiter] = useState<Delimiter>(",");

  const result = useMemo(() => {
    if (!input.trim()) {
      return { valid: null as null | boolean, output: "", error: "", rows: 0, cols: 0 };
    }

    const parsed = parseCsv(input, delimiter);
    if (!parsed.ok) {
      return { valid: false as const, output: "", error: parsed.error, rows: 0, cols: 0 };
    }

    const rows = parsed.rows.filter((r) => r.some((c) => c.trim() !== ""));
    if (!rows.length) {
      return { valid: true as const, output: "[]", error: "", rows: 0, cols: 0 };
    }

    const headers = rows[0].map((h) => h.trim());
    const cols = headers.length;
    if (!headers.length || headers.every((h) => !h)) {
      return {
        valid: false as const,
        output: "",
        error: "Missing header row (first line).",
        rows: 0,
        cols: 0,
      };
    }

    for (let idx = 1; idx < rows.length; idx++) {
      if (rows[idx].length !== cols) {
        return {
          valid: false as const,
          output: "",
          error: `Row ${idx + 1} has ${rows[idx].length} columns, expected ${cols}.`,
          rows: 0,
          cols,
        };
      }
    }

    const data = rows.slice(1).map((r) => {
      const obj: Record<string, unknown> = {};
      for (let j = 0; j < cols; j++) {
        const key = headers[j] || `col_${j + 1}`;
        const value = r[j] ?? "";
        obj[key] = inferTypes ? inferScalar(value) : value;
      }
      return obj;
    });

    const output = JSON.stringify(data, null, 2);
    return { valid: true as const, output, error: "", rows: data.length, cols };
  }, [delimiter, inferTypes, input]);

  const handleClear = () => setInput("");

  return (
    <div className="space-y-6">
      {/* Status Bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {result.valid === true && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Parsed CSV</span>
            </div>
          )}
          {result.valid === false && (
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Invalid CSV</span>
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

          <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
            <Label className="text-sm text-slate-700">Infer types</Label>
            <Switch checked={inferTypes} onCheckedChange={setInferTypes} />
          </div>

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
        <Label className="text-sm font-medium text-slate-700">Input CSV</Label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={delimiter === ";" ? "name;age\nAda;36\nLinus;55" : delimiter === "\t" ? "name\tage\nAda\t36\nLinus\t55" : "name,age\nAda,36\nLinus,55"}
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
          <Label className="text-sm font-medium text-slate-700">JSON Output</Label>
          {result.valid && !!result.output && (
            <CopyButton text={result.output} variant="outline" size="sm" className="h-7" />
          )}
        </div>

        <pre className="bg-slate-900 rounded-xl p-4 overflow-auto max-h-[400px]">
          <code className="text-green-400 font-mono text-sm whitespace-pre">
            {result.valid && result.output ? (
              result.output
            ) : (
              <span className="text-slate-500">JSON will appear here...</span>
            )}
          </code>
        </pre>

        {result.valid && result.output && (
          <p className="text-xs text-slate-500">
            {result.cols} columns • {result.rows.toLocaleString()} row
            {result.rows === 1 ? "" : "s"}
          </p>
        )}
      </div>
    </div>
  );
}

