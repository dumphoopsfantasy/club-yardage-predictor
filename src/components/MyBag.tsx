import { useMemo, useState } from "react";
import {
  type Club,
  type CalibrationPoint,
  predictYardages,
} from "@/lib/yardage-model";
import { CatalogSelector } from "@/components/CatalogSelector";
import { CalibrationInput } from "@/components/CalibrationInput";
import { YardageResults } from "@/components/YardageResults";
import { BagManager } from "@/components/BagManager";
import {
  ChevronDown,
  Settings2,
  ShoppingBag,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ClubEditor } from "@/components/ClubEditor";

type BagMode = "catalog" | "mixed";

interface Props {
  clubs: Club[];
  setClubs: (clubs: Club[]) => void;
  calibrations: CalibrationPoint[];
  setCalibrations: (cals: CalibrationPoint[]) => void;
  selectedModel: string;
  setSelectedModel: (m: string) => void;
  bagMode: BagMode;
  setBagMode: (m: BagMode) => void;
  onReset: () => void;
}

export function MyBag({
  clubs,
  setClubs,
  calibrations,
  setCalibrations,
  selectedModel,
  setSelectedModel,
  bagMode,
  setBagMode,
  onReset,
}: Props) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleCatalogSelect = (newClubs: Club[], label: string) => {
    setClubs(newClubs);
    setCalibrations([]);
    setSelectedModel(label);
    setShowAdvanced(false);
  };

  const predictedClubs = useMemo(() => {
    if (calibrations.length === 0 || clubs.length === 0) return [];
    const validCals = calibrations.filter((c) => c.clubId && c.yardage > 0);
    if (validCals.length === 0) return [];
    return predictYardages(clubs, validCals);
  }, [clubs, calibrations]);

  const hasResults =
    predictedClubs.length > 0 && predictedClubs.some((c) => c.predictedYardage);

  const calibratedClubIds = calibrations
    .filter((c) => c.clubId && c.yardage > 0)
    .map((c) => c.clubId);

  const handleToggleClub = (id: string) => {
    setClubs(
      clubs.map((c) =>
        c.id === id ? { ...c, enabled: c.enabled === false ? true : false } : c
      )
    );
  };

  return (
    <div className="px-4 py-5 space-y-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">My Bag</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="text-muted-foreground hover:text-destructive h-9 gap-1.5"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </Button>
      </div>

      {/* Club Selection */}
      <Collapsible defaultOpen={clubs.length === 0}>
        <section className="space-y-3">
          <CollapsibleTrigger asChild>
            <button className="flex items-center gap-2 w-full text-left group">
              <span className="h-7 w-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0">
                1
              </span>
              <h3 className="font-semibold text-foreground text-base flex-1">
                Select Your Clubs
              </h3>
              <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3">
            {/* Mode toggle */}
            <div className="flex rounded-lg border border-border overflow-hidden">
              <button
                onClick={() => setBagMode("catalog")}
                className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                  bagMode === "catalog"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-muted-foreground hover:bg-muted"
                }`}
              >
                Full Set
              </button>
              <button
                onClick={() => setBagMode("mixed")}
                className={`flex-1 py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-1.5 ${
                  bagMode === "mixed"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-muted-foreground hover:bg-muted"
                }`}
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                Mixed Bag
              </button>
            </div>

            <p className="text-sm text-muted-foreground">
              {bagMode === "catalog"
                ? "Pick your iron set from our catalog of real club models."
                : "Build a custom bag by adding individual clubs from different models."}
            </p>

            {bagMode === "catalog" ? (
              <>
                <CatalogSelector onSelect={handleCatalogSelect} />
                {selectedModel && (
                  <p className="text-sm text-muted-foreground">
                    Loaded:{" "}
                    <span className="font-medium text-foreground">
                      {selectedModel}
                    </span>
                  </p>
                )}
                {clubs.length > 0 && (
                  <div className="space-y-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className="text-muted-foreground text-xs gap-1.5 h-10"
                    >
                      <Settings2 className="h-3.5 w-3.5" />
                      Edit lofts
                      <ChevronDown
                        className={`h-3.5 w-3.5 transition-transform ${
                          showAdvanced ? "rotate-180" : ""
                        }`}
                      />
                    </Button>
                    {showAdvanced && (
                      <ClubEditor clubs={clubs} onChange={setClubs} />
                    )}
                  </div>
                )}
              </>
            ) : (
              <BagManager bag={clubs} onBagChange={setClubs} />
            )}
          </CollapsibleContent>
        </section>
      </Collapsible>

      {/* Club Toggling */}
      {clubs.length > 0 && (
        <section className="space-y-3">
          <h3 className="font-semibold text-foreground text-base flex items-center gap-2">
            <span className="h-7 w-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0">
              2
            </span>
            Your Clubs
          </h3>
          <p className="text-sm text-muted-foreground">
            Toggle off clubs you don't carry. Disabled clubs won't appear in calculator recommendations.
          </p>
          <div className="rounded-xl border border-border bg-card divide-y divide-border">
            {clubs.map((club) => (
              <div
                key={club.id}
                className="flex items-center justify-between px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`text-sm font-medium ${
                      club.enabled === false
                        ? "text-muted-foreground line-through"
                        : "text-foreground"
                    }`}
                  >
                    {club.name || `${club.loft}°`}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {club.loft}°
                  </span>
                </div>
                <button
                  onClick={() => handleToggleClub(club.id)}
                  className={`relative w-12 h-7 rounded-full transition-colors ${
                    club.enabled !== false
                      ? "bg-primary"
                      : "bg-muted"
                  }`}
                  role="switch"
                  aria-checked={club.enabled !== false}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
                      club.enabled !== false ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Calibration */}
      {clubs.length > 0 && (
        <Collapsible defaultOpen={calibrations.length === 0 || calibrations.some(c => !c.clubId)}>
          <section className="space-y-3">
            <CollapsibleTrigger asChild>
              <button className="flex items-center gap-2 w-full text-left group">
                <span className="h-7 w-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0">
                  3
                </span>
                <h3 className="font-semibold text-foreground text-base flex-1">
                  Calibrate
                </h3>
                <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3">
              <CalibrationInput
                clubs={clubs}
                calibrations={calibrations}
                onChange={setCalibrations}
              />
            </CollapsibleContent>
          </section>
        </Collapsible>
      )}

      {/* Predicted Distances */}
      {hasResults && (
        <Collapsible defaultOpen>
          <section className="space-y-3">
            <CollapsibleTrigger asChild>
              <button className="flex items-center gap-2 w-full text-left group">
                <span className="h-7 w-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0">
                  4
                </span>
                <h3 className="font-semibold text-foreground text-base flex-1">
                  Your Distances
                </h3>
                <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="rounded-xl border border-border bg-card p-4">
                <YardageResults
                  clubs={predictedClubs}
                  calibratedClubIds={calibratedClubIds}
                />
              </div>
            </CollapsibleContent>
          </section>
        </Collapsible>
      )}
    </div>
  );
}
