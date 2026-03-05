"use client";

import React, { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CopyButton } from "@/components/ui/CopyButton";
import { cn } from "@/lib/utils";

type DecodedJwt =
  | {
      error: string;
    }
  | {
      header: Record<string, unknown>;
      payload: Record<string, any>;
      signature: string;
      expirationStatus: null | {
        expired: boolean;
        date: Date;
        remainingMs: number;
      };
    };

function base64UrlDecode(input: string): string {
  // padding
  let str = input;
  const pad = str.length % 4;
  if (pad) str += "=".repeat(4 - pad);

  // url-safe -> standard
  str = str.replace(/-/g, "+").replace(/_/g, "/");

  try {
    // decode UTF-8 safely
    return decodeURIComponent(
      atob(str)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
  } catch {
    // fallback for non-utf8 payloads
    return atob(str);
  }
}

type ExpirationStatus = {
    expired: boolean;
    date: Date;
    remainingMs: number;
  } | null;

function formatJson(obj: unknown): string {
  return JSON.stringify(obj, null, 2);
}

function formatUnixSeconds(timestamp?: number): string {
  if (!timestamp || Number.isNaN(timestamp)) return "N/A";
  return new Date(timestamp * 1000).toLocaleString();
}

export default function JwtDecoder() {
  const [jwt, setJwt] = useState<string>("");

  const decoded = useMemo<DecodedJwt | null>(() => {
    const raw = jwt.trim();
    if (!raw) return null;

    const parts = raw.split(".");
    if (parts.length !== 3) {
      return { error: "Invalid JWT format. A JWT should have 3 parts separated by dots." };
    }

    try {
      const header = JSON.parse(base64UrlDecode(parts[0])) as Record<string, unknown>;
      const payload = JSON.parse(base64UrlDecode(parts[1])) as Record<string, any>;
      const signature = parts[2];
      
      let expirationStatus: ExpirationStatus = null;

      if (payload?.exp) {
        const expDate = new Date(Number(payload.exp) * 1000);
        const now = new Date();
        expirationStatus = {
          expired: expDate < now,
          date: expDate,
          remainingMs: expDate.getTime() - now.getTime(),
        };
      }

      return { header, payload, signature, expirationStatus };
    } catch {
      return { error: "Failed to decode JWT. The token may be malformed." };
    }
  }, [jwt]);

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-slate-700">JWT Token</Label>
        <Textarea
          value={jwt}
          onChange={(e) => setJwt(e.target.value)}
          placeholder="Paste your JWT token here (eyJhbGciOiJIUzI1NiIs...)"
          className="font-mono text-sm min-h-[100px]"
        />
      </div>

      {/* Error */}
      {decoded && "error" in decoded && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{decoded.error}</p>
        </div>
      )}

      {/* Decoded Output */}
      {decoded && !("error" in decoded) && (
        <div className="space-y-4">
          {/* Expiration */}
          {decoded.expirationStatus && (
            <div
              className={cn(
                "flex items-center gap-3 p-4 rounded-xl border",
                decoded.expirationStatus.expired
                  ? "bg-red-50 border-red-100"
                  : "bg-green-50 border-green-100"
              )}
            >
              {decoded.expirationStatus.expired ? (
                <>
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <div>
                    <p className="font-medium text-red-800">Token Expired</p>
                    <p className="text-sm text-red-700">
                      Expired on {decoded.expirationStatus.date.toLocaleString()}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="font-medium text-green-800">Token Valid</p>
                    <p className="text-sm text-green-700">
                      Expires on {decoded.expirationStatus.date.toLocaleString()}
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                Header
              </Label>
              <CopyButton text={formatJson(decoded.header)} variant="ghost" size="sm" />
            </div>
            <pre className="bg-slate-900 rounded-xl p-4 overflow-x-auto">
              <code className="text-sm text-green-400">{formatJson(decoded.header)}</code>
            </pre>
          </div>

          {/* Payload */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-violet-500" />
                Payload
              </Label>
              <CopyButton text={formatJson(decoded.payload)} variant="ghost" size="sm" />
            </div>
            <pre className="bg-slate-900 rounded-xl p-4 overflow-x-auto">
              <code className="text-sm text-green-400">{formatJson(decoded.payload)}</code>
            </pre>
          </div>

          {/* Standard Claims */}
          <div className="bg-slate-50 rounded-xl p-4">
            <h4 className="font-medium text-slate-700 mb-3">Standard Claims</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              {[
                { key: "iss", label: "Issuer" },
                { key: "sub", label: "Subject" },
                { key: "aud", label: "Audience" },
                { key: "exp", label: "Expires", format: formatUnixSeconds },
                { key: "iat", label: "Issued At", format: formatUnixSeconds },
                { key: "nbf", label: "Not Before", format: formatUnixSeconds },
              ].map((claim) => (
                <div key={claim.key} className="bg-white rounded-lg p-2 border border-slate-200">
                  <div className="text-slate-500 text-xs mb-1">{claim.label}</div>
                  <div className="text-slate-900 font-mono text-xs truncate">
                    {decoded.payload?.[claim.key] ? (
                      claim.format ? (
                        claim.format(Number(decoded.payload[claim.key]))
                      ) : (
                        String(decoded.payload[claim.key])
                      )
                    ) : (
                      <span className="text-slate-400">Not set</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Signature */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              Signature
            </Label>
            <div className="bg-slate-100 rounded-xl p-4">
              <code className="text-xs text-slate-600 break-all">{decoded.signature}</code>
            </div>
          </div>
        </div>
      )}

      {/* Note */}
      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl">
        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="text-sm text-amber-800">
          <strong>Note:</strong> This tool only decodes the JWT—it does not verify the signature. Always verify
          signatures server-side before trusting token contents.
        </div>
      </div>
    </div>
  );
}