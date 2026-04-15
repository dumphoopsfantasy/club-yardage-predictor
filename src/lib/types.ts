export interface Club {
  id: number;
  name: string;
  brand: string;
  model: string;
  variant?: string;
  loft: number;
  clubType: "iron" | "wood" | "hybrid" | "wedge" | "putter";
  enabled: 0 | 1;
  sortOrder: number;
  createdAt: string;
}

export interface Calibration {
  id: number;
  clubId: number;
  yardage: number;
  createdAt: string;
}

export interface Round {
  id: number;
  courseName: string;
  date: string;
  tees?: string;
  notes?: string;
  createdAt: string;
}

export interface Shot {
  id: number;
  roundId: number;
  holeNumber: number;
  clubId?: number;
  distanceToPin?: number;
  playsAsDistance?: number;
  result?: "fairway" | "green" | "rough" | "bunker" | "hazard" | "ob";
  putts?: number;
  notes?: string;
  createdAt: string;
}

export interface AppSettings {
  theme: "dark" | "light";
  units: "yards" | "meters";
  tempUnit: "fahrenheit" | "celsius";
}
