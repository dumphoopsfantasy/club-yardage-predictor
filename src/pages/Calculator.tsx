import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useApp } from "@/context/AppContext";
import {
  calculatePDF,
  calculatePlaysAs,
  recommendClub,
  type EnvironmentalConditions,
} from "@/lib/yardage-model";
import { Wind, Thermometer, ChevronUp, ChevronDown, Loader2, RotateCcw, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import dumpLogo from "@/assets/dump-logo-transparent.png";

type WindDir = EnvironmentalConditions["windDirection"];
type Lie = EnvironmentalConditions["lie"];
type LieSeverity = EnvironmentalConditions["lieSeverity"];
type Rough = EnvironmentalConditions["rough"];

export default function Calculator() {
  const { state } = useApp();
  const { clubs, calibrations, clockCalibrations, settings } = state;

  const [distance, setDistance] = useState<string>("");
  const [elevation, setElevation] = useState(0);
  const [useRangefinder, setUseRangefinder] = useState(true);
  const [slopeDistance, setSlopeDistance] = useState<string>("");
  const [windSpeed, setWindSpeed] = useState(0);
  const [windDirection, setWindDirection] = useState<WindDir>("none");
  const [temperature, setTemperature] = useState(70);
  const [altitude, setAltitude] = useState(0);
  const [lie, setLie] = useState<Lie>("flat");
  const [lieSeverity, setLieSeverity] = useState<LieSeverity>("slight");
  const [rough, setRough] = useState<Rough>("fairway");
  const [teed, setTeed] = useState(false);
  const [ground, setGround] = useState<EnvironmentalConditions["ground"]>("dry");
  const [weatherLoading, setWeatherLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const slopeRef = useRef<HTMLInputElement>(null);

  const enabledClubs = useMemo(
    () => clubs.filter((c) => c.enabled === 1),
    [clubs]
  );

  const pdf = useMemo(
    () => calculatePDF(calibrations, clubs),
    [calibrations, clubs]
  );

  // Fetch weather directly from Open-Meteo (no backend needed)
  useEffect(() => {
    if (!navigator.geolocation) return;
    setWeatherLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const url = `https://api.open-meteo.com/v1/forecast?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&current=temperature_2m,wind_speed_10m,wind_direction_10m&temperature_unit=fahrenheit&wind_speed_unit=mph`;
          const res = await fetch(url);
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

  const playsLikeDist = parseInt(distance) || 0;
  const straightLineDist = parseInt(slopeDistance) || 0;

  // In rangefinder mode, work off the straight-line distance (what the laser
  // actually measured) so slope becomes a visible adjustment line item.
  // Percentage-based adjustments (wind, rough, etc.) scale off this distance.
  const baseDist = useRangefinder && straightLineDist > 0 ? straightLineDist : playsLikeDist;
  const targetDist = baseDist;  // used for "has input" checks below

  // Slope adjustment = plays-like minus straight-line
  // Downhill: plays-like < straight-line → negative (plays shorter)
  // Uphill:   plays-like > straight-line → positive (plays longer)
  const slopeAdjustment =
    useRangefinder && straightLineDist > 0 && playsLikeDist > 0 && straightLineDist !== playsLikeDist
      ? playsLikeDist - straightLineDist
      : 0;

  const conditions: EnvironmentalConditions = {
    windSpeed,
    windDirection,
    elevationChange: useRangefinder ? 0 : elevation,
    altitude,
    temperature,
    lie,
    lieSeverity,
    rough,
    teed,
    ground,
  };

  const result = useMemo(() => {
    if (baseDist <= 0) return null;
    const { playsAs: rawPlaysAs, adjustments: rawAdj, aimOffset } = calculatePlaysAs(baseDist, conditions);

    // Inject slope as the first adjustment when in rangefinder mode
    const adjustments = [...rawAdj];
    let playsAs = rawPlaysAs;
    if (slopeAdjustment !== 0) {
      adjustments.unshift({
        label: slopeAdjustment < 0 ? "Downhill to target" : "Uphill to target",
        yards: slopeAdjustment,
      });
      playsAs += slopeAdjustment;
    }

    const rec = recommendClub(playsAs, enabledClubs, pdf, clockCalibrations);
    return { playsAs, adjustments, aimOffset, ...rec };
  }, [baseDist, slopeAdjustment, JSON.stringify(conditions), enabledClubs, pdf, clockCalibrations]);

  const activeBadges = useMemo(() => {
    const badges: string[] = [];
    if (windSpeed > 0 && windDirection !== "none")
      badges.push(`${windSpeed}mph ${windDirection}`);
    if (useRangefinder && slopeDistance && distance && slopeDistance !== distance) {
      badges.push(parseInt(distance) < parseInt(slopeDistance) ? "downhill" : "uphill");
    } else if (!useRangefinder && elevation !== 0) {
      badges.push(`${elevation > 0 ? "+" : ""}${elevation}ft`);
    }
    if (lie !== "flat") badges.push(lie.replace("_", " "));
    if (rough !== "fairway") badges.push(rough.replace("_", " "));
    if (teed) badges.push("tee shot");
    if (ground !== "dry") badges.push(ground);
    return badges;
  }, [windSpeed, windDirection, elevation, lie, rough, teed, ground, useRangefinder, slopeDistance, distance]);

  const stepElevation = useCallback((delta: number) => {
    setElevation((prev) => prev + delta);
  }, []);

  const resetShot = useCallback(() => {
    setDistance("");
    setSlopeDistance("");
    setLie("flat");
    setLieSeverity("medium");
    setRough("fairway");
    setElevation(0);
    setTeed(false);
    // Keep wind, temperature, altitude, ground — those are course/day conditions
    inputRef.current?.focus();
  }, []);

  const windDirOptions: { value: WindDir; label: string }[] = [
    { value: "none", label: "—" },
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
    { value: "flyer", label: "Flyer" },
  ];

  return (
    <div className="yardage-page calculator-page">
      {/* Header */}
      <div className="calculator-header">
        <div className="flex items-center gap-2">
          <img src={dumpLogo} alt="Dump Golf" className="h-11 w-auto" />
          <div><h1 className="text-xl font-semibold">Dump Golf</h1><span className="book-label">THE YARDAGE BOOK</span></div>
        </div>
        <div className="flex items-center gap-2">
          {weatherLoading && (
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          )}
          {targetDist > 0 && (
            <Button variant="unstyled" size="bare"
              onClick={resetShot}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted-foreground bg-secondary hover:bg-secondary/80 transition-colors"
              title="New shot"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              New
            </Button>
          )}
        </div>
      </div>

      {/* Input Mode Toggle */}
      <div className="mode-switch mb-6">
        <Button variant="unstyled" size="bare"
          onClick={() => { setUseRangefinder(true); setElevation(0); }}
          className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-colors ${
            useRangefinder
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Rangefinder
        </Button>
        <Button variant="unstyled" size="bare"
          onClick={() => { setUseRangefinder(false); setSlopeDistance(""); }}
          className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-colors ${
            !useRangefinder
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Manual
        </Button>
      </div>

      {/* Distance Input */}
      {useRangefinder ? (
        <div className="mb-3">
          <div className="flex items-stretch gap-3">
            <div className="flex-1 min-w-0">
              <label className="block text-xs font-medium text-muted-foreground mb-1 uppercase tracking-normal">
                Straight-line
              </label>
              <div className="relative">
                <input
                  ref={slopeRef}
                  type="number"
                  inputMode="numeric"
                  value={slopeDistance}
                  onChange={(e) => setSlopeDistance(e.target.value)}
                  placeholder="—" aria-label="Straight-line distance"
                  className="shot-yardage"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">
                  yds
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-0.5 text-center">Laser distance</div>
            </div>
            <div className="flex-1 min-w-0">
              <label className="block text-xs font-medium text-muted-foreground mb-1 uppercase tracking-normal">
                Plays Like
              </label>
              <div className="relative">
                <input
                  ref={inputRef}
                  type="number"
                  inputMode="numeric"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  placeholder="—" aria-label="Plays like distance"
                  className="shot-yardage"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">
                  yds
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-0.5 text-center">Adjusted</div>
            </div>
          </div>
          {slopeDistance && distance && slopeDistance !== distance && (
            <div className="text-center mt-1.5 text-xs text-muted-foreground">
              {parseInt(distance) < parseInt(slopeDistance) ? "↓ Downhill" : "↑ Uphill"}{" "}
              {Math.abs((parseInt(slopeDistance) || 0) - (parseInt(distance) || 0))} yard adjustment
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="mb-3">
            <label className="block text-xs font-medium text-muted-foreground mb-1 uppercase tracking-normal">
              Distance to Pin
            </label>
            <div className="relative">
              <input
                ref={inputRef}
                type="number"
                inputMode="numeric"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                placeholder="—" aria-label="Distance to pin"
                className="shot-yardage manual-yardage"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
                yds
              </span>
            </div>
          </div>

          {/* Elevation stepper — compact */}
          <div className="flex items-center justify-between condition-section">
            <span className="text-xs text-muted-foreground uppercase tracking-normal font-medium">
              Elevation
            </span>
            <div className="flex items-center gap-2">
              <Button variant="unstyled" size="bare"
                aria-label="Decrease elevation" onClick={() => stepElevation(-3)}
                className="w-11 h-11 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
              >
                <ChevronDown className="w-4 h-4" />
              </Button>
              <span className="text-base font-bold tabular-nums min-w-[55px] text-center">
                {elevation > 0 ? "+" : ""}{elevation}ft
              </span>
              <Button variant="unstyled" size="bare"
                aria-label="Increase elevation" onClick={() => stepElevation(3)}
                className="w-11 h-11 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
              >
                <ChevronUp className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </>
      )}

      {/* ====== RESULT CARD — RIGHT AFTER INPUT ====== */}
      {result && targetDist > 0 && (
        <div className="shot-result animate-in fade-in duration-300">
          {activeBadges.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {activeBadges.map((badge, i) => (
                <span
                  key={i}
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                >
                  {badge}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between">
            {/* Plays As — left side, big number */}
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-normal mb-0.5">
                Plays As
              </div>
              <div className="result-yardage tabular-nums">
                {result.playsAs}
              </div>
              <div className="text-xs text-muted-foreground">yards</div>
            </div>

            {/* Club recommendation — right side */}
            {result.recommended ? (
              <div className="text-right max-w-[45%]">
                <div className="text-2xl font-semibold leading-tight break-words">{result.recommended.label}</div>
                <div className="text-xs text-muted-foreground">
                  {result.recommended.yardage} yds &middot; {result.recommended.club.loft}&deg;
                </div>
              </div>
            ) : (
              <div className="text-right text-muted-foreground text-xs max-w-[140px]">
                Add clubs in My Bag for recommendations
              </div>
            )}
          </div>

          {result.aimOffset && (
            <div className="text-center mt-4 px-3 py-2 bg-accent/10 text-accent-foreground text-sm font-medium border border-accent/30">
              {result.aimOffset}
            </div>
          )}

          {result.alternatives.length > 0 && (
            <div className="flex gap-2 mt-3">
              {result.alternatives.map((alt, i) => (
                <div key={i} className="flex-1 min-w-0 text-center border-t border-border py-3 px-2">
                  <div className="text-xs font-semibold">{alt.label}</div>
                  <div className="text-xs text-muted-foreground">{alt.yardage} yds</div>
                </div>
              ))}
            </div>
          )}

          {/* Adjustment breakdown — collapsible */}
          {result.adjustments.length > 0 && (
            <details className="mt-3 border-t border-border pt-2">
              <summary className="text-xs text-muted-foreground uppercase tracking-normal font-medium cursor-pointer select-none">
                Adjustments
              </summary>
              <div className="space-y-0.5 mt-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">
                    {useRangefinder && straightLineDist > 0 ? "Straight-line" : "Target distance"}
                  </span>
                  <span className="tabular-nums font-medium">{baseDist} yds</span>
                </div>
                {result.adjustments.map((adj, i) => (
                  <div key={i} className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{adj.label}</span>
                    <span
                      className={`tabular-nums font-medium ${
                        adj.yards > 0
                          ? "text-destructive"
                          : adj.yards < 0
                            ? "text-primary"
                            : ""
                      }`}
                    >
                      {adj.yards > 0 ? "+" : ""}
                      {adj.yards} yds
                    </span>
                  </div>
                ))}
                <div className="flex justify-between text-xs font-bold border-t border-border/50 pt-1 mt-1">
                  <span>Plays as</span>
                  <span className="tabular-nums text-primary">{result.playsAs} yds</span>
                </div>
              </div>
            </details>
          )}
        </div>
      )}

      {targetDist === 0 && (
        <div className="empty-shot">
          <Flag className="h-8 w-8 mx-auto mb-3 text-primary" strokeWidth={1.25} />
          <p className="text-lg font-medium text-foreground">Distance to the flag</p>

        </div>
      )}

      {/* ====== CONDITIONS — BELOW THE RESULT ====== */}

      <h2 className="section-title">Course conditions</h2>
      {/* Wind — compact single row */}
      <div className="condition-section">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Wind className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground uppercase tracking-normal font-medium">
              Wind
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Button variant="unstyled" size="bare"
              aria-label="Decrease wind speed" onClick={() => setWindSpeed(Math.max(0, windSpeed - 1))}
              className="w-11 h-11 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </Button>
            <span className="text-sm font-bold tabular-nums min-w-[42px] text-center">
              {windSpeed}mph
            </span>
            <Button variant="unstyled" size="bare"
              aria-label="Increase wind speed" onClick={() => setWindSpeed(windSpeed + 1)}
              className="w-11 h-11 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Wind direction — inline pills when wind > 0 */}
        {windSpeed > 0 && (
          <div className="flex gap-1.5 mt-2">
            {windDirOptions.map((opt) => (
              <Button variant="unstyled" size="bare"
                key={opt.value}
                onClick={() => setWindDirection(opt.value)}
                className={`flex-1 h-11 rounded-md text-xs font-medium transition-colors ${
                  windDirection === opt.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {opt.label}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Temperature */}
      <div className="flex items-center justify-between condition-section">
        <div className="flex items-center gap-1.5">
          <Thermometer className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground uppercase tracking-normal font-medium">
            Temp
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Button variant="unstyled" size="bare"
            aria-label="Decrease temperature" onClick={() => setTemperature(temperature - 5)}
            className="w-11 h-11 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </Button>
          <span className="text-sm font-bold tabular-nums min-w-[42px] text-center">
            {temperature}&deg;F
          </span>
          <Button variant="unstyled" size="bare"
            aria-label="Increase temperature" onClick={() => setTemperature(temperature + 5)}
            className="w-11 h-11 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Lie */}
      <div className="condition-section">
        <span className="block text-xs text-muted-foreground uppercase tracking-normal font-medium mb-1.5">
          Lie
        </span>
        <div className="flex flex-wrap gap-1.5">
          {lieOptions.map((opt) => (
            <Button variant="unstyled" size="bare"
              key={opt.value}
              onClick={() => setLie(opt.value)}
              className={`h-11 px-2.5 rounded-lg text-xs font-medium transition-colors ${
                lie === opt.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {opt.label}
            </Button>
          ))}
        </div>
        {lie !== "flat" && (
          <div className="flex gap-1.5 mt-1.5">
            {(["slight", "medium", "severe"] as LieSeverity[]).map((sev) => (
              <Button variant="unstyled" size="bare"
                key={sev}
                onClick={() => setLieSeverity(sev)}
                className={`flex-1 h-11 rounded-md text-xs font-medium transition-colors capitalize ${
                  lieSeverity === sev
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                }`}
              >
                {sev}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Rough */}
      <div className="condition-section">
        <span className="block text-xs text-muted-foreground uppercase tracking-normal font-medium mb-1.5">
          Rough
        </span>
        <div className="flex gap-1.5">
          {roughOptions.map((opt) => (
            <Button variant="unstyled" size="bare"
              key={opt.value}
              onClick={() => setRough(opt.value)}
              className={`flex-1 h-11 rounded-md text-xs font-medium transition-colors ${
                rough === opt.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Tee Shot + Ground — combined row */}
      <div className="ground-section">
        <div className="condition-section">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground uppercase tracking-normal font-medium">
              Off the Tee
            </span>
            <Button variant="unstyled" size="bare"
              onClick={() => {
                const newTeed = !teed;
                setTeed(newTeed);
                if (newTeed) {
                  setLie("flat");
                  setLieSeverity("medium");
                  setRough("fairway");
                }
              }}
              aria-label="Off the tee" aria-pressed={teed} className={`relative w-12 h-11 rounded-full transition-colors ${
                teed ? "bg-primary" : "bg-secondary"
              }`}
            >
              <span
                className={`absolute top-3 left-1 w-5 h-5 rounded-full bg-primary-foreground transition-transform ${
                  teed ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </Button>
          </div>
        </div>
        <div className="condition-section">
          <span className="block text-xs text-muted-foreground uppercase tracking-normal font-medium mb-1">
            Ground
          </span>
          <div className="flex gap-1">
            {(["dry", "soft", "rain"] as const).map((opt) => (
              <Button variant="unstyled" size="bare"
                key={opt}
                onClick={() => setGround(opt)}
                className={`flex-1 h-11 rounded-md text-xs font-medium transition-colors ${
                  ground === opt
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {opt === "dry" ? "Dry" : opt === "soft" ? "Soft" : "Rain"}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
