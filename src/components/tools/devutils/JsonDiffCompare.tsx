"use client";

import React, { useMemo, useState } from "react";
import { AlertCircle, CheckCircle, Trash2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/ui/CopyButton";

type JsonValue =
  | null
  | boolean
  | number
  | string
  | JsonValue[]
  | { [key: string]: JsonValue };

type DiffKind = "added" | "removed" | "changed" | "type-changed";

type DiffEntry = {
  path: string;
  kind: DiffKind;
  a?: JsonValue;
  b?: JsonValue;
};

function getErrorMessage(err: unknown) {
  if (err instanceof Error) return err.message;
  return "Invalid JSON";
}

function isObject(v: JsonValue): v is Record<string, JsonValue> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

function typeTag(v: JsonValue) {
  if (v === null) return "null";
  if (Array.isArray(v)) return "array";
  return typeof v;
}

function deepEqual(a: JsonValue, b: JsonValue): boolean {
  if (a === b) return true;
  if (typeTag(a) !== typeTag(b)) return false;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (!deepEqual(a[i], b[i])) return false;
    return true;
  }

  if (isObject(a) && isObject(b)) {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) return false;

    const set = new Set(aKeys);
    for (const k of bKeys) if (!set.has(k)) return false;
    for (const k of aKeys) if (!deepEqual(a[k], b[k])) return false;
    return true;
  }

  return false;
}

function escapeKey(key: string) {
  return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? `.${key}` : `["${key.replace(/"/g, '\\"')}"]`;
}

function diffJson(a: JsonValue, b: JsonValue): DiffEntry[] {
  const diffs: DiffEntry[] = [];

  const walk = (va: JsonValue | undefined, vb: JsonValue | undefined, path: string) => {
    if (va === undefined && vb === undefined) return;
    if (va === undefined) {
      diffs.push({ path, kind: "added", b: vb as JsonValue });
      return;
    }
    if (vb === undefined) {
      diffs.push({ path, kind: "removed", a: va });
      return;
    }

    const ta = typeTag(va);
    const tb = typeTag(vb);
    if (ta !== tb) {
      diffs.push({ path, kind: "type-changed", a: va, b: vb });
      return;
    }

    if (Array.isArray(va) && Array.isArray(vb)) {
      const max = Math.max(va.length, vb.length);
      for (let i = 0; i < max; i++) {
        walk(va[i] as JsonValue | undefined, vb[i] as JsonValue | undefined, `${path}[${i}]`);
      }
      return;
    }

    if (isObject(va) && isObject(vb)) {
      const keys = new Set<string>([...Object.keys(va), ...Object.keys(vb)]);
      const sorted = Array.from(keys).sort((x, y) => x.localeCompare(y));
      for (const k of sorted) {
        walk(va[k], vb[k], `${path}${escapeKey(k)}`);
      }
      return;
    }

    if (va !== vb) {
      diffs.push({ path, kind: "changed", a: va, b: vb });
    }
  };

  walk(a, b, "$");
  return diffs;
}

function formatValue(v: JsonValue | undefined) {
  if (v === undefined) return "undefined";
  if (typeof v === "string") return JSON.stringify(v);
  return JSON.stringify(v);
}

export default function JsonDiffCompare() {
  const [aText, setAText] = useState<string>("");
  const [bText, setBText] = useState<string>("");

  const result = useMemo(() => {
    const aTrim = aText.trim();
    const bTrim = bText.trim();
    if (!aTrim && !bTrim) {
      return {
        validA: null as null | boolean,
        validB: null as null | boolean,
        errorA: "",
        errorB: "",
        equal: null as null | boolean,
        diffs: [] as DiffEntry[],
      };
    }

    let aVal: JsonValue | null = null;
    let bVal: JsonValue | null = null;
    let errorA = "";
    let errorB = "";

    try {
      aVal = aTrim ? (JSON.parse(aTrim) as JsonValue) : null;
    } catch (e) {
      errorA = getErrorMessage(e);
    }

    try {
      bVal = bTrim ? (JSON.parse(bTrim) as JsonValue) : null;
    } catch (e) {
      errorB = getErrorMessage(e);
    }

    const validA = !aTrim ? null : errorA ? false : true;
    const validB = !bTrim ? null : errorB ? false : true;

    if (validA !== true || validB !== true) {
      return {
        validA,
        validB,
        errorA,
        errorB,
        equal: null as null | boolean,
        diffs: [] as DiffEntry[],
      };
    }

    const equal = deepEqual(aVal as JsonValue, bVal as JsonValue);
    const diffs = equal ? [] : diffJson(aVal as JsonValue, bVal as JsonValue);

    return { validA: true as const, validB: true as const, errorA: "", errorB: "", equal, diffs };
  }, [aText, bText]);

  const handleClear = () => {
    setAText("");
    setBText("");
  };

  const diffText = useMemo(() => {
    if (result.equal !== false) return "";
    const max = 200;
    const shown = result.diffs.slice(0, max);
    const lines = shown.map((d) => {
      const prefix =
        d.kind === "added"
          ? "+"
          : d.kind === "removed"
            ? "-"
            : d.kind === "type-changed"
              ? "±"
              : "~";
      const body =
        d.kind === "added"
          ? `${d.path} = ${formatValue(d.b)}`
          : d.kind === "removed"
            ? `${d.path} = ${formatValue(d.a)}`
            : `${d.path}: ${formatValue(d.a)} → ${formatValue(d.b)}`;
      return `${prefix} ${body}`;
    });
    if (result.diffs.length > max) lines.push(`… and ${result.diffs.length - max} more differences`);
    return lines.join("\n");
  }, [result.diffs, result.equal]);

  return (
    <div className="space-y-6">
      {/* Status Bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {result.equal === true && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Equivalent JSON</span>
            </div>
          )}
          {result.equal === false && (
            <div className="flex items-center gap-2 text-red-600">
              <XCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Different JSON</span>
            </div>
          )}
          {result.equal === null && (result.validA === false || result.validB === false) && (
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Invalid JSON</span>
            </div>
          )}
        </div>

        <Button type="button" size="sm" variant="ghost" onClick={handleClear} className="h-7 text-xs">
          <Trash2 className="w-3 h-3 mr-1" />
          Clear
        </Button>
      </div>

      {/* Inputs */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-slate-700">JSON A</Label>
          <Textarea
            value={aText}
            onChange={(e) => setAText(e.target.value)}
            placeholder={`{"id":1,"name":"Ada"}`}
            className="font-mono text-sm min-h-[200px]"
          />
          {result.errorA && result.validA === false && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <p className="text-xs text-red-800 font-mono">{result.errorA}</p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-slate-700">JSON B</Label>
          <Textarea
            value={bText}
            onChange={(e) => setBText(e.target.value)}
            placeholder={`{"id":1,"name":"Ada Lovelace"}`}
            className="font-mono text-sm min-h-[200px]"
          />
          {result.errorB && result.validB === false && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <p className="text-xs text-red-800 font-mono">{result.errorB}</p>
            </div>
          )}
        </div>
      </div>

      {/* Output */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <Label className="text-sm font-medium text-slate-700">Differences</Label>
          {result.equal === false && diffText && (
            <CopyButton text={diffText} variant="outline" size="sm" className="h-7" />
          )}
        </div>

        <pre className="bg-slate-900 rounded-xl p-4 overflow-auto max-h-[360px]">
          <code className="text-green-400 font-mono text-sm whitespace-pre">
            {result.equal === true ? (
              "No differences found."
            ) : result.equal === false ? (
              diffText
            ) : (
              <span className="text-slate-500">
                Paste two JSON documents to compare...
              </span>
            )}
          </code>
        </pre>

        {result.equal === false && (
          <p className="text-xs text-slate-500">
            {result.diffs.length.toLocaleString()} difference
            {result.diffs.length === 1 ? "" : "s"} detected
          </p>
        )}
      </div>
    </div>
  );
}

