export const REF_CODE_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

/**
 * Generates an obfuscated Reference Code in format `#CS-YYMM-XXXX`
 * using the unambiguous 30-character alphabet (30^4 = 810,000 combinations per month)
 * as specified in ADR 0004.
 */
export function generateRefCode(date: Date = new Date()): string {
  const yy = String(date.getFullYear()).slice(-2);
  const mm = String(date.getMonth() + 1).padStart(2, "0");

  let randomPart = "";
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * REF_CODE_ALPHABET.length);
    randomPart += REF_CODE_ALPHABET[randomIndex];
  }

  return `#CS-${yy}${mm}-${randomPart}`;
}

/**
 * Validates whether a reference code conforms to the CraftSpace standard.
 */
export function isValidRefCode(code: string): boolean {
  if (!code) return false;
  const cleanCode = code.startsWith("#") ? code.slice(1) : code;
  const regex = /^CS-\d{4}-[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{4}$/;
  return regex.test(cleanCode);
}

/**
 * Normalizes a reference code into standard `#CS-YYMM-XXXX` format.
 */
export function normalizeRefCode(code: string): string {
  if (!code) return "";
  return code.startsWith("#") ? code : `#${code}`;
}
