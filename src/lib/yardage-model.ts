// Predicts yardages based on loft angles using a known calibration point.
// Uses the empirical relationship: distance ≈ k / tan(loft_radians)
// This models the physics of ball flight vs club loft.

export interface Club {
  id: string;
  name: string;
  loft: number; // degrees
  predictedYardage?: number;
}

export interface CalibrationPoint {
  clubId: string;
  yardage: number;
}

export function predictYardages(
  clubs: Club[],
  calibration: CalibrationPoint
): Club[] {
  const calClub = clubs.find((c) => c.id === calibration.clubId);
  if (!calClub) return clubs;

  const calLoftRad = (calClub.loft * Math.PI) / 180;
  // Solve for k: yardage = k / tan(loft) => k = yardage * tan(loft)
  const k = calibration.yardage * Math.tan(calLoftRad);

  return clubs.map((club) => {
    const loftRad = (club.loft * Math.PI) / 180;
    const predicted = Math.round(k / Math.tan(loftRad));
    return { ...club, predictedYardage: predicted };
  });
}

export const COMMON_CLUB_SETS: Record<string, Omit<Club, "id">[]> = {
  "Standard Iron Set (4-PW)": [
    { name: "4 Iron", loft: 22 },
    { name: "5 Iron", loft: 25 },
    { name: "6 Iron", loft: 28 },
    { name: "7 Iron", loft: 31.5 },
    { name: "8 Iron", loft: 35.5 },
    { name: "9 Iron", loft: 40 },
    { name: "PW", loft: 44.5 },
  ],
  "Game Improvement (5-PW, GW)": [
    { name: "5 Iron", loft: 23 },
    { name: "6 Iron", loft: 26 },
    { name: "7 Iron", loft: 29 },
    { name: "8 Iron", loft: 33 },
    { name: "9 Iron", loft: 38 },
    { name: "PW", loft: 43 },
    { name: "GW", loft: 48 },
  ],
  "Players Iron Set (3-PW)": [
    { name: "3 Iron", loft: 21 },
    { name: "4 Iron", loft: 24 },
    { name: "5 Iron", loft: 27 },
    { name: "6 Iron", loft: 30.5 },
    { name: "7 Iron", loft: 34.5 },
    { name: "8 Iron", loft: 38.5 },
    { name: "9 Iron", loft: 42.5 },
    { name: "PW", loft: 47 },
  ],
  "Full Bag (3-PW + Wedges)": [
    { name: "3 Iron", loft: 21 },
    { name: "4 Iron", loft: 24 },
    { name: "5 Iron", loft: 27 },
    { name: "6 Iron", loft: 30.5 },
    { name: "7 Iron", loft: 34.5 },
    { name: "8 Iron", loft: 38.5 },
    { name: "9 Iron", loft: 42.5 },
    { name: "PW", loft: 47 },
    { name: "50°", loft: 50 },
    { name: "54°", loft: 54 },
    { name: "58°", loft: 58 },
  ],
};

let idCounter = 0;
export function createClubWithId(club: Omit<Club, "id">): Club {
  return { ...club, id: `club-${++idCounter}` };
}
