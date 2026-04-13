import { type Club } from "@/lib/yardage-model";

interface Props {
  clubs: Club[];
  calibratedClubIds?: string[];
  showAdjusted?: boolean;
}

export function YardageResults({ clubs, calibratedClubIds = [], showAdjusted }: Props) {
  const hasAdjusted = showAdjusted && clubs.some((c) => c.adjustedYardage != null);
  const maxYardage = Math.max(
    ...clubs.map((c) => {
      const val = hasAdjusted ? (c.adjustedYardage ?? c.predictedYardage ?? 0) : (c.predictedYardage ?? 0);
      return val;
    })
  );

  return (
    <div className="space-y-3">
      {hasAdjusted && (
        <div className="flex items-center gap-4 text-xs text-muted-foreground pb-1 border-b border-border mb-2">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-golf-green inline-block" style={{ background: "hsl(var(--golf-green))" }} />
            Stock
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full inline-block" style={{ background: "hsl(var(--golf-gold))" }} />
            Adjusted
          </span>
        </div>
      )}
      {clubs.map((club) => {
        const stock = club.predictedYardage ?? 0;
        const adjusted = club.adjustedYardage;
        const display = hasAdjusted && adjusted != null ? adjusted : stock;
        const pct = maxYardage > 0 ? (display / maxYardage) * 100 : 0;
        const isCalibrated = calibratedClubIds.includes(club.id);

        return (
          <div key={club.id} className="space-y-1">
            <div className="flex justify-between items-baseline gap-2">
              <span className="text-sm font-medium text-foreground truncate">
                {club.name || `${club.loft}°`}
                {club.source && (
                  <span className="ml-1.5 text-[10px] text-muted-foreground font-normal">
                    {club.source}
                  </span>
                )}
                {isCalibrated && (
                  <span className="ml-2 text-xs text-golf-gold font-normal">
                    ⚑
                  </span>
                )}
              </span>
              <span className="text-base font-bold text-foreground tabular-nums whitespace-nowrap">
                {hasAdjusted && adjusted != null ? (
                  <>
                    <span className="text-xs font-normal text-muted-foreground line-through mr-1.5">
                      {stock}
                    </span>
                    {adjusted}
                  </>
                ) : (
                  stock || "—"
                )}
                <span className="text-xs font-normal text-muted-foreground ml-1">
                  yds
                </span>
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${pct}%`,
                  background:
                    hasAdjusted && adjusted != null
                      ? "hsl(var(--golf-gold))"
                      : isCalibrated
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
