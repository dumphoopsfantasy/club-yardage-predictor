import { useState, useEffect, useCallback, useRef } from "react";

interface WindData {
  speed: number; // mph
  direction: number; // degrees (meteorological)
  directionLabel: string; // e.g. "NW"
  fetchedAt: number; // timestamp
}

interface UseWindReturn {
  wind: WindData | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
  locationGranted: boolean;
}

const CACHE_DURATION_MS = 10 * 60 * 1000; // 10 minutes

function degreesToLabel(deg: number): string {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const idx = Math.round(deg / 45) % 8;
  return dirs[idx];
}

// Convert km/h from Open-Meteo to mph
function kmhToMph(kmh: number): number {
  return Math.round(kmh * 0.621371);
}

export function useWind(): UseWindReturn {
  const [wind, setWind] = useState<WindData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationGranted, setLocationGranted] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const fetchWind = useCallback(async () => {
    // Check cache
    if (wind && Date.now() - wind.fetchedAt < CACHE_DURATION_MS) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get position
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          maximumAge: 300000,
        });
      });

      setLocationGranted(true);
      const { latitude, longitude } = position.coords;

      abortRef.current?.abort();
      abortRef.current = new AbortController();

      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=wind_speed_10m,wind_direction_10m`,
        { signal: abortRef.current.signal }
      );

      if (!res.ok) throw new Error("Weather API error");

      const data = await res.json();
      const speedKmh = data.current?.wind_speed_10m ?? 0;
      const direction = data.current?.wind_direction_10m ?? 0;

      setWind({
        speed: kmhToMph(speedKmh),
        direction,
        directionLabel: degreesToLabel(direction),
        fetchedAt: Date.now(),
      });
    } catch (err: any) {
      if (err?.name === "AbortError") return;
      if (err?.code === 1) {
        setError("Location denied");
      } else if (err?.code === 2) {
        setError("Location unavailable");
      } else {
        setError("Could not fetch wind");
      }
    } finally {
      setLoading(false);
    }
  }, [wind]);

  // Auto-fetch on mount
  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }
    fetchWind();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { wind, loading, error, refresh: fetchWind, locationGranted };
}
