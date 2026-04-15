import { useState, useRef } from "react";
import { useApp } from "@/context/AppContext";
import { Sun, Moon, TreePine, Download, Upload, Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export default function Settings() {
  const { state, updateSettings, exportData, importData, resetAll } = useApp();
  const { settings } = state;
  const [showResetConfirm, setShowResetConfirm] = useState(false);
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

        <div className="text-center py-4 text-xs text-muted-foreground/50">
          Dump Golf v1.0.0
        </div>
      </div>
    </div>
  );
}
