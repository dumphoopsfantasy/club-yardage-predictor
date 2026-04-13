import { type EnvironmentalConditions, DEFAULT_CONDITIONS } from "@/lib/yardage-model";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Mountain, Thermometer, Wind, ArrowUpDown, RotateCcw } from "lucide-react";

interface Props {
  conditions: EnvironmentalConditions;
  onChange: (conditions: EnvironmentalConditions) => void;
}

export function EnvironmentalAdjustments({ conditions, onChange }: Props) {
  const update = (partial: Partial<EnvironmentalConditions>) => {
    onChange({ ...conditions, ...partial });
  };

  const isModified =
    conditions.altitude !== 0 ||
    conditions.temperature !== 70 ||
    conditions.windSpeed !== 0 ||
    conditions.windDirection !== "none" ||
    conditions.slope !== 0;

  return (
    <div className="space-y-5">
      {/* Altitude */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <Mountain className="h-4 w-4 text-golf-green-light" />
          Altitude
          <span className="text-muted-foreground font-normal ml-auto text-xs">
            {conditions.altitude.toLocaleString()} ft
          </span>
        </Label>
        <Slider
          value={[conditions.altitude]}
          onValueChange={([v]) => update({ altitude: v })}
          min={0}
          max={10000}
          step={100}
          className="py-2"
        />
        <p className="text-xs text-muted-foreground">
          +1 yard per 100ft elevation per 100 yards of distance
        </p>
      </div>

      {/* Temperature */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <Thermometer className="h-4 w-4 text-golf-gold" />
          Temperature
          <span className="text-muted-foreground font-normal ml-auto text-xs">
            {conditions.temperature}°F
          </span>
        </Label>
        <Slider
          value={[conditions.temperature]}
          onValueChange={([v]) => update({ temperature: v })}
          min={30}
          max={110}
          step={1}
          className="py-2"
        />
        <p className="text-xs text-muted-foreground">
          ±2 yards per 10°F from 70°F per 100 yards
        </p>
      </div>

      {/* Wind */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <Wind className="h-4 w-4 text-blue-500" />
          Wind
        </Label>
        <div className="grid grid-cols-2 gap-3">
          <Input
            type="number"
            value={conditions.windSpeed || ""}
            onChange={(e) =>
              update({ windSpeed: parseInt(e.target.value) || 0 })
            }
            placeholder="Speed (mph)"
            min={0}
            max={50}
            className="bg-card border-border h-11"
          />
          <Select
            value={conditions.windDirection}
            onValueChange={(v: EnvironmentalConditions["windDirection"]) =>
              update({ windDirection: v })
            }
          >
            <SelectTrigger className="bg-card border-border h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No wind</SelectItem>
              <SelectItem value="headwind">Headwind (into)</SelectItem>
              <SelectItem value="tailwind">Tailwind (with)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p className="text-xs text-muted-foreground">
          Headwind: +1 yd/mph; Tailwind: −0.5 yd/mph per 100 yards
        </p>
      </div>

      {/* Slope */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <ArrowUpDown className="h-4 w-4 text-orange-500" />
          Slope
          <span className="text-muted-foreground font-normal ml-auto text-xs">
            {conditions.slope > 0
              ? `+${conditions.slope}° uphill`
              : conditions.slope < 0
              ? `${conditions.slope}° downhill`
              : "Flat"}
          </span>
        </Label>
        <Slider
          value={[conditions.slope]}
          onValueChange={([v]) => update({ slope: v })}
          min={-15}
          max={15}
          step={1}
          className="py-2"
        />
        <p className="text-xs text-muted-foreground">
          ±1 yard per degree per 100 yards
        </p>
      </div>

      {isModified && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange({ ...DEFAULT_CONDITIONS })}
          className="text-muted-foreground text-xs gap-1.5 h-10"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset to defaults
        </Button>
      )}
    </div>
  );
}
