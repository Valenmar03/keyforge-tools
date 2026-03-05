"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyButton } from "@/components/ui/CopyButton";

type ParsedFromTimestamp = {
  date: Date;
  isMs: boolean;
  seconds: number;
  milliseconds: number;
  iso: string;
  utc: string;
  local: string;
  relative: string;
};

type ParsedFromDate = {
  seconds: number;
  milliseconds: number;
};

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

/** Local datetime for <input type="datetime-local">: YYYY-MM-DDTHH:mm */
function toLocalDatetimeInputValue(d: Date) {
  const yyyy = d.getFullYear();
  const mm = pad2(d.getMonth() + 1);
  const dd = pad2(d.getDate());
  const hh = pad2(d.getHours());
  const min = pad2(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}

/** Robust seconds/ms detection by magnitude */
function detectMillisOrSeconds(raw: number) {
  // Rough heuristic:
  // seconds now ~ 1.7e9, ms now ~ 1.7e12
  // If > 1e11 => definitely ms
  const isMs = Math.abs(raw) >= 1e11;
  return { isMs, msValue: isMs ? raw : raw * 1000 };
}

function getRelativeTime(target: Date, nowMs: number) {
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
  const diffMs = target.getTime() - nowMs;

  const abs = Math.abs(diffMs);
  const sign = diffMs < 0 ? -1 : 1;

  const units: Array<{ unit: Intl.RelativeTimeFormatUnit; ms: number }> = [
    { unit: "year", ms: 31536000000 },
    { unit: "month", ms: 2592000000 },
    { unit: "day", ms: 86400000 },
    { unit: "hour", ms: 3600000 },
    { unit: "minute", ms: 60000 },
    { unit: "second", ms: 1000 },
  ];

  for (const u of units) {
    if (abs >= u.ms) {
      const value = Math.floor(abs / u.ms) * sign;
      return rtf.format(value, u.unit);
    }
  }

  return rtf.format(0, "second");
}

export default function TimestampConverter() {
  const [timestamp, setTimestamp] = useState<string>("");
  const [dateInput, setDateInput] = useState<string>("");
  const [now, setNow] = useState<number>(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const setCurrentTime = () => {
    setTimestamp(String(Math.floor(Date.now() / 1000)));
  };

  const currentSeconds = Math.floor(now / 1000);
  const currentMs = now;

  const parsedFromTimestamp: ParsedFromTimestamp | null = useMemo(() => {
    const t = timestamp.trim();
    if (!t) return null;

    // allow leading +/-, strip spaces
    const raw = Number(t);
    if (!Number.isFinite(raw)) return null;

    const { isMs, msValue } = detectMillisOrSeconds(raw);
    const date = new Date(msValue);
    if (Number.isNaN(date.getTime())) return null;

    return {
      date,
      isMs,
      seconds: Math.floor(date.getTime() / 1000),
      milliseconds: date.getTime(),
      iso: date.toISOString(),
      utc: date.toUTCString(),
      local: date.toLocaleString(),
      relative: getRelativeTime(date, now),
    };
  }, [timestamp, now]);

  const parsedFromDate: ParsedFromDate | null = useMemo(() => {
    const d = dateInput.trim();
    if (!d) return null;

    const date = new Date(d);
    if (Number.isNaN(date.getTime())) return null;

    return {
      seconds: Math.floor(date.getTime() / 1000),
      milliseconds: date.getTime(),
    };
  }, [dateInput]);

  return (
    <div className="space-y-6">
      {/* Current Time */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            <span className="font-medium">Current Time</span>
          </div>

          <Button
            size="sm"
            variant="secondary"
            onClick={setCurrentTime}
            className="bg-white/20 hover:bg-white/30 text-white border-0"
          >
            Use Current
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <div className="text-white/70 text-sm mb-1">Unix (seconds)</div>
            <div className="font-mono text-2xl">{currentSeconds}</div>
          </div>
          <div>
            <div className="text-white/70 text-sm mb-1">Unix (milliseconds)</div>
            <div className="font-mono text-2xl">{currentMs}</div>
          </div>
        </div>
      </div>

      {/* Timestamp Input */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-slate-700">
          Convert Timestamp to Date
        </Label>

        <Input
          type="text"
          value={timestamp}
          onChange={(e) => setTimestamp(e.target.value)}
          placeholder="Enter Unix timestamp (seconds or milliseconds)..."
          className="font-mono"
          inputMode="numeric"
        />

        {parsedFromTimestamp && (
          <div className="bg-slate-50 rounded-xl p-4 space-y-3">
            <div className="grid md:grid-cols-2 gap-3">
              <div className="bg-white rounded-lg p-3 border border-slate-200">
                <div className="text-xs text-slate-500 mb-1">ISO 8601</div>
                <div className="font-mono text-sm text-slate-900 flex items-center justify-between gap-2">
                  <span className="truncate">{parsedFromTimestamp.iso}</span>
                  <CopyButton text={parsedFromTimestamp.iso} className="shrink-0" />
                </div>
              </div>

              <div className="bg-white rounded-lg p-3 border border-slate-200">
                <div className="text-xs text-slate-500 mb-1">UTC</div>
                <div className="font-mono text-sm text-slate-900 flex items-center justify-between gap-2">
                  <span className="truncate">{parsedFromTimestamp.utc}</span>
                  <CopyButton text={parsedFromTimestamp.utc} className="shrink-0" />
                </div>
              </div>

              <div className="bg-white rounded-lg p-3 border border-slate-200">
                <div className="text-xs text-slate-500 mb-1">Local Time</div>
                <div className="font-mono text-sm text-slate-900">
                  {parsedFromTimestamp.local}
                </div>
              </div>

              <div className="bg-white rounded-lg p-3 border border-slate-200">
                <div className="text-xs text-slate-500 mb-1">Relative</div>
                <div className="font-mono text-sm text-slate-900">
                  {parsedFromTimestamp.relative}
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              Detected format: {parsedFromTimestamp.isMs ? "milliseconds" : "seconds"}
            </p>
          </div>
        )}
      </div>

      {/* Date Input */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <Label className="text-sm font-medium text-slate-700">
          Convert Date to Timestamp
        </Label>

        <div className="flex gap-2">
          <Input
            type="datetime-local"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            className="flex-1"
          />

          <Button
            variant="outline"
            onClick={() => setDateInput(toLocalDatetimeInputValue(new Date()))}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Now
          </Button>
        </div>

        {parsedFromDate && (
          <div className="grid md:grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-lg p-3 flex items-center justify-between gap-3">
              <div>
                <div className="text-xs text-slate-500">Seconds</div>
                <div className="font-mono text-lg text-slate-900">
                  {parsedFromDate.seconds}
                </div>
              </div>
              <CopyButton text={String(parsedFromDate.seconds)} />
            </div>

            <div className="bg-slate-50 rounded-lg p-3 flex items-center justify-between gap-3">
              <div>
                <div className="text-xs text-slate-500">Milliseconds</div>
                <div className="font-mono text-lg text-slate-900">
                  {parsedFromDate.milliseconds}
                </div>
              </div>
              <CopyButton text={String(parsedFromDate.milliseconds)} />
            </div>
          </div>
        )}
      </div>

      {/* Quick Reference */}
      <div className="bg-slate-50 rounded-xl p-4">
        <h4 className="font-medium text-slate-700 text-sm mb-3">Quick Reference</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-white rounded-lg p-2 border border-slate-200">
            <span className="text-slate-500">Unix Epoch:</span>
            <span className="font-mono ml-2">Jan 1, 1970 00:00:00 UTC</span>
          </div>
          <div className="bg-white rounded-lg p-2 border border-slate-200">
            <span className="text-slate-500">Seconds vs MS:</span>
            <span className="font-mono ml-2">~1e9 vs ~1e12</span>
          </div>
        </div>
      </div>
    </div>
  );
}