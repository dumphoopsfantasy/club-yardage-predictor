// Predicts yardages using Personal Distance Factor (PDF).
// PDF = Baseline Yardage / (90 - Baseline Club Loft)
// Predicted Distance = (90 - Club Loft) × PDF

export interface Club {
  id: string;
  name: string;
  loft: number; // degrees
  predictedYardage?: number;
  adjustedYardage?: number;
  source?: string; // e.g. "Titleist T100 (2024)" for mixed bag tracking
  enabled?: boolean; // whether club is active in calculator (default true)
  addedIndividually?: boolean; // true for clubs added via "Add Club" (not from base set)
}

export interface CalibrationPoint {
  clubId: string;
  yardage: number;
}

export interface EnvironmentalConditions {
  altitude: number; // feet above sea level
  temperature: number; // °F
  windSpeed: number; // mph
  windDirection: "headwind" | "tailwind" | "none";
  slope: number; // degrees, positive = uphill, negative = downhill
}

export const DEFAULT_CONDITIONS: EnvironmentalConditions = {
  altitude: 0,
  temperature: 70,
  windSpeed: 0,
  windDirection: "none",
  slope: 0,
};

export function calculatePDF(
  clubs: Club[],
  calibrations: CalibrationPoint[]
): number | null {
  const validCalibrations = calibrations.filter((cal) => {
    const club = clubs.find((c) => c.id === cal.clubId);
    return club && cal.yardage > 0;
  });

  if (validCalibrations.length === 0) return null;

  const pdfs = validCalibrations.map((cal) => {
    const club = clubs.find((c) => c.id === cal.clubId)!;
    return cal.yardage / (90 - club.loft);
  });

  return pdfs.reduce((sum, p) => sum + p, 0) / pdfs.length;
}

export function applyEnvironmentalAdjustment(
  stockYardage: number,
  conditions: EnvironmentalConditions
): number {
  const per100 = stockYardage / 100;

  // Altitude: +1 yard per 100ft of elevation per 100 yards
  const altitudeAdj = (conditions.altitude / 100) * per100;

  // Temperature: +/- 2 yards per 10°F deviation from 70°F per 100 yards
  const tempAdj = ((conditions.temperature - 70) / 10) * 2 * per100;

  // Wind: headwind +1 yard/mph/100yds, tailwind -0.5 yard/mph/100yds
  let windAdj = 0;
  if (conditions.windDirection === "headwind") {
    windAdj = conditions.windSpeed * 1 * per100;
  } else if (conditions.windDirection === "tailwind") {
    windAdj = -conditions.windSpeed * 0.5 * per100;
  }

  // Slope: +1 yard per degree uphill, -1 per degree downhill per 100 yards
  const slopeAdj = conditions.slope * 1 * per100;

  return Math.round(stockYardage + altitudeAdj + tempAdj + windAdj + slopeAdj);
}

export function predictYardages(
  clubs: Club[],
  calibrations: CalibrationPoint | CalibrationPoint[],
  conditions?: EnvironmentalConditions
): Club[] {
  const calArray = Array.isArray(calibrations) ? calibrations : [calibrations];
  const pdf = calculatePDF(clubs, calArray);
  if (!pdf) return clubs;

  const hasConditions =
    conditions &&
    (conditions.altitude !== 0 ||
      conditions.temperature !== 70 ||
      (conditions.windSpeed > 0 && conditions.windDirection !== "none") ||
      conditions.slope !== 0);

  return clubs.map((club) => {
    const predicted = Math.round((90 - club.loft) * pdf);
    const adjusted = hasConditions
      ? applyEnvironmentalAdjustment(predicted, conditions!)
      : undefined;
    return { ...club, predictedYardage: predicted, adjustedYardage: adjusted };
  });
}

/**
 * Calculate "plays as" distance for the on-course calculator.
 * - Elevation: every 3 feet = 1 yard. Uphill adds, downhill subtracts.
 * - Headwind: +1% per mph
 * - Tailwind: -0.5% per mph
 * - Crosswind: no distance change
 */
export function calculatePlaysAs(
  distanceYards: number,
  elevationFeet: number,
  windSpeed: number,
  windType: "headwind" | "tailwind" | "crosswind" | "none"
): number {
  let adjusted = distanceYards;

  // Elevation adjustment: +1 yard per 3 feet uphill, -1 per 3 feet downhill
  adjusted += elevationFeet / 3;

  // Wind adjustment
  if (windType === "headwind") {
    adjusted += distanceYards * (windSpeed * 0.01);
  } else if (windType === "tailwind") {
    adjusted -= distanceYards * (windSpeed * 0.005);
  }

  return Math.round(adjusted);
}

/**
 * Find the best club for a given yardage from predicted clubs.
 * Returns the closest match plus one above and one below.
 */
export function findClubRecommendation(
  clubs: Club[],
  targetYardage: number
): { primary: Club | null; above: Club | null; below: Club | null } {
  // Filter to enabled clubs with predictions, sorted by yardage desc
  const available = clubs
    .filter((c) => c.enabled !== false && c.predictedYardage && c.predictedYardage > 0)
    .sort((a, b) => (b.predictedYardage ?? 0) - (a.predictedYardage ?? 0));

  if (available.length === 0) return { primary: null, above: null, below: null };

  // Find closest club by absolute distance
  let closestIdx = 0;
  let closestDiff = Infinity;
  available.forEach((club, idx) => {
    const diff = Math.abs((club.predictedYardage ?? 0) - targetYardage);
    if (diff < closestDiff) {
      closestDiff = diff;
      closestIdx = idx;
    }
  });

  const primary = available[closestIdx];
  const above = closestIdx > 0 ? available[closestIdx - 1] : null;
  const below = closestIdx < available.length - 1 ? available[closestIdx + 1] : null;

  return { primary, above, below };
}

let idCounter = 0;
export function createClubWithId(
  club: Omit<Club, "id">,
  source?: string
): Club {
  return { ...club, id: `club-${++idCounter}`, source };
}
