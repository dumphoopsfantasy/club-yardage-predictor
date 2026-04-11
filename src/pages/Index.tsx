import { useState, useMemo } from "react";
import { type Club, type CalibrationPoint, predictYardages } from "@/lib/yardage-model";
import { ClubSetSelector } from "@/components/ClubSetSelector";
import { ClubEditor } from "@/components/ClubEditor";
import { CalibrationInput } from "@/components/CalibrationInput";
import { YardageResults } from "@/components/YardageResults";
import { Flag } from "lucide-react";

export default function Index() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [calibration, setCalibration] = useState<CalibrationPoint | null>(null);

  const predictedClubs = useMemo(() => {
    if (!calibration?.clubId || !calibration.yardage || clubs.length === 0) return [];
    return predictYardages(clubs, calibration);
  }, [clubs, calibration]);

  const hasResults = predictedClubs.length > 0 && predictedClubs.some((c) => c.predictedYardage);

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
        {/* Step 1: Club Set */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">1</span>
            <h2 className="font-semibold text-foreground">Your Club Set</h2>
          </div>
          <ClubSetSelector onSelect={(c) => { setClubs(c); setCalibration(null); }} />
          {clubs.length > 0 && <ClubEditor clubs={clubs} onChange={setClubs} />}
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
