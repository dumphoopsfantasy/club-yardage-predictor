import { type Club, type CalibrationPoint } from "@/lib/yardage-model";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Crosshair } from "lucide-react";

interface Props {
  clubs: Club[];
  calibration: CalibrationPoint | null;
  onChange: (cal: CalibrationPoint) => void;
}

export function CalibrationInput({ clubs, calibration, onChange }: Props) {
  return (
    <div className="rounded-xl border border-golf-gold/30 bg-golf-cream p-5 space-y-4">
      <div className="flex items-center gap-2 text-foreground font-semibold">
        <Crosshair className="h-5 w-5 text-golf-gold" />
        <span>Calibrate Your Distances</span>
      </div>
      <p className="text-sm text-muted-foreground">
        Select a club you know your distance for, and enter the yardage. We'll predict the rest.
      </p>
      <div className="grid grid-cols-2 gap-3">
        <Select
          value={calibration?.clubId ?? ""}
          onValueChange={(id) =>
            onChange({ clubId: id, yardage: calibration?.yardage ?? 150 })
          }
        >
          <SelectTrigger className="bg-card border-border">
            <SelectValue placeholder="Select club" />
          </SelectTrigger>
          <SelectContent>
            {clubs.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name || `${c.loft}°`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="number"
          placeholder="Yardage"
          value={calibration?.yardage ?? ""}
          onChange={(e) =>
            onChange({
              clubId: calibration?.clubId ?? "",
              yardage: parseInt(e.target.value) || 0,
            })
          }
          className="bg-card border-border"
        />
      </div>
    </div>
  );
}
