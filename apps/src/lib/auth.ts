export const SESSION_COOKIE_NAME = "craftspace_admin_session";
export const DEFAULT_ADMIN_PASSCODE = "craftspace2026";

export function getAdminPasscode(): string {
  return process.env.ADMIN_PASSCODE || DEFAULT_ADMIN_PASSCODE;
}

export function getAuthSecret(): string {
  return process.env.ADMIN_SECRET || getAdminPasscode();
}

/**
 * Validates provided studio passcode
 */
export function verifyPasscode(input: string): boolean {
  if (!input) return false;
  return input.trim() === getAdminPasscode().trim();
}

/**
 * Generates HMAC SHA-256 hex digest using Web Crypto (Edge + Node compatible)
 */
async function computeHmacSha256(
  secret: string,
  data: string,
): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  const hashArray = Array.from(new Uint8Array(signature));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Creates a cryptographically signed session token: {timestamp}.{signature}
 */
export async function createSessionToken(): Promise<string> {
  const timestamp = Date.now().toString();
  const secret = getAuthSecret();
  const signature = await computeHmacSha256(secret, timestamp);
  return `${timestamp}.${signature}`;
}

/**
 * Validates a signed session token. Checks signature and expiration (default 7 days).
 */
export async function verifySessionToken(
  token: string | undefined | null,
  maxAgeMs: number = 1000 * 60 * 60 * 24 * 7, // 7 days
): Promise<boolean> {
  if (!token || typeof token !== "string") return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [timestampStr, expectedSignature] = parts;
  const timestamp = Number(timestampStr);

  if (Number.isNaN(timestamp)) return false;

  // Check expiration
  const now = Date.now();
  if (now - timestamp > maxAgeMs || timestamp > now + 60000) {
    return false;
  }

  const secret = getAuthSecret();
  const validSignature = await computeHmacSha256(secret, timestampStr);

  return expectedSignature === validSignature;
}
