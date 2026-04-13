import { useState, useCallback, useEffect } from "react";
import {
  type Club,
  type CalibrationPoint,
} from "@/lib/yardage-model";
import { usePersistedState, clearAllPersistedState } from "@/hooks/use-persisted-state";
import { Calculator } from "@/components/Calculator";
import { MyBag } from "@/components/MyBag";
import { Flag, Crosshair, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

type Tab = "calculator" | "bag";
type BagMode = "catalog" | "mixed";

export interface BagState {
  clubs: Club[];
  calibrations: CalibrationPoint[];
  selectedModel: string;
  bagMode: BagMode;
}

export default function Index() {
  const [activeTab, setActiveTab] = usePersistedState<Tab>("activeTab", "calculator");

  // Saved state — persisted in localStorage, used by Calculator
  const [savedClubs, setSavedClubs] = usePersistedState<Club[]>("clubs", []);
  const [savedCalibrations, setSavedCalibrations] = usePersistedState<CalibrationPoint[]>(
    "calibrations",
    []
  );
  const [savedSelectedModel, setSavedSelectedModel] = usePersistedState("selectedModel", "");
  const [savedBagMode, setSavedBagMode] = usePersistedState<BagMode>("bagMode", "catalog");

  // Draft state — in-memory, used by MyBag for editing
  const [draftClubs, setDraftClubs] = useState<Club[]>(savedClubs);
  const [draftCalibrations, setDraftCalibrations] = useState<CalibrationPoint[]>(savedCalibrations);
  const [draftSelectedModel, setDraftSelectedModel] = useState(savedSelectedModel);
  const [draftBagMode, setDraftBagMode] = useState<BagMode>(savedBagMode);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Track unsaved changes by comparing draft to saved
  useEffect(() => {
    const changed =
      JSON.stringify(draftClubs) !== JSON.stringify(savedClubs) ||
      JSON.stringify(draftCalibrations) !== JSON.stringify(savedCalibrations) ||
      draftSelectedModel !== savedSelectedModel ||
      draftBagMode !== savedBagMode;
    setHasUnsavedChanges(changed);
  }, [draftClubs, draftCalibrations, draftSelectedModel, draftBagMode, savedClubs, savedCalibrations, savedSelectedModel, savedBagMode]);

  const handleSaveBag = useCallback(() => {
    setSavedClubs(draftClubs);
    setSavedCalibrations(draftCalibrations);
    setSavedSelectedModel(draftSelectedModel);
    setSavedBagMode(draftBagMode);
    toast.success("Bag saved!");
  }, [draftClubs, draftCalibrations, draftSelectedModel, draftBagMode, setSavedClubs, setSavedCalibrations, setSavedSelectedModel, setSavedBagMode]);

  const handleReset = () => {
    clearAllPersistedState();
    setSavedClubs([]);
    setSavedCalibrations([]);
    setSavedSelectedModel("");
    setSavedBagMode("catalog");
    setDraftClubs([]);
    setDraftCalibrations([]);
    setDraftSelectedModel("");
    setDraftBagMode("catalog");
    setActiveTab("calculator");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center shrink-0">
            <Flag className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-foreground tracking-tight">
              Club Yardage Calculator
            </h1>
          </div>
        </div>
      </header>

      {/* Screen content */}
      <main className="flex-1 pb-20">
        {activeTab === "calculator" ? (
          <Calculator clubs={savedClubs} calibrations={savedCalibrations} />
        ) : (
          <MyBag
            clubs={draftClubs}
            setClubs={setDraftClubs}
            calibrations={draftCalibrations}
            setCalibrations={setDraftCalibrations}
            selectedModel={draftSelectedModel}
            setSelectedModel={setDraftSelectedModel}
            bagMode={draftBagMode}
            setBagMode={setDraftBagMode}
            onReset={handleReset}
            onSave={handleSaveBag}
            hasUnsavedChanges={hasUnsavedChanges}
          />
        )}
      </main>

      {/* Bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="max-w-lg mx-auto flex">
          <button
            onClick={() => setActiveTab("calculator")}
            className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${
              activeTab === "calculator"
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            <Crosshair className="h-6 w-6" />
            <span className="text-xs font-semibold">Calculator</span>
          </button>
          <button
            onClick={() => setActiveTab("bag")}
            className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${
              activeTab === "bag"
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            <ShoppingBag className="h-6 w-6" />
            <span className="text-xs font-semibold">My Bag</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
