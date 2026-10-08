import { useState } from "react";
import { Check, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export default function ClubPicker({ label, value, options, onChange }: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const filtered = options.filter(option => option.toLowerCase().includes(query.toLowerCase()));
  return (
    <>
      <Button variant="unstyled" size="bare" className="picker-trigger" onClick={() => { setQuery(""); setOpen(true); }} aria-label={`Choose ${label.toLowerCase()}`}>
        <span className="min-w-0 text-left"><span className="block text-xs text-muted-foreground mb-1">{label}</span><span className="block whitespace-normal text-lg font-medium">{value || `Choose ${label.toLowerCase()}`}</span></span>
        <ChevronRight className="shrink-0 text-primary" />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="picker-dialog" aria-describedby={undefined}>
          <DialogTitle className="text-2xl pr-10">{label}</DialogTitle>
          <label className="picker-search"><Search className="h-4 w-4 text-muted-foreground" /><input aria-label={`Search ${label.toLowerCase()}`} value={query} onChange={e => setQuery(e.target.value)} className="w-full min-w-0 bg-transparent text-base outline-none" autoComplete="off" /></label>
          <div className="picker-options">
            {filtered.map(option => <Button variant="unstyled" size="bare" className="picker-option" key={option} onClick={() => { onChange(option); setOpen(false); }}><span className="whitespace-normal text-left">{option}</span>{value === option && <Check className="text-primary" />}</Button>)}
            {filtered.length === 0 && <p className="py-8 text-sm text-muted-foreground">No matching models</p>}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}