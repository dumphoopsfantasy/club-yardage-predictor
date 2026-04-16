import { useState, useEffect } from "react";
import launchScreen from "/launch-screen.png";

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
      className={`fixed inset-0 z-[200] flex items-center justify-center bg-white transition-opacity duration-600 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
    >
      <img
        src={launchScreen}
        alt="Dump Golf"
        className="w-full h-full object-cover"
      />
    </div>
  );
}
