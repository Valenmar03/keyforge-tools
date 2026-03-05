"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { CopyButton } from "@/components/ui/CopyButton";
import { getRandomString, CHARSETS } from "@/lib/crypto";

type Options = {
  lowercase: boolean;
  uppercase: boolean;
  numbers: boolean;
  symbols: boolean;
};

const OPTION_DEFS: Array<{ key: keyof Options; label: string }> = [
  { key: "lowercase", label: "Lowercase (a-z)" },
  { key: "uppercase", label: "Uppercase (A-Z)" },
  { key: "numbers", label: "Numbers (0-9)" },
  { key: "symbols", label: "Symbols (!@#...)" },
];

export default function RandomStringGenerator() {
  const [output, setOutput] = useState<string>("");
  const [length, setLength] = useState<number>(16);
  const [options, setOptions] = useState<Options>({
    lowercase: true,
    uppercase: true,
    numbers: true,
    symbols: false,
  });

  const [customChars, setCustomChars] = useState<string>("");
  const [useCustom, setUseCustom] = useState<boolean>(false);

  const effectiveCharset = useMemo(() => {
    const custom = customChars ?? "";

    if (useCustom) {
      const trimmed = custom.trim();
      return trimmed.length ? trimmed : CHARSETS.alphanumeric;
    }

    let charset = "";
    if (options.lowercase) charset += CHARSETS.lowercase;
    if (options.uppercase) charset += CHARSETS.uppercase;
    if (options.numbers) charset += CHARSETS.numbers;
    if (options.symbols) charset += CHARSETS.symbols;

    return charset.length ? charset : CHARSETS.alphanumeric;
  }, [customChars, options, useCustom]);

  const generate = useCallback(() => {
    const safeLen = Math.max(1, Math.min(512, Math.trunc(length)));
    setOutput(getRandomString(safeLen, effectiveCharset));
  }, [effectiveCharset, length]);

  useEffect(() => {
    generate();
  }, [generate]);

  return (
    <div className="space-y-6">
      {/* Output */}
      <div className="bg-slate-900 rounded-xl p-4 flex items-center justify-between gap-3">
        <code className="text-green-400 font-mono text-lg break-all select-all flex-1">
          {output}
        </code>

        <div className="flex items-center gap-2 shrink-0">
          <CopyButton text={output} className="text-slate-400 hover:text-white" />
          <Button size="icon" onClick={generate} className="bg-blue-600 hover:bg-blue-700">
            <RefreshCw className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Length */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-slate-700">Length</Label>
          <span className="text-sm font-mono bg-slate-100 px-2 py-0.5 rounded">{length}</span>
        </div>

        <Slider
          value={[length]}
          onValueChange={(v) => setLength(v[0])}
          min={4}
          max={128}
          step={1}
        />
      </div>

      {/* Character Options */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-slate-700">
            Use Custom Characters
          </Label>
          <Switch checked={useCustom} onCheckedChange={setUseCustom} />
        </div>

        {useCustom ? (
          <Input
            value={customChars}
            onChange={(e) => setCustomChars(e.target.value)}
            placeholder="Enter custom character set..."
            className="font-mono"
          />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {OPTION_DEFS.map((opt) => (
              <div
                key={opt.key}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
              >
                <Label className="text-sm text-slate-700">{opt.label}</Label>
                <Switch
                  checked={options[opt.key]}
                  onCheckedChange={(checked) =>
                    setOptions((prev) => ({ ...prev, [opt.key]: checked }))
                  }
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Generate Button */}
      <Button
        onClick={generate}
        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-base"
      >
        <RefreshCw className="w-5 h-5 mr-2" />
        Generate String
      </Button>
    </div>
  );
}