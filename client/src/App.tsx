import { useState, useEffect } from "react";
import { Switch, Route, Router, useLocation } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Calculator from "@/pages/calculator";
import MyBag from "@/pages/my-bag";
import Rounds from "@/pages/rounds";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";
import { useQuery } from "@tanstack/react-query";
import type { Setting } from "@shared/schema";
import { Calculator as CalcIcon, Backpack, Flag, SettingsIcon } from "lucide-react";

function BottomNav() {
  const [location, setLocation] = useLocation();

  const tabs = [
    { path: "/", label: "Calculator", icon: CalcIcon },
    { path: "/bag", label: "My Bag", icon: Backpack },
    { path: "/rounds", label: "Rounds", icon: Flag },
    { path: "/settings", label: "Settings", icon: SettingsIcon },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-md"
      data-testid="bottom-nav"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = location === tab.path;
          const Icon = tab.icon;
          return (
            <button
              key={tab.path}
              onClick={() => setLocation(tab.path)}
              className={`flex flex-col items-center gap-1 py-3 px-4 min-w-[68px] min-h-[44px] transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-testid={`nav-${tab.label.toLowerCase().replace(" ", "-")}`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function ThemeApplier() {
  const { data: settings = [] } = useQuery<Setting[]>({
    queryKey: ["/api/settings"],
  });

  useEffect(() => {
    const themeSetting = settings.find((s) => s.key === "theme");
    const theme = themeSetting?.value ?? "dark";
    document.documentElement.classList.remove("dark", "blue");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (theme === "blue") {
      document.documentElement.classList.add("blue");
    }
  }, [settings]);

  return null;
}

function AppRouter() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Switch>
        <Route path="/" component={Calculator} />
        <Route path="/bag" component={MyBag} />
        <Route path="/rounds" component={Rounds} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
      <BottomNav />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <ThemeApplier />
        <Router hook={useHashLocation}>
          <AppRouter />
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
