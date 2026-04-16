import { useState, useMemo } from "react";
import { useApp } from "@/context/AppContext";
import { getBrands, getModels, getClubsForModel } from "@/lib/club-catalog";
import { calculatePDF, predictDistance } from "@/lib/yardage-model";
import { Plus, Trash2, Check, X, Target, Clock } from "lucide-react";
import { toast } from "sonner";
import type { ClockPosition } from "@/lib/types";

const CLOCK_POSITIONS: ClockPosition[] = ["7:30", "9:00", "10:30"];
const CLOCK_LABELS: Record<ClockPosition, string> = {
  "7:30": "7:30",
  "9:00": "9:00",
  "10:30": "10:30",
};

export default function MyBag() {
  const { state, addClubs, removeClub, toggleClub, clearClubs, addCalibration, removeCalibration, setClockCalibration, removeClockCalibration } = useApp();
  const { clubs, calibrations, clockCalibrations } = state;

  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>();
  const [bagMode, setBagMode] = useState<"full" | "mixed">("full");
  const [calClubId, setCalClubId] = useState<number | null>(null);
  const [calYardage, setCalYardage] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customLoft, setCustomLoft] = useState("");
  const [customType, setCustomType] = useState<string>("iron");
  const [clockEditClub, setClockEditClub] = useState<number | null>(null);
  const [clockInputs, setClockInputs] = useState<Record<string, string>>({});

  const brands = useMemo(() => getBrands(), []);
  const models = useMemo(
    () => (selectedBrand ? getModels(selectedBrand) : []),
    [selectedBrand]
  );

  const selectedModelEntry = useMemo(() => {
    const parsed = selectedModel.match(/^(.+?)\s\((\d+)\)$/);
    if (!parsed) return null;
    return { model: parsed[1], year: parseInt(parsed[2]) };
  }, [selectedModel]);

  const availableVariants = useMemo(() => {
    if (!selectedBrand || !selectedModelEntry) return [];
    return models
      .filter(
        (m) =>
          m.model === selectedModelEntry.model &&
          m.year === selectedModelEntry.year
      )
      .map((m) => m.variant)
      .filter(Boolean) as string[];
  }, [selectedBrand, selectedModelEntry, models]);

  const catalogEntry = useMemo(() => {
    if (!selectedBrand || !selectedModelEntry) return null;
    return getClubsForModel(selectedBrand, selectedModelEntry.model, selectedVariant);
  }, [selectedBrand, selectedModelEntry, selectedVariant]);

  const pdf = useMemo(
    () => calculatePDF(calibrations, clubs),
    [calibrations, clubs]
  );

  const handleAddSet = () => {
    if (!catalogEntry) return;
    const clubsToAdd = catalogEntry.clubs.map((c) => ({
      name: c.name,
      brand: catalogEntry.brand,
      model: `${catalogEntry.model} (${catalogEntry.year})`,
      variant: catalogEntry.variant || undefined,
      loft: c.loft,
      clubType: c.type as "iron" | "wood" | "hybrid" | "wedge" | "putter",
      enabled: 1 as const,
    }));
    addClubs(clubsToAdd);
    toast.success("Clubs added to bag");
  };

  const handleAddSingle = (club: { name: string; loft: number; type: string }) => {
    if (!catalogEntry) return;
    addClubs([
      {
        name: club.name,
        brand: catalogEntry.brand,
        model: `${catalogEntry.model} (${catalogEntry.year})`,
        variant: catalogEntry.variant || undefined,
        loft: club.loft,
        clubType: club.type as "iron" | "wood" | "hybrid" | "wedge" | "putter",
        enabled: 1 as const,
      },
    ]);
    toast.success("Club added");
  };

  const handleAddCustom = () => {
    if (!customName || !customLoft) return;
    addClubs([
      {
        name: customName,
        brand: "Custom",
        model: "Custom",
        loft: parseFloat(customLoft),
        clubType: customType as "iron" | "wood" | "hybrid" | "wedge" | "putter",
        enabled: 1 as const,
      },
    ]);
    setCustomName("");
    setCustomLoft("");
    setShowCustom(false);
    toast.success("Custom club added");
  };

  const handleAddCalibration = () => {
    if (!calClubId || !calYardage) return;
    addCalibration({ clubId: calClubId, yardage: parseFloat(calYardage) });
    setCalYardage("");
    setCalClubId(null);
    toast.success("Calibration point saved");
  };

  const uniqueModelOptions = useMemo(() => {
    const seen = new Set<string>();
    return models.filter((m) => {
      const key = `${m.model} (${m.year})`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [models]);

  return (
    <div className="max-w-lg mx-auto px-4 pt-4">
      <h1 className="text-xl font-bold tracking-tight mb-4">My Bag</h1>

      {/* Calibration Section — always visible near top */}
      {clubs.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold">Calibration</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${Math.min(100, calibrations.length * 20)}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {calibrations.length}/5
                </span>
              </div>
              <span className="text-sm font-bold tabular-nums text-primary">
                PDF {pdf.toFixed(2)}
              </span>
            </div>
          </div>

          {calibrations.length === 0 && (
            <p className="text-xs text-muted-foreground mb-3">
              Enter known distances to personalize your yardages. Hit a few clubs at the range, enter what you carry.
            </p>
          )}

          {calibrations.length > 0 && (
            <div className="space-y-1 mb-3">
              {calibrations.map((cal) => {
                const club = clubs.find((c) => c.id === cal.clubId);
                return (
                  <div
                    key={cal.id}
                    className="flex items-center justify-between bg-secondary/30 rounded-lg px-3 py-1.5"
                  >
                    <span className="text-sm">
                      {club?.name || "Unknown"}: {cal.yardage} yds
                    </span>
                    <button
                      onClick={() => removeCalibration(cal.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {calibrations.length < 5 && (
            <div className="flex gap-2">
              <select
                value={calClubId || ""}
                onChange={(e) => setCalClubId(e.target.value ? Number(e.target.value) : null)}
                className="flex-1 h-10 bg-secondary rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select club...</option>
                {clubs
                  .filter((c) => c.enabled)
                  .map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
              </select>
              <input
                type="number"
                placeholder="Yds"
                value={calYardage}
                onChange={(e) => setCalYardage(e.target.value)}
                className="w-20 h-10 bg-secondary rounded-lg px-3 text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={handleAddCalibration}
                disabled={!calClubId || !calYardage}
                className="h-10 px-3 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Mode Toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setBagMode("full")}
          className={`flex-1 h-11 rounded-lg text-sm font-medium transition-colors ${
            bagMode === "full"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          Full Set
        </button>
        <button
          onClick={() => setBagMode("mixed")}
          className={`flex-1 h-11 rounded-lg text-sm font-medium transition-colors ${
            bagMode === "mixed"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          Mixed Bag
        </button>
      </div>

      {/* Brand Selector */}
      <div className="space-y-3 mb-4">
        <div>
          <label className="block text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1.5">
            Brand
          </label>
          <select
            value={selectedBrand}
            onChange={(e) => {
              setSelectedBrand(e.target.value);
              setSelectedModel("");
              setSelectedVariant(undefined);
            }}
            className="w-full h-11 bg-card border border-border rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select brand...</option>
            {brands.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        {selectedBrand && (
          <div>
            <label className="block text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1.5">
              Model
            </label>
            <select
              value={selectedModel}
              onChange={(e) => {
                setSelectedModel(e.target.value);
                setSelectedVariant(undefined);
              }}
              className="w-full h-11 bg-card border border-border rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select model...</option>
              {uniqueModelOptions.map((m, i) => (
                <option key={i} value={`${m.model} (${m.year})`}>
                  {m.model} ({m.year})
                </option>
              ))}
            </select>
          </div>
        )}

        {availableVariants.length > 0 && (
          <div>
            <label className="block text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1.5">
              Variant
            </label>
            <select
              value={selectedVariant || ""}
              onChange={(e) => setSelectedVariant(e.target.value || undefined)}
              className="w-full h-11 bg-card border border-border rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Standard</option>
              {availableVariants.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Catalog Preview */}
      {catalogEntry && (
        <div className="bg-card border border-border rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="font-semibold text-sm">
                {catalogEntry.brand} {catalogEntry.model}
                {catalogEntry.variant && (
                  <span className="text-muted-foreground ml-1">({catalogEntry.variant})</span>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                {catalogEntry.year} &middot; {catalogEntry.clubs.length} clubs
              </div>
            </div>
            {bagMode === "full" && (
              <button
                onClick={handleAddSet}
                className="h-9 px-4 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Set
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {catalogEntry.clubs.map((c, i) => (
              <div
                key={i}
                className={`flex items-center justify-between bg-secondary/50 rounded-lg px-3 py-2 ${
                  bagMode === "mixed" ? "cursor-pointer hover:bg-secondary" : ""
                }`}
                onClick={() => bagMode === "mixed" && handleAddSingle(c)}
              >
                <span className="text-sm font-medium">{c.name}</span>
                <span className="text-xs text-muted-foreground tabular-nums">{c.loft}&deg;</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Custom Club */}
      <button
        onClick={() => setShowCustom(!showCustom)}
        className="w-full flex items-center justify-center gap-1.5 py-2 mb-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <Plus className="w-3 h-3" />
        Add custom club
      </button>

      {showCustom && (
        <div className="bg-card border border-border rounded-xl p-4 mb-4 space-y-3">
          <input
            type="text"
            placeholder="Club name (e.g., 3 Wood)"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            className="w-full h-11 bg-secondary rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Loft"
              value={customLoft}
              onChange={(e) => setCustomLoft(e.target.value)}
              className="flex-1 h-11 bg-secondary rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <select
              value={customType}
              onChange={(e) => setCustomType(e.target.value)}
              className="flex-1 h-11 bg-secondary rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="iron">Iron</option>
              <option value="wood">Wood</option>
              <option value="hybrid">Hybrid</option>
              <option value="wedge">Wedge</option>
            </select>
          </div>
          <button
            onClick={handleAddCustom}
            disabled={!customName || !customLoft}
            className="w-full h-11 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            Add Custom Club
          </button>
        </div>
      )}

      {/* Wedge Clock Calibration */}
      {clubs.filter((c) => c.clubType === "wedge" && c.enabled).length > 0 && (
        <div className="bg-card border border-border rounded-xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold">Wedge Clock System</span>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Set yardages for each swing position on your wedges. Hit each position at the range and enter what you carry.
          </p>
          <div className="space-y-2">
            {clubs
              .filter((c) => c.clubType === "wedge" && c.enabled)
              .map((club) => {
                const clubClocks = clockCalibrations.filter((cc) => cc.clubId === club.id);
                const isEditing = clockEditClub === club.id;
                return (
                  <div key={club.id} className="bg-secondary/30 rounded-lg p-3">
                    <button
                      onClick={() => {
                        if (isEditing) {
                          setClockEditClub(null);
                          setClockInputs({});
                        } else {
                          setClockEditClub(club.id);
                          const inputs: Record<string, string> = {};
                          CLOCK_POSITIONS.forEach((pos) => {
                            const existing = clubClocks.find((cc) => cc.position === pos);
                            inputs[pos] = existing ? String(existing.yardage) : "";
                          });
                          setClockInputs(inputs);
                        }
                      }}
                      className="w-full flex items-center justify-between"
                    >
                      <span className="text-sm font-medium">{club.name}</span>
                      <div className="flex items-center gap-2">
                        {clubClocks.length > 0 && !isEditing && (
                          <span className="text-[10px] text-muted-foreground">
                            {clubClocks.length}/{CLOCK_POSITIONS.length} set
                          </span>
                        )}
                        <span className="text-xs text-primary font-medium">
                          {isEditing ? "Done" : "Edit"}
                        </span>
                      </div>
                    </button>

                    {/* Clock position grid when editing */}
                    {isEditing && (
                      <div className="grid grid-cols-3 gap-2 mt-3">
                        {CLOCK_POSITIONS.map((pos) => (
                          <div key={pos} className="text-center">
                            <div className="text-[10px] text-muted-foreground font-medium mb-1">
                              {CLOCK_LABELS[pos]}
                            </div>
                            <input
                              type="number"
                              inputMode="numeric"
                              placeholder="—"
                              value={clockInputs[pos] || ""}
                              onChange={(e) => {
                                const val = e.target.value;
                                setClockInputs((prev) => ({ ...prev, [pos]: val }));
                                if (val && parseInt(val) > 0) {
                                  setClockCalibration(club.id, pos, parseInt(val));
                                } else if (!val) {
                                  removeClockCalibration(club.id, pos);
                                }
                              }}
                              className="w-full h-9 bg-card border border-border rounded-lg text-sm font-bold text-center tabular-nums focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                            <div className="text-[9px] text-muted-foreground mt-0.5">yds</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Compact display when not editing */}
                    {!isEditing && clubClocks.length > 0 && (
                      <div className="flex gap-2 mt-2">
                        {CLOCK_POSITIONS.map((pos) => {
                          const cc = clubClocks.find((c) => c.position === pos);
                          return (
                            <div
                              key={pos}
                              className={`flex-1 text-center rounded-md py-1 ${
                                cc ? "bg-primary/10 border border-primary/20" : "bg-secondary/50"
                              }`}
                            >
                              <div className="text-[9px] text-muted-foreground">{CLOCK_LABELS[pos]}</div>
                              <div className={`text-xs font-bold tabular-nums ${
                                cc ? "text-primary" : "text-muted-foreground/30"
                              }`}>
                                {cc ? cc.yardage : "—"}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Club List */}
      {clubs.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold">My Clubs ({clubs.length})</h2>
            <button
              onClick={() => {
                clearClubs();
                toast.success("Bag cleared");
              }}
              className="text-xs text-destructive hover:text-destructive/80 transition-colors"
            >
              Clear all
            </button>
          </div>
          <div className="space-y-1.5">
            {clubs.map((club) => {
              const stockDist = Math.round(predictDistance(club, pdf));
              return (
                <div
                  key={club.id}
                  className={`flex items-center gap-3 bg-card border border-border rounded-lg px-3 py-2.5 transition-opacity ${
                    club.enabled ? "" : "opacity-40"
                  }`}
                >
                  <button
                    onClick={() => toggleClub(club.id)}
                    className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                      club.enabled
                        ? "bg-primary border-primary text-primary-foreground"
                        : "border-border"
                    }`}
                  >
                    {club.enabled ? <Check className="w-3 h-3" /> : null}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{club.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {club.brand} &middot; {club.loft}&deg;
                      {stockDist > 0 && ` \u00B7 ~${stockDist} yds`}
                    </div>
                  </div>
                  <button
                    onClick={() => removeClub(club.id)}
                    className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {clubs.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <div className="text-3xl mb-2 opacity-30">&#127948;</div>
          <p className="text-sm">Your bag is empty</p>
          <p className="text-xs mt-1 text-muted-foreground/60">
            Select a brand and model above to add clubs
          </p>
        </div>
      )}


    </div>
  );
}
