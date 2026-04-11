// Predicts yardages using Personal Distance Factor (PDF).
// PDF = Baseline Yardage / (90 - Baseline Club Loft)
// Predicted Distance = (90 - Club Loft) × PDF

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

  // Personal Distance Factor
  const pdf = calibration.yardage / (90 - calClub.loft);

  return clubs.map((club) => {
    const predicted = Math.round((90 - club.loft) * pdf);
    return { ...club, predictedYardage: predicted };
  });
}


let idCounter = 0;
export function createClubWithId(club: Omit<Club, "id">): Club {
  return { ...club, id: `club-${++idCounter}` };
}
