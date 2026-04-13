import { useState, useMemo } from "react";
import { getBrands, getModelsForBrand, type ClubModel } from "@/lib/club-catalog";
import { type Club, createClubWithId } from "@/lib/yardage-model";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, PenLine, BookOpen } from "lucide-react";

interface Props {
  onAddClubs: (clubs: Club[]) => void;
}

const categoryColors: Record<string, string> = {
  Players: "bg-primary text-primary-foreground",
  "Players Distance": "bg-golf-green-light text-primary-foreground",
  "Game Improvement": "bg-golf-gold text-foreground",
  "Super Game Improvement": "bg-golf-sand text-foreground",
  "Wedge Set": "bg-muted text-foreground",
  "Hybrid/Fairway": "bg-muted text-foreground",
};

export function AddClubSection({ onAddClubs }: Props) {
  const [mode, setMode] = useState<"catalog" | "manual">("catalog");

  return (
    <div className="space-y-3">
      {/* Mode toggle */}
      <div className="flex rounded-lg border border-border overflow-hidden">
        <button
          onClick={() => setMode("catalog")}
          className={`flex-1 py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-1.5 ${
            mode === "catalog"
              ? "bg-primary text-primary-foreground"
              : "bg-card text-muted-foreground hover:bg-muted"
          }`}
        >
          <BookOpen className="h-3.5 w-3.5" />
          From Catalog
        </button>
        <button
          onClick={() => setMode("manual")}
          className={`flex-1 py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-1.5 ${
            mode === "manual"
              ? "bg-primary text-primary-foreground"
              : "bg-card text-muted-foreground hover:bg-muted"
          }`}
        >
          <PenLine className="h-3.5 w-3.5" />
          Manual Entry
        </button>
      </div>

      {mode === "catalog" ? (
        <CatalogClubPicker onAddClubs={onAddClubs} />
      ) : (
        <ManualClubEntry onAddClub={(club) => onAddClubs([club])} />
      )}
    </div>
  );
}

/* ─── Catalog Club Picker ─── */

function CatalogClubPicker({ onAddClubs }: { onAddClubs: (clubs: Club[]) => void }) {
  const [brand, setBrand] = useState("");
  const [modelIdx, setModelIdx] = useState("");
  const [specIdx, setSpecIdx] = useState("");
  const [checkedIndices, setCheckedIndices] = useState<Set<number>>(new Set());

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
    setCheckedIndices(new Set());
  };

  const handleModelChange = (idx: string) => {
    setModelIdx(idx);
    setSpecIdx("");
    setCheckedIndices(new Set());
    const model = models[parseInt(idx)];
    if (model && model.variants.length === 1) {
      setSpecIdx("0");
    }
  };

  const handleSpecChange = (idx: string) => {
    setSpecIdx(idx);
    setCheckedIndices(new Set());
  };

  const toggleClub = (idx: number) => {
    setCheckedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  const handleAddSelected = () => {
    if (!selectedModel || !selectedVariant || checkedIndices.size === 0) return;
    const sourceLabel = `${selectedModel.brand} ${selectedModel.model} (${selectedModel.year})`;
    const newClubs = Array.from(checkedIndices)
      .sort((a, b) => a - b)
      .map((idx) => {
        const c = availableClubs[idx];
        return createClubWithId({ ...c, addedIndividually: true }, sourceLabel);
      });
    onAddClubs(newClubs);
    setCheckedIndices(new Set());
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
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

      {/* Club checklist */}
      {selectedVariant && availableClubs.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium">
            Pick clubs to add:
          </p>
          <div className="rounded-lg border border-border divide-y divide-border max-h-48 overflow-y-auto">
            {availableClubs.map((club, idx) => (
              <label
                key={idx}
                className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={checkedIndices.has(idx)}
                  onChange={() => toggleClub(idx)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary accent-primary"
                />
                <span className="text-sm font-medium text-foreground flex-1">
                  {club.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {club.loft}°
                </span>
              </label>
            ))}
          </div>
          <Button
            onClick={handleAddSelected}
            disabled={checkedIndices.size === 0}
            className="w-full h-10"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Add {checkedIndices.size > 0 ? `${checkedIndices.size} Club${checkedIndices.size > 1 ? "s" : ""}` : "Selected"}
          </Button>
        </div>
      )}
    </div>
  );
}

/* ─── Manual Club Entry ─── */

function ManualClubEntry({ onAddClub }: { onAddClub: (club: Club) => void }) {
  const [name, setName] = useState("");
  const [loft, setLoft] = useState("");

  const handleAdd = () => {
    const loftNum = parseFloat(loft);
    if (!name.trim() || isNaN(loftNum) || loftNum <= 0) return;
    const club = createClubWithId(
      { name: name.trim(), loft: loftNum, addedIndividually: true },
      "Manual"
    );
    onAddClub(club);
    setName("");
    setLoft("");
  };

  const isValid = name.trim().length > 0 && !isNaN(parseFloat(loft)) && parseFloat(loft) > 0;

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <p className="text-xs text-muted-foreground font-medium">
        Enter a club that's not in the catalog:
      </p>
      <div className="grid grid-cols-2 gap-2">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Club name (e.g. 56° Wedge)"
          className="h-11"
        />
        <Input
          type="number"
          inputMode="decimal"
          value={loft}
          onChange={(e) => setLoft(e.target.value)}
          placeholder="Loft (°)"
          className="h-11"
        />
      </div>
      <Button
        onClick={handleAdd}
        disabled={!isValid}
        className="w-full h-10"
      >
        <Plus className="h-4 w-4 mr-1.5" />
        Add Club
      </Button>
    </div>
  );
}
