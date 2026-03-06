"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Lock } from "lucide-react";
import SparkMD5 from "spark-md5";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyButton } from "@/components/ui/CopyButton";

export default function Md5HashGenerator() {
  const [input, setInput] = useState<string>("");
  const [hash, setHash] = useState<string>("");

  const computeHash = useCallback(() => {
    if (!input) {
      setHash("");
      return;
    }
    setHash(SparkMD5.hash(input));
  }, [input]);

  useEffect(() => {
    computeHash();
  }, [computeHash]);

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-slate-700">Text to Hash</Label>
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text..."
          className="font-mono"
        />
      </div>

      {/* Output */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-slate-700">MD5 Hash</Label>
          {hash && (
            <CopyButton text={hash} variant="outline" size="sm" className="h-7" />
          )}
        </div>
        <div className="bg-slate-900 rounded-xl p-4 min-h-[60px]">
          <code className="text-green-400 font-mono text-sm break-all">
            {hash || (
              <span className="text-slate-500">Hash will appear here...</span>
            )}
          </code>
        </div>
      </div>

      {/* Privacy Note */}
      <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-100 rounded-xl">
        <Lock className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
        <p className="text-sm text-green-800">
          Hashing happens entirely in your browser. Your data is never transmitted anywhere.
        </p>
      </div>
    </div>
  );
}
