"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshCw, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CopyButton } from "@/components/ui/CopyButton";
import { getRandomString, getRandomHex, CHARSETS } from "@/lib/crypto";

type Format = "alphanumeric" | "hex" | "lowercase";
type Preset = "sk_live_" | "sk_test_" | "pk_live_" | "pk_test_" | "api_" | "tok_" | "key_" | "custom" | "none";

export default function ApiKeyGenerator() {
  const [apiKey, setApiKey] = useState("");
  const [preset, setPreset] = useState<Preset>("sk_live_");
  const [customPrefix, setCustomPrefix] = useState("sk_live_");
  const [length, setLength] = useState(32);
  const [format, setFormat] = useState<Format>("alphanumeric");
  const [useDashes, setUseDashes] = useState(false);

  const effectivePrefix = useMemo(() => {
    if (preset === "none") return "";
    if (preset === "custom") return customPrefix ?? "";
    return preset;
  }, [preset, customPrefix]);

  const generateApiKey = useCallback(() => {
    let key = "";

    switch (format) {
      case "alphanumeric":
        key = getRandomString(length, CHARSETS.alphanumeric);
        break;
      case "hex":
        key = getRandomHex(Math.ceil(length / 2)).slice(0, length);
        break;
      case "lowercase":
        key = getRandomString(length, CHARSETS.lowercase + CHARSETS.numbers);
        break;
      default:
        key = getRandomString(length, CHARSETS.alphanumeric);
    }

    if (useDashes && length >= 16) {
      const chunkSize = Math.ceil(length / 4);
      key = key.match(new RegExp(`.{1,${chunkSize}}`, "g"))?.join("-") || key;
    }

    setApiKey(effectivePrefix + key);
  }, [effectivePrefix, format, length, useDashes]);

  useEffect(() => {
    generateApiKey();
  }, [generateApiKey]);

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="shrink-0 mt-1">
            <Key className="w-5 h-5 text-slate-400" />
          </div>
          <code className="flex-1 text-green-400 font-mono text-sm md:text-base break-all select-all leading-relaxed">
            {apiKey || "Click generate to create an API key"}
          </code>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500">{apiKey.length} characters</span>
        <div className="flex items-center gap-2">
          <CopyButton text={apiKey} variant="outline" size="sm" className="h-8" />
          <Button size="sm" onClick={generateApiKey} className="bg-blue-600 hover:bg-blue-700 h-8">
            <RefreshCw className="w-4 h-4 mr-1" />
            Generate
          </Button>
        </div>
      </div>

      <div className="space-y-5 pt-4 border-t border-slate-100">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-slate-700">Prefix</Label>
          <div className="flex gap-2">
            <Select value={preset} onValueChange={(v: Preset) => setPreset(v)}>
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sk_live_">Secret Live</SelectItem>
                <SelectItem value="sk_test_">Secret Test</SelectItem>
                <SelectItem value="pk_live_">Public Live</SelectItem>
                <SelectItem value="pk_test_">Public Test</SelectItem>
                <SelectItem value="api_">API Key</SelectItem>
                <SelectItem value="tok_">Token</SelectItem>
                <SelectItem value="key_">Key</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
                <SelectItem value="none">No Prefix</SelectItem>
              </SelectContent>
            </Select>

            <Input
              value={customPrefix}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setCustomPrefix(e.target.value);
                setPreset("custom");
              }}
              placeholder="Custom prefix..."
              className="flex-1"
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-slate-700">Key Length (excluding prefix)</Label>
            <span className="text-sm font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700">{length}</span>
          </div>
          <Slider value={[length]} onValueChange={(v: number[]) => setLength(v[0])} min={16} max={64} step={4} />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-slate-700">Character Set</Label>
          <Select value={format} onValueChange={(v: Format) => setFormat(v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alphanumeric">Alphanumeric (A-Z, a-z, 0-9)</SelectItem>
              <SelectItem value="hex">Hexadecimal (0-9, a-f)</SelectItem>
              <SelectItem value="lowercase">Lowercase + Numbers</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
          <Label className="text-sm text-slate-700">Add dashes for readability</Label>
          <Switch checked={useDashes} onCheckedChange={setUseDashes} />
        </div>

        <Button onClick={generateApiKey} className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base">
          <RefreshCw className="w-5 h-5 mr-2" />
          Generate New API Key
        </Button>
      </div>

      <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
        <p className="text-sm text-amber-800">
          <strong>Security Tip:</strong> Store API keys securely using environment variables or a secrets manager.
          Never commit keys to version control.
        </p>
      </div>
    </div>
  );
}