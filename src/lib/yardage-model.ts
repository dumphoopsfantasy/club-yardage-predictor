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


let idCounter = 0;
export function createClubWithId(club: Omit<Club, "id">): Club {
  return { ...club, id: `club-${++idCounter}` };
}
