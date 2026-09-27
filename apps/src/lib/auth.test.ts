import { describe, expect, it } from "vitest";
import {
  createSessionToken,
  DEFAULT_ADMIN_PASSCODE,
  verifyPasscode,
  verifySessionToken,
} from "./auth";

describe("Admin Passcode Authentication and Session Tokens", () => {
  it("verifies the default studio passcode correctly", () => {
    expect(verifyPasscode(DEFAULT_ADMIN_PASSCODE)).toBe(true);
    expect(verifyPasscode("wrong-code")).toBe(false);
    expect(verifyPasscode("")).toBe(false);
  });

  it("creates and verifies a valid cryptographic session token", async () => {
    const token = await createSessionToken();
    expect(typeof token).toBe("string");
    expect(token).toContain(".");

    const isValid = await verifySessionToken(token);
    expect(isValid).toBe(true);
  });

  it("rejects tampered or malformed tokens", async () => {
    const token = await createSessionToken();
    const tampered = token.slice(0, -3) + "xyz";

    expect(await verifySessionToken(tampered)).toBe(false);
    expect(await verifySessionToken("malformed-token")).toBe(false);
    expect(await verifySessionToken("")).toBe(false);
    expect(await verifySessionToken(null)).toBe(false);
  });

  it("rejects expired tokens", async () => {
    // Session token generated with an expired timestamp (e.g. 10 days ago)
    const oldTimestamp = (Date.now() - 1000 * 60 * 60 * 24 * 10).toString();
    const token = await createSessionToken();
    const [, sig] = token.split(".");
    const expiredToken = `${oldTimestamp}.${sig}`;

    expect(await verifySessionToken(expiredToken)).toBe(false);
  });
});
