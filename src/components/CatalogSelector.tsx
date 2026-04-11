import { useState, useMemo } from "react";
import { getBrands, getModelsForBrand, type ClubModel } from "@/lib/club-catalog";
import { type Club, createClubWithId } from "@/lib/yardage-model";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface Props {
  onSelect: (clubs: Club[], modelLabel: string) => void;
}

const categoryColors: Record<string, string> = {
  Players: "bg-primary text-primary-foreground",
  "Players Distance": "bg-golf-green-light text-primary-foreground",
  "Game Improvement": "bg-golf-gold text-foreground",
  "Super Game Improvement": "bg-golf-sand text-foreground",
};

export function CatalogSelector({ onSelect }: Props) {
  const [brand, setBrand] = useState<string>("");
  const [modelId, setModelId] = useState<string>("");
  const brands = useMemo(() => getBrands(), []);
  const models = useMemo(() => (brand ? getModelsForBrand(brand) : []), [brand]);

  const handleModelSelect = (idx: string) => {
    setModelId(idx);
    const model = models[parseInt(idx)];
    if (model) {
      const clubs = model.clubs.map((c) => createClubWithId(c));
      onSelect(clubs, `${model.brand} ${model.model} (${model.year})`);
    }
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Select
          value={brand}
          onValueChange={(b) => {
            setBrand(b);
            setModelId("");
          }}
        >
          <SelectTrigger className="bg-card border-border">
            <SelectValue placeholder="Select brand..." />
          </SelectTrigger>
          <SelectContent>
            {brands.map((b) => (
              <SelectItem key={b} value={b}>
                {b}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={modelId}
          onValueChange={handleModelSelect}
          disabled={!brand}
        >
          <SelectTrigger className="bg-card border-border">
            <SelectValue placeholder={brand ? "Select model..." : "Pick a brand first"} />
          </SelectTrigger>
          <SelectContent>
            {models.map((m, i) => (
              <SelectItem key={i} value={String(i)}>
                <span className="flex items-center gap-2">
                  {m.model} ({m.year})
                  <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 ${categoryColors[m.category] ?? ""}`}>
                    {m.category}
                  </Badge>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
