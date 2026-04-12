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
  "Wedge Set": "bg-muted text-foreground",
  "Hybrid/Fairway": "bg-muted text-foreground",
};

export function CatalogSelector({ onSelect }: Props) {
  const [brand, setBrand] = useState<string>("");
  const [modelIdx, setModelIdx] = useState<string>("");
  const [specIdx, setSpecIdx] = useState<string>("");

  const brands = useMemo(() => getBrands(), []);
  const models = useMemo(() => (brand ? getModelsForBrand(brand) : []), [brand]);
  const selectedModel: ClubModel | undefined = modelIdx !== "" ? models[parseInt(modelIdx)] : undefined;
  const variants = useMemo(() => selectedModel?.variants ?? [], [selectedModel]);
  const hasMultipleSpecs = variants.length > 1;

  const handleBrandChange = (b: string) => {
    setBrand(b);
    setModelIdx("");
    setSpecIdx("");
  };

  const handleModelChange = (idx: string) => {
    setModelIdx(idx);
    setSpecIdx("");
    const model = models[parseInt(idx)];
    // If only one spec, auto-select it
    if (model && model.variants.length === 1) {
      const clubs = model.variants[0].clubs.map((c) => createClubWithId(c));
      onSelect(clubs, `${model.brand} ${model.model} (${model.year})`);
      setSpecIdx("0");
    }
  };

  const handleSpecChange = (idx: string) => {
    setSpecIdx(idx);
    if (!selectedModel) return;
    const variant = selectedModel.variants[parseInt(idx)];
    if (variant) {
      const clubs = variant.clubs.map((c) => createClubWithId(c));
      onSelect(
        clubs,
        `${selectedModel.brand} ${selectedModel.model} – ${variant.spec} (${selectedModel.year})`
      );
    }
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {/* Brand */}
        <Select value={brand} onValueChange={handleBrandChange}>
          <SelectTrigger className="bg-card border-border">
            <SelectValue placeholder="Select brand..." />
          </SelectTrigger>
          <SelectContent>
            {brands.map((b) => (
              <SelectItem key={b} value={b}>{b}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Model */}
        <Select value={modelIdx} onValueChange={handleModelChange} disabled={!brand}>
          <SelectTrigger className="bg-card border-border">
            <SelectValue placeholder={brand ? "Select model..." : "Pick a brand first"} />
          </SelectTrigger>
          <SelectContent>
            {models.map((m, i) => (
              <SelectItem key={i} value={String(i)}>
                <span className="flex items-center gap-2">
                  {m.model} ({m.year})
                  <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 ${categoryColors[m.category] ?? ""}` }>
                    {m.category}
                  </Badge>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Spec / Variant — only shown if model has multiple specs */}
      {hasMultipleSpecs && (
        <Select value={specIdx} onValueChange={handleSpecChange} disabled={!selectedModel}>
          <SelectTrigger className="bg-card border-border w-full">
            <SelectValue placeholder="Select spec / loft option..." />
          </SelectTrigger>
          <SelectContent>
            {variants.map((v, i) => (
              <SelectItem key={i} value={String(i)}>
                {v.spec}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
