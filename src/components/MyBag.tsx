import { useMemo, useState } from "react";
import {
  type Club,
  type CalibrationPoint,
  predictYardages,
  createClubWithId,
} from "@/lib/yardage-model";
import { CatalogSelector } from "@/components/CatalogSelector";
import { CalibrationInput } from "@/components/CalibrationInput";
import { YardageResults } from "@/components/YardageResults";
import { AddClubSection } from "@/components/AddClubSection";
import {
  ChevronDown,
  RotateCcw,
  Save,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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
  onSave: () => void;
  hasUnsavedChanges: boolean;
}

export function MyBag({
  clubs,
  setClubs,
  calibrations,
  setCalibrations,
  selectedModel,
  setSelectedModel,
  onReset,
  onSave,
  hasUnsavedChanges,
}: Props) {
  const [showAddClub, setShowAddClub] = useState(false);

  const handleCatalogSelect = (newClubs: Club[], label: string) => {
    // Replace base set clubs, keep added clubs
    const addedClubs = clubs.filter((c) => c.source && c.source !== selectedModel && c.addedIndividually);
    setClubs([...newClubs, ...addedClubs]);
    setCalibrations([]);
    setSelectedModel(label);
  };

  // Separate base set clubs from individually added clubs
  const baseSetClubs = clubs.filter((c) => !c.addedIndividually);
  const addedClubs = clubs.filter((c) => c.addedIndividually);

  // All clubs sorted by loft for the bag view (disabled shown grayed out)
  const allClubsSorted = useMemo(() => {
    return [...clubs].sort((a, b) => a.loft - b.loft);
  }, [clubs]);

  const enabledCount = useMemo(() => {
    return clubs.filter((c) => c.enabled !== false).length;
  }, [clubs]);

  const predictedClubs = useMemo(() => {
    const enabled = clubs.filter((c) => c.enabled !== false);
    if (calibrations.length === 0 || enabled.length === 0) return [];
    const validCals = calibrations.filter((c) => c.clubId && c.yardage > 0);
    if (validCals.length === 0) return [];
    return predictYardages(enabled, validCals);
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

  const handleRemoveAddedClub = (id: string) => {
    setClubs(clubs.filter((c) => c.id !== id));
  };

  const handleAddClubs = (newClubs: Club[]) => {
    setClubs([...clubs, ...newClubs]);
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

      {/* Step 1: Base Iron Set */}
      <Collapsible defaultOpen={baseSetClubs.length === 0}>
        <section className="space-y-3">
          <CollapsibleTrigger asChild>
            <button className="flex items-center gap-2 w-full text-left group">
              <span className="h-7 w-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0">
                1
              </span>
              <h3 className="font-semibold text-foreground text-base flex-1">
                Base Iron Set
              </h3>
              <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Start by picking your iron set from the catalog. You can then toggle off clubs you don't carry.
            </p>

            <CatalogSelector onSelect={handleCatalogSelect} />

            {selectedModel && (
              <p className="text-sm text-muted-foreground">
                Loaded:{" "}
                <span className="font-medium text-foreground">
                  {selectedModel}
                </span>
              </p>
            )}

            {/* Toggle base set clubs on/off */}
            {baseSetClubs.length > 0 && (
              <div className="rounded-xl border border-border bg-card divide-y divide-border">
                {baseSetClubs.map((club) => (
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
            )}
          </CollapsibleContent>
        </section>
      </Collapsible>

      {/* Step 2: Add Individual Clubs */}
      <Collapsible defaultOpen={false} open={showAddClub} onOpenChange={setShowAddClub}>
        <section className="space-y-3">
          <CollapsibleTrigger asChild>
            <button className="flex items-center gap-2 w-full text-left group">
              <span className="h-7 w-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0">
                2
              </span>
              <h3 className="font-semibold text-foreground text-base flex-1">
                Add Clubs
              </h3>
              <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Add individual clubs from other catalog models (hybrids, wedges, etc.) or enter clubs manually.
            </p>
            <AddClubSection onAddClubs={handleAddClubs} />
          </CollapsibleContent>
        </section>
      </Collapsible>

      {/* Step 3: Bag View — sorted by loft */}
      {clubs.length > 0 && (
        <section className="space-y-3">
          <h3 className="font-semibold text-foreground text-base flex items-center gap-2">
            <span className="h-7 w-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0">
              3
            </span>
            Your Bag ({enabledCount} clubs)
          </h3>
          <p className="text-sm text-muted-foreground">
            All active clubs sorted by loft. Individually added clubs can be removed with the X button.
          </p>
          <div className="rounded-xl border border-border bg-card divide-y divide-border">
            {allClubsSorted.map((club) => {
              const isDisabled = club.enabled === false;
              return (
                <div
                  key={club.id}
                  className={`flex items-center justify-between px-4 py-3 ${isDisabled ? "opacity-40" : ""}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`text-sm font-medium truncate ${isDisabled ? "text-muted-foreground line-through" : "text-foreground"}`}>
                      {club.name || `${club.loft}°`}
                    </span>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {club.loft}°
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {isDisabled && (
                      <span className="text-[11px] text-muted-foreground italic">
                        Off
                      </span>
                    )}
                    <span className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full truncate max-w-[140px]">
                      {club.addedIndividually
                        ? club.source || "Manual"
                        : selectedModel || "Base Set"}
                    </span>
                    {club.addedIndividually && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveAddedClub(club.id)}
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Step 4: Calibrate */}
      {clubs.length > 0 && (
        <Collapsible defaultOpen={calibrations.length === 0 || calibrations.some(c => !c.clubId)}>
          <section className="space-y-3">
            <CollapsibleTrigger asChild>
              <button className="flex items-center gap-2 w-full text-left group">
                <span className="h-7 w-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0">
                  4
                </span>
                <h3 className="font-semibold text-foreground text-base flex-1">
                  Calibrate
                </h3>
                <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3">
              <CalibrationInput
                clubs={clubs.filter((c) => c.enabled !== false)}
                calibrations={calibrations}
                onChange={setCalibrations}
              />
            </CollapsibleContent>
          </section>
        </Collapsible>
      )}

      {/* Step 5: Predicted Distances */}
      {hasResults && (
        <Collapsible defaultOpen>
          <section className="space-y-3">
            <CollapsibleTrigger asChild>
              <button className="flex items-center gap-2 w-full text-left group">
                <span className="h-7 w-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0">
                  5
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

      {/* Save Bag Button */}
      <div className="sticky bottom-20 z-40 pt-2">
        <Button
          onClick={onSave}
          className="w-full h-12 text-base font-bold bg-green-600 hover:bg-green-700 text-white shadow-lg"
        >
          <Save className="h-5 w-5 mr-2" />
          {hasUnsavedChanges ? "Save Bag *" : "Save Bag"}
        </Button>
      </div>
    </div>
  );
}
