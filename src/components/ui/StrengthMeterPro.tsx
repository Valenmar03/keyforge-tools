"use client";

import { cn } from "@/lib/utils";

type StrengthLevel = {
  label: string;
  textClass: string;
  activeClass: string;
  segments: number; // 0..5
};

function levelFromEntropyBits(bits: number): StrengthLevel {
  // Rangos razonables (aprox) usados en muchas apps:
  // < 28 muy débil, < 36 débil, < 60 ok, < 128 fuerte, >= 128 muy fuerte
  if (!Number.isFinite(bits) || bits <= 0) {
    return {
      label: "—",
      textClass: "text-slate-600",
      activeClass: "bg-slate-400",
      segments: 0,
    };
  }

  if (bits < 28)
    return {
      label: "Very Weak",
      textClass: "text-red-600",
      activeClass: "bg-red-500",
      segments: 1,
    };

  if (bits < 36)
    return {
      label: "Weak",
      textClass: "text-orange-600",
      activeClass: "bg-orange-500",
      segments: 2,
    };

  if (bits < 60)
    return {
      label: "Reasonable",
      textClass: "text-yellow-600",
      activeClass: "bg-yellow-500",
      segments: 3,
    };

  if (bits < 128)
    return {
      label: "Strong",
      textClass: "text-lime-600",
      activeClass: "bg-lime-500",
      segments: 4,
    };

  return {
    label: "Very Strong",
    textClass: "text-green-600",
    activeClass: "bg-green-500",
    segments: 5,
  };
}

function humanCrackTime(bits: number): string {
  // Estimación MUY aproximada (online rate-limited vs offline GPU cambia muchísimo).
  // Solo para dar intuición.
  if (!Number.isFinite(bits) || bits <= 0) return "N/A";
  if (bits < 20) return "seconds";
  if (bits < 28) return "minutes";
  if (bits < 36) return "hours–days";
  if (bits < 60) return "weeks–months";
  if (bits < 80) return "years";
  if (bits < 128) return "centuries";
  return "practically impossible";
}

export type StrengthMeterProProps = {
  entropyBits: number; // bits reales
  className?: string;
  showCrackTime?: boolean;
};

export function StrengthMeterPro({
  entropyBits,
  className,
  showCrackTime = true,
}: StrengthMeterProProps) {
  const clampedBits = Math.max(0, entropyBits || 0);
  const level = levelFromEntropyBits(clampedBits);

  // Barra continua opcional (0..128 cap) para animación suave
  const widthPct = Math.min(100, (clampedBits / 128) * 100);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className={cn("text-sm font-medium", level.textClass)}>
            {level.label}
          </span>
          <span className="text-xs text-slate-500 font-mono">
            {Math.round(clampedBits)} bits
          </span>
        </div>

        {showCrackTime && (
          <span className="text-xs text-slate-500">
            Est. crack:{" "}
            <span className="font-medium text-slate-700">
              {humanCrackTime(clampedBits)}
            </span>
          </span>
        )}
      </div>

      {/* Segmented bar */}
      <div className="grid grid-cols-5 gap-1">
        {Array.from({ length: 5 }).map((_, i) => {
          const active = i < level.segments;
          return (
            <div
              key={i}
              className={cn(
                "h-2 rounded-full",
                active ? level.activeClass : "bg-slate-200"
              )}
            />
          );
        })}
      </div>

      {/* Smooth bar (extra, queda pro) */}
      <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <div
          className={cn("h-full transition-all duration-300", level.activeClass)}
          style={{ width: `${widthPct}%` }}
        />
      </div>
    </div>
  );
}