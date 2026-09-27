import { describe, expect, it } from "vitest";
import { generateRefCode, isValidRefCode, REF_CODE_ALPHABET } from "./refCode";

describe("Ref ID Generation and Validation (ADR 0004)", () => {
  it("generates ref code in #CS-YYMM-XXXX format", () => {
    const fixedDate = new Date("2026-09-27T08:00:00Z");
    const code = generateRefCode(fixedDate);

    expect(code).toMatch(/^#CS-2609-[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{4}$/);
    expect(code.length).toBe(13); // #CS-YYMM-XXXX = 13 characters
  });

  it("never includes ambiguous characters (0, O, 1, I, l)", () => {
    // Generate 500 codes to ensure random alphabet constraints
    for (let i = 0; i < 500; i++) {
      const code = generateRefCode();
      const randomPart = code.slice(9);
      expect(randomPart).not.toMatch(/[01IOlio]/);
      for (const char of randomPart) {
        expect(REF_CODE_ALPHABET.includes(char)).toBe(true);
      }
    }
  });

  it("correctly validates valid and invalid ref codes", () => {
    expect(isValidRefCode("#CS-2609-7X2K")).toBe(true);
    expect(isValidRefCode("CS-2609-7X2K")).toBe(true); // handles without leading hash
    expect(isValidRefCode("#CS-2609-082")).toBe(false); // contains 0 and only 3 chars
    expect(isValidRefCode("#CS-2609-1234")).toBe(false); // contains 1
    expect(isValidRefCode("#CS-2609-XXXXX")).toBe(false); // too long
  });
});
