"use client";

import React, { useMemo, useState } from "react";
import { Eye, EyeOff, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StrengthMeterPro } from "@/components/ui/StrengthMeterPro";

/* -----------------------------
   Better dictionary & patterns
------------------------------ */

const COMMON_WORDS = [
  // auth/admin
  "password","pass","passwd","admin","administrator","root","user","login","guest","test","testing",
  "default","qwerty","asdf","zxcv","welcome","letmein","iloveyou","monkey","dragon","master","shadow",
  "sunshine","princess","freedom","hello","whatever","trustno1",
  // services/common
  "google","facebook","instagram","twitter","tiktok","linkedin","youtube","gmail","hotmail","outlook",
  // names (basic)
  "michael","john","jessica","daniel","ashley","jennifer","joshua","matthew","andrew","james","robert",
  // spanish/latam common
  "hola","mundo","contrasena","contraseña","clave","secreto","seguro","usuario","bienvenido","bienvenida",
  "administrador","qwertyuiop","asdfghjkl","zxcvbnm",
];

const KEYBOARD_PATTERNS = [
  "qwerty","qwertyuiop","asdfgh","asdfghjkl","zxcvbn","zxcvbnm",
  "qazwsx","1q2w3e","12345","123456","1234567","12345678","654321",
];

const MONTHS = [
  "january","february","march","april","may","june","july","august","september","october","november","december",
  "enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","setiembre","octubre","noviembre","diciembre",
];

const SEASONS = ["spring","summer","autumn","fall","winter","primavera","verano","otonio","otoño","invierno"];

const DAYS = [
  "monday","tuesday","wednesday","thursday","friday","saturday","sunday",
  "lunes","martes","miercoles","miércoles","jueves","viernes","sabado","sábado","domingo",
];

function normalizeLeet(input: string): string {
  const map: Record<string, string> = {
    "@": "a", "4": "a",
    "$": "s", "5": "s",
    "0": "o",
    "1": "i", "!": "i", "|": "i",
    "3": "e",
    "7": "t", "+": "t",
    "2": "z",
    "8": "b",
  };

  return input
    .toLowerCase()
    .split("")
    .map((ch) => map[ch] ?? ch)
    .join("");
}

function stripSeparators(input: string): string {
  return input.toLowerCase().replace(/[\s._\-]+/g, "");
}

function containsYearOrDateish(pwd: string): boolean {
  const lower = pwd.toLowerCase();

  // años típicos
  if (/\b(19[5-9]\d|20[0-3]\d)\b/.test(lower)) return true;

  // cualquier 4 dígitos con pinta de año
  if (/\b(19\d{2}|20\d{2})\b/.test(lower)) return true;

  // ddmmaa / ddmmaaaa / etc
  if (/\b\d{6,8}\b/.test(lower)) return true;

  return false;
}

function containsMonthSeasonDay(pwd: string): boolean {
  const compact = stripSeparators(normalizeLeet(pwd));
  return (
    MONTHS.some((m) => compact.includes(stripSeparators(m))) ||
    SEASONS.some((m) => compact.includes(stripSeparators(m))) ||
    DAYS.some((m) => compact.includes(stripSeparators(m)))
  );
}

function looksLikeCommonWordWithSuffix(pwd: string): boolean {
  // ej: password123, admin2026!, welcome_01
  const lower = pwd.toLowerCase();
  const alphaPrefix = lower.match(/^[a-záéíóúñü]+/i)?.[0] ?? "";
  if (alphaPrefix.length < 4) return false;

  const normalizedPrefix = normalizeLeet(alphaPrefix);

  // mejor: match por "includes" por si la lista tiene varias variantes
  return COMMON_WORDS.some((w) => normalizedPrefix.includes(w));
}

function containsCommonDictionaryPattern(
  pwd: string
): { hit: boolean; reason?: string } {
  const lower = pwd.toLowerCase();
  const normalized = normalizeLeet(lower);
  const compact = stripSeparators(normalized);

  // direct common word / substring
  if (COMMON_WORDS.some((w) => compact.includes(stripSeparators(w)))) {
    return { hit: true, reason: "Contains common dictionary word" };
  }

  // keyboard patterns
  if (KEYBOARD_PATTERNS.some((p) => compact.includes(stripSeparators(p)))) {
    return { hit: true, reason: "Contains keyboard pattern" };
  }

  // month/season/day words
  if (containsMonthSeasonDay(pwd)) {
    return { hit: true, reason: "Contains month/season/day word" };
  }

  // year/date-ish
  if (containsYearOrDateish(pwd)) {
    return { hit: true, reason: "Contains year or date-like pattern" };
  }

  // word + suffix
  if (looksLikeCommonWordWithSuffix(normalized)) {
    return { hit: true, reason: "Looks like common word with suffix" };
  }

  // classic structure: letters + digits (+ optional symbols at end)
  if (/^[a-záéíóúñü]{4,}\d{2,}[^a-z0-9]*$/i.test(pwd)) {
    return { hit: true, reason: "Common pattern (word + numbers)" };
  }

  return { hit: false };
}

function checkSequential(str: string): boolean {
  const s = str.toLowerCase();
  for (let i = 0; i < s.length - 2; i++) {
    const c1 = s.charCodeAt(i);
    const c2 = s.charCodeAt(i + 1);
    const c3 = s.charCodeAt(i + 2);
    if (c2 - c1 === 1 && c3 - c2 === 1) return true;
    if (c1 - c2 === 1 && c2 - c3 === 1) return true;
  }
  return false;
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return "Instantly";
  if (seconds < 1) return "Instantly";
  if (seconds < 60) return `${Math.ceil(seconds)} seconds`;
  if (seconds < 3600) return `${Math.ceil(seconds / 60)} minutes`;
  if (seconds < 86400) return `${Math.ceil(seconds / 3600)} hours`;
  if (seconds < 31536000) return `${Math.ceil(seconds / 86400)} days`;
  if (seconds < 31536000 * 100) return `${Math.ceil(seconds / 31536000)} years`;
  if (seconds < 31536000 * 1e6)
    return `${Math.ceil(seconds / 31536000 / 1000)}k years`;
  return "Centuries+";
}

function estimateTimeToCrack(poolSize: number, length: number): string {
  if (poolSize <= 0 || length <= 0) return "Instantly";

  const log10Combos = length * Math.log10(poolSize);

  const guessesPerSecond = 1e10;
  const log10GuessesPerSecond = Math.log10(guessesPerSecond);

  const log10Seconds =
    log10Combos - log10GuessesPerSecond - Math.log10(2);

  if (log10Seconds > 12) return "Centuries+";

  const seconds = Math.pow(10, log10Seconds);
  return formatTime(seconds);
}

type Analysis = {
  score: number;
  entropyBits: number;
  poolSize: number;
  timeToCrack: string;
  issues: string[];
  strengths: string[];
};

export default function PasswordStrengthChecker() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const analysis: Analysis | null = useMemo(() => {
    if (!password) return null;

    const issues: string[] = [];
    const strengths: string[] = [];

    // length
    if (password.length < 8) issues.push("Too short (minimum 8 characters)");
    else if (password.length >= 16) strengths.push(`Good length (${password.length} characters)`);
    else if (password.length >= 12) strengths.push(`Decent length (${password.length} characters)`);

    // variety
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[^a-zA-Z0-9]/.test(password);

    let poolSize = 0;
    if (hasLower) poolSize += 26;
    if (hasUpper) poolSize += 26;
    if (hasNumber) poolSize += 10;
    if (hasSymbol) poolSize += 32;
    if (poolSize === 0) poolSize = 26;

    if (!hasLower) issues.push("Missing lowercase letters");
    else strengths.push("Contains lowercase");

    if (!hasUpper) issues.push("Missing uppercase letters");
    else strengths.push("Contains uppercase");

    if (!hasNumber) issues.push("Missing numbers");
    else strengths.push("Contains numbers");

    if (!hasSymbol) issues.push("Missing special characters");
    else strengths.push("Contains symbols");

    // dictionary/pattern hit (improved)
    const dictHit = containsCommonDictionaryPattern(password);
    if (dictHit.hit) issues.push(dictHit.reason ?? "Contains common password pattern");

    // repeats
    if (/(.)\1{2,}/.test(password)) issues.push("Contains repeated characters");

    // sequential
    if (checkSequential(password)) issues.push("Contains sequential characters (abc, 123)");

    // entropy
    const entropyBits = Math.log2(poolSize) * password.length;

    // base score: 128 bits => 100
    let score = Math.min(100, (entropyBits / 128) * 100);

    // penalties
    let penalty = 0;
    penalty += issues.length * 8;
    if (dictHit.hit) penalty += 20;
    if (password.length < 12) penalty += 8;
    if (!hasSymbol) penalty += 4;

    score = Math.max(0, score - penalty);

    const timeToCrack = estimateTimeToCrack(poolSize, password.length);

    return {
      score,
      entropyBits,
      poolSize,
      timeToCrack,
      issues,
      strengths,
    };
  }, [password]);

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter a password to check..."
          className="pr-12 h-14 text-lg"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setShowPassword((v) => !v)}
          className="absolute right-2 top-1/2 -translate-y-1/2"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </Button>
      </div>

      {/* Results */}
      {analysis && (
        <div className="space-y-6">
          {/* Strength Meter */}
          <StrengthMeterPro entropyBits={analysis.entropyBits} />

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-slate-900">
                {analysis.entropyBits.toFixed(1)}
              </div>
              <div className="text-xs text-slate-500 mt-1">Entropy Bits</div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-slate-900">
                {password.length}
              </div>
              <div className="text-xs text-slate-500 mt-1">Characters</div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 text-center">
              <div className="text-lg font-bold text-slate-900 leading-tight">
                {analysis.timeToCrack}
              </div>
              <div className="text-xs text-slate-500 mt-1">Time to Crack</div>
            </div>
          </div>

          {/* Issues */}
          {analysis.issues.length > 0 && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <span className="font-medium text-red-800">Issues Found</span>
              </div>
              <ul className="space-y-1">
                {analysis.issues.map((issue, i) => (
                  <li key={i} className="text-sm text-red-700 flex items-start gap-2">
                    <span className="text-red-400">•</span>
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Strengths */}
          {analysis.strengths.length > 0 && (
            <div className="bg-green-50 border border-green-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="font-medium text-green-800">Strengths</span>
              </div>
              <ul className="space-y-1">
                {analysis.strengths.map((strength, i) => (
                  <li key={i} className="text-sm text-green-700 flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    {strength}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Privacy Note */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl">
        <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <p className="text-sm text-blue-800">
          Your password is analyzed locally in your browser. It is never sent to any server or stored anywhere.
        </p>
      </div>
    </div>
  );
}