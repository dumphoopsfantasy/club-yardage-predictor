import { COMMON_CLUB_SETS, createClubWithId, type Club } from "@/lib/yardage-model";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  onSelect: (clubs: Club[]) => void;
}

export function ClubSetSelector({ onSelect }: Props) {
  return (
    <Select
      onValueChange={(val) => {
        const set = COMMON_CLUB_SETS[val];
        if (set) onSelect(set.map(createClubWithId));
      }}
    >
      <SelectTrigger className="bg-card border-border">
        <SelectValue placeholder="Choose a preset club set..." />
      </SelectTrigger>
      <SelectContent>
        {Object.keys(COMMON_CLUB_SETS).map((name) => (
          <SelectItem key={name} value={name}>
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
