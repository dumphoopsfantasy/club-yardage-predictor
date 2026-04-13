import { useMemo, useState } from "react";
import {
  type Club,
  type CalibrationPoint,
  type EnvironmentalConditions,
  DEFAULT_CONDITIONS,
  predictYardages,
  createClubWithId,
} from "@/lib/yardage-model";
import { usePersistedState, clearAllPersistedState } from "@/hooks/use-persisted-state";
import { CatalogSelector } from "@/components/CatalogSelector";
import { ClubEditor } from "@/components/ClubEditor";
import { CalibrationInput } from "@/components/CalibrationInput";
import { YardageResults } from "@/components/YardageResults";
import { EnvironmentalAdjustments } from "@/components/EnvironmentalAdjustments";
import { BagManager } from "@/components/BagManager";
import { ShareExport } from "@/components/ShareExport";
import {
  Flag,
  ChevronDown,
  Settings2,
  CloudSun,
  ShoppingBag,
  RotateCcw,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

type BagMode = "catalog" | "mixed";

export default function Index() {
  // Persisted state
  const [clubs, setClubs] = usePersistedState<Club[]>("clubs", []);
  const [calibrations, setCalibrations] = usePersistedState<CalibrationPoint[]>(
    "calibrations",
    []
  );
  const [conditions, setConditions] = usePersistedState<EnvironmentalConditions>(
    "conditions",
    { ...DEFAULT_CONDITIONS }
  );
  const [selectedModel, setSelectedModel] = usePersistedState("selectedModel", "");
  const [bagMode, setBagMode] = usePersistedState<BagMode>("bagMode", "catalog");

  // UI state (not persisted)
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [conditionsOpen, setConditionsOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const hasConditions =
    conditions.altitude !== 0 ||
    conditions.temperature !== 70 ||
    (conditions.windSpeed > 0 && conditions.windDirection !== "none") ||
    conditions.slope !== 0;

  const predictedClubs = useMemo(() => {
    if (calibrations.length === 0 || clubs.length === 0) return [];
    const validCals = calibrations.filter((c) => c.clubId && c.yardage > 0);
    if (validCals.length === 0) return [];
    return predictYardages(clubs, validCals, conditions);
  }, [clubs, calibrations, conditions]);

  const hasResults =
    predictedClubs.length > 0 && predictedClubs.some((c) => c.predictedYardage);

  const calibratedClubIds = calibrations
    .filter((c) => c.clubId && c.yardage > 0)
    .map((c) => c.clubId);

  const handleCatalogSelect = (newClubs: Club[], label: string) => {
    setClubs(newClubs);
    setCalibrations([]);
    setSelectedModel(label);
    setShowAdvanced(false);
  };

  const handleAddCustomClub = () => {
    setClubs([...clubs, createClubWithId({ name: "", loft: 30 })]);
    setShowAdvanced(true);
  };

  const handleReset = () => {
    clearAllPersistedState();
    setClubs([]);
    setCalibrations([]);
    setConditions({ ...DEFAULT_CONDITIONS });
    setSelectedModel("");
    setBagMode("catalog");
    setShowAdvanced(false);
    setConditionsOpen(false);
    setShareOpen(false);
  };

  return (
    <div className="min-h-screen bg-background pb-24 sm:pb-8">
      {/* Sticky header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="max-w-2xl mx-auto px-4 py-3 sm:py-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
            <Flag className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight truncate">
              Club Yardage Predictor
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Know one distance. Predict them all.
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleReset}
            className="ml-auto h-10 w-10 text-muted-foreground hover:text-destructive shrink-0"
            title="Reset all data"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Step 1: Club Selection */}
        <Collapsible defaultOpen>
          <section className="space-y-4">
            <CollapsibleTrigger asChild>
              <button className="flex items-center gap-2 w-full text-left group">
                <span className="h-7 w-7 sm:h-6 sm:w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0">
                  1
                </span>
                <h2 className="font-semibold text-foreground text-base sm:text-sm flex-1">
                  Select Your Clubs
                </h2>
                <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
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
                  ? "Pick your iron set from our catalog of real club models. Lofts are loaded automatically."
                  : "Build a custom bag by adding individual clubs from different brands and models."}
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
                        Advanced: Edit lofts manually
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
                  {clubs.length === 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAddCustomClub}
                      className="text-muted-foreground border-dashed h-11 w-full"
                    >
                      Or build a custom set manually
                    </Button>
                  )}
                </>
              ) : (
                <BagManager bag={clubs} onBagChange={setClubs} />
              )}
            </CollapsibleContent>
          </section>
        </Collapsible>

        {/* Step 2: Calibration */}
        {clubs.length > 0 && (
          <Collapsible defaultOpen>
            <section className="space-y-4">
              <CollapsibleTrigger asChild>
                <button className="flex items-center gap-2 w-full text-left group">
                  <span className="h-7 w-7 sm:h-6 sm:w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0">
                    2
                  </span>
                  <h2 className="font-semibold text-foreground text-base sm:text-sm flex-1">
                    Calibrate
                  </h2>
                  <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
                <CalibrationInput
                  clubs={clubs}
                  calibrations={calibrations}
                  onChange={setCalibrations}
                />
              </CollapsibleContent>
            </section>
          </Collapsible>
        )}

        {/* Step 3: Course Conditions */}
        {clubs.length > 0 &&
          calibrations.some((c) => c.clubId && c.yardage > 0) && (
            <Collapsible open={conditionsOpen} onOpenChange={setConditionsOpen}>
              <section className="space-y-4">
                <CollapsibleTrigger asChild>
                  <button className="flex items-center gap-2 w-full text-left group">
                    <span className="h-7 w-7 sm:h-6 sm:w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0">
                      3
                    </span>
                    <h2 className="font-semibold text-foreground text-base sm:text-sm flex-1">
                      Course Conditions
                      {hasConditions && (
                        <span className="ml-2 text-xs text-golf-gold font-normal">
                          Active
                        </span>
                      )}
                    </h2>
                    <CloudSun className="h-4 w-4 text-muted-foreground mr-1" />
                    <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
                  <div className="rounded-xl border border-border bg-card p-5">
                    <EnvironmentalAdjustments
                      conditions={conditions}
                      onChange={setConditions}
                    />
                  </div>
                </CollapsibleContent>
              </section>
            </Collapsible>
          )}

        {/* Step 4: Results */}
        {hasResults && (
          <Collapsible defaultOpen>
            <section className="space-y-4">
              <CollapsibleTrigger asChild>
                <button className="flex items-center gap-2 w-full text-left group">
                  <span className="h-7 w-7 sm:h-6 sm:w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0">
                    {clubs.length > 0 &&
                    calibrations.some((c) => c.clubId && c.yardage > 0)
                      ? "4"
                      : "3"}
                  </span>
                  <h2 className="font-semibold text-foreground text-base sm:text-sm flex-1">
                    Your Predicted Distances
                  </h2>
                  <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
                <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
                  <YardageResults
                    clubs={predictedClubs}
                    calibratedClubIds={calibratedClubIds}
                    showAdjusted={hasConditions}
                  />
                </div>

                {/* Share/Export */}
                <Collapsible open={shareOpen} onOpenChange={setShareOpen}>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full h-11 gap-2"
                    >
                      <Share2 className="h-4 w-4" />
                      Share / Export Yardage Card
                      <ChevronDown
                        className={`h-3.5 w-3.5 ml-auto transition-transform ${
                          shareOpen ? "rotate-180" : ""
                        }`}
                      />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-4 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
                    <ShareExport
                      clubs={predictedClubs}
                      calibrations={calibrations}
                      conditions={hasConditions ? conditions : undefined}
                      showAdjusted={hasConditions}
                    />
                  </CollapsibleContent>
                </Collapsible>
              </CollapsibleContent>
            </section>
          </Collapsible>
        )}
      </main>
    </div>
  );
}
