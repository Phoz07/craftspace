import { describe, expect, it } from "vitest";
import { PORTFOLIO_PROJECTS } from "./portfolio";

describe("Portfolio Data and Filtering Contracts", () => {
  it("contains exactly 6 verified studio projects", () => {
    expect(PORTFOLIO_PROJECTS).toHaveLength(6);
  });

  it("covers all 3 property categories and all 3 design styles", () => {
    const propertyTypes = new Set(
      PORTFOLIO_PROJECTS.map((p) => p.propertyType)
    );
    const styles = new Set(PORTFOLIO_PROJECTS.map((p) => p.style));

    expect(propertyTypes.has("CONDO")).toBe(true);
    expect(propertyTypes.has("TOWNHOME")).toBe(true);
    expect(propertyTypes.has("HOUSE")).toBe(true);

    expect(styles.has("JAPANDI")).toBe(true);
    expect(styles.has("LUXURY")).toBe(true);
    expect(styles.has("CLASSIC")).toBe(true);
  });

  it("ensures every project has positive area, duration, and realistic budget exceeding floor price", () => {
    PORTFOLIO_PROJECTS.forEach((project) => {
      expect(project.areaSqm).toBeGreaterThan(0);
      expect(project.durationDays).toBeGreaterThan(0);
      expect(project.actualBudget).toBeGreaterThanOrEqual(120_000);
      expect(project.imageUrl).toMatch(/^https?:\/\//);
    });
  });
});
