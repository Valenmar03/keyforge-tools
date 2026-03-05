"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { CopyButton } from "@/components/ui/CopyButton";
import { generateUUIDv4 } from "@/lib/crypto";

export default function UuidGenerator() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState<number>(1);
  const [uppercase, setUppercase] = useState<boolean>(false);
  const [noDashes, setNoDashes] = useState<boolean>(false);

  const generateUuids = useCallback(() => {
    const newUuids = Array.from({ length: count }, () => {
      let uuid = generateUUIDv4();
      if (uppercase) uuid = uuid.toUpperCase();
      if (noDashes) uuid = uuid.replace(/-/g, "");
      return uuid;
    });

    setUuids(newUuids);
  }, [count, uppercase, noDashes]);

  useEffect(() => {
    generateUuids();
  }, [generateUuids]);

  const copyAll = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(uuids.join("\n"));
    } catch (err) {
      console.error("Failed to copy all UUIDs:", err);
    }
  }, [uuids]);

  const generatedLabel = useMemo(() => {
    return `${uuids.length} UUID${uuids.length !== 1 ? "s" : ""} generated`;
  }, [uuids.length]);

  return (
    <div className="space-y-6">
      {/* Output */}
      <div className="space-y-2">
        {uuids.length === 1 ? (
          <div className="bg-slate-900 rounded-xl p-4 flex items-center justify-between">
            <code className="text-green-400 font-mono text-lg select-all">
              {uuids[0]}
            </code>
            <CopyButton
              text={uuids[0]}
              className="text-slate-400 hover:text-white"
            />
          </div>
        ) : (
          <div className="bg-slate-900 rounded-xl p-4 max-h-64 overflow-y-auto">
            <div className="space-y-1">
              {uuids.map((uuid, i) => (
                <div key={`${uuid}-${i}`} className="flex items-center justify-between group">
                  <code className="text-green-400 font-mono text-sm select-all">
                    {uuid}
                  </code>
                  <CopyButton
                    text={uuid}
                    className="text-slate-600 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">{generatedLabel}</span>
          <div className="flex items-center gap-2">
            {uuids.length > 1 && (
              <Button size="sm" variant="outline" onClick={copyAll} className="h-8">
                Copy All
              </Button>
            )}
            <Button
              size="sm"
              onClick={generateUuids}
              className="bg-blue-600 hover:bg-blue-700 h-8"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Generate
            </Button>
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-5 pt-4 border-t border-slate-100">
        {/* Count */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-slate-700">Count</Label>
            <span className="text-sm font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700">
              {count}
            </span>
          </div>
          <Slider
            value={[count]}
            onValueChange={(value: number[]) => setCount(value[0] ?? 1)}
            min={1}
            max={50}
            step={1}
            className="w-full"
          />
        </div>

        {/* Format Options */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setUppercase((v) => !v)}
            className={`p-3 rounded-lg border text-sm font-medium transition-all ${
              uppercase
                ? "bg-blue-50 border-blue-200 text-blue-700"
                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
            }`}
          >
            UPPERCASE
          </button>

          <button
            type="button"
            onClick={() => setNoDashes((v) => !v)}
            className={`p-3 rounded-lg border text-sm font-medium transition-all ${
              noDashes
                ? "bg-blue-50 border-blue-200 text-blue-700"
                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
            }`}
          >
            No Dashes
          </button>
        </div>

        {/* Generate Button */}
        <Button
          onClick={generateUuids}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          Generate {count > 1 ? `${count} UUIDs` : "UUID"}
        </Button>
      </div>

      {/* Info */}
      <div className="bg-slate-50 rounded-xl p-4 space-y-2">
        <h4 className="font-medium text-slate-700 text-sm">UUID v4 Format</h4>
        <div className="grid grid-cols-5 gap-1 text-xs font-mono">
          <div className="bg-white rounded p-2 text-center border border-slate-200">
            <div className="text-slate-400">8 chars</div>
          </div>
          <div className="bg-white rounded p-2 text-center border border-slate-200">
            <div className="text-slate-400">4 chars</div>
          </div>
          <div className="bg-blue-50 rounded p-2 text-center border border-blue-200">
            <div className="text-blue-600">4xxx</div>
            <div className="text-blue-400 text-[10px]">version</div>
          </div>
          <div className="bg-violet-50 rounded p-2 text-center border border-violet-200">
            <div className="text-violet-600">yxxx</div>
            <div className="text-violet-400 text-[10px]">variant</div>
          </div>
          <div className="bg-white rounded p-2 text-center border border-slate-200">
            <div className="text-slate-400">12 chars</div>
          </div>
        </div>
      </div>
    </div>
  );
}