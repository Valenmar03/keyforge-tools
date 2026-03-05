"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CopyButton } from "@/components/ui/CopyButton";

// OJO: ajustá esto según tu proyecto
import {
  getRandomHex,
  getRandomBase64,
  getRandomBase64Url,
  getRandomString,
  CHARSETS,
} from "@/lib/crypto";

type TokenFormat = "hex" | "base64" | "base64url" | "alphanumeric";

const formats: Array<{
  value: TokenFormat;
  label: string;
  description: string;
}> = [
  { value: "hex", label: "Hexadecimal", description: "0-9, a-f" },
  { value: "base64", label: "Base64", description: "A-Z, a-z, 0-9, +, /" },
  { value: "base64url", label: "URL-Safe Base64", description: "A-Z, a-z, 0-9, -, _" },
  { value: "alphanumeric", label: "Alphanumeric", description: "A-Z, a-z, 0-9" },
];

const presets: Array<{
  label: string;
  bytes: number;
  format: TokenFormat;
}> = [
  { label: "Session Token", bytes: 16, format: "hex" },          // 128-bit
  { label: "CSRF Token", bytes: 16, format: "base64url" },       // 128-bit
  { label: "API Key", bytes: 32, format: "alphanumeric" },       // 256-bit
  { label: "Secure Key", bytes: 32, format: "hex" },             // 256-bit
];

export default function RandomTokenGenerator() {
  const [token, setToken] = useState<string>("");
  const [format, setFormat] = useState<TokenFormat>("hex");
  const [bytes, setBytes] = useState<number>(32); // 256 bits

  const entropyBits = useMemo(() => bytes * 8, [bytes]);

  const estimatedCharCount = useMemo(() => {
    switch (format) {
      case "hex":
        return bytes * 2;
      case "base64":
      case "base64url":
        // base64 length ~ ceil(bytes*4/3) (sin padding puede variar)
        return Math.ceil((bytes * 4) / 3);
      case "alphanumeric":
        // aproximación para que se vea “parecido” en densidad
        return Math.ceil(bytes * 1.4);
      default:
        return bytes * 2;
    }
  }, [bytes, format]);

  const generateToken = useCallback(() => {
    let newToken = "";

    switch (format) {
      case "hex":
        newToken = getRandomHex(bytes);
        break;
      case "base64":
        newToken = getRandomBase64(bytes);
        break;
      case "base64url":
        newToken = getRandomBase64Url(bytes);
        break;
      case "alphanumeric": {
        const len = Math.ceil(bytes * 1.4);
        newToken = getRandomString(len, CHARSETS.alphanumeric).slice(0, len);
        break;
      }
      default:
        newToken = getRandomHex(bytes);
    }

    setToken(newToken);
  }, [bytes, format]);

  // Generate on mount + when deps change
  useEffect(() => {
    generateToken();
  }, [generateToken]);

  const applyPreset = (p: (typeof presets)[number]) => {
    setBytes(p.bytes);
    setFormat(p.format);
    // Generá después del setState (microtask) para usar valores nuevos
    // (o simplemente dejás que el useEffect regenere al cambiar format/bytes)
    // Igual, si querés instantáneo:
    setTimeout(() => {
      // con estados ya actualizados por React
      // el useEffect igual lo hace, pero esto evita “parpadeo” si tu UI lo nota
      // podés borrar este setTimeout si no lo querés
    }, 0);
  };

  return (
    <div className="space-y-6">
      {/* Output */}
      <div className="relative">
        <div className="bg-slate-900 rounded-xl p-4">
          <code className="block text-green-400 font-mono text-sm md:text-base break-all select-all leading-relaxed">
            {token || "Click generate to create a token"}
          </code>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span>{entropyBits} bits</span>
            <span>{token.length} characters</span>
            <span className="hidden sm:inline">~{estimatedCharCount} est.</span>
          </div>

          <div className="flex items-center gap-2">
            <CopyButton text={token} variant="outline" size="sm" className="h-8" />
            <Button
              size="sm"
              onClick={generateToken}
              className="bg-blue-600 hover:bg-blue-700 h-8"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Generate
            </Button>
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-5 pt-4 border-t border-slate-100">
        {/* Format */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-slate-700">Format</Label>

          <Select value={format} onValueChange={(v) => setFormat(v as TokenFormat)}>
            <SelectTrigger className="w-full py-7">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {formats.map((f) => (
                <SelectItem key={f.value} value={f.value}>
                  <div className="flex flex-col">
                    <span>{f.label}</span>
                    <span className="text-xs text-slate-500">{f.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Entropy (Bytes) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-slate-700">Entropy</Label>
            <span className="text-sm font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700">
              {bytes} bytes ({entropyBits} bits)
            </span>
          </div>

          <Slider
            value={[bytes]}
            onValueChange={(value) => setBytes(value[0])}
            min={8}
            max={64}
            step={4}
            className="w-full"
          />

          <div className="flex justify-between text-xs text-slate-400">
            <span>64 bits</span>
            <span>128 bits</span>
            <span>256 bits</span>
            <span>512 bits</span>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-slate-700">Quick Presets</Label>
          <div className="flex flex-wrap gap-2">
            {presets.map((p) => (
              <Button
                key={p.label}
                variant="outline"
                size="sm"
                onClick={() => applyPreset(p)}
                className="text-xs"
              >
                {p.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={generateToken}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          Generate New Token
        </Button>
      </div>

      {/* Info */}
      <div className="p-4 bg-green-50 border border-green-100 rounded-xl">
        <p className="text-sm text-green-800">
          <strong>Secure:</strong> Tokens are generated using{" "}
          <code className="bg-green-100 px-1 rounded">crypto.getRandomValues()</code>.
          Suitable for session IDs, CSRF tokens, and API secrets.
        </p>
      </div>
    </div>
  );
}