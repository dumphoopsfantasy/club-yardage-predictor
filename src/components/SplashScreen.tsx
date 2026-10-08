import { useState, useEffect } from "react";
import dumpLogo from "@/assets/dump-logo-transparent.png";

export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 2200);
    const doneTimer = setTimeout(onDone, 2800);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <div
      className={`splash-screen ${
        fading ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="splash-brand">
        <img src={dumpLogo} alt="" className="splash-logo" />
        <h1>Dump Golf</h1>
        <span className="book-label">YOUR YARDAGE BOOK</span>
        <div className="splash-rule" />
      </div>
    </div>
  );
}
