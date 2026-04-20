import type { Club, Calibration, ClockCalibration, ClockPosition } from "./types";

export interface EnvironmentalConditions {
  windSpeed: number;
  windDirection: "into" | "with" | "cross" | "none";
  elevationChange: number;
  altitude: number;
  temperature: number;
  lie: "flat" | "above_feet" | "below_feet" | "uphill" | "downhill";
  lieSeverity: "slight" | "medium" | "severe";
  rough: "fairway" | "light_rough" | "heavy_rough" | "buried" | "flyer";
  teed: boolean;
  ground: "dry" | "soft" | "rain";
}

export interface YardageResult {
  playsAs: number;
  recommendedClub: Club | null;
  stockYardage: number;
  alternatives: { club: Club; stockYardage: number }[];
  adjustments: {
    label: string;
    yards: number;
  }[];
  aimOffset: string | null;
}

const DEFAULT_PDF = 2.5;
const BASELINE_TEMP = 70;

export function calculatePDF(calibrations: Calibration[], clubs: Club[]): number {
  if (calibrations.length === 0) return DEFAULT_PDF;

  const pdfs: number[] = [];
  for (const cal of calibrations) {
    const club = clubs.find((c) => c.id === cal.clubId);
    if (!club) continue;
    const pdf = cal.yardage / (90 - club.loft);
    if (pdf > 0 && isFinite(pdf)) {
      pdfs.push(pdf);
    }
  }

  if (pdfs.length === 0) return DEFAULT_PDF;
  return pdfs.reduce((a, b) => a + b, 0) / pdfs.length;
}

export function predictDistance(club: Club, pdf: number): number {
  // Manual distance override takes priority over PDF prediction
  if (club.manualDistance && club.manualDistance > 0) {
    return club.manualDistance;
  }
  return (90 - club.loft) * pdf;
}

export function calculatePlaysAs(
  targetDistance: number,
  conditions: EnvironmentalConditions
): { playsAs: number; adjustments: { label: string; yards: number }[]; aimOffset: string | null } {
  let playsAs = targetDistance;
  const adjustments: { label: string; yards: number }[] = [];
  let aimOffset: string | null = null;

  // Wind adjustment
  // Headwind: +1% per mph (industry standard — Arccos, Galvin Green)
  // Tailwind: -0.5% per mph
  // Crosswind: no distance change, aim offset instead
  if (conditions.windSpeed > 0 && conditions.windDirection !== "none") {
    let windYards = 0;
    if (conditions.windDirection === "into") {
      windYards = targetDistance * (conditions.windSpeed * 0.01);
    } else if (conditions.windDirection === "with") {
      windYards = -(targetDistance * (conditions.windSpeed * 0.005));
    } else if (conditions.windDirection === "cross") {
      // Crosswind pushes ball sideways, not longer/shorter
      const crossOffset = Math.round(conditions.windSpeed * 0.75);
      if (crossOffset > 0) {
        aimOffset = `Aim ${crossOffset} yards into the wind`;
      }
    }
    if (conditions.windDirection !== "cross") {
      windYards = Math.round(windYards);
      if (windYards !== 0) {
        playsAs += windYards;
        adjustments.push({
          label: `Wind ${conditions.windSpeed}mph ${conditions.windDirection}`,
          yards: windYards,
        });
      }
    }
  }

  // Elevation adjustment: ~1 yard per 3 feet
  if (conditions.elevationChange !== 0) {
    const elevYards = Math.round(conditions.elevationChange / 3);
    if (elevYards !== 0) {
      playsAs += elevYards;
      adjustments.push({
        label: `Elevation ${conditions.elevationChange > 0 ? "+" : ""}${conditions.elevationChange}ft`,
        yards: elevYards,
      });
    }
  }

  // Altitude adjustment: ball flies ~1.16% farther per 1000ft above sea level
  // Formula: altitude_ft * 0.00116 = percentage gain (e.g. 5000ft → 5.8%)
  // This means the shot plays SHORTER (need less club) so we subtract from playsAs
  if (conditions.altitude > 0) {
    const altPercent = conditions.altitude * 0.00116 / 100;
    const altYards = -Math.round(targetDistance * altPercent);
    if (altYards !== 0) {
      playsAs += altYards;
      adjustments.push({
        label: `Altitude ${conditions.altitude}ft`,
        yards: altYards,
      });
    }
  }

  // Temperature adjustment: scales by club distance
  // Driver (~250yds): ~2 yds per 10°F from 70° baseline
  // PW (~130yds): ~1.3 yds per 10°F
  // Linear interpolation: yardsPerDegree = 0.006 * targetDistance / 10
  // At 250yds → 0.15/°F → 1.5/10°F ≈ 2. At 130yds → 0.078/°F → 0.78/10°F ≈ 1.3
  if (conditions.temperature !== BASELINE_TEMP) {
    const tempDiff = BASELINE_TEMP - conditions.temperature;
    const yardsPerTenDeg = Math.max(1, targetDistance * 0.008);
    const tempYards = Math.round((tempDiff / 10) * yardsPerTenDeg);
    if (tempYards !== 0) {
      playsAs += tempYards;
      adjustments.push({
        label: `Temperature ${conditions.temperature}\u00B0F`,
        yards: tempYards,
      });
    }
  }

  // Lie adjustments — scaled by club loft
  // Uphill adds effective loft → shorter (more so with low-loft clubs)
  // Downhill removes loft → longer (more so with low-loft clubs)
  // Sidehill → aim offset only
  if (conditions.lie !== "flat") {
    const severityMultiplier =
      conditions.lieSeverity === "slight" ? 0.5 : conditions.lieSeverity === "medium" ? 1 : 1.5;

    // Loft scaling: low loft clubs (driver/long irons) are more affected by slope
    // ~4° effective loft change per severity level
    // Impact on distance is larger for low-loft clubs
    // At 20° loft: ~8% per severity. At 45° loft: ~4% per severity.
    const loftFactor = Math.max(0.03, 0.10 - (targetDistance < 100 ? 0.06 : targetDistance < 160 ? 0.04 : 0.02));

    if (conditions.lie === "uphill") {
      const lieYards = Math.round(targetDistance * loftFactor * severityMultiplier);
      playsAs += lieYards;
      adjustments.push({ label: `Uphill lie (${conditions.lieSeverity})`, yards: lieYards });
    } else if (conditions.lie === "downhill") {
      const lieYards = -Math.round(targetDistance * loftFactor * severityMultiplier);
      playsAs += lieYards;
      adjustments.push({ label: `Downhill lie (${conditions.lieSeverity})`, yards: lieYards });
    } else if (conditions.lie === "above_feet") {
      const offset = Math.round(3 * severityMultiplier);
      const existingAim = aimOffset ? aimOffset + " / " : "";
      aimOffset = `${existingAim}Aim ${offset} yards right (ball above feet)`;
    } else if (conditions.lie === "below_feet") {
      const offset = Math.round(3 * severityMultiplier);
      const existingAim = aimOffset ? aimOffset + " / " : "";
      aimOffset = `${existingAim}Aim ${offset} yards left (ball below feet)`;
    }
  }

  // Rough adjustment
  // Light rough: 5% distance loss
  // Heavy rough: 15% distance loss
  // Buried (into-grain): 20-25% loss
  // Flyer (down-grain): 10-15% distance GAIN (reduced spin, ball jumps)
  if (conditions.rough !== "fairway") {
    let roughPercent = 0;
    let roughLabel = "";
    if (conditions.rough === "light_rough") {
      roughPercent = 0.05;
      roughLabel = "Light rough";
    } else if (conditions.rough === "heavy_rough") {
      roughPercent = 0.15;
      roughLabel = "Heavy rough";
    } else if (conditions.rough === "buried") {
      roughPercent = 0.22;
      roughLabel = "Buried lie";
    } else if (conditions.rough === "flyer") {
      roughPercent = -0.12;
      roughLabel = "Flyer lie";
    }

    // Wet rough multiplier: rain makes grass heavier and clingier,
    // increasing the rough penalty by ~40%. Doesn't apply to flyers
    // (wet grass can actually cause flyers, already accounted for).
    if (conditions.ground === "rain" && conditions.rough !== "flyer" && roughPercent > 0) {
      roughPercent *= 1.4;
      roughLabel += " (wet)";
    }

    const roughYards = Math.round(targetDistance * roughPercent);
    if (roughYards !== 0) {
      playsAs += roughYards;
      adjustments.push({ label: roughLabel, yards: roughYards });
    }
  }

  // Tee shot adjustment: cleaner strike, less grass interference
  // Irons off a tee gain ~3-5% distance, wedges ~1-2%
  if (conditions.teed) {
    const teePercent = targetDistance > 160 ? -0.04 : targetDistance > 120 ? -0.03 : -0.02;
    const teeYards = Math.round(targetDistance * teePercent);
    if (teeYards !== 0) {
      playsAs += teeYards;
      adjustments.push({ label: "Off the tee", yards: teeYards });
    }
  }

  // Ground conditions adjustment
  // Soft: rained earlier / morning dew. Ball checks up, less roll. Fly it closer to pin.
  // Rain: actively raining. Wet clubface = flyer, ball stops dead. Fly it all the way.
  if (conditions.ground !== "dry") {
    let groundYards = 0;
    let groundLabel = "";
    if (conditions.ground === "soft") {
      groundYards = Math.round(targetDistance * 0.03);
      groundLabel = "Soft ground";
    } else if (conditions.ground === "rain") {
      groundYards = Math.round(targetDistance * 0.05);
      groundLabel = "Rain";
    }
    if (groundYards !== 0) {
      playsAs += groundYards;
      adjustments.push({ label: groundLabel, yards: groundYards });
    }
  }

  return { playsAs: Math.round(playsAs), adjustments, aimOffset };
}

export interface ClockRecommendation {
  club: Club;
  position: ClockPosition;
  calibratedYardage: number;
  difference: number;
}

export function findClockPosition(
  playsAs: number,
  enabledClubs: Club[],
  clockCalibrations: ClockCalibration[]
): ClockRecommendation | null {
  if (clockCalibrations.length === 0) return null;

  const wedgeClubs = enabledClubs.filter((c) => c.clubType === "wedge");
  if (wedgeClubs.length === 0) return null;

  // Find the max calibrated clock yardage — if playsAs is above this, clock system doesn't apply
  const allClockYardages = clockCalibrations
    .filter((cc) => wedgeClubs.some((w) => w.id === cc.clubId))
    .map((cc) => cc.yardage);
  const maxClockYardage = Math.max(...allClockYardages);
  if (playsAs > maxClockYardage + 5) return null;

  let best: ClockRecommendation | null = null;
  let bestDiff = Infinity;

  for (const club of wedgeClubs) {
    const clubClocks = clockCalibrations.filter((cc) => cc.clubId === club.id);
    for (const cc of clubClocks) {
      const diff = Math.abs(cc.yardage - playsAs);
      if (diff < bestDiff) {
        bestDiff = diff;
        best = {
          club,
          position: cc.position,
          calibratedYardage: cc.yardage,
          difference: cc.yardage - playsAs,
        };
      }
    }
  }

  return best;
}

export interface ClubCandidate {
  club: Club;
  yardage: number;
  label: string;
  clockPosition?: ClockPosition;
}

export function recommendClub(
  playsAs: number,
  enabledClubs: Club[],
  pdf: number,
  clockCalibrations: ClockCalibration[] = []
): { recommended: ClubCandidate | null; alternatives: ClubCandidate[] } {
  if (enabledClubs.length === 0) {
    return { recommended: null, alternatives: [] };
  }

  // Full-swing candidates
  const candidates: ClubCandidate[] = enabledClubs
    .filter((c) => c.clubType !== "putter")
    .map((club) => ({
      club,
      yardage: Math.round(predictDistance(club, pdf)),
      label: club.name,
    }));

  // Clock position candidates — each is a virtual "club"
  for (const cc of clockCalibrations) {
    const club = enabledClubs.find((c) => c.id === cc.clubId);
    if (club && club.enabled) {
      candidates.push({
        club,
        yardage: cc.yardage,
        label: `${club.name} at ${cc.position}`,
        clockPosition: cc.position,
      });
    }
  }

  candidates.sort((a, b) => b.yardage - a.yardage);

  if (candidates.length === 0) {
    return { recommended: null, alternatives: [] };
  }

  let bestIdx = 0;
  let bestDiff = Math.abs(candidates[0].yardage - playsAs);

  for (let i = 1; i < candidates.length; i++) {
    const diff = Math.abs(candidates[i].yardage - playsAs);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestIdx = i;
    }
  }

  const recommended = candidates[bestIdx];
  const alternatives: ClubCandidate[] = [];

  if (bestIdx > 0) {
    alternatives.push(candidates[bestIdx - 1]);
  }
  if (bestIdx < candidates.length - 1) {
    alternatives.push(candidates[bestIdx + 1]);
  }

  return { recommended, alternatives };
}
