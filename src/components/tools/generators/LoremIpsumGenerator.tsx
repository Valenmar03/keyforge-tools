"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { CopyButton } from "@/components/ui/CopyButton";
import { cn } from "@/lib/utils";

type Mode = "paragraphs" | "sentences" | "words";

const LOREM_WORDS = [
  "lorem","ipsum","dolor","sit","amet","consectetur","adipiscing","elit",
  "sed","do","eiusmod","tempor","incididunt","ut","labore","et","dolore",
  "magna","aliqua","enim","ad","minim","veniam","quis","nostrud",
  "exercitation","ullamco","laboris","nisi","aliquip","ex","ea","commodo",
  "consequat","duis","aute","irure","in","reprehenderit","voluptate",
  "velit","esse","cillum","fugiat","nulla","pariatur","excepteur","sint",
  "occaecat","cupidatat","non","proident","sunt","culpa","qui","officia",
  "deserunt","mollit","anim","id","est","laborum",
] as const;

/** Cryptographically-strong random int in [0, maxExclusive) */
function randomInt(maxExclusive: number): number {
  if (maxExclusive <= 0) return 0;

  // Prefer crypto.getRandomValues
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    // Rejection sampling to avoid modulo bias
    const range = 0xffffffff;
    const limit = range - (range % maxExclusive);

    const buf = new Uint32Array(1);
    let x = 0;

    do {
      crypto.getRandomValues(buf);
      x = buf[0];
    } while (x >= limit);

    return x % maxExclusive;
  }

  // Fallback
  return Math.floor(Math.random() * maxExclusive);
}

function generateWords(count: number): string[] {
  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    words.push(LOREM_WORDS[randomInt(LOREM_WORDS.length)]);
  }
  return words;
}

function generateSentence(): string {
  const wordCount = 8 + randomInt(10); // 8..17
  const words = generateWords(wordCount);
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return `${words.join(" ")}.`;
}

function generateParagraph(): string {
  const sentenceCount = 4 + randomInt(4); // 4..7
  return Array.from({ length: sentenceCount }, generateSentence).join(" ");
}

export default function LoremIpsumGenerator() {
  const [mode, setMode] = useState<Mode>("paragraphs");
  const [count, setCount] = useState<number>(3);
  const [output, setOutput] = useState<string>("");
  const [startWithLorem, setStartWithLorem] = useState<boolean>(true);

  const maxCount = useMemo(() => {
    if (mode === "words") return 200;
    if (mode === "sentences") return 20;
    return 10; // paragraphs
  }, [mode]);

  // Keep count in range when mode changes
  useEffect(() => {
    setCount((c) => Math.min(Math.max(c, 1), maxCount));
  }, [maxCount]);

  const generate = useCallback(() => {
    let result = "";

    if (mode === "paragraphs") {
      result = Array.from({ length: count }, generateParagraph).join("\n\n");
    } else if (mode === "sentences") {
      result = Array.from({ length: count }, generateSentence).join(" ");
    } else {
      result = generateWords(count).join(" ");
    }

    if (startWithLorem && result.length > 0) {
      // Make it feel like classic lorem opening
      result =
        "Lorem ipsum dolor sit amet, " +
        result.slice(0, 1).toLowerCase() +
        result.slice(1);
    }

    setOutput(result);
  }, [mode, count, startWithLorem]);

  // Generate on mount + when options change (si lo querés manual, borra este effect)
  useEffect(() => {
    generate();
  }, [generate]);

  const wordCount = useMemo(() => {
    if (!output.trim()) return 0;
    return output.trim().split(/\s+/).length;
  }, [output]);

  return (
    <div className="space-y-6">
      {/* Mode Selection */}
      <div className="flex justify-center">
        <div className="inline-flex bg-slate-100 rounded-xl p-1">
          {(["paragraphs", "sentences", "words"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize",
                mode === m
                  ? "bg-white shadow-sm text-slate-900"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-slate-700 capitalize">
            Number of {mode}
          </Label>
          <span className="text-sm font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700">
            {count}
          </span>
        </div>

        <Slider
          value={[count]}
          onValueChange={(v: number[]) => setCount(v[0])}
          min={1}
          max={maxCount}
          step={1}
        />

        <div className="flex justify-between text-xs text-slate-400">
          <span>1</span>
          <span>{maxCount}</span>
        </div>
      </div>

      {/* Start with Lorem */}
      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
        <Label className="text-sm text-slate-700">Start with "Lorem ipsum..."</Label>
        <Switch checked={startWithLorem} onCheckedChange={setStartWithLorem} />
      </div>

      {/* Generate */}
      <Button
        onClick={generate}
        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-base"
      >
        <RefreshCw className="w-5 h-5 mr-2" />
        Generate Lorem Ipsum
      </Button>

      {/* Output */}
      {output && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-slate-700">Generated Text</Label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">{wordCount} words</span>
              <CopyButton text={output} variant="outline" size="sm" className="h-7" />
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 max-h-64 overflow-y-auto">
            <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
              {output}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}