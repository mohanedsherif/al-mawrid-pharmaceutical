import { useEffect, useState } from 'react';

export const useDarkMode = () => {
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage first
    const stored = localStorage.getItem('darkMode');
    if (stored !== null) {
      return stored === 'true';
    }
    // Fallback to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Initialize on mount
  useEffect(() => {
    const root = document.documentElement;
    const stored = localStorage.getItem('darkMode');
    const shouldBeDark = stored !== null ? stored === 'true' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (shouldBeDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [isDark]);

  const toggle = () => {
    setIsDark((prev) => {
      const newValue = !prev;
      // Immediately update DOM for instant feedback
      const root = document.documentElement;
      if (newValue) {
        root.classList.add('dark');
        localStorage.setItem('darkMode', 'true');
      } else {
        root.classList.remove('dark');
        localStorage.setItem('darkMode', 'false');
      }
      return newValue;
    });
  };

  return { isDark, toggle };
};

