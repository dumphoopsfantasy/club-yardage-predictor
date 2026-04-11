import { useState, useMemo } from "react";
import { type Club, type CalibrationPoint, predictYardages, createClubWithId } from "@/lib/yardage-model";
import { CatalogSelector } from "@/components/CatalogSelector";
import { ClubEditor } from "@/components/ClubEditor";
import { CalibrationInput } from "@/components/CalibrationInput";
import { YardageResults } from "@/components/YardageResults";
import { Flag, ChevronDown, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Index() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [calibration, setCalibration] = useState<CalibrationPoint | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const predictedClubs = useMemo(() => {
    if (!calibration?.clubId || !calibration.yardage || clubs.length === 0) return [];
    return predictYardages(clubs, calibration);
  }, [clubs, calibration]);

  const hasResults = predictedClubs.length > 0 && predictedClubs.some((c) => c.predictedYardage);

  const handleCatalogSelect = (newClubs: Club[], label: string) => {
    setClubs(newClubs);
    setCalibration(null);
    setSelectedModel(label);
    setShowAdvanced(false);
  };

  const handleAddCustomClub = () => {
    setClubs([...clubs, createClubWithId({ name: "", loft: 30 })]);
    setShowAdvanced(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-2xl mx-auto px-4 py-6 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
            <Flag className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">Club Yardage Predictor</h1>
            <p className="text-sm text-muted-foreground">Know one distance. Predict them all.</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        {/* Step 1: Club Set from Catalog */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">1</span>
            <h2 className="font-semibold text-foreground">Select Your Irons</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Pick your iron set from our catalog of real club models. Lofts are loaded automatically.
          </p>
          <CatalogSelector onSelect={handleCatalogSelect} />

          {selectedModel && (
            <p className="text-sm text-muted-foreground">
              Loaded: <span className="font-medium text-foreground">{selectedModel}</span>
            </p>
          )}

          {/* Advanced: manual editing */}
          {clubs.length > 0 && (
            <div className="space-y-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-muted-foreground text-xs gap-1.5"
              >
                <Settings2 className="h-3.5 w-3.5" />
                Advanced: Edit lofts manually
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
              </Button>
              {showAdvanced && <ClubEditor clubs={clubs} onChange={setClubs} />}
            </div>
          )}

          {clubs.length === 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddCustomClub}
              className="text-muted-foreground border-dashed"
            >
              Or build a custom set manually
            </Button>
          )}
        </section>

        {/* Step 2: Calibration */}
        {clubs.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">2</span>
              <h2 className="font-semibold text-foreground">Calibrate</h2>
            </div>
            <CalibrationInput
              clubs={clubs}
              calibration={calibration}
              onChange={setCalibration}
            />
          </section>
        )}

        {/* Step 3: Results */}
        {hasResults && (
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">3</span>
              <h2 className="font-semibold text-foreground">Your Predicted Distances</h2>
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
              <YardageResults clubs={predictedClubs} calibratedClubId={calibration?.clubId} />
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
