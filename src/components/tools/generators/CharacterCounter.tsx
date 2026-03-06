"use client";

import React, { useMemo, useState } from "react";
import { Eraser } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { getTextStats } from "@/lib/textStats";

export default function CharacterCounter() {
  const [input, setInput] = useState<string>("");

  const stats = useMemo(() => {
    if (!input) return null;
    return getTextStats(input);
  }, [input]);

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-slate-700">Input Text</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setInput("")}
            disabled={!input}
            className="h-8"
          >
            <Eraser className="w-4 h-4 mr-2" />
            Clear
          </Button>
        </div>

        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste or type your text here..."
          className="min-h-[200px] font-mono text-sm"
        />
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-slate-900">
              {stats.chars.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500">Characters (total)</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-slate-900">
              {stats.charsWithoutSpaces.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500">Characters (no spaces)</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-slate-900">
              {stats.words.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500">Words</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-slate-900">
              {stats.lines.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500">Lines</div>
          </div>
        </div>
      )}

      {!input && (
        <div className="bg-slate-50 rounded-xl p-6 text-center">
          <p className="text-sm text-slate-500">
            Paste or type text above to see character count (with and without spaces).
          </p>
        </div>
      )}
    </div>
  );
}
