// lib/crypto.ts
// Cryptographically secure random utilities (browser-first)

export type CharsetKey =
  | "lowercase"
  | "uppercase"
  | "numbers"
  | "symbols"
  | "hex"
  | "alphanumeric";

export const CHARSETS: Record<CharsetKey, string> = {
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
  hex: "0123456789abcdef",
  alphanumeric: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
};

function assertBrowserCrypto(): Crypto {
  // In Next.js, this module should be used from Client Components.
  // This guard gives a clearer error if imported/used on the server.
  if (typeof globalThis === "undefined" || !("crypto" in globalThis) || !globalThis.crypto?.getRandomValues) {
    throw new Error("crypto.getRandomValues is not available. Use this only in the browser (Client Components).");
  }
  return globalThis.crypto;
}

export function getRandomBytes(length: number): Uint8Array {
  if (!Number.isFinite(length) || length <= 0) throw new Error("length must be a positive number");
  const bytes = new Uint8Array(length);
  assertBrowserCrypto().getRandomValues(bytes);
  return bytes;
}

/**
 * Uniform random integer in [0, maxExclusive)
 * Uses rejection sampling to avoid modulo bias.
 */
export function getRandomInt(maxExclusive: number): number {
  if (!Number.isFinite(maxExclusive) || maxExclusive <= 0) {
    throw new Error("maxExclusive must be a positive number");
  }
  if (maxExclusive === 1) return 0;

  // We draw 32-bit unsigned ints and reject values that would bias modulo.
  const cryptoObj = assertBrowserCrypto();
  const uint32Max = 0x100000000; // 2^32
  const limit = uint32Max - (uint32Max % maxExclusive);

  const buf = new Uint32Array(1);
  let x: number;
  do {
    cryptoObj.getRandomValues(buf);
    x = buf[0]!;
  } while (x >= limit);

  return x % maxExclusive;
}

/**
 * Uniform random integer in [min, maxInclusive]
 */
export function getRandomIntRange(min: number, maxInclusive: number): number {
  if (!Number.isFinite(min) || !Number.isFinite(maxInclusive)) throw new Error("min/max must be numbers");
  if (maxInclusive < min) throw new Error("maxInclusive must be >= min");
  const span = maxInclusive - min + 1;
  return min + getRandomInt(span);
}

export function getRandomString(length: number, charset: string): string {
  if (!charset || charset.length === 0) throw new Error("charset must be non-empty");
  if (!Number.isFinite(length) || length < 0) throw new Error("length must be >= 0");

  let out = "";
  for (let i = 0; i < length; i++) {
    out += charset[getRandomInt(charset.length)];
  }
  return out;
}

export function getRandomHex(bytes: number): string {
  const arr = getRandomBytes(bytes);
  let hex = "";
  for (let i = 0; i < arr.length; i++) {
    hex += arr[i]!.toString(16).padStart(2, "0");
  }
  return hex;
}

// Convert Uint8Array -> base64 safely
function bytesToBase64(bytes: Uint8Array): string {
  // For small buffers (<= 64 bytes typical here), this is fine.
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]!);
  return btoa(binary);
}

export function getRandomBase64(bytes: number): string {
  return bytesToBase64(getRandomBytes(bytes));
}

export function getRandomBase64Url(bytes: number): string {
  return getRandomBase64(bytes)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

/**
 * RFC 4122 UUID v4 (browser crypto)
 */
export function generateUUIDv4(): string {
  const bytes = getRandomBytes(16);
  // Version 4
  bytes[6] = (bytes[6]! & 0x0f) | 0x40;
  // Variant 10xxxxxx
  bytes[8] = (bytes[8]! & 0x3f) | 0x80;

  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}