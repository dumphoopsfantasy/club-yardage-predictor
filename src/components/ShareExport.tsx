import { useRef, useState } from "react";
import { type Club, type EnvironmentalConditions, type CalibrationPoint, calculatePDF } from "@/lib/yardage-model";
import { Button } from "@/components/ui/button";
import { Download, Copy, Check } from "lucide-react";

interface Props {
  clubs: Club[];
  calibrations: CalibrationPoint[];
  conditions?: EnvironmentalConditions;
  showAdjusted?: boolean;
}

export function ShareExport({ clubs, calibrations, conditions, showAdjusted }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const pdf = calculatePDF(clubs, calibrations);
  const hasAdjusted = showAdjusted && clubs.some((c) => c.adjustedYardage != null);
  const today = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const generateText = () => {
    let text = `Club Yardage Card — ${today}\n`;
    text += `PDF: ${pdf?.toFixed(2) ?? "N/A"}\n`;
    text += "─".repeat(32) + "\n";
    clubs.forEach((c) => {
      const name = (c.name || `${c.loft}°`).padEnd(14);
      const stock = String(c.predictedYardage ?? "—").padStart(4);
      if (hasAdjusted && c.adjustedYardage != null) {
        const adj = String(c.adjustedYardage).padStart(4);
        text += `${name} ${stock} → ${adj} yds\n`;
      } else {
        text += `${name} ${stock} yds\n`;
      }
    });

    if (hasAdjusted && conditions) {
      text += "─".repeat(32) + "\n";
      text += "Conditions: ";
      const parts: string[] = [];
      if (conditions.altitude > 0) parts.push(`${conditions.altitude}ft alt`);
      if (conditions.temperature !== 70) parts.push(`${conditions.temperature}°F`);
      if (conditions.windSpeed > 0 && conditions.windDirection !== "none")
        parts.push(`${conditions.windSpeed}mph ${conditions.windDirection}`);
      if (conditions.slope !== 0)
        parts.push(`${conditions.slope > 0 ? "+" : ""}${conditions.slope}° slope`);
      text += parts.join(", ") + "\n";
    }
    return text;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const textarea = document.createElement("textarea");
      textarea.value = generateText();
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
      });
      const link = document.createElement("a");
      link.download = `yardage-card-${new Date().toISOString().split("T")[0]}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      // If html2canvas fails, fall back to text download
      const blob = new Blob([generateText()], { type: "text/plain" });
      const link = document.createElement("a");
      link.download = `yardage-card-${new Date().toISOString().split("T")[0]}.txt`;
      link.href = URL.createObjectURL(blob);
      link.click();
    }
    setDownloading(false);
  };

  return (
    <div className="space-y-4">
      {/* Visual card for screenshot */}
      <div
        ref={cardRef}
        className="rounded-xl border-2 border-primary/20 bg-white p-5 space-y-3"
        style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
      >
        <div className="flex items-center justify-between border-b border-gray-200 pb-3">
          <div>
            <h3
              className="font-bold text-base"
              style={{ color: "hsl(152, 45%, 28%)" }}
            >
              Yardage Card
            </h3>
            <p className="text-xs text-gray-500">{today}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">PDF</p>
            <p
              className="text-lg font-bold tabular-nums"
              style={{ color: "hsl(152, 45%, 28%)" }}
            >
              {pdf?.toFixed(2) ?? "—"}
            </p>
          </div>
        </div>

        <div className="space-y-1.5">
          {hasAdjusted && (
            <div className="grid grid-cols-[1fr_60px_60px] gap-2 text-[10px] uppercase tracking-wider text-gray-400 font-semibold px-1">
              <span>Club</span>
              <span className="text-right">Stock</span>
              <span className="text-right">Adj.</span>
            </div>
          )}
          {clubs.map((club, i) => (
            <div
              key={club.id}
              className="grid gap-2 items-center py-1.5 px-2 rounded-md"
              style={{
                gridTemplateColumns: hasAdjusted
                  ? "1fr 60px 60px"
                  : "1fr 80px",
                background: i % 2 === 0 ? "#f9fafb" : "transparent",
              }}
            >
              <span className="text-sm font-medium text-gray-800 truncate">
                {club.name || `${club.loft}°`}
              </span>
              {hasAdjusted ? (
                <>
                  <span className="text-sm text-gray-400 text-right tabular-nums">
                    {club.predictedYardage ?? "—"}
                  </span>
                  <span
                    className="text-sm font-bold text-right tabular-nums"
                    style={{ color: "hsl(43, 80%, 40%)" }}
                  >
                    {club.adjustedYardage ?? "—"}
                  </span>
                </>
              ) : (
                <span
                  className="text-sm font-bold text-right tabular-nums"
                  style={{ color: "hsl(152, 45%, 28%)" }}
                >
                  {club.predictedYardage ?? "—"}
                  <span className="text-[10px] font-normal text-gray-400 ml-0.5">
                    yds
                  </span>
                </span>
              )}
            </div>
          ))}
        </div>

        {hasAdjusted && conditions && (
          <div className="border-t border-gray-200 pt-2 text-[10px] text-gray-400 space-y-0.5">
            <p className="font-semibold uppercase tracking-wider">Conditions</p>
            <div className="flex flex-wrap gap-x-3 gap-y-0.5">
              {conditions.altitude > 0 && (
                <span>{conditions.altitude.toLocaleString()}ft altitude</span>
              )}
              {conditions.temperature !== 70 && (
                <span>{conditions.temperature}°F</span>
              )}
              {conditions.windSpeed > 0 && conditions.windDirection !== "none" && (
                <span>
                  {conditions.windSpeed}mph {conditions.windDirection}
                </span>
              )}
              {conditions.slope !== 0 && (
                <span>
                  {conditions.slope > 0 ? "+" : ""}
                  {conditions.slope}° slope
                </span>
              )}
            </div>
          </div>
        )}

        <p className="text-[9px] text-gray-300 text-center pt-1">
          Generated by Club Yardage Predictor
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={handleCopy}
          className="flex-1 h-11 gap-2"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          {copied ? "Copied!" : "Copy Text"}
        </Button>
        <Button
          onClick={handleDownload}
          disabled={downloading}
          className="flex-1 h-11 gap-2"
        >
          <Download className="h-4 w-4" />
          {downloading ? "Generating..." : "Download Image"}
        </Button>
      </div>
    </div>
  );
}
