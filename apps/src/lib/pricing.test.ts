import { describe, expect, it } from "vitest";
import {
  BASE_ZONE_COSTS,
  calculateEstimate,
  type EstimateInput,
  GRADE_MULTIPLIERS,
  getAreaScaleFactor,
  PROPERTY_MULTIPLIERS,
} from "./pricing";

describe("Pricing Engine Contract", () => {
  it("returns 0 for both min and max when no zones are selected (Guard Clause)", () => {
    const input: EstimateInput = {
      propertyType: "CONDO",
      areaSqm: 35,
      selectedZones: [],
      materialGrade: "STANDARD",
    };

    const result = calculateEstimate(input);
    expect(result.rawEstimate).toBe(0);
    expect(result.estimatedMin).toBe(0);
    expect(result.estimatedMax).toBe(0);
    expect(result.isZeroZone).toBe(true);
  });

  it("evaluates floor price ฿120,000 when raw estimate is below floor threshold", () => {
    // Only living room (45,000) in condo (1.0) <= 40 sqm (1.0) with standard (1.0)
    // RawEst = 45,000 * 1.0 * 1.0 * 1.0 = 45,000
    // FloorPrice is 120,000
    const input: EstimateInput = {
      propertyType: "CONDO",
      areaSqm: 30,
      selectedZones: ["LIVING"],
      materialGrade: "STANDARD",
    };

    const result = calculateEstimate(input);
    expect(result.rawEstimate).toBe(45000);
    expect(result.estimatedMin).toBe(120000);
    expect(result.estimatedMax).toBe(144000); // 120,000 * 1.20
    expect(result.isZeroZone).toBe(false);
  });

  it("calculates accurate price for standard condo with living and bedroom exceeding floor price", () => {
    // Living (45,000) + Bedroom (55,000) + Kitchen (65,000) = 165,000
    // Condo (1.0), 35 sqm (1.0), Premium (1.35)
    // RawEst = 165,000 * 1.0 * 1.35 * 1.0 = 222,750
    const input: EstimateInput = {
      propertyType: "CONDO",
      areaSqm: 35,
      selectedZones: ["LIVING", "BEDROOM", "KITCHEN"],
      materialGrade: "PREMIUM",
    };

    const result = calculateEstimate(input);
    expect(result.rawEstimate).toBe(222750);
    expect(result.estimatedMin).toBe(222750);
    expect(result.estimatedMax).toBe(267300); // 222,750 * 1.20
  });

  it("correctly applies Townhome multiplier (1.10) and area scale (1.15 for 75 sqm)", () => {
    // Zones: LIVING (45k) + BEDROOM (55k) + KITCHEN (65k) + SYSTEM (25k) = 190,000
    // Townhome: 1.10
    // Area 75 sqm: 1.15
    // Grade: LUXURY: 1.80
    // RawEst = 190,000 * 1.10 * 1.80 * 1.15 = 432,630
    const input: EstimateInput = {
      propertyType: "TOWNHOME",
      areaSqm: 75,
      selectedZones: ["LIVING", "BEDROOM", "KITCHEN", "SYSTEM"],
      materialGrade: "LUXURY",
    };

    const result = calculateEstimate(input);
    expect(result.rawEstimate).toBe(432630);
    expect(result.estimatedMin).toBe(432630);
    expect(result.estimatedMax).toBe(519156); // 432,630 * 1.20 = 519,156
  });

  it("correctly applies House multiplier (1.20) and area scale (1.45 for >150 sqm)", () => {
    // Zones: LIVING (45k) + BEDROOM (55k) = 100,000
    // House: 1.20
    // Area 180 sqm: 1.45
    // Grade: PREMIUM: 1.35
    // RawEst = 100,000 * 1.20 * 1.35 * 1.45 = 234,900
    const input: EstimateInput = {
      propertyType: "HOUSE",
      areaSqm: 180,
      selectedZones: ["LIVING", "BEDROOM"],
      materialGrade: "PREMIUM",
    };

    const result = calculateEstimate(input);
    expect(result.rawEstimate).toBe(234900);
    expect(result.estimatedMin).toBe(234900);
    expect(result.estimatedMax).toBe(281880); // 234,900 * 1.20
  });

  describe("Area Scale Factors", () => {
    it("returns correct factor for boundaries", () => {
      expect(getAreaScaleFactor(20)).toBe(1.0);
      expect(getAreaScaleFactor(40)).toBe(1.0);
      expect(getAreaScaleFactor(41)).toBe(1.15);
      expect(getAreaScaleFactor(80)).toBe(1.15);
      expect(getAreaScaleFactor(81)).toBe(1.3);
      expect(getAreaScaleFactor(150)).toBe(1.3);
      expect(getAreaScaleFactor(151)).toBe(1.45);
      expect(getAreaScaleFactor(250)).toBe(1.45);
    });
  });
});
