import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeMode, FontSize } from './tokens';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  highFocusMode: boolean;
  setHighFocusMode: (enabled: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const stored = localStorage.getItem('theme');
    return (stored === 'dark' || stored === 'light') ? stored : 'light';
  });

  const [fontSize, setFontSizeState] = useState<FontSize>(() => {
    const stored = localStorage.getItem('fontSize');
    return (stored === 'small' || stored === 'standard' || stored === 'large') 
      ? stored 
      : 'standard';
  });

  const [highFocusMode, setHighFocusModeState] = useState<boolean>(() => {
    const stored = localStorage.getItem('highFocusMode');
    return stored === 'true';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    // Apply theme classes
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('fontSize', fontSize);
    document.documentElement.setAttribute('data-font-size', fontSize);
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('highFocusMode', highFocusMode.toString());
    document.documentElement.setAttribute('data-high-focus', highFocusMode.toString());
  }, [highFocusMode]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  const setFontSize = (size: FontSize) => {
    setFontSizeState(size);
  };

  const setHighFocusMode = (enabled: boolean) => {
    setHighFocusModeState(enabled);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        fontSize,
        setFontSize,
        highFocusMode,
        setHighFocusMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

