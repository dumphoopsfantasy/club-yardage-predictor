import { useState, useMemo, useCallback, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import {
  calculatePDF,
  calculatePlaysAs,
  recommendClub,
  type EnvironmentalConditions,
} from "@/lib/yardage-model";
import { Wind, Thermometer, Mountain, ChevronUp, ChevronDown, Loader2 } from "lucide-react";
import dumpLogo from "@/assets/dump-logo.png";

type WindDir = EnvironmentalConditions["windDirection"];
type Lie = EnvironmentalConditions["lie"];
type LieSeverity = EnvironmentalConditions["lieSeverity"];
type Rough = EnvironmentalConditions["rough"];

export default function Calculator() {
  const { state } = useApp();
  const { clubs, calibrations, settings } = state;

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
  const [expandConditions, setExpandConditions] = useState(false);

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

  const targetDist = parseInt(distance) || 0;

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
    if (targetDist <= 0) return null;
    const { playsAs, adjustments, aimOffset } = calculatePlaysAs(targetDist, conditions);
    const rec = recommendClub(playsAs, enabledClubs, pdf);
    return { playsAs, adjustments, aimOffset, ...rec };
  }, [targetDist, JSON.stringify(conditions), enabledClubs, pdf]);

  const activeBadges = useMemo(() => {
    const badges: string[] = [];
    if (windSpeed > 0 && windDirection !== "none")
      badges.push(`${windSpeed}mph ${windDirection}`);
    if (useRangefinder && slopeDistance && distance && slopeDistance !== distance) {
      badges.push("Slope adjusted");
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
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <img src={dumpLogo} alt="Dump Golf" className="h-8 w-auto" />
          <h1 className="text-xl font-bold tracking-tight">Dump Golf</h1>
        </div>
        {weatherLoading && (
          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {/* Input Mode Toggle */}
      <div className="flex bg-card border border-border rounded-lg p-0.5 mb-4">
        <button
          onClick={() => { setUseRangefinder(true); setElevation(0); }}
          className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
            useRangefinder
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Rangefinder
        </button>
        <button
          onClick={() => { setUseRangefinder(false); setSlopeDistance(""); }}
          className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
            !useRangefinder
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Manual
        </button>
      </div>

      {useRangefinder ? (
        /* Rangefinder Mode: Two inputs side by side */
        <div className="mb-4">
          <div className="flex items-stretch gap-3">
            <div className="flex-1">
              <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">
                Slope Distance
              </label>
              <div className="relative">
                <input
                  type="number"
                  inputMode="numeric"
                  value={slopeDistance}
                  onChange={(e) => setSlopeDistance(e.target.value)}
                  placeholder="155"
                  className="w-full h-14 text-3xl font-bold text-center tabular-nums bg-card border border-border rounded-xl px-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-muted-foreground/30"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground font-medium">
                  yds
                </span>
              </div>
              <div className="text-[10px] text-muted-foreground mt-1 text-center">Big number</div>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">
                Plays Like
              </label>
              <div className="relative">
                <input
                  type="number"
                  inputMode="numeric"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  placeholder="148"
                  className="w-full h-14 text-3xl font-bold text-center tabular-nums bg-card border border-border rounded-xl px-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-muted-foreground/30"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground font-medium">
                  yds
                </span>
              </div>
              <div className="text-[10px] text-muted-foreground mt-1 text-center">Small number</div>
            </div>
          </div>
          {slopeDistance && distance && slopeDistance !== distance && (
            <div className="text-center mt-2 text-xs text-muted-foreground">
              {parseInt(slopeDistance) > parseInt(distance) ? "↓" : "↑"}{" "}
              {Math.abs((parseInt(slopeDistance) || 0) - (parseInt(distance) || 0))} yard slope adjustment
            </div>
          )}
        </div>
      ) : (
        /* Manual Mode: Single distance input + elevation stepper */
        <>
          <div className="mb-4">
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
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
                yds
              </span>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-3 mb-3">
            <div className="flex items-center gap-1.5 mb-2">
              <Mountain className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                Elevation
              </span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => stepElevation(-3)}
                className="w-11 h-11 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              <span className="text-lg font-bold tabular-nums min-w-[60px] text-center">
                {elevation > 0 ? "+" : ""}{elevation}ft
              </span>
              <button
                onClick={() => stepElevation(3)}
                className="w-11 h-11 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Wind Speed */}
      <div className="bg-card border border-border rounded-xl p-3 mb-3">
        <div className="flex items-center gap-1.5 mb-2">
          <Wind className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
            Wind
          </span>
        </div>
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setWindSpeed(Math.max(0, windSpeed - 1))}
            className="w-11 h-11 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          <span className="text-lg font-bold tabular-nums min-w-[50px] text-center">
            {windSpeed}mph
          </span>
          <button
            onClick={() => setWindSpeed(windSpeed + 1)}
            className="w-11 h-11 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Wind Direction Pills */}
      {windSpeed > 0 && (
        <div className="mb-3">
          <div className="flex gap-2">
            {windDirOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setWindDirection(opt.value)}
                className={`flex-1 h-11 rounded-lg text-sm font-medium transition-colors ${
                  windDirection === opt.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
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
        className="w-full flex items-center justify-center gap-1.5 py-2.5 mb-3 text-sm font-medium text-secondary-foreground bg-secondary border border-border rounded-lg hover:bg-secondary/80 transition-colors"
      >
        {expandConditions ? "Less conditions" : "More conditions (lie, rough, tee, ground)"}
        {expandConditions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {/* Expanded Conditions */}
      {expandConditions && (
        <div className="space-y-3 mb-4">
          {/* Temperature */}
          <div className="bg-card border border-border rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <Thermometer className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                Temperature
              </span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setTemperature(temperature - 5)}
                className="w-11 h-11 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              <span className="text-lg font-bold tabular-nums min-w-[50px] text-center">
                {temperature}&deg;F
              </span>
              <button
                onClick={() => setTemperature(temperature + 5)}
                className="w-11 h-11 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Lie */}
          <div className="bg-card border border-border rounded-xl p-3">
            <span className="block text-xs text-muted-foreground uppercase tracking-wider font-medium mb-2">
              Lie
            </span>
            <div className="flex flex-wrap gap-2">
              {lieOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setLie(opt.value)}
                  className={`h-11 px-3 rounded-lg text-sm font-medium transition-colors ${
                    lie === opt.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
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
                  >
                    {sev}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Rough */}
          <div className="bg-card border border-border rounded-xl p-3">
            <span className="block text-xs text-muted-foreground uppercase tracking-wider font-medium mb-2">
              Rough
            </span>
            <div className="flex gap-2">
              {roughOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setRough(opt.value)}
                  className={`flex-1 h-11 rounded-lg text-sm font-medium transition-colors ${
                    rough === opt.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tee Shot */}
          <div className="bg-card border border-border rounded-xl p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                Off the Tee
              </span>
              <button
                onClick={() => setTeed(!teed)}
                className={`relative w-12 h-7 rounded-full transition-colors ${
                  teed ? "bg-primary" : "bg-secondary"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white transition-transform ${
                    teed ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
            {teed && (
              <p className="text-[11px] text-muted-foreground mt-1.5">
                Cleaner strike off a tee — plays a few yards shorter
              </p>
            )}
          </div>

          {/* Ground Conditions */}
          <div className="bg-card border border-border rounded-xl p-3">
            <span className="block text-xs text-muted-foreground uppercase tracking-wider font-medium mb-2">
              Ground
            </span>
            <div className="flex gap-2">
              {(["dry", "soft", "rain"] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => setGround(opt)}
                  className={`flex-1 h-11 rounded-lg text-sm font-medium transition-colors ${
                    ground === opt
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {opt === "dry" ? "Dry" : opt === "soft" ? "Soft" : "🌧️ Rain"}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Result Card */}
      {result && targetDist > 0 && (
        <div className="bg-card border border-border rounded-2xl p-5 mt-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
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

          <div className="text-center mb-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Plays As
            </div>
            <div className="text-5xl font-extrabold tabular-nums text-primary">
              {result.playsAs}
            </div>
            <div className="text-sm text-muted-foreground">yards</div>
          </div>

          {result.recommended ? (
            <div className="text-center mb-4">
              <div className="text-3xl font-bold">{result.recommended.name}</div>
              <div className="text-sm text-muted-foreground">
                Stock: {result.stockYardage} yds &middot; {result.recommended.loft}&deg; loft
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground text-sm mb-4">
              Add clubs in My Bag to get recommendations
            </div>
          )}

          {result.aimOffset && (
            <div className="text-center mb-3 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 text-sm font-medium border border-amber-500/20">
              {result.aimOffset}
            </div>
          )}

          {result.alternatives.length > 0 && (
            <div className="flex gap-2 mb-4">
              {result.alternatives.map((alt, i) => (
                <div key={i} className="flex-1 text-center bg-secondary/50 rounded-lg py-2 px-2">
                  <div className="text-sm font-semibold">{alt.club.name}</div>
                  <div className="text-xs text-muted-foreground">{alt.stockYardage} yds</div>
                </div>
              ))}
            </div>
          )}

          {result.adjustments.length > 0 && (
            <div className="border-t border-border pt-3">
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
                  <span className="tabular-nums text-primary">{result.playsAs} yds</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {targetDist === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <div className="text-4xl mb-3 opacity-30">&#9971;</div>
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
