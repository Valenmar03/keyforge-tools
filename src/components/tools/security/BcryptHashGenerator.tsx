"use client";

import React, { useMemo, useState } from "react";
import { Hash, AlertTriangle, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { CopyButton } from "@/components/ui/CopyButton";

// Demo bcrypt-like hash simulation (NOT real bcrypt)
async function generateBcryptHash(password: string, cost: number): Promise<string> {
  const encoder = new TextEncoder();

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const saltB64 = btoa(String.fromCharCode(...salt))
    .replace(/\+/g, ".")
    .replace(/\//g, "/")
    .slice(0, 22);

  let data = encoder.encode(password + saltB64);

  const iterations = Math.pow(2, cost);

  // Cap to avoid freezing UI (demo purposes)
  for (let i = 0; i < Math.min(iterations, 1000); i++) {
    const hash = await crypto.subtle.digest("SHA-256", data);
    data = new Uint8Array(hash);
  }

  const hashB64 = btoa(String.fromCharCode(...data))
    .replace(/\+/g, ".")
    .slice(0, 31);

  const costStr = cost.toString().padStart(2, "0");
  return `$2b$${costStr}$${saltB64}${hashB64}`;
}

export default function BcryptHashGenerator() {
  const [password, setPassword] = useState<string>("");
  const [cost, setCost] = useState<number>(10);
  const [hash, setHash] = useState<string>("");
  const [isHashing, setIsHashing] = useState<boolean>(false);

  const estimatedTime = useMemo(() => {
    const times: Record<number, string> = {
      8: "~25ms",
      9: "~50ms",
      10: "~100ms",
      11: "~200ms",
      12: "~400ms",
      13: "~800ms",
      14: "~1.6s",
      15: "~3.2s",
      16: "~6.4s",
    };
    return times[cost] ?? "~100ms";
  }, [cost]);

  const handleGenerate = async () => {
    if (!password || isHashing) return;

    setIsHashing(true);
    try {
      // tiny delay to show loading state (demo)
      await new Promise<void>((resolve) =>
        setTimeout(resolve, 100 * Math.pow(2, Math.max(0, cost - 10)))
      );

      const newHash = await generateBcryptHash(password, cost);
      setHash(newHash);
    } finally {
      setIsHashing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Password Input */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-slate-700">Password to Hash</Label>
        <div className="flex gap-2">
          <Input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password..."
            className="flex-1"
          />
          <Button
            onClick={handleGenerate}
            disabled={!password || isHashing}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isHashing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Hash className="w-4 h-4 mr-2" />
                Hash
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Cost Factor */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-slate-700">Cost Factor (Rounds)</Label>
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700">
              {cost}
            </span>
            <span className="text-xs text-slate-500">({estimatedTime})</span>
          </div>
        </div>

        <Slider
          value={[cost]}
          onValueChange={(value: number[]) => setCost(value[0])}
          min={4}
          max={16}
          step={1}
          className="w-full"
        />

        <div className="flex justify-between text-xs text-slate-400">
          <span>Fast (4)</span>
          <span>Balanced (10-12)</span>
          <span>Slow (16)</span>
        </div>
      </div>

      {/* Output */}
      {hash && (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-slate-700">Bcrypt Hash</Label>
          <div className="relative">
            <div className="bg-slate-900 rounded-xl p-4">
              <code className="text-green-400 font-mono text-sm break-all select-all">
                {hash}
              </code>
            </div>
            <CopyButton
              text={hash}
              className="absolute top-3 right-3 text-slate-400 hover:text-white"
            />
          </div>
          <p className="text-xs text-slate-500">Hash format: $2b$[cost]$[22-char salt][31-char hash]</p>
        </div>
      )}

      {/* Hash Breakdown */}
      {hash && (
        <div className="bg-slate-50 rounded-xl p-4 space-y-2">
          <h4 className="font-medium text-slate-700 text-sm">Hash Components</h4>
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="bg-white rounded-lg p-2 border border-slate-200">
              <div className="text-slate-500 mb-1">Algorithm</div>
              <code className="text-slate-900">$2b$</code>
            </div>
            <div className="bg-white rounded-lg p-2 border border-slate-200">
              <div className="text-slate-500 mb-1">Cost Factor</div>
              <code className="text-slate-900">{cost.toString().padStart(2, "0")}</code>
            </div>
            <div className="bg-white rounded-lg p-2 border border-slate-200">
              <div className="text-slate-500 mb-1">Iterations</div>
              <code className="text-slate-900">
                2^{cost} = {Math.pow(2, cost).toLocaleString()}
              </code>
            </div>
          </div>
        </div>
      )}

      {/* Warning */}
      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl">
        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="text-sm text-amber-800">
          <strong>Demo Only:</strong> This is a simplified bcrypt simulation. For production use,
          implement bcrypt server-side using a proper library like{" "}
          <code className="bg-amber-100 px-1 rounded">bcryptjs</code> or{" "}
          <code className="bg-amber-100 px-1 rounded">bcrypt</code>.
        </div>
      </div>

      {/* Privacy Note */}
      <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-100 rounded-xl">
        <Lock className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
        <p className="text-sm text-green-800">
          Hashing happens entirely in your browser. Your password is never transmitted anywhere.
        </p>
      </div>
    </div>
  );
}