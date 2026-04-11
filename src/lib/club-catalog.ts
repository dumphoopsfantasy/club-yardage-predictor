// Real golf club catalog with manufacturer loft specs

export interface ClubModel {
  brand: string;
  model: string;
  year: number;
  category: "Players" | "Players Distance" | "Game Improvement" | "Super Game Improvement";
  clubs: { name: string; loft: number }[];
}

export const CLUB_CATALOG: ClubModel[] = [
  // === TITLEIST ===
  {
    brand: "Titleist",
    model: "T100",
    year: 2024,
    category: "Players",
    clubs: [
      { name: "3 Iron", loft: 21 },
      { name: "4 Iron", loft: 24 },
      { name: "5 Iron", loft: 27 },
      { name: "6 Iron", loft: 30 },
      { name: "7 Iron", loft: 34 },
      { name: "8 Iron", loft: 38 },
      { name: "9 Iron", loft: 42 },
      { name: "PW", loft: 46 },
    ],
  },
  {
    brand: "Titleist",
    model: "T150",
    year: 2024,
    category: "Players Distance",
    clubs: [
      { name: "4 Iron", loft: 22 },
      { name: "5 Iron", loft: 25 },
      { name: "6 Iron", loft: 28 },
      { name: "7 Iron", loft: 31 },
      { name: "8 Iron", loft: 35 },
      { name: "9 Iron", loft: 39 },
      { name: "PW", loft: 43 },
    ],
  },
  {
    brand: "Titleist",
    model: "T200",
    year: 2024,
    category: "Players Distance",
    clubs: [
      { name: "4 Iron", loft: 21 },
      { name: "5 Iron", loft: 24 },
      { name: "6 Iron", loft: 27 },
      { name: "7 Iron", loft: 30 },
      { name: "8 Iron", loft: 34 },
      { name: "9 Iron", loft: 38 },
      { name: "PW", loft: 43 },
    ],
  },
  {
    brand: "Titleist",
    model: "T350",
    year: 2024,
    category: "Game Improvement",
    clubs: [
      { name: "5 Iron", loft: 22 },
      { name: "6 Iron", loft: 25 },
      { name: "7 Iron", loft: 28 },
      { name: "8 Iron", loft: 32 },
      { name: "9 Iron", loft: 37 },
      { name: "PW", loft: 42 },
      { name: "W", loft: 47 },
    ],
  },

  // === TAYLORMADE ===
  {
    brand: "TaylorMade",
    model: "P770",
    year: 2024,
    category: "Players Distance",
    clubs: [
      { name: "3 Iron", loft: 19 },
      { name: "4 Iron", loft: 21.5 },
      { name: "5 Iron", loft: 24.5 },
      { name: "6 Iron", loft: 28 },
      { name: "7 Iron", loft: 32 },
      { name: "8 Iron", loft: 36 },
      { name: "9 Iron", loft: 40.5 },
      { name: "PW", loft: 45 },
    ],
  },
  {
    brand: "TaylorMade",
    model: "P790",
    year: 2024,
    category: "Players Distance",
    clubs: [
      { name: "3 Iron", loft: 19 },
      { name: "4 Iron", loft: 21 },
      { name: "5 Iron", loft: 23.5 },
      { name: "6 Iron", loft: 26.5 },
      { name: "7 Iron", loft: 30 },
      { name: "8 Iron", loft: 34.5 },
      { name: "9 Iron", loft: 39 },
      { name: "PW", loft: 43.5 },
    ],
  },
  {
    brand: "TaylorMade",
    model: "Qi35",
    year: 2025,
    category: "Game Improvement",
    clubs: [
      { name: "4 Iron", loft: 19 },
      { name: "5 Iron", loft: 21.5 },
      { name: "6 Iron", loft: 25 },
      { name: "7 Iron", loft: 28.5 },
      { name: "8 Iron", loft: 33 },
      { name: "9 Iron", loft: 38 },
      { name: "PW", loft: 43 },
      { name: "AW", loft: 49 },
      { name: "SW", loft: 54 },
    ],
  },
  {
    brand: "TaylorMade",
    model: "Qi35 Max",
    year: 2025,
    category: "Super Game Improvement",
    clubs: [
      { name: "5 Iron", loft: 21.5 },
      { name: "6 Iron", loft: 24 },
      { name: "7 Iron", loft: 27 },
      { name: "8 Iron", loft: 31.5 },
      { name: "9 Iron", loft: 36 },
      { name: "PW", loft: 41 },
      { name: "AW", loft: 47 },
      { name: "SW", loft: 53 },
    ],
  },
  {
    brand: "TaylorMade",
    model: "P7MC",
    year: 2024,
    category: "Players",
    clubs: [
      { name: "3 Iron", loft: 21 },
      { name: "4 Iron", loft: 24 },
      { name: "5 Iron", loft: 27 },
      { name: "6 Iron", loft: 31 },
      { name: "7 Iron", loft: 35 },
      { name: "8 Iron", loft: 39 },
      { name: "9 Iron", loft: 43 },
      { name: "PW", loft: 47 },
    ],
  },

  // === CALLAWAY ===
  {
    brand: "Callaway",
    model: "Apex Pro",
    year: 2024,
    category: "Players",
    clubs: [
      { name: "3 Iron", loft: 20 },
      { name: "4 Iron", loft: 23 },
      { name: "5 Iron", loft: 26 },
      { name: "6 Iron", loft: 29 },
      { name: "7 Iron", loft: 33 },
      { name: "8 Iron", loft: 37 },
      { name: "9 Iron", loft: 41 },
      { name: "PW", loft: 45 },
    ],
  },
  {
    brand: "Callaway",
    model: "Apex",
    year: 2024,
    category: "Players Distance",
    clubs: [
      { name: "4 Iron", loft: 20 },
      { name: "5 Iron", loft: 23 },
      { name: "6 Iron", loft: 26 },
      { name: "7 Iron", loft: 29 },
      { name: "8 Iron", loft: 33 },
      { name: "9 Iron", loft: 37.5 },
      { name: "PW", loft: 42 },
      { name: "AW", loft: 47 },
    ],
  },
  {
    brand: "Callaway",
    model: "Paradym Ai Smoke",
    year: 2024,
    category: "Game Improvement",
    clubs: [
      { name: "4 Iron", loft: 19 },
      { name: "5 Iron", loft: 21.5 },
      { name: "6 Iron", loft: 24.5 },
      { name: "7 Iron", loft: 27.5 },
      { name: "8 Iron", loft: 31.5 },
      { name: "9 Iron", loft: 36 },
      { name: "PW", loft: 41 },
      { name: "AW", loft: 46 },
      { name: "SW", loft: 51 },
    ],
  },
  {
    brand: "Callaway",
    model: "Paradym Ai Smoke Max",
    year: 2024,
    category: "Super Game Improvement",
    clubs: [
      { name: "5 Iron", loft: 21 },
      { name: "6 Iron", loft: 23.5 },
      { name: "7 Iron", loft: 26.5 },
      { name: "8 Iron", loft: 30 },
      { name: "9 Iron", loft: 35 },
      { name: "PW", loft: 40 },
      { name: "AW", loft: 45 },
      { name: "SW", loft: 50 },
    ],
  },
  {
    brand: "Callaway",
    model: "Mavrik",
    year: 2020,
    category: "Game Improvement",
    clubs: [
      { name: "4 Iron", loft: 18 },
      { name: "5 Iron", loft: 21 },
      { name: "6 Iron", loft: 24 },
      { name: "7 Iron", loft: 27 },
      { name: "8 Iron", loft: 31.5 },
      { name: "9 Iron", loft: 36 },
      { name: "PW", loft: 41 },
      { name: "AW", loft: 46 },
      { name: "GW", loft: 51 },
      { name: "SW", loft: 56 },
    ],
  },

  // === PING ===
  {
    brand: "Ping",
    model: "i230",
    year: 2023,
    category: "Players",
    clubs: [
      { name: "3 Iron", loft: 20 },
      { name: "4 Iron", loft: 23 },
      { name: "5 Iron", loft: 26 },
      { name: "6 Iron", loft: 29.5 },
      { name: "7 Iron", loft: 33.5 },
      { name: "8 Iron", loft: 38 },
      { name: "9 Iron", loft: 42.5 },
      { name: "PW", loft: 47 },
      { name: "UW", loft: 52 },
    ],
  },
  {
    brand: "Ping",
    model: "i210",
    year: 2018,
    category: "Players",
    clubs: [
      { name: "3 Iron", loft: 19 },
      { name: "4 Iron", loft: 22.5 },
      { name: "5 Iron", loft: 26 },
      { name: "6 Iron", loft: 29.5 },
      { name: "7 Iron", loft: 33 },
      { name: "8 Iron", loft: 37 },
      { name: "9 Iron", loft: 41 },
      { name: "PW", loft: 45 },
      { name: "UW", loft: 50 },
    ],
  },
  {
    brand: "Ping",
    model: "G430",
    year: 2023,
    category: "Game Improvement",
    clubs: [
      { name: "4 Iron", loft: 20.5 },
      { name: "5 Iron", loft: 23.5 },
      { name: "6 Iron", loft: 26.5 },
      { name: "7 Iron", loft: 30 },
      { name: "8 Iron", loft: 34.5 },
      { name: "9 Iron", loft: 39.5 },
      { name: "PW", loft: 44.5 },
      { name: "UW", loft: 49.5 },
      { name: "SW", loft: 54 },
    ],
  },
  {
    brand: "Ping",
    model: "G430 Max",
    year: 2023,
    category: "Super Game Improvement",
    clubs: [
      { name: "5 Iron", loft: 22 },
      { name: "6 Iron", loft: 25 },
      { name: "7 Iron", loft: 28.5 },
      { name: "8 Iron", loft: 33 },
      { name: "9 Iron", loft: 38.5 },
      { name: "PW", loft: 43.5 },
      { name: "UW", loft: 49 },
      { name: "SW", loft: 54 },
    ],
  },
  {
    brand: "Ping",
    model: "Zing",
    year: 1990,
    category: "Players",
    clubs: [
      { name: "3 Iron", loft: 20.5 },
      { name: "4 Iron", loft: 24 },
      { name: "5 Iron", loft: 27 },
      { name: "6 Iron", loft: 30.5 },
      { name: "7 Iron", loft: 34.5 },
      { name: "8 Iron", loft: 38.5 },
      { name: "9 Iron", loft: 42.5 },
      { name: "PW", loft: 47 },
      { name: "SW", loft: 52 },
    ],
  },

  // === COBRA ===
  {
    brand: "Cobra",
    model: "Darkspeed",
    year: 2024,
    category: "Game Improvement",
    clubs: [
      { name: "4 Iron", loft: 19 },
      { name: "5 Iron", loft: 21.5 },
      { name: "6 Iron", loft: 24.5 },
      { name: "7 Iron", loft: 27.5 },
      { name: "8 Iron", loft: 31.5 },
      { name: "9 Iron", loft: 36 },
      { name: "PW", loft: 41 },
      { name: "GW", loft: 46 },
      { name: "SW", loft: 51 },
    ],
  },
  {
    brand: "Cobra",
    model: "King Forged Tec",
    year: 2024,
    category: "Players Distance",
    clubs: [
      { name: "4 Iron", loft: 21 },
      { name: "5 Iron", loft: 24 },
      { name: "6 Iron", loft: 27 },
      { name: "7 Iron", loft: 30.5 },
      { name: "8 Iron", loft: 35 },
      { name: "9 Iron", loft: 39 },
      { name: "PW", loft: 44 },
    ],
  },

  // === MIZUNO ===
  {
    brand: "Mizuno",
    model: "Pro 245",
    year: 2024,
    category: "Players Distance",
    clubs: [
      { name: "4 Iron", loft: 21 },
      { name: "5 Iron", loft: 24 },
      { name: "6 Iron", loft: 27 },
      { name: "7 Iron", loft: 30.5 },
      { name: "8 Iron", loft: 34.5 },
      { name: "9 Iron", loft: 39 },
      { name: "PW", loft: 43.5 },
    ],
  },
  {
    brand: "Mizuno",
    model: "Pro 225",
    year: 2022,
    category: "Players Distance",
    clubs: [
      { name: "4 Iron", loft: 21 },
      { name: "5 Iron", loft: 24 },
      { name: "6 Iron", loft: 27 },
      { name: "7 Iron", loft: 30.5 },
      { name: "8 Iron", loft: 34.5 },
      { name: "9 Iron", loft: 39 },
      { name: "PW", loft: 43.5 },
    ],
  },
  {
    brand: "Mizuno",
    model: "JPX 925 Hot Metal",
    year: 2024,
    category: "Game Improvement",
    clubs: [
      { name: "4 Iron", loft: 19 },
      { name: "5 Iron", loft: 21.5 },
      { name: "6 Iron", loft: 24.5 },
      { name: "7 Iron", loft: 27.5 },
      { name: "8 Iron", loft: 32 },
      { name: "9 Iron", loft: 37 },
      { name: "PW", loft: 42 },
      { name: "GW", loft: 47 },
      { name: "SW", loft: 52 },
    ],
  },
  {
    brand: "Mizuno",
    model: "Pro 243",
    year: 2024,
    category: "Players",
    clubs: [
      { name: "3 Iron", loft: 20 },
      { name: "4 Iron", loft: 23 },
      { name: "5 Iron", loft: 26 },
      { name: "6 Iron", loft: 29.5 },
      { name: "7 Iron", loft: 33.5 },
      { name: "8 Iron", loft: 37.5 },
      { name: "9 Iron", loft: 42 },
      { name: "PW", loft: 46 },
    ],
  },

  // === SRIXON / CLEVELAND ===
  {
    brand: "Srixon",
    model: "ZX5 Mk II",
    year: 2023,
    category: "Players Distance",
    clubs: [
      { name: "4 Iron", loft: 22 },
      { name: "5 Iron", loft: 25 },
      { name: "6 Iron", loft: 28 },
      { name: "7 Iron", loft: 31 },
      { name: "8 Iron", loft: 35 },
      { name: "9 Iron", loft: 39 },
      { name: "PW", loft: 44 },
      { name: "AW", loft: 49 },
    ],
  },
  {
    brand: "Srixon",
    model: "ZX7 Mk II",
    year: 2023,
    category: "Players",
    clubs: [
      { name: "3 Iron", loft: 20 },
      { name: "4 Iron", loft: 23 },
      { name: "5 Iron", loft: 26 },
      { name: "6 Iron", loft: 29 },
      { name: "7 Iron", loft: 33 },
      { name: "8 Iron", loft: 37 },
      { name: "9 Iron", loft: 41 },
      { name: "PW", loft: 46 },
    ],
  },

  // === TAYLORMADE OLDER / POPULAR ===
  {
    brand: "TaylorMade",
    model: "SIM2 Max",
    year: 2021,
    category: "Game Improvement",
    clubs: [
      { name: "4 Iron", loft: 19 },
      { name: "5 Iron", loft: 21.5 },
      { name: "6 Iron", loft: 25 },
      { name: "7 Iron", loft: 28.5 },
      { name: "8 Iron", loft: 33 },
      { name: "9 Iron", loft: 38 },
      { name: "PW", loft: 43 },
      { name: "AW", loft: 49 },
      { name: "SW", loft: 54 },
    ],
  },

  // === TITLEIST AP SERIES (from user's data) ===
  {
    brand: "Titleist",
    model: "AP1",
    year: 2016,
    category: "Game Improvement",
    clubs: [
      { name: "4 Iron", loft: 23 },
      { name: "5 Iron", loft: 26 },
      { name: "6 Iron", loft: 29 },
      { name: "7 Iron", loft: 32 },
      { name: "8 Iron", loft: 36 },
      { name: "9 Iron", loft: 40 },
      { name: "PW", loft: 44 },
    ],
  },
  {
    brand: "Titleist",
    model: "AP3",
    year: 2018,
    category: "Players Distance",
    clubs: [
      { name: "3 Iron", loft: 19 },
      { name: "4 Iron", loft: 22 },
      { name: "5 Iron", loft: 25 },
      { name: "6 Iron", loft: 28 },
      { name: "7 Iron", loft: 31 },
      { name: "8 Iron", loft: 35 },
      { name: "9 Iron", loft: 39 },
      { name: "PW", loft: 43 },
      { name: "W", loft: 48 },
    ],
  },
];

// Get unique brands
export function getBrands(): string[] {
  return [...new Set(CLUB_CATALOG.map((c) => c.brand))].sort();
}

// Get models for a brand
export function getModelsForBrand(brand: string): ClubModel[] {
  return CLUB_CATALOG.filter((c) => c.brand === brand);
}

// Search catalog
export function searchCatalog(query: string): ClubModel[] {
  const q = query.toLowerCase();
  return CLUB_CATALOG.filter(
    (c) =>
      c.brand.toLowerCase().includes(q) ||
      c.model.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
  );
}
