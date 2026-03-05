"use client";

import React, { useMemo, useState } from "react";
import { ArrowDownUp, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CopyButton } from "@/components/ui/CopyButton";

type Mode = "encode" | "decode";

function uint8ToBase64(bytes: Uint8Array) {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function base64ToUint8(base64: string) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function toUrlSafe(b64: string) {
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromUrlSafe(b64url: string) {
  let s = b64url.replace(/-/g, "+").replace(/_/g, "/");
  const pad = s.length % 4;
  if (pad) s += "=".repeat(4 - pad);
  return s;
}

export default function Base64EncoderDecoder() {
  const [input, setInput] = useState<string>("");
  const [mode, setMode] = useState<Mode>("encode");
  const [urlSafe, setUrlSafe] = useState<boolean>(false);

  const { output, error } = useMemo(() => {
    const raw = input;
    if (!raw.trim()) return { output: "", error: "" };

    try {
      if (mode === "encode") {
        const bytes = new TextEncoder().encode(raw);
        let encoded = uint8ToBase64(bytes);
        if (urlSafe) encoded = toUrlSafe(encoded);
        return { output: encoded, error: "" };
      } else {
        let b64 = raw.trim();
        if (urlSafe) b64 = fromUrlSafe(b64);

        const bytes = base64ToUint8(b64);
        const decoded = new TextDecoder().decode(bytes);
        return { output: decoded, error: "" };
      }
    } catch {
      return {
        output: "",
        error: mode === "decode" ? "Invalid Base64 string" : "Failed to encode text",
      };
    }
  }, [input, mode, urlSafe]);

  const swapMode = () => {
    // Si hay output válido, lo usamos como próximo input
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

      {/* URL Safe Toggle */}
      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
        <Label className="text-sm text-slate-700">
          URL-Safe Base64 (replace +/ with -_)
        </Label>
        <Switch checked={urlSafe} onCheckedChange={setUrlSafe} />
      </div>

      {/* Input */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-slate-700">
          {mode === "encode" ? "Plain Text" : "Base64 String"}
        </Label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            mode === "encode"
              ? "Enter text to encode..."
              : "Enter Base64 string to decode..."
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
            {mode === "encode" ? "Base64 Output" : "Decoded Text"}
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
          <p className="text-xs text-slate-500">
            {output.length} characters
            {mode === "encode" && input.trim() && (
              <span>
                {" "}
                (size increase:{" "}
                {Math.max(
                  0,
                  Math.round((output.length / Math.max(1, input.length) - 1) * 100)
                )}
                %)
              </span>
            )}
          </p>
        )}
      </div>

      {/* Info */}
      <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-600">
        <p>
          <strong>Note:</strong> Base64 encoding increases data size by ~33%. It’s used
          for safely transmitting binary data through text-based protocols, not for
          encryption.
        </p>
      </div>
    </div>
  );
}