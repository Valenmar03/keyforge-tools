"use client";

import React, { useMemo, useState } from "react";
import { CheckCircle, AlertCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CopyButton } from "@/components/ui/CopyButton";

function getErrorMessage(err: unknown) {
  if (err instanceof Error) return err.message;
  return "Invalid JSON";
}

export default function JsonMinify() {
  const [input, setInput] = useState<string>("");

  const result = useMemo(() => {
    if (!input.trim()) {
      return {
        valid: null as null | boolean,
        output: "",
        error: "",
      };
    }

    try {
      const parsed = JSON.parse(input);
      const output = JSON.stringify(parsed);
      return { valid: true as const, output, error: "" };
    } catch (e) {
      return {
        valid: false as const,
        output: "",
        error: getErrorMessage(e),
      };
    }
  }, [input]);

  const handleClear = () => {
    setInput("");
  };

  return (
    <div className="space-y-6">
      {/* Status Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {result.valid === true && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Valid JSON</span>
            </div>
          )}
          {result.valid === false && (
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Invalid JSON</span>
            </div>
          )}
        </div>

        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={handleClear}
          className="h-7 text-xs"
        >
          <Trash2 className="w-3 h-3 mr-1" />
          Clear
        </Button>
      </div>

      {/* Input */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-slate-700">Input JSON</Label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`{"example":"Paste your JSON here","items":[1,2,3]}`}
          className="font-mono text-sm min-h-[200px]"
        />
      </div>

      {/* Error */}
      {result.error && result.valid === false && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-100 rounded-xl">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <p className="text-sm text-red-800 font-mono">{result.error}</p>
        </div>
      )}

      {/* Output */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-slate-700">
            Minified Output
          </Label>
          {result.valid && result.output && (
            <CopyButton
              text={result.output}
              variant="outline"
              size="sm"
              className="h-7"
            />
          )}
        </div>

        <div className="bg-slate-900 rounded-xl p-4 min-h-[120px]">
          <code className="text-green-400 font-mono text-sm break-all whitespace-pre-wrap">
            {result.valid && result.output ? (
              result.output
            ) : (
              <span className="text-slate-500">Minified JSON will appear here...</span>
            )}
          </code>
        </div>

        {result.valid && result.output && (
          <p className="text-xs text-slate-500">
            {result.output.length} characters
            {input.trim() && (
              <span>
                {" "}
                (saved{" "}
                {Math.max(
                  0,
                  Math.round((1 - result.output.length / input.length) * 100)
                )}
                % vs formatted)
              </span>
            )}
          </p>
        )}
      </div>
    </div>
  );
}
