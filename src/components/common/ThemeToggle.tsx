"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { PiSunDuotone, PiMoonDuotone } from "react-icons/pi";

const ThemeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="rounded-full p-2 drop-shadow shadow text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-all duration-300"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <PiSunDuotone size={20} />
      ) : (
        <PiMoonDuotone size={20} />
      )}
    </button>
  );
};

export default ThemeToggle;
