import { type Club, createClubWithId } from "@/lib/yardage-model";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  clubs: Club[];
  onChange: (clubs: Club[]) => void;
}

export function ClubEditor({ clubs, onChange }: Props) {
  const addClub = () => {
    onChange([...clubs, createClubWithId({ name: "", loft: 30 })]);
  };

  const removeClub = (id: string) => {
    onChange(clubs.filter((c) => c.id !== id));
  };

  const updateClub = (id: string, field: "name" | "loft", value: string) => {
    onChange(
      clubs.map((c) =>
        c.id === id
          ? { ...c, [field]: field === "loft" ? parseFloat(value) || 0 : value }
          : c
      )
    );
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-[1fr_80px_44px] gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
        <span>Club</span>
        <span>Loft (°)</span>
        <span></span>
      </div>
      {clubs.map((club) => (
        <div key={club.id} className="grid grid-cols-[1fr_80px_44px] gap-2 items-center">
          <Input
            value={club.name}
            onChange={(e) => updateClub(club.id, "name", e.target.value)}
            placeholder="Club name"
            className="bg-card border-border h-11"
          />
          <Input
            type="number"
            value={club.loft || ""}
            onChange={(e) => updateClub(club.id, "loft", e.target.value)}
            placeholder="Loft"
            className="bg-card border-border h-11"
            step={0.5}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeClub(club.id)}
            className="h-11 w-11 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        onClick={addClub}
        className="w-full border-dashed border-border text-muted-foreground"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Club
      </Button>
    </div>
  );
}
