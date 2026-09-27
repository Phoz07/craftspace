export type PropertyType = "CONDO" | "TOWNHOME" | "HOUSE";
export type DecorationZoneKey = "LIVING" | "BEDROOM" | "KITCHEN" | "SYSTEM";
export type MaterialGradeKey = "STANDARD" | "PREMIUM" | "LUXURY";

export interface EstimateInput {
  propertyType: PropertyType;
  areaSqm: number;
  selectedZones: DecorationZoneKey[];
  materialGrade: MaterialGradeKey;
}

export interface EstimateResult {
  rawEstimate: number;
  estimatedMin: number;
  estimatedMax: number;
  isFloorPriceApplied: boolean;
  isZeroZone: boolean;
  breakdown: {
    propertyMultiplier: number;
    areaScaleFactor: number;
    gradeMultiplier: number;
    baseZoneTotal: number;
  };
}

export const FLOOR_PRICE = 120_000;

export const PROPERTY_MULTIPLIERS: Record<PropertyType, number> = {
  CONDO: 1.0,
  TOWNHOME: 1.1,
  HOUSE: 1.2,
};

export const GRADE_MULTIPLIERS: Record<MaterialGradeKey, number> = {
  STANDARD: 1.0,
  PREMIUM: 1.35,
  LUXURY: 1.8,
};

export const BASE_ZONE_COSTS: Record<DecorationZoneKey, number> = {
  LIVING: 45_000,
  BEDROOM: 55_000,
  KITCHEN: 65_000,
  SYSTEM: 25_000,
};

export function getAreaScaleFactor(areaSqm: number): number {
  if (areaSqm <= 40) return 1.0;
  if (areaSqm <= 80) return 1.15;
  if (areaSqm <= 150) return 1.3;
  return 1.45;
}

export function calculateEstimate(input: EstimateInput): EstimateResult {
  const { propertyType, areaSqm, selectedZones, materialGrade } = input;

  if (!selectedZones || selectedZones.length === 0) {
    return {
      rawEstimate: 0,
      estimatedMin: 0,
      estimatedMax: 0,
      isFloorPriceApplied: false,
      isZeroZone: true,
      breakdown: {
        propertyMultiplier: PROPERTY_MULTIPLIERS[propertyType] ?? 1.0,
        areaScaleFactor: getAreaScaleFactor(areaSqm),
        gradeMultiplier: GRADE_MULTIPLIERS[materialGrade] ?? 1.0,
        baseZoneTotal: 0,
      },
    };
  }

  const baseZoneTotal = selectedZones.reduce((acc, zone) => {
    return acc + (BASE_ZONE_COSTS[zone] || 0);
  }, 0);

  if (baseZoneTotal === 0) {
    return {
      rawEstimate: 0,
      estimatedMin: 0,
      estimatedMax: 0,
      isFloorPriceApplied: false,
      isZeroZone: true,
      breakdown: {
        propertyMultiplier: PROPERTY_MULTIPLIERS[propertyType] ?? 1.0,
        areaScaleFactor: getAreaScaleFactor(areaSqm),
        gradeMultiplier: GRADE_MULTIPLIERS[materialGrade] ?? 1.0,
        baseZoneTotal: 0,
      },
    };
  }

  const propertyMultiplier = PROPERTY_MULTIPLIERS[propertyType] ?? 1.0;
  const areaScaleFactor = getAreaScaleFactor(areaSqm);
  const gradeMultiplier = GRADE_MULTIPLIERS[materialGrade] ?? 1.0;

  // RawEst = (\sum BaseZoneCost) * M_property * M_grade * F_area
  const rawEstimate = Math.round(
    baseZoneTotal * propertyMultiplier * gradeMultiplier * areaScaleFactor
  );

  const estimatedMin = Math.max(FLOOR_PRICE, rawEstimate);
  const estimatedMax = Math.round(estimatedMin * 1.2);

  return {
    rawEstimate,
    estimatedMin,
    estimatedMax,
    isFloorPriceApplied: rawEstimate < FLOOR_PRICE,
    isZeroZone: false,
    breakdown: {
      propertyMultiplier,
      areaScaleFactor,
      gradeMultiplier,
      baseZoneTotal,
    },
  };
}
