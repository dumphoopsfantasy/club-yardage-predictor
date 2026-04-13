// Real golf club catalog with manufacturer loft specs
// Sources: manufacturer websites, Golf Digest, MyGolfSpy equipment databases

export interface ClubVariant {
  spec: string; // e.g. "Standard", "Power Spec", "Strong Loft", "Retro Spec"
  clubs: { name: string; loft: number }[];
}

export interface ClubModel {
  brand: string;
  model: string;
  year: number;
  category: "Players" | "Players Distance" | "Game Improvement" | "Super Game Improvement" | "Wedge Set" | "Hybrid/Fairway";
  variants: ClubVariant[];
}

export const CLUB_CATALOG: ClubModel[] = [

  // ===========================
  // TITLEIST
  // ===========================
  {
    brand: "Titleist",
    model: "T100",
    year: 2024,
    category: "Players",
    variants: [
      { spec: "Standard", clubs: [
        { name: "3 Iron", loft: 21 }, { name: "4 Iron", loft: 24 }, { name: "5 Iron", loft: 27 },
        { name: "6 Iron", loft: 30 }, { name: "7 Iron", loft: 34 }, { name: "8 Iron", loft: 38 },
        { name: "9 Iron", loft: 42 }, { name: "PW", loft: 46 },
      ]},
    ],
  },
  {
    brand: "Titleist",
    model: "T100S",
    year: 2024,
    category: "Players",
    variants: [
      { spec: "Standard", clubs: [
        { name: "3 Iron", loft: 19 }, { name: "4 Iron", loft: 22 }, { name: "5 Iron", loft: 25 },
        { name: "6 Iron", loft: 28 }, { name: "7 Iron", loft: 32 }, { name: "8 Iron", loft: 36 },
        { name: "9 Iron", loft: 40 }, { name: "PW", loft: 44 },
      ]},
    ],
  },
  {
    brand: "Titleist",
    model: "T150",
    year: 2024,
    category: "Players Distance",
    variants: [
      { spec: "Standard", clubs: [
        { name: "4 Iron", loft: 22 }, { name: "5 Iron", loft: 25 }, { name: "6 Iron", loft: 28 },
        { name: "7 Iron", loft: 31 }, { name: "8 Iron", loft: 35 }, { name: "9 Iron", loft: 39 },
        { name: "PW", loft: 43 },
      ]},
    ],
  },
  {
    brand: "Titleist",
    model: "T200",
    year: 2024,
    category: "Players Distance",
    variants: [
      { spec: "Standard", clubs: [
        { name: "4 Iron", loft: 21 }, { name: "5 Iron", loft: 24 }, { name: "6 Iron", loft: 27 },
        { name: "7 Iron", loft: 30 }, { name: "8 Iron", loft: 34 }, { name: "9 Iron", loft: 38 },
        { name: "PW", loft: 43 },
      ]},
    ],
  },
  {
    brand: "Titleist",
    model: "T350",
    year: 2024,
    category: "Game Improvement",
    variants: [
      { spec: "Standard", clubs: [
        { name: "5 Iron", loft: 22 }, { name: "6 Iron", loft: 25 }, { name: "7 Iron", loft: 28 },
        { name: "8 Iron", loft: 32 }, { name: "9 Iron", loft: 37 }, { name: "PW", loft: 42 },
        { name: "W", loft: 47 },
      ]},
    ],
  },
  {
    brand: "Titleist",
    model: "AP2 716",
    year: 2016,
    category: "Players",
    variants: [
      { spec: "Standard", clubs: [
        { name: "3 Iron", loft: 21 }, { name: "4 Iron", loft: 24 }, { name: "5 Iron", loft: 27 },
        { name: "6 Iron", loft: 31 }, { name: "7 Iron", loft: 35 }, { name: "8 Iron", loft: 39 },
        { name: "9 Iron", loft: 43 }, { name: "PW", loft: 47 },
      ]},
    ],
  },
  {
    brand: "Titleist",
    model: "AP2 714",
    year: 2014,
    category: "Players",
    variants: [
      { spec: "Standard", clubs: [
        { name: "3 Iron", loft: 21 }, { name: "4 Iron", loft: 24 }, { name: "5 Iron", loft: 27 },
        { name: "6 Iron", loft: 31 }, { name: "7 Iron", loft: 35 }, { name: "8 Iron", loft: 39 },
        { name: "9 Iron", loft: 43 }, { name: "PW", loft: 47 },
      ]},
    ],
  },
  {
    brand: "Titleist",
    model: "AP1",
    year: 2016,
    category: "Game Improvement",
    variants: [
      { spec: "Standard", clubs: [
        { name: "4 Iron", loft: 23 }, { name: "5 Iron", loft: 26 }, { name: "6 Iron", loft: 29 },
        { name: "7 Iron", loft: 32 }, { name: "8 Iron", loft: 36 }, { name: "9 Iron", loft: 40 },
        { name: "PW", loft: 44 },
      ]},
    ],
  },
  {
    brand: "Titleist",
    model: "AP3",
    year: 2018,
    category: "Players Distance",
    variants: [
      { spec: "Standard", clubs: [
        { name: "3 Iron", loft: 19 }, { name: "4 Iron", loft: 22 }, { name: "5 Iron", loft: 25 },
        { name: "6 Iron", loft: 28 }, { name: "7 Iron", loft: 31 }, { name: "8 Iron", loft: 35 },
        { name: "9 Iron", loft: 39 }, { name: "PW", loft: 43 }, { name: "W", loft: 48 },
      ]},
    ],
  },
  {
    brand: "Titleist",
    model: "690 MB",
    year: 2009,
    category: "Players",
    variants: [
      { spec: "Standard", clubs: [
        { name: "3 Iron", loft: 21 }, { name: "4 Iron", loft: 24 }, { name: "5 Iron", loft: 27 },
        { name: "6 Iron", loft: 31 }, { name: "7 Iron", loft: 35 }, { name: "8 Iron", loft: 39 },
        { name: "9 Iron", loft: 43 }, { name: "PW", loft: 47 },
      ]},
    ],
  },
  {
    brand: "Titleist",
    model: "Vokey SM10 Wedges",
    year: 2024,
    category: "Wedge Set",
    variants: [
      { spec: "Standard", clubs: [
        { name: "46° PW", loft: 46 }, { name: "48° GW", loft: 48 }, { name: "50° AW", loft: 50 },
        { name: "52° GW", loft: 52 }, { name: "54° SW", loft: 54 }, { name: "56° SW", loft: 56 },
        { name: "58° LW", loft: 58 }, { name: "60° LW", loft: 60 }, { name: "62° LW", loft: 62 },
      ]},
    ],
  },
  {
    brand: "Titleist",
    model: "Vokey SM9 Wedges",
    year: 2022,
    category: "Wedge Set",
    variants: [
      { spec: "Standard", clubs: [
        { name: "46° PW", loft: 46 }, { name: "48° GW", loft: 48 }, { name: "50° AW", loft: 50 },
        { name: "52° GW", loft: 52 }, { name: "54° SW", loft: 54 }, { name: "56° SW", loft: 56 },
        { name: "58° LW", loft: 58 }, { name: "60° LW", loft: 60 },
      ]},
    ],
  },

  // ===========================
  // PING
  // ===========================
  {
    brand: "Ping",
    model: "i230",
    year: 2023,
    category: "Players",
    variants: [
      { spec: "Standard", clubs: [
        { name: "3 Iron", loft: 20 }, { name: "4 Iron", loft: 23 }, { name: "5 Iron", loft: 26 },
        { name: "6 Iron", loft: 29.5 }, { name: "7 Iron", loft: 33.5 }, { name: "8 Iron", loft: 38 },
        { name: "9 Iron", loft: 42.5 }, { name: "PW", loft: 47 }, { name: "UW", loft: 52 },
      ]},
      { spec: "Power Spec", clubs: [
        { name: "3 Iron", loft: 18.5 }, { name: "4 Iron", loft: 21.5 }, { name: "5 Iron", loft: 24.5 },
        { name: "6 Iron", loft: 28 }, { name: "7 Iron", loft: 32 }, { name: "8 Iron", loft: 36.5 },
        { name: "9 Iron", loft: 41 }, { name: "PW", loft: 45.5 }, { name: "UW", loft: 50.5 },
      ]},
    ],
  },
  {
    brand: "Ping",
    model: "i210",
    year: 2018,
    category: "Players",
    variants: [
      { spec: "Standard", clubs: [
        { name: "3 Iron", loft: 19 }, { name: "4 Iron", loft: 22.5 }, { name: "5 Iron", loft: 26 },
        { name: "6 Iron", loft: 29.5 }, { name: "7 Iron", loft: 33 }, { name: "8 Iron", loft: 37 },
        { name: "9 Iron", loft: 41 }, { name: "PW", loft: 45 }, { name: "UW", loft: 50 },
      ]},
      { spec: "Power Spec", clubs: [
        { name: "3 Iron", loft: 19 }, { name: "4 Iron", loft: 22 }, { name: "5 Iron", loft: 25 },
        { name: "6 Iron", loft: 28 }, { name: "7 Iron", loft: 31.5 }, { name: "8 Iron", loft: 35.5 },
        { name: "9 Iron", loft: 40 }, { name: "PW", loft: 44.5 }, { name: "UW", loft: 49.5 },
      ]},
    ],
  },
  {
    brand: "Ping",
    model: "i500",
    year: 2018,
    category: "Players Distance",
    variants: [
      { spec: "Standard", clubs: [
        { name: "3 Iron", loft: 18 }, { name: "4 Iron", loft: 21 }, { name: "5 Iron", loft: 24 },
        { name: "6 Iron", loft: 27 }, { name: "7 Iron", loft: 30.5 }, { name: "8 Iron", loft: 35 },
        { name: "9 Iron", loft: 40 }, { name: "PW", loft: 45 }, { name: "UW", loft: 50 },
      ]},
      { spec: "Power Spec", clubs: [
        { name: "3 Iron", loft: 17 }, { name: "4 Iron", loft: 19.5 }, { name: "5 Iron", loft: 22.5 },
        { name: "6 Iron", loft: 25.5 }, { name: "7 Iron", loft: 29 }, { name: "8 Iron", loft: 33.5 },
        { name: "9 Iron", loft: 38.5 }, { name: "PW", loft: 44 }, { name: "UW", loft: 49 },
      ]},
    ],
  },
  {
    brand: "Ping",
    model: "G430",
    year: 2023,
    category: "Game Improvement",
    variants: [
      { spec: "Standard", clubs: [
        { name: "4 Iron", loft: 20.5 }, { name: "5 Iron", loft: 23.5 }, { name: "6 Iron", loft: 26.5 },
        { name: "7 Iron", loft: 30 }, { name: "8 Iron", loft: 34.5 }, { name: "9 Iron", loft: 39.5 },
        { name: "PW", loft: 44.5 }, { name: "UW", loft: 49.5 }, { name: "SW", loft: 54 },
      ]},
    ],
  },
  {
    brand: "Ping",
    model: "G430 Max",
    year: 2023,
    category: "Super Game Improvement",
    variants: [
      { spec: "Standard", clubs: [
        { name: "5 Iron", loft: 22 }, { name: "6 Iron", loft: 25 }, { name: "7 Iron", loft: 28.5 },
        { name: "8 Iron", loft: 33 }, { name: "9 Iron", loft: 38.5 }, { name: "PW", loft: 43.5 },
        { name: "UW", loft: 49 }, { name: "SW", loft: 54 },
      ]},
    ],
  },
  {
    brand: "Ping",
    model: "G425",
    year: 2021,
    category: "Game Improvement",
    variants: [
      { spec: "Standard", clubs: [
        { name: "4 Iron", loft: 21 }, { name: "5 Iron", loft: 24 }, { name: "6 Iron", loft: 27 },
        { name: "7 Iron", loft: 31 }, { name: "8 Iron", loft: 35.5 }, { name: "9 Iron", loft: 40.5 },
        { name: "PW", loft: 45.5 }, { name: "UW", loft: 50 }, { name: "SW", loft: 55 },
      ]},
    ],
  },
  {
    brand: "Ping",
    model: "G410",
    year: 2019,
    category: "Game Improvement",
    variants: [
      { spec: "Standard", clubs: [
        { name: "4 Iron", loft: 21 }, { name: "5 Iron", loft: 24 }, { name: "6 Iron", loft: 27 },
        { name: "7 Iron", loft: 31 }, { name: "8 Iron", loft: 36 }, { name: "9 Iron", loft: 41 },
        { name: "PW", loft: 46 }, { name: "UW", loft: 51 }, { name: "SW", loft: 56 },
      ]},
    ],
  },
  {
    brand: "Ping",
    model: "G400",
    year: 2017,
    category: "Game Improvement",
    variants: [
      { spec: "Standard", clubs: [
        { name: "4 Iron", loft: 21.5 }, { name: "5 Iron", loft: 24.5 }, { name: "6 Iron", loft: 27.5 },
        { name: "7 Iron", loft: 31 }, { name: "8 Iron", loft: 36 }, { name: "9 Iron", loft: 41 },
        { name: "PW", loft: 46 }, { name: "UW", loft: 51 }, { name: "SW", loft: 56 },
      ]},
    ],
  },
  {
    brand: "Ping",
    model: "G30",
    year: 2014,
    category: "Game Improvement",
    variants: [
      { spec: "Standard", clubs: [
        { name: "4 Iron", loft: 22 }, { name: "5 Iron", loft: 25.5 }, { name: "6 Iron", loft: 29 },
        { name: "7 Iron", loft: 33 }, { name: "8 Iron", loft: 37.5 }, { name: "9 Iron", loft: 42 },
        { name: "PW", loft: 47 }, { name: "UW", loft: 52 }, { name: "SW", loft: 57 },
      ]},
    ],
  },
  {
    brand: "Ping",
    model: "G25",
    year: 2013,
    category: "Game Improvement",
    variants: [
      { spec: "Standard", clubs: [
        { name: "4 Iron", loft: 22 }, { name: "5 Iron", loft: 25.5 }, { name: "6 Iron", loft: 29 },
        { name: "7 Iron", loft: 33 }, { name: "8 Iron", loft: 37.5 }, { name: "9 Iron", loft: 42 },
        { name: "PW", loft: 47 }, { name: "UW", loft: 52 }, { name: "SW", loft: 57 },
      ]},
    ],
  },
  {
    brand: "Ping",
    model: "G20",
    year: 2011,
    category: "Game Improvement",
    variants: [
      { spec: "Standard", clubs: [
        { name: "4 Iron", loft: 22 }, { name: "5 Iron", loft: 25.5 }, { name: "6 Iron", loft: 29 },
        { name: "7 Iron", loft: 33 }, { name: "8 Iron", loft: 37.5 }, { name: "9 Iron", loft: 42 },
        { name: "PW", loft: 47 }, { name: "UW", loft: 52 }, { name: "SW", loft: 57 },
      ]},
    ],
  },
  {
    brand: "Ping",
    model: "G15",
    year: 2009,
    category: "Game Improvement",
    variants: [
      { spec: "Standard", clubs: [
        { name: "4 Iron", loft: 22.5 }, { name: "5 Iron", loft: 26 }, { name: "6 Iron", loft: 30 },
        { name: "7 Iron", loft: 34 }, { name: "8 Iron", loft: 38.5 }, { name: "9 Iron", loft: 43 },
        { name: "PW", loft: 48 }, { name: "UW", loft: 53 }, { name: "SW", loft: 58 },
      ]},
    ],
  },
  {
    brand: "Ping",
    model: "G10",
    year: 2007,
    category: "Game Improvement",
    variants: [
      { spec: "Standard", clubs: [
        { name: "4 Iron", loft: 24 }, { name: "5 Iron", loft: 27.5 }, { name: "6 Iron", loft: 31 },
        { name: "7 Iron", loft: 35 }, { name: "8 Iron", loft: 39.5 }, { name: "9 Iron", loft: 44 },
        { name: "PW", loft: 49 }, { name: "UW", loft: 54 }, { name: "SW", loft: 59 },
      ]},
    ],
  },
  {
    brand: "Ping",
    model: "i20",
    year: 2011,
    category: "Players",
    variants: [
      { spec: "Standard", clubs: [
        { name: "3 Iron", loft: 20 }, { name: "4 Iron", loft: 23 }, { name: "5 Iron", loft: 26.5 },
        { name: "6 Iron", loft: 30 }, { name: "7 Iron", loft: 34 }, { name: "8 Iron", loft: 38 },
        { name: "9 Iron", loft: 42 }, { name: "PW", loft: 46 }, { name: "UW", loft: 51 },
      ]},
      { spec: "Power Spec", clubs: [
        { name: "3 Iron", loft: 18.5 }, { name: "4 Iron", loft: 21.5 }, { name: "5 Iron", loft: 25 },
        { name: "6 Iron", loft: 28.5 }, { name: "7 Iron", loft: 32.5 }, { name: "8 Iron", loft: 36.5 },
        { name: "9 Iron", loft: 40.5 }, { name: "PW", loft: 44.5 }, { name: "UW", loft: 49.5 },
      ]},
    ],
  },
  {
    brand: "Ping",
    model: "i15",
    year: 2009,
    category: "Players",
    variants: [
      { spec: "Standard", clubs: [
        { name: "3 Iron", loft: 20 }, { name: "4 Iron", loft: 23.5 }, { name: "5 Iron", loft: 27 },
        { name: "6 Iron", loft: 30.5 }, { name: "7 Iron", loft: 34.5 }, { name: "8 Iron", loft: 38.5 },
        { name: "9 Iron", loft: 43 }, { name: "PW", loft: 47.5 }, { name: "UW", loft: 52.5 },
      ]},
      { spec: "Power Spec", clubs: [
        { name: "3 Iron", loft: 18.5 }, { name: "4 Iron", loft: 22 }, { name: "5 Iron", loft: 25.5 },
        { name: "6 Iron", loft: 29 }, { name: "7 Iron", loft: 33 }, { name: "8 Iron", loft: 37 },
        { name: "9 Iron", loft: 41.5 }, { name: "PW", loft: 46 }, { name: "UW", loft: 51 },
      ]},
    ],
  },
  {
    brand: "Ping",
    model: "i10",
    year: 2007,
    category: "Players",
    variants: [
      { spec: "Standard", clubs: [
        { name: "3 Iron", loft: 21 }, { name: "4 Iron", loft: 24 }, { name: "5 Iron", loft: 27.5 },
        { name: "6 Iron", loft: 31 }, { name: "7 Iron", loft: 35 }, { name: "8 Iron", loft: 39 },
        { name: "9 Iron", loft: 43 }, { name: "PW", loft: 48 }, { name: "UW", loft: 53 },
      ]},
      { spec: "Power Spec", clubs: [
        { name: "3 Iron", loft: 19.5 }, { name: "4 Iron", loft: 22.5 }, { name: "5 Iron", loft: 26 },
        { name: "6 Iron", loft: 29.5 }, { name: "7 Iron", loft: 33.5 }, { name: "8 Iron", loft: 37.5 },
        { name: "9 Iron", loft: 41.5 }, { name: "PW", loft: 46.5 }, { name: "UW", loft: 51.5 },
      ]},
    ],
  },
  {
    brand: "Ping",
    model: "Zing",
    year: 1990,
    category: "Players",
    variants: [
      { spec: "Standard", clubs: [
        { name: "3 Iron", loft: 20.5 }, { name: "4 Iron", loft: 24 }, { name: "5 Iron", loft: 27 },
        { name: "6 Iron", loft: 30.5 }, { name: "7 Iron", loft: 34.5 }, { name: "8 Iron", loft: 38.5 },
        { name: "9 Iron", loft: 42.5 }, { name: "PW", loft: 47 }, { name: "SW", loft: 52 },
      ]},
    ],
  },
  {
    brand: "Ping",
    model: "G430 Hybrids & Fairways",
    year: 2023,
    category: "Hybrid/Fairway",
    variants: [
      { spec: "Standard", clubs: [
        { name: "3 Wood", loft: 14.5 }, { name: "5 Wood", loft: 17.5 },
        { name: "3 Hybrid", loft: 19 }, { name: "4 Hybrid", loft: 22 },
        { name: "5 Hybrid", loft: 26 }, { name: "6 Hybrid", loft: 30 },
      ]},
    ],
  },
  {
    brand: "Ping",
    model: "Glide 4.0 Wedges",
    year: 2023,
    category: "Wedge Set",
    variants: [
      { spec: "Standard", clubs: [
        { name: "46° PW", loft: 46 }, { name: "50° GW", loft: 50 }, { name: "52° GW", loft: 52 },
        { name: "54° SW", loft: 54 }, { name: "56° SW", loft: 56 }, { name: "58° LW", loft: 58 },
        { name: "60° LW", loft: 60 },
      ]},
    ],
  },

  // ===========================
  // TAYLORMADE
  // ===========================
  {
    brand: "TaylorMade",
    model: "P790",
    year: 2024,
    category: "Players Distance",
    variants: [
      { spec: "Standard", clubs: [
        { name: "3 Iron", loft: 19 }, { name: "4 Iron", loft: 21 }, { name: "5 Iron", loft: 23.5 },
        { name: "6 Iron", loft: 26.5 }, { name: "7 Iron", loft: 30 }, { name: "8 Iron", loft: 34.5 },
        { name: "9 Iron", loft: 39 }, { name: "PW", loft: 43.5 },
      ]},
    ],
  },
  {
    brand: "TaylorMade",
    model: "P770",
    year: 2024,
    category: "Players Distance",
    variants: [
      { spec: "Standard", clubs: [
        { name: "3 Iron", loft: 19 }, { name: "4 Iron", loft: 21.5 }, { name: "5 Iron", loft: 24.5 },
        { name: "6 Iron", loft: 28 }, { name: "7 Iron", loft: 32 }, { name: "8 Iron", loft: 36 },
        { name: "9 Iron", loft: 40.5 }, { name: "PW", loft: 45 },
      ]},
    ],
  },
  {
    brand: "TaylorMade",
    model: "P7MC",
    year: 2024,
    category: "Players",
    variants: [
      { spec: "Standard", clubs: [
        { name: "3 Iron", loft: 21 }, { name: "4 Iron", loft: 24 }, { name: "5 Iron", loft: 27 },
        { name: "6 Iron", loft: 31 }, { name: "7 Iron", loft: 35 }, { name: "8 Iron", loft: 39 },
        { name: "9 Iron", loft: 43 }, { name: "PW", loft: 47 },
      ]},
    ],
  },
  {
    brand: "TaylorMade",
    model: "P7MB",
    year: 2024,
    category: "Players",
    variants: [
      { spec: "Standard", clubs: [
        { name: "3 Iron", loft: 21 }, { name: "4 Iron", loft: 24 }, { name: "5 Iron", loft: 27 },
        { name: "6 Iron", loft: 31 }, { name: "7 Iron", loft: 35 }, { name: "8 Iron", loft: 39 },
        { name: "9 Iron", loft: 43 }, { name: "PW", loft: 47 },
      ]},
    ],
  },
  {
    brand: "TaylorMade",
    model: "Qi35",
    year: 2025,
    category: "Game Improvement",
    variants: [
      { spec: "Standard", clubs: [
        { name: "4 Iron", loft: 19 }, { name: "5 Iron", loft: 21.5 }, { name: "6 Iron", loft: 25 },
        { name: "7 Iron", loft: 28.5 }, { name: "8 Iron", loft: 33 }, { name: "9 Iron", loft: 38 },
        { name: "PW", loft: 43 }, { name: "AW", loft: 49 }, { name: "SW", loft: 54 },
      ]},
    ],
  },
  {
    brand: "TaylorMade",
    model: "Qi35 Max",
    year: 2025,
    category: "Super Game Improvement",
    variants: [
      { spec: "Standard", clubs: [
        { name: "5 Iron", loft: 21.5 }, { name: "6 Iron", loft: 24 }, { name: "7 Iron", loft: 27 },
        { name: "8 Iron", loft: 31.5 }, { name: "9 Iron", loft: 36 }, { name: "PW", loft: 41 },
        { name: "AW", loft: 47 }, { name: "SW", loft: 53 },
      ]},
    ],
  },
  {
    brand: "TaylorMade",
    model: "Stealth 2",
    year: 2023,
    category: "Game Improvement",
    variants: [
      { spec: "Standard", clubs: [
        { name: "4 Iron", loft: 19 }, { name: "5 Iron", loft: 21.5 }, { name: "6 Iron", loft: 25 },
        { name: "7 Iron", loft: 28.5 }, { name: "8 Iron", loft: 33 }, { name: "9 Iron", loft: 38 },
        { name: "PW", loft: 43 }, { name: "AW", loft: 49 }, { name: "SW", loft: 54 },
      ]},
    ],
  },
  {
    brand: "TaylorMade",
    model: "SIM2 Max",
    year: 2021,
    category: "Game Improvement",
    variants: [
      { spec: "Standard", clubs: [
        { name: "4 Iron", loft: 19 }, { name: "5 Iron", loft: 21.5 }, { name: "6 Iron", loft: 25 },
        { name: "7 Iron", loft: 28.5 }, { name: "8 Iron", loft: 33 }, { name: "9 Iron", loft: 38 },
        { name: "PW", loft: 43 }, { name: "AW", loft: 49 }, { name: "SW", loft: 54 },
      ]},
    ],
  },
  {
    brand: "TaylorMade",
    model: "SIM Max",
    year: 2020,
    category: "Game Improvement",
    variants: [
      { spec: "Standard", clubs: [
        { name: "4 Iron", loft: 19 }, { name: "5 Iron", loft: 21.5 }, { name: "6 Iron", loft: 25 },
        { name: "7 Iron", loft: 28.5 }, { name: "8 Iron", loft: 33 }, { name: "9 Iron", loft: 38 },
        { name: "PW", loft: 43 }, { name: "AW", loft: 49 }, { name: "SW", loft: 54 },
      ]},
    ],
  },
  {
    brand: "TaylorMade",
    model: "M2",
    year: 2017,
    category: "Game Improvement",
    variants: [
      { spec: "Standard", clubs: [
        { name: "4 Iron", loft: 19 }, { name: "5 Iron", loft: 21.5 }, { name: "6 Iron", loft: 25 },
        { name: "7 Iron", loft: 28.5 }, { name: "8 Iron", loft: 33 }, { name: "9 Iron", loft: 38 },
        { name: "PW", loft: 43 }, { name: "AW", loft: 49 }, { name: "SW", loft: 54 },
      ]},
    ],
  },
  {
    brand: "TaylorMade",
    model: "M4",
    year: 2018,
    category: "Game Improvement",
    variants: [
      { spec: "Standard", clubs: [
        { name: "4 Iron", loft: 19.5 }, { name: "5 Iron", loft: 22.5 }, { name: "6 Iron", loft: 26 },
        { name: "7 Iron", loft: 29.5 }, { name: "8 Iron", loft: 34 }, { name: "9 Iron", loft: 39 },
        { name: "PW", loft: 44 }, { name: "AW", loft: 49 }, { name: "SW", loft: 54 },
      ]},
    ],
  },
  {
    brand: "TaylorMade",
    model: "RSi 1",
    year: 2015,
    category: "Game Improvement",
    variants: [
      { spec: "Standard", clubs: [
        { name: "4 Iron", loft: 20 }, { name: "5 Iron", loft: 23 }, { name: "6 Iron", loft: 26 },
        { name: "7 Iron", loft: 30 }, { name: "8 Iron", loft: 35 }, { name: "9 Iron", loft: 40 },
        { name: "PW", loft: 45 }, { name: "AW", loft: 50 }, { name: "SW", loft: 55 },
      ]},
    ],
  },
  {
    brand: "TaylorMade",
    model: "RocketBladez",
    year: 2013,
    category: "Game Improvement",
    variants: [
      { spec: "Standard", clubs: [
        { name: "4 Iron", loft: 19 }, { name: "5 Iron", loft: 22 }, { name: "6 Iron", loft: 25 },
        { name: "7 Iron", loft: 28 }, { name: "8 Iron", loft: 32 }, { name: "9 Iron", loft: 37 },
        { name: "PW", loft: 42 }, { name: "AW", loft: 47 }, { name: "SW", loft: 52 },
      ]},
    ],
  },
  {
    brand: "TaylorMade",
    model: "Burner 2.0",
    year: 2010,
    category: "Game Improvement",
    variants: [
      { spec: "Standard", clubs: [
        { name: "4 Iron", loft: 19 }, { name: "5 Iron", loft: 22.5 }, { name: "6 Iron", loft: 26 },
        { name: "7 Iron", loft: 30 }, { name: "8 Iron", loft: 34.5 }, { name: "9 Iron", loft: 39 },
        { name: "PW", loft: 44 }, { name: "AW", loft: 49 }, { name: "SW", loft: 54 },
      ]},
    ],
  },
  {
    brand: "TaylorMade",
    model: "Burner Plus",
    year: 2009,
    category: "Game Improvement",
    variants: [
      { spec: "Standard", clubs: [
        { name: "4 Iron", loft: 20 }, { name: "5 Iron", loft: 23 }, { name: "6 Iron", loft: 26.5 },
        { name: "7 Iron", loft: 30.5 }, { name: "8 Iron", loft: 35 }, { name: "9 Iron", loft: 40 },
        { name: "PW", loft: 45 }, { name: "AW", loft: 50 }, { name: "SW", loft: 55 },
      ]},
    ],
  },
  {
    brand: "TaylorMade",
    model: "r7 CGB Max",
    year: 2006,
    category: "Super Game Improvement",
    variants: [
      { spec: "Standard", clubs: [
        { name: "4 Iron", loft: 20 }, { name: "5 Iron", loft: 23 }, { name: "6 Iron", loft: 26.5 },
        { name: "7 Iron", loft: 31 }, { name: "8 Iron", loft: 36 }, { name: "9 Iron", loft: 41 },
        { name: "PW", loft: 46 }, { name: "AW", loft: 51 }, { name: "SW", loft: 56 },
      ]},
    ],
  },
  {
    brand: "TaylorMade",
    model: "MG4 Wedges",
    year: 2024,
    category: "Wedge Set",
    variants: [
      { spec: "Standard", clubs: [
        { name: "46° PW", loft: 46 }, { name: "48° GW", loft: 48 }, { name: "50° AW", loft: 50 },
        { name: "52° GW", loft: 52 }, { name: "54° SW", loft: 54 }, { name: "56° SW", loft: 56 },
        { name: "58° LW", loft: 58 }, { name: "60° LW", loft: 60 },
      ]},
    ],
  },
  {
    brand: "TaylorMade",
    model: "Qi35 Hybrids & Fairways",
    year: 2025,
    category: "Hybrid/Fairway",
    variants: [
      { spec: "Standard", clubs: [
        { name: "3 Wood", loft: 15 }, { name: "5 Wood", loft: 19 }, { name: "7 Wood", loft: 22 },
        { name: "3 Hybrid", loft: 19.5 }, { name: "4 Hybrid", loft: 22 },
        { name: "5 Hybrid", loft: 25 }, { name: "6 Hybrid", loft: 28 },
      ]},
    ],
  },

  // ===========================
  // CALLAWAY
  // ===========================
  {
    brand: "Callaway",
    model: "Apex Pro",
    year: 2024,
    category: "Players",
    variants: [
      { spec: "Standard", clubs: [
        { name: "3 Iron", loft: 20 }, { name: "4 Iron", loft: 23 }, { name: "5 Iron", loft: 26 },
        { name: "6 Iron", loft: 29 }, { name: "7 Iron", loft: 33 }, { name: "8 Iron", loft: 37 },
        { name: "9 Iron", loft: 41 }, { name: "PW", loft: 45 },
      ]},
    ],
  },
  {
    brand: "Callaway",
    model: "Apex",
    year: 2024,
    category: "Players Distance",
    variants: [
      { spec: "Standard", clubs: [
        { name: "4 Iron", loft: 20 }, { name: "5 Iron", loft: 23 }, { name: "6 Iron", loft: 26 },
        { name: "7 Iron", loft: 29 }, { name: "8 Iron", loft: 33 }, { name: "9 Iron", loft: 37.5 },
        { name: "PW", loft: 42 }, { name: "AW", loft: 47 },
      ]},
    ],
  },
  {
    brand: "Callaway",
    model: "Paradym Ai Smoke",
    year: 2024,
    category: "Game Improvement",
    variants: [
      { spec: "Standard", clubs: [
        { name: "4 Iron", loft: 19 }, { name: "5 Iron", loft: 21.5 }, { name: "6 Iron", loft: 24.5 },
        { name: "7 Iron", loft: 27.5 }, { name: "8 Iron", loft: 31.5 }, { name: "9 Iron", loft: 36 },
        { name: "PW", loft: 41 }, { name: "AW", loft: 46 }, { name: "SW", loft: 51 },
      ]},
    ],
  },
  {
    brand: "Callaway",
    model: "Paradym Ai Smoke Max",
    year: 2024,
    category: "Super Game Improvement",
    variants: [
      { spec: "Standard", clubs: [
        { name: "5 Iron", loft: 21 }, { name: "6 Iron", loft: 23.5 }, { name: "7 Iron", loft: 26.5 },
        { name: "8 Iron", loft: 30 }, { name: "9 Iron", loft: 35 }, { name: "PW", loft: 40 },
        { name: "AW", loft: 45 }, { name: "SW", loft: 50 },
      ]},
    ],
  },
  {
    brand: "Callaway",
    model: "Big Bertha",
    year: 2023,
    category: "Super Game Improvement",
    variants: [
      { spec: "Standard", clubs: [
        { name: "5 Iron", loft: 22 }, { name: "6 Iron", loft: 25 }, { name: "7 Iron", loft: 28 },
        { name: "8 Iron", loft: 32 }, { name: "9 Iron", loft: 37 }, { name: "PW", loft: 42 },
        { name: "AW", loft: 47 }, { name: "SW", loft: 52 },
      ]},
    ],
  },
  {
    brand: "Callaway",
    model: "Mavrik",
    year: 2020,
    category: "Game Improvement",
    variants: [
      { spec: "Standard", clubs: [
        { name: "4 Iron", loft: 18 }, { name: "5 Iron", loft: 21 }, { name: "6 Iron", loft: 24 },
        { name: "7 Iron", loft: 27 }, { name: "8 Iron", loft: 31.5 }, { name: "9 Iron", loft: 36 },
        { name: "PW", loft: 41 }, { name: "AW", loft: 46 }, { name: "GW", loft: 51 }, { name: "SW", loft: 56 },
      ]},
    ],
  },
  {
    brand: "Callaway",
    model: "Rogue ST Max",
    year: 2022,
    category: "Game Improvement",
    variants: [
      { spec: "Standard", clubs: [
        { name: "4 Iron", loft: 18 }, { name: "5 Iron", loft: 20.5 }, { name: "6 Iron", loft: 23.5 },
        { name: "7 Iron", loft: 27 }, { name: "8 Iron", loft: 31 }, { name: "9 Iron", loft: 36 },
        { name: "PW", loft: 41 }, { name: "AW", loft: 46 }, { name: "SW", loft: 51 },
      ]},
    ],
  },
  {
    brand: "Callaway",
    model: "Epic Max",
    year: 2021,
    category: "Game Improvement",
    variants: [
      { spec: "Standard", clubs: [
        { name: "4 Iron", loft: 18 }, { name: "5 Iron", loft: 20.5 }, { name: "6 Iron", loft: 23.5 },
        { name: "7 Iron", loft: 27 }, { name: "8 Iron", loft: 31 }, { name: "9 Iron", loft: 35.5 },
        { name: "PW", loft: 40.5 }, { name: "AW", loft: 45.5 }, { name: "SW", loft: 50.5 },
      ]},
    ],
  },
  {
    brand: "Callaway",
    model: "X Hot",
    year: 2013,
    category: "Game Improvement",
    variants: [
      { spec: "Standard", clubs: [
        { name: "4 Iron", loft: 19 }, { name: "5 Iron", loft: 22 }, { name: "6 Iron", loft: 25 },
        { name: "7 Iron", loft: 28 }, { name: "8 Iron", loft: 32 }, { name: "9 Iron", loft: 37 },
        { name: "PW", loft: 42 }, { name: "AW", loft: 47 }, { name: "SW", loft: 52 },
      ]},
    ],
  },
  {
    brand: "Callaway",
    model: "X-24 Hot",
    year: 2012,
    category: "Game Improvement",
    variants: [
      { spec: "Standard", clubs: [
        { name: "4 Iron", loft: 20 }, { name: "5 Iron", loft: 23 }, { name: "6 Iron", loft: 26 },
        { name: "7 Iron", loft: 29 }, { name: "8 Iron", loft: 33 }, { name: "9 Iron", loft: 38 },
        { name: "PW", loft: 43 }, { name: "AW", loft: 48 }, { name: "SW", loft: 54 },
      ]},
    ],
  },
  {
    brand: "Callaway",
    model: "X-20",
    year: 2008,
    category: "Game Improvement",
    variants: [
      { spec: "Standard", clubs: [
        { name: "3 Iron", loft: 21 }, { name: "4 Iron", loft: 24 }, { name: "5 Iron", loft: 27 },
        { name: "6 Iron", loft: 30 }, { name: "7 Iron", loft: 34 }, { name: "8 Iron", loft: 38 },
        { name: "9 Iron", loft: 43 }, { name: "PW", loft: 48 }, { name: "AW", loft: 52 }, { name: "SW", loft: 56 },
      ]},
    ],
  },
  {
    brand: "Callaway",
    model: "Big Bertha 2004",
    year: 2004,
    category: "Super Game Improvement",
    variants: [
      { spec: "Standard", clubs: [
        { name: "3 Iron", loft: 22 }, { name: "4 Iron", loft: 25 }, { name: "5 Iron", loft: 28 },
        { name: "6 Iron", loft: 31 }, { name: "7 Iron", loft: 35 }, { name: "8 Iron", loft: 39 },
        { name: "9 Iron", loft: 43 }, { name: "PW", loft: 47 }, { name: "SW", loft: 55 },
      ]},
    ],
  },
  {
    brand: "Callaway",
    model: "Jaws Raw Wedges",
    year: 2024,
    category: "Wedge Set",
    variants: [
      { spec: "Standard", clubs: [
        { name: "46° PW", loft: 46 }, { name: "48° GW", loft: 48 }, { name: "50° AW", loft: 50 },
        { name: "52° GW", loft: 52 }, { name: "54° SW", loft: 54 }, { name: "56° SW", loft: 56 },
        { name: "58° LW", loft: 58 }, { name: "60° LW", loft: 60 },
      ]},
    ],
  },
  {
    brand: "Callaway",
    model: "Paradym Ai Smoke Hybrids & Fairways",
    year: 2024,
    category: "Hybrid/Fairway",
    variants: [
      { spec: "Standard", clubs: [
        { name: "3 Wood", loft: 15 }, { name: "5 Wood", loft: 18 }, { name: "7 Wood", loft: 21 },
        { name: "2 Hybrid", loft: 17 }, { name: "3 Hybrid", loft: 19 }, { name: "4 Hybrid", loft: 22 },
        { name: "5 Hybrid", loft: 25 }, { name: "6 Hybrid", loft: 28 },
      ]},
    ],
  },

  // ===========================
  // COBRA
  // ===========================
  {
    brand: "Cobra",
    model: "Darkspeed",
    year: 2024,
    category: "Game Improvement",
    variants: [
      { spec: "Standard", clubs: [
        { name: "4 Iron", loft: 19 }, { name: "5 Iron", loft: 21.5 }, { name: "6 Iron", loft: 24.5 },
        { name: "7 Iron", loft: 27.5 }, { name: "8 Iron", loft: 31.5 }, { name: "9 Iron", loft: 36 },
        { name: "PW", loft: 41 }, { name: "GW", loft: 46 }, { name: "SW", loft: 51 },
      ]},
    ],
  },
  {
    brand: "Cobra",
    model: "King Forged Tec",
    year: 2024,
    category: "Players Distance",
    variants: [
      { spec: "Standard", clubs: [
        { name: "4 Iron", loft: 21 }, { name: "5 Iron", loft: 24 }, { name: "6 Iron", loft: 27 },
        { name: "7 Iron", loft: 30.5 }, { name: "8 Iron", loft: 35 }, { name: "9 Iron", loft: 39 },
        { name: "PW", loft: 44 },
      ]},
    ],
  },
  {
    brand: "Cobra",
    model: "King Tour",
    year: 2023,
    category: "Players",
    variants: [
      { spec: "Standard", clubs: [
        { name: "3 Iron", loft: 20 }, { name: "4 Iron", loft: 23 }, { name: "5 Iron", loft: 26 },
        { name: "6 Iron", loft: 29 }, { name: "7 Iron", loft: 33 }, { name: "8 Iron", loft: 37 },
        { name: "9 Iron", loft: 41 }, { name: "PW", loft: 45 },
      ]},
    ],
  },
  {
    brand: "Cobra",
    model: "Fly-Z+",
    year: 2015,
    category: "Players Distance",
    variants: [
      { spec: "Standard", clubs: [
        { name: "4 Iron", loft: 21 }, { name: "5 Iron", loft: 24 }, { name: "6 Iron", loft: 27 },
        { name: "7 Iron", loft: 30.5 }, { name: "8 Iron", loft: 35 }, { name: "9 Iron", loft: 40 },
        { name: "PW", loft: 44.5 },
      ]},
    ],
  },
  {
    brand: "Cobra",
    model: "Bio Cell",
    year: 2014,
    category: "Game Improvement",
    variants: [
      { spec: "Standard", clubs: [
        { name: "4 Iron", loft: 19.5 }, { name: "5 Iron", loft: 22.5 }, { name: "6 Iron", loft: 26 },
        { name: "7 Iron", loft: 30 }, { name: "8 Iron", loft: 34.5 }, { name: "9 Iron", loft: 39.5 },
        { name: "PW", loft: 44.5 }, { name: "GW", loft: 50 }, { name: "SW", loft: 55 },
      ]},
    ],
  },
  {
    brand: "Cobra",
    model: "Snakebite Wedges",
    year: 2024,
    category: "Wedge Set",
    variants: [
      { spec: "Standard", clubs: [
        { name: "46° PW", loft: 46 }, { name: "50° AW", loft: 50 }, { name: "52° GW", loft: 52 },
        { name: "54° SW", loft: 54 }, { name: "56° SW", loft: 56 }, { name: "58° LW", loft: 58 },
        { name: "60° LW", loft: 60 },
      ]},
    ],
  },

  // ===========================
  // MIZUNO
  // ===========================
  {
    brand: "Mizuno",
    model: "Pro 243",
    year: 2024,
    category: "Players",
    variants: [
      { spec: "Standard", clubs: [
        { name: "3 Iron", loft: 20 }, { name: "4 Iron", loft: 23 }, { name: "5 Iron", loft: 26 },
        { name: "6 Iron", loft: 29.5 }, { name: "7 Iron", loft: 33.5 }, { name: "8 Iron", loft: 37.5 },
        { name: "9 Iron", loft: 42 }, { name: "PW", loft: 46 },
      ]},
    ],
  },
  {
    brand: "Mizuno",
    model: "Pro 245",
    year: 2024,
    category: "Players Distance",
    variants: [
      { spec: "Standard", clubs: [
        { name: "4 Iron", loft: 21 }, { name: "5 Iron", loft: 24 }, { name: "6 Iron", loft: 27 },
        { name: "7 Iron", loft: 30.5 }, { name: "8 Iron", loft: 34.5 }, { name: "9 Iron", loft: 39 },
        { name: "PW", loft: 43.5 },
      ]},
    ],
  },
  {
    brand: "Mizuno",
    model: "Pro 225",
    year: 2022,
    category: "Players Distance",
    variants: [
      { spec: "Standard", clubs: [
        { name: "4 Iron", loft: 21 }, { name: "5 Iron", loft: 24 }, { name: "6 Iron", loft: 27 },
        { name: "7 Iron", loft: 30.5 }, { name: "8 Iron", loft: 34.5 }, { name: "9 Iron", loft: 39 },
        { name: "PW", loft: 43.5 },
      ]},
    ],
  },
  {
    brand: "Mizuno",
    model: "JPX 925 Hot Metal",
    year: 2024,
    category: "Game Improvement",
    variants: [
      { spec: "Standard", clubs: [
        { name: "4 Iron", loft: 19 }, { name: "5 Iron", loft: 21.5 }, { name: "6 Iron", loft: 24.5 },
        { name: "7 Iron", loft: 27.5 }, { name: "8 Iron", loft: 32 }, { name: "9 Iron", loft: 37 },
        { name: "PW", loft: 42 }, { name: "GW", loft: 47 }, { name: "SW", loft: 52 },
      ]},
    ],
  },
  {
    brand: "Mizuno",
    model: "JPX 925 Hot Metal Pro",
    year: 2024,
    category: "Players Distance",
    variants: [
      { spec: "Standard", clubs: [
        { name: "4 Iron", loft: 19 }, { name: "5 Iron", loft: 22 },
        { name: "6 Iron", loft: 25 }, { name: "7 Iron", loft: 28 },
        { name: "8 Iron", loft: 32.5 }, { name: "9 Iron", loft: 37 },
        { name: "PW", loft: 42 }, { name: "GW", loft: 48 },
      ]},
    ],
  },
  {
    brand: "Mizuno",
    model: "MP-20",
    year: 2019,
    category: "Players",
    variants: [
      { spec: "Standard", clubs: [
        { name: "3 Iron", loft: 20 }, { name: "4 Iron", loft: 23 }, { name: "5 Iron", loft: 26.5 },
        { name: "6 Iron", loft: 30 }, { name: "7 Iron", loft: 34 }, { name: "8 Iron", loft: 38 },
        { name: "9 Iron", loft: 42.5 }, { name: "PW", loft: 47 },
      ]},
    ],
  },
  {
    brand: "Mizuno",
    model: "MP-18",
    year: 2017,
    category: "Players",
    variants: [
      { spec: "Standard", clubs: [
        { name: "3 Iron", loft: 20 }, { name: "4 Iron", loft: 23.5 }, { name: "5 Iron", loft: 27 },
        { name: "6 Iron", loft: 30.5 }, { name: "7 Iron", loft: 34.5 }, { name: "8 Iron", loft: 38.5 },
        { name: "9 Iron", loft: 43 }, { name: "PW", loft: 47.5 },
      ]},
    ],
  },
  {
    brand: "Mizuno",
    model: "JPX 900 Hot Metal",
    year: 2017,
    category: "Game Improvement",
    variants: [
      { spec: "Standard", clubs: [
        { name: "4 Iron", loft: 19 }, { name: "5 Iron", loft: 21.5 }, { name: "6 Iron", loft: 24.5 },
        { name: "7 Iron", loft: 27.5 }, { name: "8 Iron", loft: 31 }, { name: "9 Iron", loft: 35.5 },
        { name: "PW", loft: 40 }, { name: "GW", loft: 45 }, { name: "SW", loft: 50 },
      ]},
    ],
  },
  {
    brand: "Mizuno",
    model: "MP-64",
    year: 2014,
    category: "Players",
    variants: [
      { spec: "Standard", clubs: [
        { name: "3 Iron", loft: 20 }, { name: "4 Iron", loft: 23 }, { name: "5 Iron", loft: 26.5 },
        { name: "6 Iron", loft: 30 }, { name: "7 Iron", loft: 34 }, { name: "8 Iron", loft: 38 },
        { name: "9 Iron", loft: 42 }, { name: "PW", loft: 46 },
      ]},
    ],
  },
  {
    brand: "Mizuno",
    model: "ES21 Wedges",
    year: 2021,
    category: "Wedge Set",
    variants: [
      { spec: "Standard", clubs: [
        { name: "46° PW", loft: 46 }, { name: "50° AW", loft: 50 }, { name: "52° GW", loft: 52 },
        { name: "54° SW", loft: 54 }, { name: "56° SW", loft: 56 }, { name: "58° LW", loft: 58 },
        { name: "60° LW", loft: 60 },
      ]},
    ],
  },

  // ===========================
  // SRIXON
  // ===========================
  {
    brand: "Srixon",
    model: "ZX7 Mk II",
    year: 2023,
    category: "Players",
    variants: [
      { spec: "Standard", clubs: [
        { name: "3 Iron", loft: 20 }, { name: "4 Iron", loft: 23 }, { name: "5 Iron", loft: 26 },
        { name: "6 Iron", loft: 29 }, { name: "7 Iron", loft: 33 }, { name: "8 Iron", loft: 37 },
        { name: "9 Iron", loft: 41 }, { name: "PW", loft: 46 },
      ]},
    ],
  },
  {
    brand: "Srixon",
    model: "ZX5 Mk II",
    year: 2023,
    category: "Players Distance",
    variants: [
      { spec: "Standard", clubs: [
        { name: "4 Iron", loft: 22 }, { name: "5 Iron", loft: 25 }, { name: "6 Iron", loft: 28 },
        { name: "7 Iron", loft: 31 }, { name: "8 Iron", loft: 35 }, { name: "9 Iron", loft: 39 },
        { name: "PW", loft: 44 }, { name: "AW", loft: 49 },
      ]},
    ],
  },
  {
    brand: "Srixon",
    model: "ZX4 Mk II",
    year: 2023,
    category: "Game Improvement",
    variants: [
      { spec: "Standard", clubs: [
        { name: "5 Iron", loft: 22 }, { name: "6 Iron", loft: 25 }, { name: "7 Iron", loft: 28 },
        { name: "8 Iron", loft: 32 }, { name: "9 Iron", loft: 37 }, { name: "PW", loft: 42 },
        { name: "AW", loft: 47 }, { name: "SW", loft: 52 },
      ]},
    ],
  },
  {
    brand: "Srixon",
    model: "Z785",
    year: 2018,
    category: "Players",
    variants: [
      { spec: "Standard", clubs: [
        { name: "3 Iron", loft: 20 }, { name: "4 Iron", loft: 23 }, { name: "5 Iron", loft: 26 },
        { name: "6 Iron", loft: 29.5 }, { name: "7 Iron", loft: 33.5 }, { name: "8 Iron", loft: 37.5 },
        { name: "9 Iron", loft: 42 }, { name: "PW", loft: 46 },
      ]},
    ],
  },
  {
    brand: "Srixon",
    model: "Z585",
    year: 2018,
    category: "Game Improvement",
    variants: [
      { spec: "Standard", clubs: [
        { name: "4 Iron", loft: 20.5 }, { name: "5 Iron", loft: 23.5 }, { name: "6 Iron", loft: 26.5 },
        { name: "7 Iron", loft: 30 }, { name: "8 Iron", loft: 34.5 }, { name: "9 Iron", loft: 39.5 },
        { name: "PW", loft: 44.5 }, { name: "AW", loft: 49.5 },
      ]},
    ],
  },
  {
    brand: "Srixon",
    model: "Z965",
    year: 2016,
    category: "Players",
    variants: [
      { spec: "Standard", clubs: [
        { name: "3 Iron", loft: 21 }, { name: "4 Iron", loft: 24 }, { name: "5 Iron", loft: 27 },
        { name: "6 Iron", loft: 30 }, { name: "7 Iron", loft: 34 }, { name: "8 Iron", loft: 38 },
        { name: "9 Iron", loft: 42 }, { name: "PW", loft: 46 },
      ]},
    ],
  },

  // ===========================
  // CLEVELAND
  // ===========================
  {
    brand: "Cleveland",
    model: "Launcher XL",
    year: 2022,
    category: "Super Game Improvement",
    variants: [
      { spec: "Standard", clubs: [
        { name: "5 Iron", loft: 22 }, { name: "6 Iron", loft: 25 }, { name: "7 Iron", loft: 28 },
        { name: "8 Iron", loft: 32 }, { name: "9 Iron", loft: 36.5 }, { name: "PW", loft: 41 },
        { name: "AW", loft: 46 }, { name: "SW", loft: 51 },
      ]},
    ],
  },
  {
    brand: "Cleveland",
    model: "Launcher HB Turbo",
    year: 2020,
    category: "Super Game Improvement",
    variants: [
      { spec: "Standard", clubs: [
        { name: "4 Iron", loft: 20 }, { name: "5 Iron", loft: 23 }, { name: "6 Iron", loft: 26 },
        { name: "7 Iron", loft: 29 }, { name: "8 Iron", loft: 33 }, { name: "9 Iron", loft: 38 },
        { name: "PW", loft: 43 }, { name: "AW", loft: 48 }, { name: "SW", loft: 53 },
      ]},
    ],
  },
  {
    brand: "Cleveland",
    model: "CG7",
    year: 2006,
    category: "Players Distance",
    variants: [
      { spec: "Standard", clubs: [
        { name: "3 Iron", loft: 21 }, { name: "4 Iron", loft: 24 }, { name: "5 Iron", loft: 27 },
        { name: "6 Iron", loft: 31 }, { name: "7 Iron", loft: 35 }, { name: "8 Iron", loft: 39 },
        { name: "9 Iron", loft: 43 }, { name: "PW", loft: 47 },
      ]},
    ],
  },
  {
    brand: "Cleveland",
    model: "RTX 6 ZipCore Wedges",
    year: 2023,
    category: "Wedge Set",
    variants: [
      { spec: "Standard", clubs: [
        { name: "46° PW", loft: 46 }, { name: "50° AW", loft: 50 }, { name: "52° GW", loft: 52 },
        { name: "54° SW", loft: 54 }, { name: "56° SW", loft: 56 }, { name: "58° LW", loft: 58 },
        { name: "60° LW", loft: 60 },
      ]},
    ],
  },

  // ===========================
  // WILSON
  // ===========================
  {
    brand: "Wilson",
    model: "Staff Model",
    year: 2023,
    category: "Players",
    variants: [
      { spec: "Standard", clubs: [
        { name: "3 Iron", loft: 21 }, { name: "4 Iron", loft: 24 }, { name: "5 Iron", loft: 27 },
        { name: "6 Iron", loft: 30 }, { name: "7 Iron", loft: 34 }, { name: "8 Iron", loft: 38 },
        { name: "9 Iron", loft: 42 }, { name: "PW", loft: 46 },
      ]},
    ],
  },
  {
    brand: "Wilson",
    model: "Dynapower",
    year: 2023,
    category: "Game Improvement",
    variants: [
      { spec: "Standard", clubs: [
        { name: "4 Iron", loft: 19 }, { name: "5 Iron", loft: 22 }, { name: "6 Iron", loft: 25 },
        { name: "7 Iron", loft: 29 }, { name: "8 Iron", loft: 34 }, { name: "9 Iron", loft: 39 },
        { name: "PW", loft: 44 }, { name: "AW", loft: 49 }, { name: "SW", loft: 54 },
      ]},
    ],
  },
  {
    brand: "Wilson",
    model: "Staff Model CB",
    year: 2019,
    category: "Players",
    variants: [
      { spec: "Standard", clubs: [
        { name: "3 Iron", loft: 21 }, { name: "4 Iron", loft: 24 }, { name: "5 Iron", loft: 27 },
        { name: "6 Iron", loft: 30.5 }, { name: "7 Iron", loft: 34.5 }, { name: "8 Iron", loft: 38.5 },
        { name: "9 Iron", loft: 43 }, { name: "PW", loft: 47 },
      ]},
    ],
  },

  // ===========================
  // NIKE (discontinued 2016)
  // ===========================
  {
    brand: "Nike",
    model: "Vapor Pro",
    year: 2015,
    category: "Players",
    variants: [
      { spec: "Standard", clubs: [
        { name: "3 Iron", loft: 20 }, { name: "4 Iron", loft: 23 }, { name: "5 Iron", loft: 26 },
        { name: "6 Iron", loft: 30 }, { name: "7 Iron", loft: 34 }, { name: "8 Iron", loft: 38 },
        { name: "9 Iron", loft: 42 }, { name: "PW", loft: 46 },
      ]},
    ],
  },
  {
    brand: "Nike",
    model: "VR Pro Combo",
    year: 2012,
    category: "Players Distance",
    variants: [
      { spec: "Standard", clubs: [
        { name: "3 Iron", loft: 20 }, { name: "4 Iron", loft: 23 }, { name: "5 Iron", loft: 26 },
        { name: "6 Iron", loft: 30 }, { name: "7 Iron", loft: 34 }, { name: "8 Iron", loft: 38 },
        { name: "9 Iron", loft: 42 }, { name: "PW", loft: 46 },
      ]},
    ],
  },
  {
    brand: "Nike",
    model: "SasQuatch Slingshot",
    year: 2007,
    category: "Super Game Improvement",
    variants: [
      { spec: "Standard", clubs: [
        { name: "4 Iron", loft: 22 }, { name: "5 Iron", loft: 25 }, { name: "6 Iron", loft: 28.5 },
        { name: "7 Iron", loft: 32.5 }, { name: "8 Iron", loft: 37 }, { name: "9 Iron", loft: 42 },
        { name: "PW", loft: 47 }, { name: "AW", loft: 52 }, { name: "SW", loft: 57 },
      ]},
    ],
  },

  // ===========================
  // ADAMS
  // ===========================
  {
    brand: "Adams",
    model: "Idea a12",
    year: 2012,
    category: "Super Game Improvement",
    variants: [
      { spec: "Standard", clubs: [
        { name: "4 Iron", loft: 22 }, { name: "5 Iron", loft: 25 }, { name: "6 Iron", loft: 28 },
        { name: "7 Iron", loft: 32 }, { name: "8 Iron", loft: 37 }, { name: "9 Iron", loft: 42 },
        { name: "PW", loft: 47 }, { name: "GW", loft: 52 }, { name: "SW", loft: 57 },
      ]},
    ],
  },
  {
    brand: "Adams",
    model: "Idea Pro",
    year: 2010,
    category: "Players Distance",
    variants: [
      { spec: "Standard", clubs: [
        { name: "3 Iron", loft: 21 }, { name: "4 Iron", loft: 24 }, { name: "5 Iron", loft: 27 },
        { name: "6 Iron", loft: 30 }, { name: "7 Iron", loft: 34 }, { name: "8 Iron", loft: 38 },
        { name: "9 Iron", loft: 42 }, { name: "PW", loft: 46 },
      ]},
    ],
  },
  {
    brand: "Adams",
    model: "Tight Lies Hybrids",
    year: 2014,
    category: "Hybrid/Fairway",
    variants: [
      { spec: "Standard", clubs: [
        { name: "3 Hybrid", loft: 19 }, { name: "4 Hybrid", loft: 22 },
        { name: "5 Hybrid", loft: 25 }, { name: "6 Hybrid", loft: 28 }, { name: "7 Hybrid", loft: 31 },
      ]},
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

// Get variants for a specific model
export function getVariantsForModel(brand: string, modelName: string): ClubVariant[] {
  const model = CLUB_CATALOG.find((c) => c.brand === brand && c.model === modelName);
  return model ? model.variants : [];
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
