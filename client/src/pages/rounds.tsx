import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Round, Shot, Club } from "@shared/schema";
import {
  Plus,
  Trash2,
  ChevronRight,
  ArrowLeft,
  Flag,
  Target,
  X,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type View = "list" | "new" | "detail" | "shot";

export default function Rounds() {
  const { toast } = useToast();
  const [view, setView] = useState<View>("list");
  const [activeRoundId, setActiveRoundId] = useState<number | null>(null);
  const [newCourseName, setNewCourseName] = useState("");
  const [newDate, setNewDate] = useState(new Date().toISOString().split("T")[0]);
  const [newTees, setNewTees] = useState("");

  // Shot form
  const [shotHole, setShotHole] = useState("1");
  const [shotClubId, setShotClubId] = useState<string>("");
  const [shotDistance, setShotDistance] = useState("");
  const [shotResult, setShotResult] = useState("");
  const [shotPutts, setShotPutts] = useState("");

  const { data: rounds = [] } = useQuery<Round[]>({
    queryKey: ["/api/rounds"],
  });

  const { data: clubs = [] } = useQuery<Club[]>({
    queryKey: ["/api/clubs"],
  });

  const { data: activeShots = [] } = useQuery<Shot[]>({
    queryKey: ["/api/rounds", activeRoundId, "shots"],
    enabled: !!activeRoundId,
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/rounds/${activeRoundId}/shots`);
      return res.json();
    },
  });

  const activeRound = rounds.find((r) => r.id === activeRoundId);

  const createRoundMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/rounds", {
        courseName: newCourseName,
        date: newDate,
        tees: newTees || null,
        notes: null,
        createdAt: new Date().toISOString(),
      });
      return res.json();
    },
    onSuccess: (round: Round) => {
      queryClient.invalidateQueries({ queryKey: ["/api/rounds"] });
      setActiveRoundId(round.id);
      setView("detail");
      setNewCourseName("");
      setNewTees("");
      toast({ title: "Round started" });
    },
  });

  const deleteRoundMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/rounds/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rounds"] });
      setView("list");
      setActiveRoundId(null);
      toast({ title: "Round deleted" });
    },
  });

  const addShotMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/shots", {
        roundId: activeRoundId,
        holeNumber: parseInt(shotHole),
        clubId: shotClubId ? parseInt(shotClubId) : null,
        distanceToPin: shotDistance ? parseFloat(shotDistance) : null,
        playsAsDistance: null,
        result: shotResult || null,
        putts: shotPutts ? parseInt(shotPutts) : null,
        notes: null,
        createdAt: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/rounds", activeRoundId, "shots"],
      });
      setShotClubId("");
      setShotDistance("");
      setShotResult("");
      setShotPutts("");
      setShotHole(String(Math.min(18, parseInt(shotHole) + 1)));
      setView("detail");
      toast({ title: "Shot logged" });
    },
  });

  const deleteShotMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/shots/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/rounds", activeRoundId, "shots"],
      });
    },
  });

  // Stats calculation
  const roundStats = (shots: Shot[]) => {
    const totalShots = shots.length;
    const totalPutts = shots.reduce((s, sh) => s + (sh.putts || 0), 0);
    const fairways = shots.filter((s) => s.result === "fairway").length;
    const greens = shots.filter((s) => s.result === "green").length;
    const holesPlayed = new Set(shots.map((s) => s.holeNumber)).size;
    return { totalShots, totalPutts, fairways, greens, holesPlayed };
  };

  const resultOptions = [
    { value: "fairway", label: "Fairway" },
    { value: "green", label: "Green" },
    { value: "rough", label: "Rough" },
    { value: "bunker", label: "Bunker" },
    { value: "hazard", label: "Hazard" },
    { value: "ob", label: "OB" },
  ];

  // List view
  if (view === "list") {
    return (
      <div className="max-w-lg mx-auto px-4 pt-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold tracking-tight">Rounds</h1>
          <button
            onClick={() => setView("new")}
            className="h-9 px-3 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-1.5"
            data-testid="start-round"
          >
            <Plus className="w-4 h-4" />
            New Round
          </button>
        </div>

        {rounds.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground" data-testid="no-rounds">
            <div className="text-4xl mb-3 opacity-30">🏌️</div>
            <p className="text-sm">No rounds yet</p>
            <p className="text-xs mt-1 text-muted-foreground/60">
              Start a round to begin tracking your shots
            </p>
          </div>
        ) : (
          <div className="space-y-2" data-testid="rounds-list">
            {rounds.map((round) => (
              <button
                key={round.id}
                onClick={() => {
                  setActiveRoundId(round.id);
                  setView("detail");
                }}
                className="w-full flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3 hover:bg-card/80 transition-colors text-left"
                data-testid={`round-${round.id}`}
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Flag className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">
                    {round.courseName}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(round.date).toLocaleDateString()}
                    {round.tees && ` · ${round.tees} tees`}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // New round view
  if (view === "new") {
    return (
      <div className="max-w-lg mx-auto px-4 pt-4">
        <button
          onClick={() => setView("list")}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <h1 className="text-xl font-bold tracking-tight mb-4">New Round</h1>

        <div className="space-y-3" data-testid="new-round-form">
          <div>
            <label className="block text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1.5">
              Course Name
            </label>
            <input
              type="text"
              value={newCourseName}
              onChange={(e) => setNewCourseName(e.target.value)}
              placeholder="e.g., Pebble Beach"
              className="w-full h-11 bg-card border border-border rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              data-testid="course-name-input"
            />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1.5">
              Date
            </label>
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full h-11 bg-card border border-border rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              data-testid="date-input"
            />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1.5">
              Tees (optional)
            </label>
            <input
              type="text"
              value={newTees}
              onChange={(e) => setNewTees(e.target.value)}
              placeholder="e.g., Blue, White, Tips"
              className="w-full h-11 bg-card border border-border rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              data-testid="tees-input"
            />
          </div>
          <button
            onClick={() => createRoundMutation.mutate()}
            disabled={!newCourseName || createRoundMutation.isPending}
            className="w-full h-11 bg-primary text-primary-foreground rounded-lg text-sm font-bold hover:bg-primary/90 disabled:opacity-50 transition-colors"
            data-testid="create-round-btn"
          >
            Start Round
          </button>
        </div>
      </div>
    );
  }

  // Shot logging view
  if (view === "shot") {
    return (
      <div className="max-w-lg mx-auto px-4 pt-4">
        <button
          onClick={() => setView("detail")}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to round
        </button>
        <h1 className="text-xl font-bold tracking-tight mb-4">Log Shot</h1>

        <div className="space-y-3" data-testid="shot-form">
          <div>
            <label className="block text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1.5">
              Hole
            </label>
            <select
              value={shotHole}
              onChange={(e) => setShotHole(e.target.value)}
              className="w-full h-11 bg-card border border-border rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {Array.from({ length: 18 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  Hole {i + 1}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1.5">
              Club
            </label>
            <select
              value={shotClubId}
              onChange={(e) => setShotClubId(e.target.value)}
              className="w-full h-11 bg-card border border-border rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select club...</option>
              {clubs
                .filter((c) => c.enabled)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1.5">
              Distance to Pin (yds)
            </label>
            <input
              type="number"
              inputMode="numeric"
              value={shotDistance}
              onChange={(e) => setShotDistance(e.target.value)}
              placeholder="150"
              className="w-full h-11 bg-card border border-border rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1.5">
              Result
            </label>
            <div className="flex flex-wrap gap-2">
              {resultOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() =>
                    setShotResult(
                      shotResult === opt.value ? "" : opt.value
                    )
                  }
                  className={`h-9 px-3 rounded-lg text-sm font-medium transition-colors ${
                    shotResult === opt.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1.5">
              Putts
            </label>
            <div className="flex gap-2">
              {[0, 1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  onClick={() =>
                    setShotPutts(shotPutts === String(n) ? "" : String(n))
                  }
                  className={`w-11 h-11 rounded-lg text-sm font-medium transition-colors ${
                    shotPutts === String(n)
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => addShotMutation.mutate()}
            disabled={addShotMutation.isPending}
            className="w-full h-11 bg-primary text-primary-foreground rounded-lg text-sm font-bold hover:bg-primary/90 disabled:opacity-50 transition-colors"
            data-testid="log-shot-btn"
          >
            Log Shot
          </button>
        </div>
      </div>
    );
  }

  // Round detail view
  const stats = roundStats(activeShots);

  return (
    <div className="max-w-lg mx-auto px-4 pt-4">
      <button
        onClick={() => {
          setView("list");
          setActiveRoundId(null);
        }}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        All Rounds
      </button>

      {activeRound && (
        <>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                {activeRound.courseName}
              </h1>
              <p className="text-xs text-muted-foreground">
                {new Date(activeRound.date).toLocaleDateString()}
                {activeRound.tees && ` · ${activeRound.tees} tees`}
              </p>
            </div>
            <button
              onClick={() => deleteRoundMutation.mutate(activeRound.id)}
              className="w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-2 mb-4" data-testid="round-stats">
            <div className="bg-card border border-border rounded-lg p-2.5 text-center">
              <div className="text-lg font-bold tabular-nums">
                {stats.totalShots}
              </div>
              <div className="text-[10px] text-muted-foreground uppercase">
                Shots
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-2.5 text-center">
              <div className="text-lg font-bold tabular-nums">
                {stats.totalPutts}
              </div>
              <div className="text-[10px] text-muted-foreground uppercase">
                Putts
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-2.5 text-center">
              <div className="text-lg font-bold tabular-nums">
                {stats.fairways}
              </div>
              <div className="text-[10px] text-muted-foreground uppercase">
                FW Hit
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-2.5 text-center">
              <div className="text-lg font-bold tabular-nums">
                {stats.greens}
              </div>
              <div className="text-[10px] text-muted-foreground uppercase">
                GIR
              </div>
            </div>
          </div>

          {/* Add Shot Button */}
          <button
            onClick={() => setView("shot")}
            className="w-full h-11 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 mb-4"
            data-testid="add-shot-btn"
          >
            <Plus className="w-4 h-4" />
            Log Shot
          </button>

          {/* Shot List */}
          {activeShots.length > 0 ? (
            <div data-testid="shots-list">
              <h2 className="text-sm font-semibold mb-2">
                Shots ({activeShots.length})
              </h2>
              <div className="space-y-1.5">
                {activeShots.map((shot) => {
                  const club = clubs.find((c) => c.id === shot.clubId);
                  return (
                    <div
                      key={shot.id}
                      className="flex items-center gap-3 bg-card border border-border rounded-lg px-3 py-2.5"
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                        {shot.holeNumber}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium">
                          {club?.name || "—"}
                          {shot.distanceToPin && (
                            <span className="text-muted-foreground ml-1">
                              · {shot.distanceToPin} yds
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {shot.result && (
                            <span className="capitalize">{shot.result}</span>
                          )}
                          {shot.putts !== null && (
                            <span>
                              {shot.result ? " · " : ""}
                              {shot.putts} putts
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => deleteShotMutation.mutate(shot.id)}
                        className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <Target className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No shots logged yet</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
