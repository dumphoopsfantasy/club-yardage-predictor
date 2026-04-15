import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import Calculator from "@/pages/Calculator";
import MyBag from "@/pages/MyBag";
import Rounds from "@/pages/Rounds";
import Settings from "@/pages/Settings";
import { Crosshair, ShoppingBag, Flag, SettingsIcon } from "lucide-react";
import greeceLogo from "@/assets/logo-greece.png";

type Tab = "calculator" | "bag" | "rounds" | "settings";

export default function Index() {
  const [activeTab, setActiveTab] = useState<Tab>("calculator");
  const { state } = useApp();

  // Sync theme class with state
  useEffect(() => {
    document.documentElement.classList.remove("dark", "greece");
    if (state.settings.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (state.settings.theme === "greece") {
      document.documentElement.classList.add("greece");
    }
  }, [state.settings.theme]);

  const tabs: { id: Tab; label: string; icon: typeof Crosshair }[] = [
    { id: "calculator", label: "Calculator", icon: Crosshair },
    { id: "bag", label: "My Bag", icon: ShoppingBag },
    { id: "rounds", label: "Rounds", icon: Flag },
    { id: "settings", label: "Settings", icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Greece theme logo header */}
      {state.settings.theme === "greece" && (
        <div className="flex items-center justify-center pt-4 pb-2">
          <img src={greeceLogo} alt="Dump Golf" className="h-14 w-auto" />
        </div>
      )}

      {/* Screen content */}
      <main className="flex-1 pb-20">
        {activeTab === "calculator" && <Calculator />}
        {activeTab === "bag" && <MyBag />}
        {activeTab === "rounds" && <Rounds />}
        {activeTab === "settings" && <Settings />}
      </main>

      {/* Bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="max-w-lg mx-auto flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${
                  activeTab === tab.id
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                <Icon className="h-6 w-6" />
                <span className="text-xs font-semibold">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
