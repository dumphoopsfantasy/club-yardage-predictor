import { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Setting } from "@shared/schema";
import {
  Sun,
  Moon,
  Download,
  Upload,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { toast } = useToast();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: settings = [] } = useQuery<Setting[]>({
    queryKey: ["/api/settings"],
  });

  const getSetting = (key: string, defaultValue: string) => {
    const s = settings.find((s) => s.key === key);
    return s?.value ?? defaultValue;
  };

  const theme = getSetting("theme", "dark");
  const units = getSetting("units", "yards");
  const tempUnit = getSetting("tempUnit", "fahrenheit");

  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      await apiRequest("PUT", `/api/settings/${key}`, { value });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
    },
  });

  const handleThemeToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    updateSettingMutation.mutate({ key: "theme", value: newTheme });

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleExport = async () => {
    try {
      const res = await apiRequest("GET", "/api/export");
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `dump-golf-backup-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: "Data exported" });
    } catch {
      toast({ title: "Export failed", variant: "destructive" });
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      await apiRequest("POST", "/api/import", data);
      queryClient.invalidateQueries();
      toast({ title: "Data imported successfully" });
    } catch {
      toast({ title: "Import failed", variant: "destructive" });
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleReset = async () => {
    try {
      await apiRequest("POST", "/api/reset");
      queryClient.invalidateQueries();
      setShowResetConfirm(false);
      toast({ title: "All data reset" });
    } catch {
      toast({ title: "Reset failed", variant: "destructive" });
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 pt-4">
      <h1 className="text-xl font-bold tracking-tight mb-6">Settings</h1>

      <div className="space-y-4">
        {/* Theme */}
        <div className="bg-card border border-border rounded-xl p-4" data-testid="theme-setting">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">Theme</div>
              <div className="text-xs text-muted-foreground">
                {theme === "dark" ? "Dark mode" : "Light mode"}
              </div>
            </div>
            <button
              onClick={handleThemeToggle}
              className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
              data-testid="theme-toggle"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Units */}
        <div className="bg-card border border-border rounded-xl p-4" data-testid="units-setting">
          <div className="text-sm font-semibold mb-3">Distance Units</div>
          <div className="flex gap-2">
            <button
              onClick={() =>
                updateSettingMutation.mutate({
                  key: "units",
                  value: "yards",
                })
              }
              className={`flex-1 h-10 rounded-lg text-sm font-medium transition-colors ${
                units === "yards"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
              data-testid="units-yards"
            >
              Yards
            </button>
            <button
              onClick={() =>
                updateSettingMutation.mutate({
                  key: "units",
                  value: "meters",
                })
              }
              className={`flex-1 h-10 rounded-lg text-sm font-medium transition-colors ${
                units === "meters"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
              data-testid="units-meters"
            >
              Meters
            </button>
          </div>
        </div>

        {/* Temperature */}
        <div className="bg-card border border-border rounded-xl p-4" data-testid="temp-setting">
          <div className="text-sm font-semibold mb-3">Temperature</div>
          <div className="flex gap-2">
            <button
              onClick={() =>
                updateSettingMutation.mutate({
                  key: "tempUnit",
                  value: "fahrenheit",
                })
              }
              className={`flex-1 h-10 rounded-lg text-sm font-medium transition-colors ${
                tempUnit === "fahrenheit"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
              data-testid="temp-fahrenheit"
            >
              °F
            </button>
            <button
              onClick={() =>
                updateSettingMutation.mutate({
                  key: "tempUnit",
                  value: "celsius",
                })
              }
              className={`flex-1 h-10 rounded-lg text-sm font-medium transition-colors ${
                tempUnit === "celsius"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
              data-testid="temp-celsius"
            >
              °C
            </button>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-card border border-border rounded-xl p-4" data-testid="data-management">
          <div className="text-sm font-semibold mb-3">Data Management</div>
          <div className="space-y-2">
            <button
              onClick={handleExport}
              className="w-full h-11 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2"
              data-testid="export-btn"
            >
              <Download className="w-4 h-4" />
              Export All Data
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-11 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2"
              data-testid="import-btn"
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
        <div className="bg-card border border-destructive/20 rounded-xl p-4" data-testid="reset-section">
          <div className="text-sm font-semibold mb-1 text-destructive">
            Danger Zone
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            This will permanently delete all your clubs, calibrations, rounds,
            and settings.
          </p>
          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full h-11 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg text-sm font-medium hover:bg-destructive/20 transition-colors flex items-center justify-center gap-2"
              data-testid="reset-btn"
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
                  className="flex-1 h-10 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 h-10 bg-destructive text-destructive-foreground rounded-lg text-sm font-bold hover:bg-destructive/90 transition-colors"
                  data-testid="confirm-reset-btn"
                >
                  Yes, Reset
                </button>
              </div>
            </div>
          )}
        </div>

        {/* App Info */}
        <div className="text-center py-4 text-xs text-muted-foreground/50">
          Dump Golf v1.0.0
        </div>
      </div>
    </div>
  );
}
