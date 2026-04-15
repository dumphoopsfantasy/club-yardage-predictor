import type { Club, Calibration } from "./types";

export interface EnvironmentalConditions {
  windSpeed: number;
  windDirection: "into" | "with" | "cross" | "none";
  elevationChange: number;
  altitude: number;
  temperature: number;
  lie: "flat" | "above_feet" | "below_feet" | "uphill" | "downhill";
  lieSeverity: "slight" | "medium" | "severe";
  rough: "fairway" | "light_rough" | "heavy_rough" | "buried";
  teed: boolean;
  ground: "dry" | "damp" | "wet" | "rain";
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
  if (conditions.windSpeed > 0 && conditions.windDirection !== "none") {
    let windYards = 0;
    if (conditions.windDirection === "into") {
      windYards = targetDistance * (conditions.windSpeed * 0.01);
    } else if (conditions.windDirection === "with") {
      windYards = -(targetDistance * (conditions.windSpeed * 0.005));
    } else if (conditions.windDirection === "cross") {
      windYards = targetDistance * (conditions.windSpeed * 0.002);
    }
    windYards = Math.round(windYards);
    if (windYards !== 0) {
      playsAs += windYards;
      adjustments.push({
        label: `Wind ${conditions.windSpeed}mph ${conditions.windDirection}`,
        yards: windYards,
      });
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

  // Altitude adjustment: +0.116% per 1000ft
  if (conditions.altitude > 0) {
    const altYards = -Math.round(targetDistance * (conditions.altitude / 1000) * 0.00116);
    if (altYards !== 0) {
      playsAs += altYards;
      adjustments.push({
        label: `Altitude ${conditions.altitude}ft`,
        yards: altYards,
      });
    }
  }

  // Temperature adjustment: ~2 yards per 10F from 70F baseline
  if (conditions.temperature !== BASELINE_TEMP) {
    const tempDiff = BASELINE_TEMP - conditions.temperature;
    const tempYards = Math.round((tempDiff / 10) * 2);
    if (tempYards !== 0) {
      playsAs += tempYards;
      adjustments.push({
        label: `Temperature ${conditions.temperature}\u00B0F`,
        yards: tempYards,
      });
    }
  }

  // Lie adjustments
  if (conditions.lie !== "flat") {
    const severityMultiplier =
      conditions.lieSeverity === "slight" ? 0.5 : conditions.lieSeverity === "medium" ? 1 : 1.5;

    if (conditions.lie === "uphill") {
      const lieYards = Math.round(5 * severityMultiplier);
      playsAs += lieYards;
      adjustments.push({ label: `Uphill lie (${conditions.lieSeverity})`, yards: lieYards });
    } else if (conditions.lie === "downhill") {
      const lieYards = -Math.round(5 * severityMultiplier);
      playsAs += lieYards;
      adjustments.push({ label: `Downhill lie (${conditions.lieSeverity})`, yards: lieYards });
    } else if (conditions.lie === "above_feet") {
      const offset = Math.round(3 * severityMultiplier);
      aimOffset = `Aim ${offset} yards right`;
    } else if (conditions.lie === "below_feet") {
      const offset = Math.round(3 * severityMultiplier);
      aimOffset = `Aim ${offset} yards left`;
    }
  }

  // Rough adjustment
  if (conditions.rough !== "fairway") {
    let roughPercent = 0;
    if (conditions.rough === "light_rough") roughPercent = 0.05;
    else if (conditions.rough === "heavy_rough") roughPercent = 0.15;
    else if (conditions.rough === "buried") roughPercent = 0.25;

    const roughYards = Math.round(targetDistance * roughPercent);
    if (roughYards !== 0) {
      playsAs += roughYards;
      const roughLabel =
        conditions.rough === "light_rough"
          ? "Light rough"
          : conditions.rough === "heavy_rough"
            ? "Heavy rough"
            : "Buried lie";
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
  // Wet conditions: less spin = flyer effect (ball goes farther through air)
  // But soft ground = less roll, ball plugs. Net effect on "plays like":
  // Damp: roughly neutral, slight flyer. Wet: noticeable flyer but no roll.
  // Rain: flyer + drag cancel somewhat, but soft landing = less total distance.
  if (conditions.ground !== "dry") {
    let groundYards = 0;
    let groundLabel = "";
    if (conditions.ground === "damp") {
      // Slight flyer, slightly less roll — roughly wash
      groundYards = -Math.round(targetDistance * 0.01);
      groundLabel = "Damp conditions";
    } else if (conditions.ground === "wet") {
      // Flyer carries farther but no roll — plays shorter overall
      groundYards = Math.round(targetDistance * 0.03);
      groundLabel = "Wet ground";
    } else if (conditions.ground === "rain") {
      // Flyer + rain drag + soft landing — plays longer
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

export function recommendClub(
  playsAs: number,
  enabledClubs: Club[],
  pdf: number
): { recommended: Club | null; stockYardage: number; alternatives: { club: Club; stockYardage: number }[] } {
  if (enabledClubs.length === 0) {
    return { recommended: null, stockYardage: 0, alternatives: [] };
  }

  const clubDistances = enabledClubs
    .filter((c) => c.clubType !== "putter")
    .map((club) => ({
      club,
      stockYardage: Math.round(predictDistance(club, pdf)),
    }))
    .sort((a, b) => b.stockYardage - a.stockYardage);

  if (clubDistances.length === 0) {
    return { recommended: null, stockYardage: 0, alternatives: [] };
  }

  let bestIdx = 0;
  let bestDiff = Math.abs(clubDistances[0].stockYardage - playsAs);

  for (let i = 1; i < clubDistances.length; i++) {
    const diff = Math.abs(clubDistances[i].stockYardage - playsAs);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestIdx = i;
    }
  }

  const recommended = clubDistances[bestIdx];
  const alternatives: { club: Club; stockYardage: number }[] = [];

  if (bestIdx > 0) {
    alternatives.push(clubDistances[bestIdx - 1]);
  }
  if (bestIdx < clubDistances.length - 1) {
    alternatives.push(clubDistances[bestIdx + 1]);
  }

  return {
    recommended: recommended.club,
    stockYardage: recommended.stockYardage,
    alternatives,
  };
}
