"use client";

import React, { useMemo, useState } from "react";
import { ArrowDownUp, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CopyButton } from "@/components/ui/CopyButton";

type Mode = "encode" | "decode";
type EncodeType = "component" | "uri";

const COMMON_ENCODINGS = [
  { char: " ", encoded: "%20 (or + in querystrings)" },
  { char: "&", encoded: "%26" },
  { char: "=", encoded: "%3D" },
  { char: "?", encoded: "%3F" },
  { char: "#", encoded: "%23" },
  { char: "/", encoded: "%2F" },
  { char: "@", encoded: "%40" },
] as const;

function safeEncode(input: string, type: EncodeType) {
  return type === "component" ? encodeURIComponent(input) : encodeURI(input);
}

function safeDecode(input: string, type: EncodeType, treatPlusAsSpace: boolean) {
  const raw = treatPlusAsSpace ? input.replace(/\+/g, " ") : input;
  return type === "component" ? decodeURIComponent(raw) : decodeURI(raw);
}

export default function UrlEncoderDecoder() {
  const [input, setInput] = useState<string>("");
  const [mode, setMode] = useState<Mode>("encode");
  const [encodeType, setEncodeType] = useState<EncodeType>("component");
  const [treatPlusAsSpace, setTreatPlusAsSpace] = useState<boolean>(true);

  const { output, error } = useMemo(() => {
    const trimmed = input.trim();
    if (!trimmed) return { output: "", error: "" };

    try {
      const out =
        mode === "encode"
          ? safeEncode(trimmed, encodeType)
          : safeDecode(trimmed, encodeType, treatPlusAsSpace);

      return { output: out, error: "" };
    } catch {
      return {
        output: "",
        error:
          mode === "encode"
            ? "Invalid input for encoding."
            : "Invalid input for decoding (malformed % sequence?).",
      };
    }
  }, [input, mode, encodeType, treatPlusAsSpace]);

  const swapMode = () => {
    if (output && !error) setInput(output);
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

      {/* Encode Type */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="radio"
            name="encodeType"
            checked={encodeType === "component"}
            onChange={() => setEncodeType("component")}
            className="w-4 h-4"
          />
          <span className="text-sm text-slate-700">
            encodeURIComponent <span className="text-slate-500">(for values)</span>
          </span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="radio"
            name="encodeType"
            checked={encodeType === "uri"}
            onChange={() => setEncodeType("uri")}
            className="w-4 h-4"
          />
          <span className="text-sm text-slate-700">
            encodeURI <span className="text-slate-500">(for full URLs)</span>
          </span>
        </label>

        {/* Only useful on decode */}
        {mode === "decode" && (
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={treatPlusAsSpace}
              onChange={(e) => setTreatPlusAsSpace(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm text-slate-700">
              Treat <code className="px-1 bg-slate-100 rounded">+</code> as space
              <span className="text-slate-500 ml-1">(querystrings)</span>
            </span>
          </label>
        )}
      </div>

      {/* Input */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-slate-700">
          {mode === "encode" ? "Text to Encode" : "URL-Encoded String"}
        </Label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            mode === "encode"
              ? "Enter text or URL to encode..."
              : "Enter URL-encoded string to decode..."
          }
          className="font-mono text-sm min-h-[120px]"
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
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Output */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-slate-700">
            {mode === "encode" ? "Encoded Output" : "Decoded Output"}
          </Label>
          {output && (
            <CopyButton text={output} variant="outline" size="sm" className="h-7" />
          )}
        </div>

        <div className="bg-slate-900 rounded-xl p-4 min-h-[120px]">
          <code className="text-green-400 font-mono text-sm break-all whitespace-pre-wrap">
            {output || <span className="text-slate-500">Output will appear here...</span>}
          </code>
        </div>

        {output && (
          <p className="text-xs text-slate-500">
            {output.length.toLocaleString()} characters
          </p>
        )}
      </div>

      {/* Reference */}
      <div className="bg-slate-50 rounded-xl p-4">
        <h4 className="font-medium text-slate-700 text-sm mb-3">Common URL Encodings</h4>
        <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
          {COMMON_ENCODINGS.map((item) => (
            <div
              key={item.char}
              className="bg-white rounded-lg p-2 text-center border border-slate-200"
            >
              <div className="font-mono text-slate-900">
                {item.char === " " ? "␣" : item.char}
              </div>
              <div className="text-xs text-slate-500 mt-1">{item.encoded}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}