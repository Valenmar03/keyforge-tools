"use client";

import React, { useMemo, useState } from "react";
import { ArrowDownUp, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CopyButton } from "@/components/ui/CopyButton";

type Mode = "encode" | "decode";

function encodeHtml(str: string): string {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function decodeHtml(str: string): string {
  const txt = document.createElement("textarea");
  txt.innerHTML = str;
  return txt.value;
}

export default function HtmlEncoderDecoder() {
  const [input, setInput] = useState<string>("");
  const [mode, setMode] = useState<Mode>("encode");

  const { output, error } = useMemo(() => {
    const raw = input;
    if (!raw.trim()) return { output: "", error: "" };

    try {
      if (mode === "encode") {
        return { output: encodeHtml(raw), error: "" };
      } else {
        return { output: decodeHtml(raw.trim()), error: "" };
      }
    } catch {
      return {
        output: "",
        error:
          mode === "decode"
            ? "Invalid HTML entities or malformed input."
            : "Failed to encode text.",
      };
    }
  }, [input, mode]);

  const swapMode = () => {
    if (output && !error) {
      setInput(output);
    }
    setMode((m) => (m === "encode" ? "decode" : "encode"));
  };

  return (
    <div className="space-y-6">
      {/* Mode Toggle */}
      <div className="flex items-center justify-center">
        <div className="inline-flex items-center bg-slate-100 rounded-xl p-1">
          <button
            type="button"
            onClick={() => setMode("encode")}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
              mode === "encode"
                ? "bg-white shadow-sm text-slate-900"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Encode
          </button>
          <button
            type="button"
            onClick={() => setMode("decode")}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
              mode === "decode"
                ? "bg-white shadow-sm text-slate-900"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Decode
          </button>
        </div>
      </div>

      {/* Input */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-slate-700">
          {mode === "encode" ? "Plain Text" : "HTML Entities"}
        </Label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            mode === "encode"
              ? "Enter text to encode (e.g. <script>alert(1)</script>)..."
              : "Enter HTML entities to decode (e.g. &lt;div&gt;Hello&lt;/div&gt;)..."
          }
          className="font-mono text-sm min-h-[140px]"
        />
      </div>

      {/* Swap Button */}
      <div className="flex justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={swapMode}
          disabled={!output || !!error}
          className="h-10"
        >
          <ArrowDownUp className="w-4 h-4 mr-2" />
          Swap Input/Output
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-100 rounded-xl">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Output */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-slate-700">
            {mode === "encode" ? "Encoded Output" : "Decoded Text"}
          </Label>
          {output && !error && (
            <CopyButton text={output} variant="outline" size="sm" className="h-7" />
          )}
        </div>

        <div className="bg-slate-900 rounded-xl p-4 min-h-[120px]">
          <code className="text-green-400 font-mono text-sm break-all whitespace-pre-wrap">
            {output || (
              <span className="text-slate-500">Output will appear here...</span>
            )}
          </code>
        </div>

        {output && !error && (
          <p className="text-xs text-slate-500">{output.length} characters</p>
        )}
      </div>

      {/* Info */}
      <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-600">
        <p>
          <strong>Note:</strong> Encoding converts &lt; &gt; &amp; &quot; &#39; to HTML
          entities so they display safely in web pages. Decoding reverses this. Not for
          encryption.
        </p>
      </div>
    </div>
  );
}
