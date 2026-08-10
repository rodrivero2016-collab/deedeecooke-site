// Lightweight, dependency-free session auth for the private Content Studio.
// This is intentionally simple: one shared password (set in .env.local as
// STUDIO_PASSWORD), protecting a single admin area used by JC (and later
// Dee Dee). It is NOT a multi-user auth system — for a real production
// rollout with per-person logins, swap this for NextAuth or Clerk.
//
// Uses the Web Crypto API (not Node's `crypto` module) because this file is
// imported by middleware.ts, which runs in the Edge Runtime.

const SECRET = process.env.SESSION_SECRET || process.env.STUDIO_PASSWORD || "dev-secret-change-me";
export const SESSION_COOKIE_NAME = "ddc_studio_session";

async function hmac(value: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return Buffer.from(signature).toString("hex");
}

export async function createSessionToken(): Promise<string> {
  const payload = `authenticated.${Date.now()}`;
  const signature = await hmac(payload);
  return Buffer.from(`${payload}.${signature}`).toString("base64url");
}

export async function isValidSessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const parts = decoded.split(".");
    const signature = parts.pop();
    const payload = parts.join(".");
    if (!signature) return false;
    const expected = await hmac(payload);
    if (expected !== signature) return false;
    if (!payload.startsWith("authenticated.")) return false;
    const issuedAt = Number(payload.split(".")[1]);
    const THIRTY_DAYS = 1000 * 60 * 60 * 24 * 30;
    return Date.now() - issuedAt < THIRTY_DAYS;
  } catch {
    return false;
  }
}

export function checkStudioPassword(candidate: string): boolean {
  const expected = process.env.STUDIO_PASSWORD;
  if (!expected) {
    // No password configured yet — fail closed rather than leaving the
    // studio wide open. Set STUDIO_PASSWORD in .env.local.
    return false;
  }
  return candidate === expected;
}
