import { useState, useMemo } from "react";
import {
  type Club,
  type CalibrationPoint,
  predictYardages,
  calculatePlaysAs,
  findClubRecommendation,
} from "@/lib/yardage-model";
import { useWind } from "@/hooks/use-wind";
import { Wind, RefreshCw, ChevronUp, ChevronDown, Minus, Plus, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

type WindType = "headwind" | "tailwind" | "crosswind" | "none";

interface Props {
  clubs: Club[];
  calibrations: CalibrationPoint[];
}

export function Calculator({ clubs, calibrations }: Props) {
  const [distance, setDistance] = useState<number | "">("");
  const [elevation, setElevation] = useState(0);
  const [windType, setWindType] = useState<WindType>("none");
  const [manualWindSpeed, setManualWindSpeed] = useState<number | null>(null);

  const { wind, loading: windLoading, error: windError, refresh: refreshWind } = useWind();

  const effectiveWindSpeed = manualWindSpeed ?? wind?.speed ?? 0;

  // Get predicted clubs (stock yardages from calibration)
  const predictedClubs = useMemo(() => {
    const enabled = clubs.filter((c) => c.enabled !== false);
    if (calibrations.length === 0 || enabled.length === 0) return [];
    const validCals = calibrations.filter((c) => c.clubId && c.yardage > 0);
    if (validCals.length === 0) return [];
    return predictYardages(enabled, validCals);
  }, [clubs, calibrations]);

  const hasSetup = predictedClubs.length > 0 && predictedClubs.some((c) => c.predictedYardage);

  // Calculate "plays as" yardage
  const playsAs = useMemo(() => {
    if (!distance || distance <= 0) return null;
    return calculatePlaysAs(distance, elevation, effectiveWindSpeed, windType);
  }, [distance, elevation, effectiveWindSpeed, windType]);

  // Find recommended club
  const recommendation = useMemo(() => {
    if (!playsAs) return { primary: null, above: null, below: null };
    return findClubRecommendation(predictedClubs, playsAs);
  }, [predictedClubs, playsAs]);

  const windTypeOptions: { value: WindType; label: string }[] = [
    { value: "headwind", label: "Into" },
    { value: "tailwind", label: "With" },
    { value: "crosswind", label: "Cross" },
    { value: "none", label: "None" },
  ];

  if (!hasSetup) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
          <MapPin className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">Set Up Your Bag First</h2>
        <p className="text-muted-foreground max-w-xs">
          Head to the <span className="font-semibold">My Bag</span> tab to select your clubs and calibrate your distances.
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 py-5 space-y-5 max-w-lg mx-auto">
      {/* Distance Input */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground uppercase tracking-wide">
          Distance to Pin
        </label>
        <div className="relative">
          <input
            type="number"
            inputMode="numeric"
            value={distance}
            onChange={(e) => {
              const v = e.target.value;
              setDistance(v === "" ? "" : Math.max(0, parseInt(v) || 0));
            }}
            placeholder="150"
            className="w-full h-20 text-center text-5xl font-bold bg-card border-2 border-border rounded-2xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none tabular-nums text-foreground placeholder:text-muted-foreground/40"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg text-muted-foreground font-medium">
            yds
          </span>
        </div>
      </div>

      {/* Elevation */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground uppercase tracking-wide">
          Elevation Change
        </label>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 shrink-0 rounded-xl"
            onClick={() => setElevation((e) => e - 3)}
          >
            <Minus className="h-5 w-5" />
          </Button>
          <div className="flex-1 relative">
            <input
              type="number"
              inputMode="numeric"
              value={elevation}
              onChange={(e) => setElevation(parseInt(e.target.value) || 0)}
              className="w-full h-12 text-center text-2xl font-bold bg-card border-2 border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none tabular-nums text-foreground"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              ft
            </span>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 shrink-0 rounded-xl"
            onClick={() => setElevation((e) => e + 3)}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex justify-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <ChevronDown className="h-3 w-3" /> Downhill
          </span>
          <span className="flex items-center gap-1">
            <ChevronUp className="h-3 w-3" /> Uphill
          </span>
        </div>
      </div>

      {/* Wind */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-foreground uppercase tracking-wide flex items-center gap-1.5">
            <Wind className="h-4 w-4" /> Wind
          </label>
          <div className="flex items-center gap-2">
            {wind && !windError && (
              <span className="text-xs text-muted-foreground">
                {wind.speed} mph {wind.directionLabel}
              </span>
            )}
            <button
              onClick={() => { setManualWindSpeed(null); refreshWind(); }}
              className="text-xs text-primary hover:underline flex items-center gap-1"
              disabled={windLoading}
            >
              <RefreshCw className={`h-3 w-3 ${windLoading ? "animate-spin" : ""}`} />
              {windLoading ? "..." : "GPS"}
            </button>
          </div>
        </div>

        {/* Wind speed override */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 shrink-0 rounded-xl"
            onClick={() => setManualWindSpeed(Math.max(0, effectiveWindSpeed - 1))}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <div className="flex-1 relative">
            <input
              type="number"
              inputMode="numeric"
              value={effectiveWindSpeed}
              onChange={(e) => setManualWindSpeed(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full h-10 text-center text-xl font-bold bg-card border-2 border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none tabular-nums text-foreground"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              mph
            </span>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 shrink-0 rounded-xl"
            onClick={() => setManualWindSpeed(effectiveWindSpeed + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Wind direction relative to shot */}
        <div className="grid grid-cols-4 gap-1.5">
          {windTypeOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setWindType(opt.value)}
              className={`py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                windType === opt.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border-2 border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Result */}
      {playsAs !== null && recommendation.primary && (
        <div className="rounded-2xl bg-primary p-6 text-center space-y-3">
          {/* Plays as */}
          <div>
            <p className="text-primary-foreground/70 text-sm font-medium uppercase tracking-wider">
              Play It As
            </p>
            <p className="text-5xl font-black text-primary-foreground tabular-nums leading-tight">
              {playsAs}
              <span className="text-xl font-semibold ml-1">yds</span>
            </p>
          </div>

          {/* Primary recommendation */}
          <div className="border-t border-primary-foreground/20 pt-3">
            <p className="text-primary-foreground/70 text-xs font-medium uppercase tracking-wider mb-1">
              Hit Your
            </p>
            <p className="text-3xl font-black text-primary-foreground">
              {recommendation.primary.name}
            </p>
            <p className="text-primary-foreground/60 text-sm">
              {recommendation.primary.predictedYardage} yds stock
            </p>
          </div>

          {/* Alternatives */}
          {(recommendation.above || recommendation.below) && (
            <div className="border-t border-primary-foreground/20 pt-3 flex justify-around text-primary-foreground/70">
              {recommendation.above && (
                <div className="text-center">
                  <p className="text-xs uppercase tracking-wide mb-0.5">More Club</p>
                  <p className="text-lg font-bold text-primary-foreground/90">
                    {recommendation.above.name}
                  </p>
                  <p className="text-xs">{recommendation.above.predictedYardage} yds</p>
                </div>
              )}
              {recommendation.below && (
                <div className="text-center">
                  <p className="text-xs uppercase tracking-wide mb-0.5">Less Club</p>
                  <p className="text-lg font-bold text-primary-foreground/90">
                    {recommendation.below.name}
                  </p>
                  <p className="text-xs">{recommendation.below.predictedYardage} yds</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Show "enter distance" prompt when no input */}
      {(!distance || distance <= 0) && (
        <div className="rounded-2xl border-2 border-dashed border-border p-8 text-center">
          <p className="text-muted-foreground text-lg">
            Enter your distance to get a club recommendation
          </p>
        </div>
      )}

      {/* Show "no match" when distance entered but no recommendation */}
      {playsAs !== null && !recommendation.primary && (
        <div className="rounded-2xl border-2 border-dashed border-border p-8 text-center">
          <p className="text-muted-foreground">
            No club in your bag matches this distance
          </p>
        </div>
      )}
    </div>
  );
}
