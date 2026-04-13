import { useState, useMemo } from "react";
import { getBrands, getModelsForBrand, type ClubModel } from "@/lib/club-catalog";
import { type Club, createClubWithId } from "@/lib/yardage-model";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, ShoppingBag } from "lucide-react";

interface Props {
  bag: Club[];
  onBagChange: (clubs: Club[]) => void;
}

const categoryColors: Record<string, string> = {
  Players: "bg-primary text-primary-foreground",
  "Players Distance": "bg-golf-green-light text-primary-foreground",
  "Game Improvement": "bg-golf-gold text-foreground",
  "Super Game Improvement": "bg-golf-sand text-foreground",
  "Wedge Set": "bg-muted text-foreground",
  "Hybrid/Fairway": "bg-muted text-foreground",
};

export function BagManager({ bag, onBagChange }: Props) {
  const [brand, setBrand] = useState("");
  const [modelIdx, setModelIdx] = useState("");
  const [specIdx, setSpecIdx] = useState("");
  const [clubIdx, setClubIdx] = useState("");

  const brands = useMemo(() => getBrands(), []);
  const models = useMemo(() => (brand ? getModelsForBrand(brand) : []), [brand]);
  const selectedModel: ClubModel | undefined =
    modelIdx !== "" ? models[parseInt(modelIdx)] : undefined;
  const variants = useMemo(() => selectedModel?.variants ?? [], [selectedModel]);
  const selectedVariant =
    specIdx !== "" ? variants[parseInt(specIdx)] : variants.length === 1 ? variants[0] : undefined;
  const availableClubs = selectedVariant?.clubs ?? [];

  const handleBrandChange = (b: string) => {
    setBrand(b);
    setModelIdx("");
    setSpecIdx("");
    setClubIdx("");
  };

  const handleModelChange = (idx: string) => {
    setModelIdx(idx);
    setSpecIdx("");
    setClubIdx("");
    const model = models[parseInt(idx)];
    if (model && model.variants.length === 1) {
      setSpecIdx("0");
    }
  };

  const handleSpecChange = (idx: string) => {
    setSpecIdx(idx);
    setClubIdx("");
  };

  const addClubToBag = () => {
    if (!selectedModel || !selectedVariant || clubIdx === "") return;
    const clubData = availableClubs[parseInt(clubIdx)];
    if (!clubData) return;
    const sourceLabel = `${selectedModel.brand} ${selectedModel.model} (${selectedModel.year})`;
    const newClub = createClubWithId(clubData, sourceLabel);
    onBagChange([...bag, newClub]);
    setClubIdx("");
  };

  const addFullSet = () => {
    if (!selectedModel || !selectedVariant) return;
    const sourceLabel = `${selectedModel.brand} ${selectedModel.model} (${selectedModel.year})`;
    const newClubs = selectedVariant.clubs.map((c) =>
      createClubWithId(c, sourceLabel)
    );
    onBagChange([...bag, ...newClubs]);
  };

  const removeFromBag = (id: string) => {
    onBagChange(bag.filter((c) => c.id !== id));
  };

  const clearBag = () => {
    onBagChange([]);
  };

  // Group bag clubs by source
  const groupedBag = bag.reduce<Record<string, Club[]>>((acc, club) => {
    const key = club.source || "Custom";
    if (!acc[key]) acc[key] = [];
    acc[key].push(club);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {/* Add from catalog */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <p className="text-sm font-medium text-foreground flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add from Catalog
        </p>
        <div className="grid grid-cols-2 gap-2">
          <Select value={brand} onValueChange={handleBrandChange}>
            <SelectTrigger className="bg-card border-border h-11">
              <SelectValue placeholder="Brand..." />
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
            value={modelIdx}
            onValueChange={handleModelChange}
            disabled={!brand}
          >
            <SelectTrigger className="bg-card border-border h-11">
              <SelectValue placeholder="Model..." />
            </SelectTrigger>
            <SelectContent>
              {models.map((m, i) => (
                <SelectItem key={i} value={String(i)}>
                  <span className="flex items-center gap-2">
                    {m.model} ({m.year})
                    <Badge
                      variant="secondary"
                      className={`text-[10px] px-1.5 py-0 ${categoryColors[m.category] ?? ""}`}
                    >
                      {m.category}
                    </Badge>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {variants.length > 1 && (
          <Select value={specIdx} onValueChange={handleSpecChange}>
            <SelectTrigger className="bg-card border-border h-11 w-full">
              <SelectValue placeholder="Select spec..." />
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

        {selectedVariant && (
          <div className="flex gap-2">
            <Select value={clubIdx} onValueChange={setClubIdx}>
              <SelectTrigger className="bg-card border-border h-11 flex-1">
                <SelectValue placeholder="Pick a club..." />
              </SelectTrigger>
              <SelectContent>
                {availableClubs.map((c, i) => (
                  <SelectItem key={i} value={String(i)}>
                    {c.name} ({c.loft}°)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={addClubToBag}
              disabled={clubIdx === ""}
              className="h-11 shrink-0"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        )}

        {selectedVariant && (
          <Button
            variant="outline"
            onClick={addFullSet}
            className="w-full h-10 text-sm"
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Add Full Set ({selectedVariant.clubs.length} clubs)
          </Button>
        )}
      </div>

      {/* Current bag */}
      {bag.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              My Bag ({bag.length} clubs)
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearBag}
              className="text-xs text-muted-foreground hover:text-destructive h-8"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Clear All
            </Button>
          </div>

          {Object.entries(groupedBag).map(([source, clubs]) => (
            <div key={source} className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium px-1">
                {source}
              </p>
              <div className="rounded-lg border border-border bg-card divide-y divide-border">
                {clubs.map((club) => (
                  <div
                    key={club.id}
                    className="flex items-center justify-between px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {club.name || `${club.loft}°`}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {club.loft}°
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromBag(club.id)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
