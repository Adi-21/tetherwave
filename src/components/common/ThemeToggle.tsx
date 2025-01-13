"use client";

import { LuSun, LuMoon } from 'react-icons/lu';
import { useTheme } from '@/contexts/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="rounded-full p-2 drop-shadow shadow text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-all duration-300"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <LuMoon className="w-5 h-5" />
      ) : (
        <LuSun className="w-5 h-5" />
      )}
    </button>
  );
};

export default ThemeToggle;
