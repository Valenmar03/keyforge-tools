"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshCw, Palette, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { CopyButton } from "@/components/ui/CopyButton";
import { getRandomIntRange } from "@/lib/crypto";

type RGB = { r: number; g: number; b: number };
type HSL = { h: number; s: number; l: number };
type ColorItem = { rgb: RGB; hex: string; hsl: HSL };

type Format = "hex" | "rgb" | "hsl";

function generateRandomColor(): RGB {
  const r = getRandomIntRange(0, 255);
  const g = getRandomIntRange(0, 255);
  const b = getRandomIntRange(0, 255);
  return { r, g, b };
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((x) => x.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
}

function rgbToHsl(r: number, g: number, b: number): HSL {
  let rr = r / 255;
  let gg = g / 255;
  let bb = b / 255;

  const max = Math.max(rr, gg, bb);
  const min = Math.min(rr, gg, bb);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case rr:
        h = (gg - bb) / d + (gg < bb ? 6 : 0);
        break;
      case gg:
        h = (bb - rr) / d + 2;
        break;
      case bb:
        h = (rr - gg) / d + 4;
        break;
    }

    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function getColorString(color: ColorItem, format: Format): string {
  switch (format) {
    case "hex":
      return color.hex;
    case "rgb":
      return `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`;
    case "hsl":
      return `hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`;
    default:
      return color.hex;
  }
}

export default function RandomColorGenerator() {
  const [colors, setColors] = useState<ColorItem[]>([]);
  const [count, setCount] = useState<number>(5);
  const [selectedFormat, setSelectedFormat] = useState<Format>("hex");

  const generate = useCallback(() => {
    const newColors: ColorItem[] = Array.from({ length: count }, () => {
      const rgb = generateRandomColor();
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      return { rgb, hex, hsl };
    });

    setColors(newColors);
  }, [count]);

  useEffect(() => {
    generate();
  }, [generate]);

  const paletteText = useMemo(() => {
    return colors.map((c) => getColorString(c, selectedFormat)).join("\n");
  }, [colors, selectedFormat]);

  const copyPalette = async () => {
    if (!paletteText) return;
    await navigator.clipboard.writeText(paletteText);
  };

  const copyOne = async (color: ColorItem) => {
    await navigator.clipboard.writeText(getColorString(color, selectedFormat));
  };

  return (
    <div className="space-y-6">
      {/* Palette */}
      <div
        className="grid gap-2 h-32 rounded-xl overflow-hidden"
        style={{ gridTemplateColumns: `repeat(${Math.max(1, Math.min(10, count))}, minmax(0, 1fr))` }}
      >
        {colors.map((color, i) => (
          <button
            key={i}
            type="button"
            className="relative group cursor-pointer"
            style={{ backgroundColor: color.hex }}
            onClick={() => copyOne(color)}
            aria-label={`Copy color ${getColorString(color, selectedFormat)}`}
            title="Click to copy"
          >
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <Copy className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </button>
        ))}
      </div>

      {/* Format toggle */}
      <div className="flex justify-center">
        <div className="inline-flex bg-slate-100 rounded-xl p-1">
          {(["hex", "rgb", "hsl"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setSelectedFormat(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium uppercase transition-all ${
                selectedFormat === f ? "bg-white shadow-sm text-slate-900" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="space-y-2">
        {colors.map((color, i) => {
          const value = getColorString(color, selectedFormat);
          return (
            <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <div
                className="w-10 h-10 rounded-lg border border-slate-200"
                style={{ backgroundColor: color.hex }}
              />
              <code className="flex-1 font-mono text-sm text-slate-700">{value}</code>
              <CopyButton text={value} />
            </div>
          );
        })}
      </div>

      {/* Count */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-slate-700">Colors</Label>
          <span className="text-sm font-mono bg-slate-100 px-2 py-0.5 rounded">{count}</span>
        </div>
        <Slider value={[count]} onValueChange={(v) => setCount(v[0])} min={1} max={10} step={1} />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button onClick={generate} className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-base">
          <RefreshCw className="w-5 h-5 mr-2" />
          Generate Colors
        </Button>
        <Button onClick={copyPalette} variant="outline" className="h-12">
          <Palette className="w-5 h-5 mr-2" />
          Copy All
        </Button>
      </div>
    </div>
  );
}