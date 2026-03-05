"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Dices } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { CopyButton } from "@/components/ui/CopyButton";
import { getRandomIntRange } from "@/lib/crypto";

function randFraction01(): number {
  // 0 <= x < 1 (uniform)
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] / 2 ** 32;
}

function clampInt(n: number, min: number, max: number): number {
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, Math.trunc(n)));
}

export default function RandomNumberGenerator() {
  const [numbers, setNumbers] = useState<number[]>([]);
  const [min, setMin] = useState<number>(1);
  const [max, setMax] = useState<number>(100);
  const [count, setCount] = useState<number>(1);
  const [unique, setUnique] = useState<boolean>(false);
  const [isDecimal, setIsDecimal] = useState<boolean>(false);
  const [decimals, setDecimals] = useState<number>(2);

  const normalizedRange = useMemo(() => {
    // si el usuario puso min > max, los acomodamos
    const a = Number.isFinite(min) ? min : 0;
    const b = Number.isFinite(max) ? max : 0;
    return a <= b ? { min: a, max: b } : { min: b, max: a };
  }, [min, max]);

  const generate = useCallback(() => {
    const { min: rMin, max: rMax } = normalizedRange;

    const result: number[] = [];
    const used = new Set<number>();

    const rangeInt = Math.floor(rMax) - Math.floor(rMin) + 1;

    // para unique enteros, limitamos count al rango
    const actualCount =
      unique && !isDecimal ? Math.min(count, Math.max(0, rangeInt)) : count;

    for (let i = 0; i < actualCount; i++) {
      let num: number;

      if (isDecimal) {
        // decimal entre rMin y rMax (incluye rMin, excluye rMax si fraction=1 nunca pasa)
        const fraction = randFraction01();
        const raw = rMin + fraction * (rMax - rMin);
        num = Number(raw.toFixed(clampInt(decimals, 0, 10)));
      } else {
        // integer
        const iMin = Math.ceil(rMin);
        const iMax = Math.floor(rMax);

        if (iMax < iMin) {
          // rango inválido para enteros (ej: min=1.2 max=1.8)
          num = iMin;
        } else if (unique) {
          let tries = 0;
          do {
            num = getRandomIntRange(iMin, iMax);
            tries++;
            // safety: evita loop si algo raro pasa
            if (tries > 10_000) break;
          } while (used.has(num));
          used.add(num);
        } else {
          num = getRandomIntRange(iMin, iMax);
        }
      }

      result.push(num);
    }

    setNumbers(result);
  }, [count, decimals, isDecimal, normalizedRange, unique]);

  useEffect(() => {
    generate();
  }, [generate]);

  const copyAll = async () => {
    if (!numbers.length) return;
    await navigator.clipboard.writeText(numbers.join("\n"));
  };

  return (
    <div className="space-y-6">
      {/* Output */}
      <div className="bg-slate-900 rounded-xl p-4">
        {numbers.length === 1 ? (
          <div className="flex items-center justify-between">
            <code className="text-green-400 font-mono text-4xl select-all">
              {numbers[0]}
            </code>
            <CopyButton
              text={String(numbers[0])}
              className="text-slate-400 hover:text-white"
            />
          </div>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {numbers.map((num, i) => (
              <div key={i} className="flex items-center justify-between group">
                <code className="text-green-400 font-mono text-lg select-all">
                  {num}
                </code>
                <CopyButton
                  text={String(num)}
                  className="text-slate-600 hover:text-white opacity-0 group-hover:opacity-100"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500">
          {numbers.length} number{numbers.length !== 1 ? "s" : ""} generated
        </span>
        <div className="flex gap-2">
          {numbers.length > 1 && (
            <Button size="sm" variant="outline" onClick={copyAll} className="h-8">
              Copy All
            </Button>
          )}
          <Button size="sm" onClick={generate} className="h-8 bg-blue-600 hover:bg-blue-700">
            <Dices className="w-4 h-4 mr-1" />
            Generate
          </Button>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-5 pt-4 border-t border-slate-100">
        {/* Range */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">Minimum</Label>
            <Input
              type="number"
              value={min}
              onChange={(e) => setMin(Number(e.target.value))}
              className="font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">Maximum</Label>
            <Input
              type="number"
              value={max}
              onChange={(e) => setMax(Number(e.target.value))}
              className="font-mono"
            />
          </div>
        </div>

        {/* Count */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-slate-700">Count</Label>
            <span className="text-sm font-mono bg-slate-100 px-2 py-0.5 rounded">
              {count}
            </span>
          </div>
          <Slider
            value={[count]}
            onValueChange={(v) => setCount(v[0])}
            min={1}
            max={50}
            step={1}
          />
        </div>

        {/* Toggles */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <Label className="text-sm text-slate-700">Decimals</Label>
            <Switch
              checked={isDecimal}
              onCheckedChange={(v) => {
                setIsDecimal(v);
                if (v) setUnique(false); // unique no aplica en decimales
              }}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <Label className="text-sm text-slate-700">Unique</Label>
            <Switch checked={unique} onCheckedChange={setUnique} disabled={isDecimal} />
          </div>
        </div>

        {/* Decimals slider */}
        {isDecimal && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-slate-700">Decimal places</Label>
              <span className="text-sm font-mono bg-slate-100 px-2 py-0.5 rounded">
                {decimals}
              </span>
            </div>
            <Slider
              value={[decimals]}
              onValueChange={(v) => setDecimals(v[0])}
              min={0}
              max={10}
              step={1}
            />
          </div>
        )}

        <Button onClick={generate} className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base">
          <Dices className="w-5 h-5 mr-2" />
          Generate {count > 1 ? `${count} Numbers` : "Number"}
        </Button>
      </div>
    </div>
  );
}