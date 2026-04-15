import { useState, useEffect, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Club, Calibration } from "@shared/schema";
import {
  calculatePDF,
  calculatePlaysAs,
  recommendClub,
  type EnvironmentalConditions,
} from "@/lib/yardage-model";
import { Wind, Thermometer, Mountain, ArrowUp, ArrowDown, ChevronUp, ChevronDown, MapPin, Loader2 } from "lucide-react";

type WindDir = EnvironmentalConditions["windDirection"];
type Lie = EnvironmentalConditions["lie"];
type LieSeverity = EnvironmentalConditions["lieSeverity"];
type Rough = EnvironmentalConditions["rough"];

export default function Calculator() {
  const [distance, setDistance] = useState<string>("");
  const [elevation, setElevation] = useState(0);
  const [windSpeed, setWindSpeed] = useState(0);
  const [windDirection, setWindDirection] = useState<WindDir>("none");
  const [temperature, setTemperature] = useState(70);
  const [altitude, setAltitude] = useState(0);
  const [lie, setLie] = useState<Lie>("flat");
  const [lieSeverity, setLieSeverity] = useState<LieSeverity>("slight");
  const [rough, setRough] = useState<Rough>("fairway");
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [expandConditions, setExpandConditions] = useState(false);

  const { data: clubs = [] } = useQuery<Club[]>({
    queryKey: ["/api/clubs"],
  });

  const { data: calibrations = [] } = useQuery<Calibration[]>({
    queryKey: ["/api/calibrations"],
  });

  const enabledClubs = useMemo(
    () => clubs.filter((c) => c.enabled === 1),
    [clubs]
  );

  const pdf = useMemo(
    () => calculatePDF(calibrations, clubs),
    [calibrations, clubs]
  );

  // Fetch weather on mount
  useEffect(() => {
    if (!navigator.geolocation) return;
    setWeatherLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await apiRequest(
            "GET",
            `/api/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`
          );
          const data = await res.json();
          if (data.current) {
            setTemperature(Math.round(data.current.temperature_2m));
            setWindSpeed(Math.round(data.current.wind_speed_10m));
          }
          if (pos.coords.altitude) {
            setAltitude(Math.round(pos.coords.altitude * 3.28084));
          }
        } catch {
          // Weather unavailable, use defaults
        } finally {
          setWeatherLoading(false);
        }
      },
      () => setWeatherLoading(false),
      { timeout: 5000 }
    );
  }, []);

  const targetDist = parseInt(distance) || 0;

  const conditions: EnvironmentalConditions = {
    windSpeed,
    windDirection,
    elevationChange: elevation,
    altitude,
    temperature,
    lie,
    lieSeverity,
    rough,
  };

  const result = useMemo(() => {
    if (targetDist <= 0) return null;
    const { playsAs, adjustments, aimOffset } = calculatePlaysAs(
      targetDist,
      conditions
    );
    const rec = recommendClub(playsAs, enabledClubs, pdf);
    return {
      playsAs,
      adjustments,
      aimOffset,
      ...rec,
    };
  }, [targetDist, conditions, enabledClubs, pdf]);

  const activeBadges = useMemo(() => {
    const badges: string[] = [];
    if (windSpeed > 0 && windDirection !== "none")
      badges.push(`${windSpeed}mph ${windDirection}`);
    if (elevation !== 0) badges.push(`${elevation > 0 ? "+" : ""}${elevation}ft`);
    if (lie !== "flat") badges.push(lie.replace("_", " "));
    if (rough !== "fairway") badges.push(rough.replace("_", " "));
    return badges;
  }, [windSpeed, windDirection, elevation, lie, rough]);

  const stepElevation = useCallback((delta: number) => {
    setElevation((prev) => prev + delta);
  }, []);

  const windDirOptions: { value: WindDir; label: string }[] = [
    { value: "none", label: "None" },
    { value: "into", label: "Into" },
    { value: "with", label: "With" },
    { value: "cross", label: "Cross" },
  ];

  const lieOptions: { value: Lie; label: string }[] = [
    { value: "flat", label: "Flat" },
    { value: "uphill", label: "Uphill" },
    { value: "downhill", label: "Downhill" },
    { value: "above_feet", label: "Above" },
    { value: "below_feet", label: "Below" },
  ];

  const roughOptions: { value: Rough; label: string }[] = [
    { value: "fairway", label: "Fairway" },
    { value: "light_rough", label: "Light" },
    { value: "heavy_rough", label: "Heavy" },
    { value: "buried", label: "Buried" },
  ];

  return (
    <div className="max-w-lg mx-auto px-4 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold tracking-tight">Dump Golf</h1>
        {weatherLoading && (
          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {/* Distance Input */}
      <div className="mb-4" data-testid="distance-section">
        <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">
          Distance to Pin
        </label>
        <div className="relative">
          <input
            type="number"
            inputMode="numeric"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            placeholder="150"
            className="w-full h-16 text-4xl font-bold text-center tabular-nums bg-card border border-border rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-muted-foreground/30"
            data-testid="distance-input"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
            yds
          </span>
        </div>
      </div>

      {/* Quick Conditions Row */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        {/* Elevation */}
        <div className="bg-card border border-border rounded-xl p-3" data-testid="elevation-section">
          <div className="flex items-center gap-1.5 mb-2">
            <Mountain className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
              Elevation
            </span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => stepElevation(-3)}
              className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
              data-testid="elevation-down"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
            <span className="text-lg font-bold tabular-nums min-w-[60px] text-center">
              {elevation > 0 ? "+" : ""}{elevation}ft
            </span>
            <button
              onClick={() => stepElevation(3)}
              className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
              data-testid="elevation-up"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Wind Speed */}
        <div className="bg-card border border-border rounded-xl p-3" data-testid="wind-section">
          <div className="flex items-center gap-1.5 mb-2">
            <Wind className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
              Wind
            </span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setWindSpeed(Math.max(0, windSpeed - 1))}
              className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
              data-testid="wind-down"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
            <span className="text-lg font-bold tabular-nums min-w-[50px] text-center">
              {windSpeed}mph
            </span>
            <button
              onClick={() => setWindSpeed(windSpeed + 1)}
              className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
              data-testid="wind-up"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Wind Direction Pills */}
      {windSpeed > 0 && (
        <div className="mb-3" data-testid="wind-direction-section">
          <div className="flex gap-2">
            {windDirOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setWindDirection(opt.value)}
                className={`flex-1 h-10 rounded-lg text-sm font-medium transition-colors ${
                  windDirection === opt.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
                data-testid={`wind-dir-${opt.value}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* More Conditions Toggle */}
      <button
        onClick={() => setExpandConditions(!expandConditions)}
        className="w-full flex items-center justify-center gap-1.5 py-2 mb-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
        data-testid="expand-conditions"
      >
        {expandConditions ? "Less conditions" : "More conditions (lie, rough, temp)"}
        {expandConditions ? (
          <ChevronUp className="w-3 h-3" />
        ) : (
          <ChevronDown className="w-3 h-3" />
        )}
      </button>

      {/* Expanded Conditions */}
      {expandConditions && (
        <div className="space-y-3 mb-4">
          {/* Temperature */}
          <div className="bg-card border border-border rounded-xl p-3" data-testid="temperature-section">
            <div className="flex items-center gap-1.5 mb-2">
              <Thermometer className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                Temperature
              </span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setTemperature(temperature - 5)}
                className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                data-testid="temp-down"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              <span className="text-lg font-bold tabular-nums min-w-[50px] text-center">
                {temperature}°F
              </span>
              <button
                onClick={() => setTemperature(temperature + 5)}
                className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                data-testid="temp-up"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Altitude */}
          <div className="bg-card border border-border rounded-xl p-3" data-testid="altitude-section">
            <div className="flex items-center gap-1.5 mb-2">
              <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                Altitude
              </span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setAltitude(Math.max(0, altitude - 500))}
                className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                data-testid="altitude-down"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              <span className="text-lg font-bold tabular-nums min-w-[70px] text-center">
                {altitude}ft
              </span>
              <button
                onClick={() => setAltitude(altitude + 500)}
                className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                data-testid="altitude-up"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Lie */}
          <div className="bg-card border border-border rounded-xl p-3" data-testid="lie-section">
            <span className="block text-xs text-muted-foreground uppercase tracking-wider font-medium mb-2">
              Lie
            </span>
            <div className="flex flex-wrap gap-2">
              {lieOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setLie(opt.value)}
                  className={`h-10 px-3 rounded-lg text-sm font-medium transition-colors ${
                    lie === opt.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                  data-testid={`lie-${opt.value}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {lie !== "flat" && (
              <div className="flex gap-2 mt-2">
                {(["slight", "medium", "severe"] as LieSeverity[]).map((sev) => (
                  <button
                    key={sev}
                    onClick={() => setLieSeverity(sev)}
                    className={`flex-1 h-9 rounded-lg text-xs font-medium transition-colors capitalize ${
                      lieSeverity === sev
                        ? "bg-primary/20 text-primary border border-primary/30"
                        : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                    }`}
                    data-testid={`severity-${sev}`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Rough */}
          <div className="bg-card border border-border rounded-xl p-3" data-testid="rough-section">
            <span className="block text-xs text-muted-foreground uppercase tracking-wider font-medium mb-2">
              Rough
            </span>
            <div className="flex gap-2">
              {roughOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setRough(opt.value)}
                  className={`flex-1 h-10 rounded-lg text-sm font-medium transition-colors ${
                    rough === opt.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                  data-testid={`rough-${opt.value}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Result Card */}
      {result && targetDist > 0 && (
        <div
          className="bg-card border border-border rounded-2xl p-5 mt-2 animate-in fade-in slide-in-from-bottom-2 duration-300"
          data-testid="result-card"
        >
          {/* Active condition badges */}
          {activeBadges.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {activeBadges.map((badge, i) => (
                <span
                  key={i}
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-primary/10 text-primary border border-primary/20"
                >
                  {badge}
                </span>
              ))}
            </div>
          )}

          {/* Plays As */}
          <div className="text-center mb-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Plays As
            </div>
            <div
              className="text-5xl font-extrabold tabular-nums text-primary"
              data-testid="plays-as-distance"
            >
              {result.playsAs}
            </div>
            <div className="text-sm text-muted-foreground">yards</div>
          </div>

          {/* Recommended Club */}
          {result.recommended ? (
            <div className="text-center mb-4" data-testid="recommended-club">
              <div className="text-3xl font-bold">{result.recommended.name}</div>
              <div className="text-sm text-muted-foreground">
                Stock: {result.stockYardage} yds &middot;{" "}
                {result.recommended.loft}° loft
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground text-sm mb-4">
              Add clubs in My Bag to get recommendations
            </div>
          )}

          {/* Aim Offset */}
          {result.aimOffset && (
            <div className="text-center mb-3 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 text-sm font-medium border border-amber-500/20">
              {result.aimOffset}
            </div>
          )}

          {/* Alternatives */}
          {result.alternatives.length > 0 && (
            <div className="flex gap-2 mb-4">
              {result.alternatives.map((alt, i) => (
                <div
                  key={i}
                  className="flex-1 text-center bg-secondary/50 rounded-lg py-2 px-2"
                >
                  <div className="text-sm font-semibold">{alt.club.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {alt.stockYardage} yds
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Adjustment Breakdown */}
          {result.adjustments.length > 0 && (
            <div className="border-t border-border pt-3" data-testid="adjustments">
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2 font-medium">
                Adjustments
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Actual distance</span>
                  <span className="tabular-nums font-medium">{targetDist} yds</span>
                </div>
                {result.adjustments.map((adj, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{adj.label}</span>
                    <span
                      className={`tabular-nums font-medium ${
                        adj.yards > 0
                          ? "text-red-400"
                          : adj.yards < 0
                            ? "text-emerald-400"
                            : ""
                      }`}
                    >
                      {adj.yards > 0 ? "+" : ""}
                      {adj.yards} yds
                    </span>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-bold border-t border-border/50 pt-1 mt-1">
                  <span>Plays as</span>
                  <span className="tabular-nums text-primary">
                    {result.playsAs} yds
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty state when no distance */}
      {targetDist === 0 && (
        <div className="text-center py-12 text-muted-foreground" data-testid="empty-state">
          <div className="text-4xl mb-3 opacity-30">⛳</div>
          <p className="text-sm">Enter your distance to get started</p>
          {enabledClubs.length === 0 && (
            <p className="text-xs mt-1 text-muted-foreground/60">
              Set up your clubs in My Bag for personalized recommendations
            </p>
          )}
        </div>
      )}
    </div>
  );
}
