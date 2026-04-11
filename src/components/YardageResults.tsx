import { type Club } from "@/lib/yardage-model";

interface Props {
  clubs: Club[];
  calibratedClubId?: string;
}

export function YardageResults({ clubs, calibratedClubId }: Props) {
  const maxYardage = Math.max(...clubs.map((c) => c.predictedYardage ?? 0));

  return (
    <div className="space-y-3">
      {clubs.map((club) => {
        const pct = maxYardage > 0 ? ((club.predictedYardage ?? 0) / maxYardage) * 100 : 0;
        const isCalibrated = club.id === calibratedClubId;

        return (
          <div key={club.id} className="space-y-1">
            <div className="flex justify-between items-baseline">
              <span className="text-sm font-medium text-foreground">
                {club.name || `${club.loft}°`}
                {isCalibrated && (
                  <span className="ml-2 text-xs text-golf-gold font-normal">⚑ calibrated</span>
                )}
              </span>
              <span className="text-lg font-bold text-foreground tabular-nums">
                {club.predictedYardage ?? "—"}
                <span className="text-xs font-normal text-muted-foreground ml-1">yds</span>
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${pct}%`,
                  background: isCalibrated
                    ? "hsl(var(--golf-gold))"
                    : "hsl(var(--golf-green))",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
