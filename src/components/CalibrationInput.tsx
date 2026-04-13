import { type Club, type CalibrationPoint, calculatePDF } from "@/lib/yardage-model";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Crosshair, Plus, Trash2 } from "lucide-react";

interface Props {
  clubs: Club[];
  calibrations: CalibrationPoint[];
  onChange: (cals: CalibrationPoint[]) => void;
}

export function CalibrationInput({ clubs, calibrations, onChange }: Props) {
  const pdf = calculatePDF(clubs, calibrations);
  const maxPoints = 3;

  const addPoint = () => {
    if (calibrations.length >= maxPoints) return;
    onChange([...calibrations, { clubId: "", yardage: 0 }]);
  };

  const removePoint = (idx: number) => {
    onChange(calibrations.filter((_, i) => i !== idx));
  };

  const updatePoint = (idx: number, partial: Partial<CalibrationPoint>) => {
    onChange(
      calibrations.map((cal, i) => (i === idx ? { ...cal, ...partial } : cal))
    );
  };

  // Auto-create first empty point if none
  if (calibrations.length === 0) {
    return (
      <div className="rounded-xl border border-golf-gold/30 bg-golf-cream p-5 space-y-4">
        <div className="flex items-center gap-2 text-foreground font-semibold">
          <Crosshair className="h-5 w-5 text-golf-gold" />
          <span>Calibrate Your Distances</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Select a club you know your distance for, and enter the yardage. Add up to 3 clubs for better accuracy.
        </p>
        <Button
          variant="outline"
          onClick={() => onChange([{ clubId: "", yardage: 0 }])}
          className="w-full border-dashed border-golf-gold/30 text-muted-foreground h-11"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Calibration Point
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-golf-gold/30 bg-golf-cream p-5 space-y-4">
      <div className="flex items-center gap-2 text-foreground font-semibold">
        <Crosshair className="h-5 w-5 text-golf-gold" />
        <span>Calibrate Your Distances</span>
      </div>
      <p className="text-sm text-muted-foreground">
        Enter known distances for up to {maxPoints} clubs. More calibration points = more accurate predictions.
      </p>

      <div className="space-y-3">
        {calibrations.map((cal, idx) => {
          const calClub = clubs.find((c) => c.id === cal.clubId);
          const pointPDF =
            calClub && cal.yardage > 0
              ? (cal.yardage / (90 - calClub.loft)).toFixed(2)
              : null;

          return (
            <div key={idx} className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                Point {idx + 1}
                {pointPDF && (
                  <span className="ml-auto opacity-70">PDF: {pointPDF}</span>
                )}
              </div>
              <div className="grid grid-cols-[1fr_100px_40px] gap-2">
                <Select
                  value={cal.clubId}
                  onValueChange={(id) => updatePoint(idx, { clubId: id })}
                >
                  <SelectTrigger className="bg-card border-border h-11">
                    <SelectValue placeholder="Select club" />
                  </SelectTrigger>
                  <SelectContent>
                    {clubs.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name || `${c.loft}°`} ({c.loft}°)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  placeholder="Yards"
                  value={cal.yardage || ""}
                  onChange={(e) =>
                    updatePoint(idx, {
                      yardage: parseInt(e.target.value) || 0,
                    })
                  }
                  className="bg-card border-border h-11"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removePoint(idx)}
                  className="h-11 w-11 text-muted-foreground hover:text-destructive shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {calibrations.length < maxPoints && (
        <Button
          variant="outline"
          size="sm"
          onClick={addPoint}
          className="w-full border-dashed border-golf-gold/30 text-muted-foreground h-10"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Calibration Point ({calibrations.length}/{maxPoints})
        </Button>
      )}

      {pdf !== null && (
        <div className="text-xs text-muted-foreground bg-card rounded-lg px-3 py-2 border border-border">
          {calibrations.length > 1 ? "Averaged " : ""}Personal Distance Factor:{" "}
          <span className="font-semibold text-foreground">{pdf.toFixed(2)}</span>
          {calibrations.length > 1 && (
            <span className="ml-1 opacity-70">
              (from {calibrations.filter((c) => c.clubId && c.yardage > 0).length} calibration points)
            </span>
          )}
        </div>
      )}
    </div>
  );
}
