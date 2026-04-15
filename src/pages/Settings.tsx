import { useState, useRef } from "react";
import { useApp } from "@/context/AppContext";
import { Sun, Moon, TreePine, Download, Upload, Trash2, AlertTriangle, HelpCircle, X } from "lucide-react";
import { toast } from "sonner";

export default function Settings() {
  const { state, updateSettings, exportData, importData, resetAll } = useApp();
  const { settings } = state;
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showHowTo, setShowHowTo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleThemeChange = (theme: "dump" | "dump-dark" | "dump-green") => {
    updateSettings({ theme });
    document.documentElement.classList.remove("dump", "dump-dark", "dump-green");
    document.documentElement.classList.add(theme);
  };

  const handleExport = () => {
    try {
      const data = exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `dump-golf-backup-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Data exported");
    } catch {
      toast.error("Export failed");
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      importData(data);
      document.documentElement.classList.remove("dump", "dump-dark", "dump-green");
      const theme = data.settings?.theme || "dump";
      document.documentElement.classList.add(theme);
      toast.success("Data imported successfully");
    } catch {
      toast.error("Import failed - invalid file format");
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleReset = () => {
    resetAll();
    document.documentElement.classList.remove("dump-dark", "dump-green");
    document.documentElement.classList.add("dump");
    setShowResetConfirm(false);
    toast.success("All data reset");
  };

  const themes = [
    { id: "dump" as const, label: "Dump", icon: Sun },
    { id: "dump-dark" as const, label: "Dark", icon: Moon },
    { id: "dump-green" as const, label: "Green", icon: TreePine },
  ];

  return (
    <div className="max-w-lg mx-auto px-4 pt-4">
      <h1 className="text-xl font-bold tracking-tight mb-6">Settings</h1>

      <div className="space-y-4">
        {/* Theme */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-sm font-semibold mb-3">Theme</div>
          <div className="flex gap-2">
            {themes.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => handleThemeChange(t.id)}
                  className={`flex-1 h-11 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1.5 ${
                    settings.theme === t.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Units */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-sm font-semibold mb-3">Distance Units</div>
          <div className="flex gap-2">
            <button
              onClick={() => updateSettings({ units: "yards" })}
              className={`flex-1 h-11 rounded-lg text-sm font-medium transition-colors ${
                settings.units === "yards"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              Yards
            </button>
            <button
              onClick={() => updateSettings({ units: "meters" })}
              className={`flex-1 h-11 rounded-lg text-sm font-medium transition-colors ${
                settings.units === "meters"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              Meters
            </button>
          </div>
        </div>

        {/* Temperature */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-sm font-semibold mb-3">Temperature</div>
          <div className="flex gap-2">
            <button
              onClick={() => updateSettings({ tempUnit: "fahrenheit" })}
              className={`flex-1 h-11 rounded-lg text-sm font-medium transition-colors ${
                settings.tempUnit === "fahrenheit"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              &deg;F
            </button>
            <button
              onClick={() => updateSettings({ tempUnit: "celsius" })}
              className={`flex-1 h-11 rounded-lg text-sm font-medium transition-colors ${
                settings.tempUnit === "celsius"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              &deg;C
            </button>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-sm font-semibold mb-3">Data Management</div>
          <div className="space-y-2">
            <button
              onClick={handleExport}
              className="w-full h-11 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export All Data
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-11 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Import Data
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </div>
        </div>

        {/* Reset */}
        <div className="bg-card border border-destructive/20 rounded-xl p-4">
          <div className="text-sm font-semibold mb-1 text-destructive">Danger Zone</div>
          <p className="text-xs text-muted-foreground mb-3">
            This will permanently delete all your clubs, calibrations, rounds, and settings.
          </p>
          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full h-11 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg text-sm font-medium hover:bg-destructive/20 transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Reset All Data
            </button>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-destructive">
                <AlertTriangle className="w-4 h-4" />
                Are you sure? This cannot be undone.
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 h-11 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 h-11 bg-destructive text-destructive-foreground rounded-lg text-sm font-bold hover:bg-destructive/90 transition-colors"
                >
                  Yes, Reset
                </button>
              </div>
            </div>
          )}
        </div>

        {/* How to Use */}
        <div className="bg-card border border-border rounded-xl p-4">
          <button
            onClick={() => setShowHowTo(true)}
            className="w-full h-11 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2"
          >
            <HelpCircle className="w-4 h-4" />
            How to Use This App
          </button>
        </div>

        <div className="text-center py-4 text-xs text-muted-foreground/50">
          Dump Golf v1.0.0
        </div>
      </div>

      {/* How to Use Overlay */}
      {showHowTo && (
        <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur overflow-y-auto">
          <div className="max-w-lg mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">How to Use Dump Golf</h2>
              <button
                onClick={() => setShowHowTo(false)}
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">1</span>
                  <h3 className="font-semibold text-sm">Set Up Your Bag</h3>
                </div>
                <p className="text-sm text-muted-foreground ml-9">
                  Go to My Bag and select your brand, model, and clubs. Use Full Set to load an entire iron set, or Mixed Bag to pick individual clubs from different brands.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">2</span>
                  <h3 className="font-semibold text-sm">Calibrate Your Distances</h3>
                </div>
                <p className="text-sm text-muted-foreground ml-9">
                  At the top of My Bag, enter how far you actually carry a few clubs (e.g., 7 iron = 155 yds). This calculates your Personal Distance Factor (PDF) and makes every club prediction accurate to your game. More calibration points = better accuracy.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">3</span>
                  <h3 className="font-semibold text-sm">Use the Calculator</h3>
                </div>
                <p className="text-sm text-muted-foreground ml-9">
                  On the course, open the Calculator. In Rangefinder mode, enter the two numbers from your rangefinder (slope distance and plays-like). In Manual mode, just type the yardage. The app tells you what club to hit.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">4</span>
                  <h3 className="font-semibold text-sm">Adjust for Conditions</h3>
                </div>
                <p className="text-sm text-muted-foreground ml-9">
                  Add wind speed and direction. Tap "More conditions" for lie (uphill, downhill, ball above/below feet), rough, tee shot, and ground conditions. Everything factors into the "Plays As" yardage and club recommendation.
                </p>
              </div>

              <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
                <h3 className="font-semibold text-sm text-primary mb-1">What is "Plays As"?</h3>
                <p className="text-sm text-muted-foreground">
                  It's the adjusted yardage after accounting for all conditions. If you're 150 yards out but it's into a 15mph wind, it might "play as" 165 — meaning you should hit whatever club you carry 165, not 150.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowHowTo(false)}
              className="w-full h-12 mt-8 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
