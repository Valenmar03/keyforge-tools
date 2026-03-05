"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { RefreshCw, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { StrengthMeterPro } from "@/components/ui/StrengthMeterPro";
import { estimateEntropyBitsFromPool } from "@/lib/entropy";
import { getRandomString, CHARSETS } from "@/lib/crypto";

type Options = {
  lowercase: boolean;
  uppercase: boolean;
  numbers: boolean;
  symbols: boolean;
};

export default function PasswordGenerator() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState<Options>({
    lowercase: true,
    uppercase: true,
    numbers: true,
    symbols: true,
  });
  const [copied, setCopied] = useState(false);

  const entropyBits = useMemo(() => {
    if (!password) return 0;
  
    let poolSize = 0;
    if (options.lowercase) poolSize += 26;
    if (options.uppercase) poolSize += 26;
    if (options.numbers) poolSize += 10;
    if (options.symbols) poolSize += 32; // aprox
  
    if (poolSize === 0) poolSize = 26;
  
    return estimateEntropyBitsFromPool(poolSize, password.length);
  }, [password, options]);

  const generatePassword = useCallback(() => {
    let charset = "";
    if (options.lowercase) charset += CHARSETS.lowercase;
    if (options.uppercase) charset += CHARSETS.uppercase;
    if (options.numbers) charset += CHARSETS.numbers;
    if (options.symbols) charset += CHARSETS.symbols;

    if (!charset) charset = CHARSETS.lowercase;

    const newPassword = getRandomString(length, charset);
    setPassword(newPassword);
    setCopied(false);
  }, [length, options]);

  const handleCopy = useCallback(async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      const t = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(t);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, [password]);

  const calculateStrength = useCallback(() => {
    if (!password) return 0;

    let poolSize = 0;
    if (options.lowercase) poolSize += 26;
    if (options.uppercase) poolSize += 26;
    if (options.numbers) poolSize += 10;
    if (options.symbols) poolSize += 32;

    if (poolSize === 0) poolSize = 26;

    const entropy = Math.log2(poolSize) * password.length;
    return Math.min(100, (entropy / 128) * 100);
  }, [password, options]);

  // Generate on mount
  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  return (
    <div className="space-y-6">
      {/* Output */}
      <div className="relative">
        <div className="flex items-center gap-3 p-4 bg-slate-900 rounded-xl">
          <code className="flex-1 text-lg md:text-xl text-green-400 font-mono break-all select-all">
            {password || "Click generate to create a password"}
          </code>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="icon"
              variant="ghost"
              onClick={handleCopy}
              className="text-slate-400 hover:text-white hover:bg-slate-800"
              disabled={!password}
            >
              {copied ? (
                <Check className="w-5 h-5 text-green-400" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </Button>

            <Button
              size="icon"
              onClick={generatePassword}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <RefreshCw className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Strength Meter */}
      {password && <StrengthMeterPro entropyBits={entropyBits} />}

      {/* Options */}
      <div className="space-y-6 pt-4 border-t border-slate-100">
        {/* Length Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-slate-700">Length</Label>
            <span className="text-sm font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700">
              {length}
            </span>
          </div>

          <Slider
            value={[length]}
            onValueChange={(value) => setLength(value[0])}
            min={8}
            max={64}
            step={1}
            className="w-full"
          />

          <div className="flex justify-between text-xs text-slate-400">
            <span>8</span>
            <span>64</span>
          </div>
        </div>

        {/* Character Options */}
        <div className="grid grid-cols-2 gap-4">
          {(
            [
              { key: "lowercase", label: "Lowercase (a-z)" },
              { key: "uppercase", label: "Uppercase (A-Z)" },
              { key: "numbers", label: "Numbers (0-9)" },
              { key: "symbols", label: "Symbols (!@#$...)" },
            ] as const
          ).map((opt) => (
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

        {/* Generate Button */}
        <Button
          onClick={generatePassword}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          Generate New Password
        </Button>
      </div>

      {/* Info */}
      <div className="p-4 bg-green-50 border border-green-100 rounded-xl">
        <p className="text-sm text-green-800">
          <strong>Privacy:</strong> Passwords are generated locally using{" "}
          <code className="bg-green-100 px-1 rounded">crypto.getRandomValues()</code>.
          Nothing is transmitted or stored.
        </p>
      </div>
    </div>
  );
}