import { createContext, useContext, useReducer, useCallback, useRef, useEffect, type ReactNode } from "react";
import type { Club, Calibration, Round, Shot, AppSettings } from "@/lib/types";

interface AppState {
  clubs: Club[];
  calibrations: Calibration[];
  rounds: Round[];
  shots: Shot[];
  settings: AppSettings;
}

type Action =
  | { type: "ADD_CLUBS"; clubs: Omit<Club, "id" | "sortOrder" | "createdAt">[] }
  | { type: "REMOVE_CLUB"; id: number }
  | { type: "TOGGLE_CLUB"; id: number }
  | { type: "CLEAR_CLUBS" }
  | { type: "ADD_CALIBRATION"; calibration: Omit<Calibration, "id" | "createdAt"> }
  | { type: "REMOVE_CALIBRATION"; id: number }
  | { type: "ADD_ROUND"; round: Omit<Round, "id" | "createdAt"> }
  | { type: "REMOVE_ROUND"; id: number }
  | { type: "ADD_SHOT"; shot: Omit<Shot, "id" | "createdAt"> }
  | { type: "REMOVE_SHOT"; id: number }
  | { type: "UPDATE_SETTINGS"; settings: Partial<AppSettings> }
  | { type: "IMPORT_DATA"; data: AppState }
  | { type: "RESET_ALL" };

const defaultSettings: AppSettings = {
  theme: "dark",
  units: "yards",
  tempUnit: "fahrenheit",
};

const STORAGE_KEY = "dumpgolf_app_state";

const initialState: AppState = {
  clubs: [],
  calibrations: [],
  rounds: [],
  shots: [],
  settings: defaultSettings,
};

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...initialState, ...parsed, settings: { ...defaultSettings, ...parsed.settings } };
    }
  } catch {}
  return initialState;
}

function saveState(state: AppState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "ADD_CLUBS": {
      const nextId = state.clubs.length > 0 ? Math.max(...state.clubs.map((c) => c.id)) + 1 : 1;
      const newClubs = action.clubs.map((c, i) => ({
        ...c,
        id: nextId + i,
        sortOrder: state.clubs.length + i,
        createdAt: new Date().toISOString(),
        enabled: 1 as const,
      }));
      return { ...state, clubs: [...state.clubs, ...newClubs] };
    }
    case "REMOVE_CLUB":
      return {
        ...state,
        clubs: state.clubs.filter((c) => c.id !== action.id),
        calibrations: state.calibrations.filter((c) => c.clubId !== action.id),
      };
    case "TOGGLE_CLUB":
      return {
        ...state,
        clubs: state.clubs.map((c) =>
          c.id === action.id ? { ...c, enabled: c.enabled ? 0 : 1 } : c
        ),
      };
    case "CLEAR_CLUBS":
      return { ...state, clubs: [], calibrations: [] };
    case "ADD_CALIBRATION": {
      const calId = state.calibrations.length > 0 ? Math.max(...state.calibrations.map((c) => c.id)) + 1 : 1;
      return {
        ...state,
        calibrations: [
          ...state.calibrations,
          { ...action.calibration, id: calId, createdAt: new Date().toISOString() },
        ],
      };
    }
    case "REMOVE_CALIBRATION":
      return {
        ...state,
        calibrations: state.calibrations.filter((c) => c.id !== action.id),
      };
    case "ADD_ROUND": {
      const roundId = state.rounds.length > 0 ? Math.max(...state.rounds.map((r) => r.id)) + 1 : 1;
      return {
        ...state,
        rounds: [
          { ...action.round, id: roundId, createdAt: new Date().toISOString() },
          ...state.rounds,
        ],
      };
    }
    case "REMOVE_ROUND":
      return {
        ...state,
        rounds: state.rounds.filter((r) => r.id !== action.id),
        shots: state.shots.filter((s) => s.roundId !== action.id),
      };
    case "ADD_SHOT": {
      const shotId = state.shots.length > 0 ? Math.max(...state.shots.map((s) => s.id)) + 1 : 1;
      return {
        ...state,
        shots: [
          ...state.shots,
          { ...action.shot, id: shotId, createdAt: new Date().toISOString() },
        ],
      };
    }
    case "REMOVE_SHOT":
      return {
        ...state,
        shots: state.shots.filter((s) => s.id !== action.id),
      };
    case "UPDATE_SETTINGS":
      return {
        ...state,
        settings: { ...state.settings, ...action.settings },
      };
    case "IMPORT_DATA":
      return action.data;
    case "RESET_ALL":
      return initialState;
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  addClubs: (clubs: Omit<Club, "id" | "sortOrder" | "createdAt">[]) => void;
  removeClub: (id: number) => void;
  toggleClub: (id: number) => void;
  clearClubs: () => void;
  addCalibration: (calibration: Omit<Calibration, "id" | "createdAt">) => void;
  removeCalibration: (id: number) => void;
  addRound: (round: Omit<Round, "id" | "createdAt">) => Round;
  removeRound: (id: number) => void;
  addShot: (shot: Omit<Shot, "id" | "createdAt">) => void;
  removeShot: (id: number) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  exportData: () => AppState;
  importData: (data: AppState) => void;
  resetAll: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, undefined, loadState);
  const stateRef = useRef(state);
  stateRef.current = state;

  // Persist to localStorage on every state change
  useEffect(() => {
    saveState(state);
  }, [state]);

  const addClubs = useCallback((clubs: Omit<Club, "id" | "sortOrder" | "createdAt">[]) => {
    dispatch({ type: "ADD_CLUBS", clubs });
  }, []);

  const removeClub = useCallback((id: number) => {
    dispatch({ type: "REMOVE_CLUB", id });
  }, []);

  const toggleClub = useCallback((id: number) => {
    dispatch({ type: "TOGGLE_CLUB", id });
  }, []);

  const clearClubs = useCallback(() => {
    dispatch({ type: "CLEAR_CLUBS" });
  }, []);

  const addCalibration = useCallback((calibration: Omit<Calibration, "id" | "createdAt">) => {
    dispatch({ type: "ADD_CALIBRATION", calibration });
  }, []);

  const removeCalibration = useCallback((id: number) => {
    dispatch({ type: "REMOVE_CALIBRATION", id });
  }, []);

  const addRound = useCallback((round: Omit<Round, "id" | "createdAt">) => {
    dispatch({ type: "ADD_ROUND", round });
    const currentState = stateRef.current;
    const newId = currentState.rounds.length > 0 ? Math.max(...currentState.rounds.map((r) => r.id)) + 1 : 1;
    return { ...round, id: newId, createdAt: new Date().toISOString() } as Round;
  }, []);

  const removeRound = useCallback((id: number) => {
    dispatch({ type: "REMOVE_ROUND", id });
  }, []);

  const addShot = useCallback((shot: Omit<Shot, "id" | "createdAt">) => {
    dispatch({ type: "ADD_SHOT", shot });
  }, []);

  const removeShot = useCallback((id: number) => {
    dispatch({ type: "REMOVE_SHOT", id });
  }, []);

  const updateSettings = useCallback((settings: Partial<AppSettings>) => {
    dispatch({ type: "UPDATE_SETTINGS", settings });
  }, []);

  const exportData = useCallback(() => {
    return stateRef.current;
  }, []);

  const importData = useCallback((data: AppState) => {
    dispatch({ type: "IMPORT_DATA", data });
  }, []);

  const resetAll = useCallback(() => {
    dispatch({ type: "RESET_ALL" });
  }, []);

  return (
    <AppContext.Provider
      value={{
        state,
        addClubs,
        removeClub,
        toggleClub,
        clearClubs,
        addCalibration,
        removeCalibration,
        addRound,
        removeRound,
        addShot,
        removeShot,
        updateSettings,
        exportData,
        importData,
        resetAll,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
