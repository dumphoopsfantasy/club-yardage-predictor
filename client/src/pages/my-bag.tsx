import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Club, Calibration } from "@shared/schema";
import { getBrands, getModels, getClubsForModel } from "@/lib/club-catalog";
import { calculatePDF, predictDistance } from "@/lib/yardage-model";
import {
  Plus,
  Trash2,
  Save,
  ChevronDown,
  Check,
  X,
  Target,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function MyBag() {
  const { toast } = useToast();
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>();
  const [bagMode, setBagMode] = useState<"full" | "mixed">("full");
  const [showCalibration, setShowCalibration] = useState(false);
  const [calClubId, setCalClubId] = useState<number | null>(null);
  const [calYardage, setCalYardage] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customLoft, setCustomLoft] = useState("");
  const [customType, setCustomType] = useState<string>("iron");

  const { data: clubs = [], isLoading: clubsLoading } = useQuery<Club[]>({
    queryKey: ["/api/clubs"],
  });

  const { data: calibrations = [] } = useQuery<Calibration[]>({
    queryKey: ["/api/calibrations"],
  });

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
    return getClubsForModel(
      selectedBrand,
      selectedModelEntry.model,
      selectedVariant
    );
  }, [selectedBrand, selectedModelEntry, selectedVariant]);

  const pdf = useMemo(
    () => calculatePDF(calibrations, clubs),
    [calibrations, clubs]
  );

  const addClubsMutation = useMutation({
    mutationFn: async (
      clubsToAdd: {
        name: string;
        brand: string;
        model: string;
        variant?: string;
        loft: number;
        clubType: string;
      }[]
    ) => {
      const payload = clubsToAdd.map((c, i) => ({
        ...c,
        enabled: 1,
        sortOrder: clubs.length + i,
        createdAt: new Date().toISOString(),
      }));
      await apiRequest("POST", "/api/clubs/bulk", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clubs"] });
      toast({ title: "Clubs added to bag" });
    },
  });

  const addCustomClubMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/clubs", {
        name: customName,
        brand: "Custom",
        model: "Custom",
        variant: null,
        loft: parseFloat(customLoft),
        clubType: customType,
        enabled: 1,
        sortOrder: clubs.length,
        createdAt: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clubs"] });
      setCustomName("");
      setCustomLoft("");
      setShowCustom(false);
      toast({ title: "Custom club added" });
    },
  });

  const toggleClubMutation = useMutation({
    mutationFn: async ({ id, enabled }: { id: number; enabled: number }) => {
      await apiRequest("PATCH", `/api/clubs/${id}`, { enabled });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clubs"] });
    },
  });

  const deleteClubMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/clubs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clubs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/calibrations"] });
    },
  });

  const clearBagMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", "/api/clubs");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clubs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/calibrations"] });
      toast({ title: "Bag cleared" });
    },
  });

  const addCalibrationMutation = useMutation({
    mutationFn: async () => {
      if (!calClubId || !calYardage) return;
      await apiRequest("POST", "/api/calibrations", {
        clubId: calClubId,
        yardage: parseFloat(calYardage),
        createdAt: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/calibrations"] });
      setCalYardage("");
      setCalClubId(null);
      toast({ title: "Calibration point saved" });
    },
  });

  const deleteCalibrationMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/calibrations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/calibrations"] });
    },
  });

  const handleAddSet = () => {
    if (!catalogEntry) return;
    const clubsToAdd = catalogEntry.clubs.map((c) => ({
      name: c.name,
      brand: catalogEntry.brand,
      model: `${catalogEntry.model} (${catalogEntry.year})`,
      variant: catalogEntry.variant || undefined,
      loft: c.loft,
      clubType: c.type,
    }));
    addClubsMutation.mutate(clubsToAdd);
  };

  const handleAddSingle = (club: { name: string; loft: number; type: string }) => {
    if (!catalogEntry) return;
    addClubsMutation.mutate([
      {
        name: club.name,
        brand: catalogEntry.brand,
        model: `${catalogEntry.model} (${catalogEntry.year})`,
        variant: catalogEntry.variant || undefined,
        loft: club.loft,
        clubType: club.type,
      },
    ]);
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

      {/* Mode Toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setBagMode("full")}
          className={`flex-1 h-10 rounded-lg text-sm font-medium transition-colors ${
            bagMode === "full"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
          data-testid="mode-full"
        >
          Full Set
        </button>
        <button
          onClick={() => setBagMode("mixed")}
          className={`flex-1 h-10 rounded-lg text-sm font-medium transition-colors ${
            bagMode === "mixed"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
          data-testid="mode-mixed"
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
            data-testid="brand-select"
          >
            <option value="">Select brand...</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        {/* Model Selector */}
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
              data-testid="model-select"
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

        {/* Variant Selector */}
        {availableVariants.length > 0 && (
          <div>
            <label className="block text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1.5">
              Variant
            </label>
            <select
              value={selectedVariant || ""}
              onChange={(e) =>
                setSelectedVariant(e.target.value || undefined)
              }
              className="w-full h-11 bg-card border border-border rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              data-testid="variant-select"
            >
              <option value="">Standard</option>
              {availableVariants.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Catalog Preview / Add */}
      {catalogEntry && (
        <div className="bg-card border border-border rounded-xl p-4 mb-4" data-testid="catalog-preview">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="font-semibold text-sm">
                {catalogEntry.brand} {catalogEntry.model}
                {catalogEntry.variant && (
                  <span className="text-muted-foreground ml-1">
                    ({catalogEntry.variant})
                  </span>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                {catalogEntry.year} &middot; {catalogEntry.clubs.length} clubs
              </div>
            </div>
            {bagMode === "full" && (
              <button
                onClick={handleAddSet}
                disabled={addClubsMutation.isPending}
                className="h-9 px-4 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                data-testid="add-full-set"
              >
                {addClubsMutation.isPending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Plus className="w-3.5 h-3.5" />
                )}
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
                <span className="text-xs text-muted-foreground tabular-nums">
                  {c.loft}°
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Custom Club */}
      <button
        onClick={() => setShowCustom(!showCustom)}
        className="w-full flex items-center justify-center gap-1.5 py-2 mb-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
        data-testid="toggle-custom"
      >
        <Plus className="w-3 h-3" />
        Add custom club
      </button>

      {showCustom && (
        <div className="bg-card border border-border rounded-xl p-4 mb-4 space-y-3" data-testid="custom-club-form">
          <input
            type="text"
            placeholder="Club name (e.g., 3 Wood)"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            className="w-full h-10 bg-secondary rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Loft"
              value={customLoft}
              onChange={(e) => setCustomLoft(e.target.value)}
              className="flex-1 h-10 bg-secondary rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <select
              value={customType}
              onChange={(e) => setCustomType(e.target.value)}
              className="flex-1 h-10 bg-secondary rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="iron">Iron</option>
              <option value="wood">Wood</option>
              <option value="hybrid">Hybrid</option>
              <option value="wedge">Wedge</option>
            </select>
          </div>
          <button
            onClick={() => addCustomClubMutation.mutate()}
            disabled={!customName || !customLoft || addCustomClubMutation.isPending}
            className="w-full h-10 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
            data-testid="save-custom-club"
          >
            Add Custom Club
          </button>
        </div>
      )}

      {/* Club List */}
      {clubs.length > 0 && (
        <div className="mb-4" data-testid="club-list">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold">
              My Clubs ({clubs.length})
            </h2>
            <button
              onClick={() => clearBagMutation.mutate()}
              className="text-xs text-destructive hover:text-destructive/80 transition-colors"
              data-testid="clear-bag"
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
                  data-testid={`club-${club.id}`}
                >
                  <button
                    onClick={() =>
                      toggleClubMutation.mutate({
                        id: club.id,
                        enabled: club.enabled ? 0 : 1,
                      })
                    }
                    className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                      club.enabled
                        ? "bg-primary border-primary text-primary-foreground"
                        : "border-border"
                    }`}
                  >
                    {club.enabled ? <Check className="w-3 h-3" /> : null}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {club.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {club.brand} &middot; {club.loft}°
                      {stockDist > 0 && ` · ~${stockDist} yds`}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteClubMutation.mutate(club.id)}
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
      {clubs.length === 0 && !clubsLoading && (
        <div className="text-center py-8 text-muted-foreground" data-testid="empty-bag">
          <div className="text-3xl mb-2 opacity-30">🏌️</div>
          <p className="text-sm">Your bag is empty</p>
          <p className="text-xs mt-1 text-muted-foreground/60">
            Select a brand and model above to add clubs
          </p>
        </div>
      )}

      {/* Calibration Section */}
      {clubs.length > 0 && (
        <div className="mb-4" data-testid="calibration-section">
          <button
            onClick={() => setShowCalibration(!showCalibration)}
            className="flex items-center gap-2 mb-3"
          >
            <Target className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold">Calibration</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${
                showCalibration ? "rotate-180" : ""
              }`}
            />
          </button>

          {showCalibration && (
            <div className="bg-card border border-border rounded-xl p-4 space-y-3">
              <p className="text-xs text-muted-foreground">
                Enter known distances for your clubs to personalize yardage
                predictions. More calibration points = more accurate results.
              </p>

              {/* PDF display */}
              <div className="flex items-center justify-between bg-secondary/50 rounded-lg px-3 py-2">
                <span className="text-xs text-muted-foreground">
                  Personal Distance Factor
                </span>
                <span className="text-sm font-bold tabular-nums text-primary">
                  {pdf.toFixed(2)}
                </span>
              </div>

              {/* Confidence */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, calibrations.length * 20)}%`,
                    }}
                  />
                </div>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {calibrations.length}/5
                </span>
              </div>

              {/* Existing calibrations */}
              {calibrations.length > 0 && (
                <div className="space-y-1">
                  {calibrations.map((cal) => {
                    const club = clubs.find((c) => c.id === cal.clubId);
                    return (
                      <div
                        key={cal.id}
                        className="flex items-center justify-between bg-secondary/30 rounded-lg px-3 py-2"
                      >
                        <span className="text-sm">
                          {club?.name || "Unknown"}: {cal.yardage} yds
                        </span>
                        <button
                          onClick={() =>
                            deleteCalibrationMutation.mutate(cal.id)
                          }
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Add calibration */}
              {calibrations.length < 5 && (
                <div className="flex gap-2">
                  <select
                    value={calClubId || ""}
                    onChange={(e) =>
                      setCalClubId(e.target.value ? Number(e.target.value) : null)
                    }
                    className="flex-1 h-10 bg-secondary rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select club...</option>
                    {clubs
                      .filter((c) => c.enabled)
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
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
                    onClick={() => addCalibrationMutation.mutate()}
                    disabled={
                      !calClubId ||
                      !calYardage ||
                      addCalibrationMutation.isPending
                    }
                    className="h-10 px-3 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
                    data-testid="add-calibration"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
