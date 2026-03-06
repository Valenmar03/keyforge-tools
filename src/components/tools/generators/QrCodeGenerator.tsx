"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Download, Trash2, AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/ui/CopyButton";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ECLevel = "L" | "M" | "Q" | "H";

function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function QrCodeGenerator() {
  const t = useTranslations("toolsData");

  const [value, setValue] = useState<string>("");
  const [size, setSize] = useState<number>(256);
  const [margin, setMargin] = useState<number>(2);
  const [level, setLevel] = useState<ECLevel>("M");
  const [error, setError] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const hasValue = value.trim().length > 0;

  const options = useMemo(
    () => ({
      errorCorrectionLevel: level,
      margin,
      width: size,
      color: {
        dark: "#0f172a", // slate-900
        light: "#ffffff",
      },
    }),
    [level, margin, size]
  );

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setError("");

      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!hasValue) {
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      setIsGenerating(true);
      try {
        const QRCode = (await import("qrcode")).default;
        await QRCode.toCanvas(canvas, value, options);
      } catch (e) {
        if (!cancelled) {
          setError(
            e instanceof Error ? e.message : t("tools.qr-code-generator.ui.errors.generic")
          );
        }
      } finally {
        if (!cancelled) setIsGenerating(false);
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [hasValue, options, t, value]);

  const handleClear = () => setValue("");

  const handleDownloadPng = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !hasValue) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      downloadBlob("qr-code.png", blob);
    }, "image/png");
  }, [hasValue]);

  const handleDownloadSvg = useCallback(async () => {
    if (!hasValue) return;
    try {
      const QRCode = (await import("qrcode")).default;
      const svg = await QRCode.toString(value, { ...options, type: "svg" });
      downloadBlob("qr-code.svg", new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
    } catch (e) {
      setError(e instanceof Error ? e.message : t("tools.qr-code-generator.ui.errors.generic"));
    }
  }, [hasValue, options, t, value]);

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <Label className="text-sm font-medium text-slate-700">
            {t("tools.qr-code-generator.ui.inputLabel")}
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClear}
            disabled={!value}
            className="h-8"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {t("tools.qr-code-generator.ui.clear")}
          </Button>
        </div>

        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={t("tools.qr-code-generator.ui.placeholder")}
          className="min-h-[120px] font-mono text-sm"
        />

        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-slate-500">
            {t("tools.qr-code-generator.ui.characters", { count: value.length })}
          </p>
          <CopyButton
            text={value}
            variant="outline"
            size="sm"
            className="h-7"
          />
        </div>
      </div>

      {/* Options */}
      <div className="grid gap-3 md:grid-cols-2">
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
          <Label className="text-sm text-slate-700">
            {t("tools.qr-code-generator.ui.errorCorrection")}
          </Label>
          <Select value={level} onValueChange={(v) => setLevel(v as ECLevel)}>
            <SelectTrigger className="w-36 h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="L">L (7%)</SelectItem>
              <SelectItem value="M">M (15%)</SelectItem>
              <SelectItem value="Q">Q (25%)</SelectItem>
              <SelectItem value="H">H (30%)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <Label className="text-sm text-slate-700">
              {t("tools.qr-code-generator.ui.size")}
            </Label>
            <span className="text-sm font-mono bg-white px-2 py-0.5 rounded text-slate-700 border border-slate-200">
              {size}px
            </span>
          </div>
          <div className="pt-3">
            <Slider
              value={[size]}
              onValueChange={(v: number[]) => setSize(v[0])}
              min={128}
              max={512}
              step={16}
              className="w-full"
            />
          </div>
        </div>

        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 md:col-span-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm text-slate-700">
              {t("tools.qr-code-generator.ui.margin")}
            </Label>
            <span className="text-sm font-mono bg-white px-2 py-0.5 rounded text-slate-700 border border-slate-200">
              {margin}
            </span>
          </div>
          <div className="pt-3">
            <Slider
              value={[margin]}
              onValueChange={(v: number[]) => setMargin(v[0])}
              min={0}
              max={8}
              step={1}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-100 rounded-xl">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Preview */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <Label className="text-sm font-medium text-slate-700">
            {t("tools.qr-code-generator.ui.preview")}
          </Label>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDownloadSvg}
              disabled={!hasValue || isGenerating}
              className="h-7"
            >
              <Download className="w-4 h-4 mr-2" />
              {t("tools.qr-code-generator.ui.downloadSvg")}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDownloadPng}
              disabled={!hasValue || isGenerating}
              className="h-7"
            >
              <Download className="w-4 h-4 mr-2" />
              {t("tools.qr-code-generator.ui.downloadPng")}
            </Button>
          </div>
        </div>

        <div className="border border-slate-200 rounded-2xl bg-white p-6 flex items-center justify-center min-h-[280px]">
          {!hasValue ? (
            <div className="text-center">
              <div className="text-sm text-slate-600 font-medium">
                {t("tools.qr-code-generator.ui.emptyTitle")}
              </div>
              <p className="text-sm text-slate-500 mt-1">
                {t("tools.qr-code-generator.ui.emptyBody")}
              </p>
            </div>
          ) : (
            <canvas
              ref={canvasRef}
              width={size}
              height={size}
              className="rounded-xl border border-slate-100"
            />
          )}
        </div>
      </div>

      {/* Privacy */}
      <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-sm text-green-800">
        <strong>{t("tools.qr-code-generator.ui.privacyTitle")}</strong>{" "}
        {t("tools.qr-code-generator.ui.privacyBody")}
      </div>
    </div>
  );
}

