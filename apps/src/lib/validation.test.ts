import { describe, expect, it } from "vitest";
import { validateLeadSubmission, cleanThaiPhone } from "./validation";

describe("Lead Submission Validation", () => {
  it("normalizes and validates valid Thai phone numbers", () => {
    expect(cleanThaiPhone("089-123-4567")).toBe("0891234567");
    expect(cleanThaiPhone("089 123 4567")).toBe("0891234567");
    expect(cleanThaiPhone("+66891234567")).toBe("0891234567");
  });

  it("accepts valid submission payload", () => {
    const valid = {
      customerName: "คุณสมชาย ใจดี",
      phoneNumber: "0891234567",
      lineId: "somchai.j",
      propertyType: "CONDO",
      areaSqm: 35,
      selectedZones: ["LIVING", "BEDROOM"],
      materialGrade: "PREMIUM",
    };

    const result = validateLeadSubmission(valid);
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it("rejects missing customer name or invalid phone number", () => {
    const invalid = {
      customerName: "",
      phoneNumber: "12345",
      propertyType: "CONDO",
      areaSqm: 35,
      selectedZones: ["LIVING"],
      materialGrade: "STANDARD",
    };

    const result = validateLeadSubmission(invalid);
    expect(result.isValid).toBe(false);
    expect(result.errors.customerName).toBeDefined();
    expect(result.errors.phoneNumber).toBeDefined();
  });

  it("rejects empty decoration zones", () => {
    const invalidZones = {
      customerName: "สมชาย",
      phoneNumber: "0891234567",
      propertyType: "CONDO",
      areaSqm: 35,
      selectedZones: [],
      materialGrade: "STANDARD",
    };

    const result = validateLeadSubmission(invalidZones);
    expect(result.isValid).toBe(false);
    expect(result.errors.selectedZones).toBeDefined();
  });
});
