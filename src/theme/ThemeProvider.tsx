import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeMode, FontSize, LineSpacing } from './tokens';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  highFocusMode: boolean;
  setHighFocusMode: (enabled: boolean) => void;
  lineSpacing: LineSpacing;
  setLineSpacing: (spacing: LineSpacing) => void;
  highContrast: boolean;
  setHighContrast: (enabled: boolean) => void;
  reducedMotion: boolean;
  setReducedMotion: (enabled: boolean) => void;
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

  const [lineSpacing, setLineSpacingState] = useState<LineSpacing>(() => {
    const stored = localStorage.getItem('lineSpacing');
    return (stored === 'tight' || stored === 'normal' || stored === 'relaxed' || stored === 'loose')
      ? stored
      : 'normal';
  });

  const [highContrast, setHighContrastState] = useState<boolean>(() => {
    const stored = localStorage.getItem('highContrast');
    return stored === 'true';
  });

  const [reducedMotion, setReducedMotionState] = useState<boolean>(() => {
    const stored = localStorage.getItem('reducedMotion');
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

  useEffect(() => {
    localStorage.setItem('lineSpacing', lineSpacing);
    document.documentElement.setAttribute('data-line-spacing', lineSpacing);
  }, [lineSpacing]);

  useEffect(() => {
    localStorage.setItem('highContrast', highContrast.toString());
    document.documentElement.setAttribute('data-high-contrast', highContrast.toString());
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrast]);

  useEffect(() => {
    localStorage.setItem('reducedMotion', reducedMotion.toString());
    document.documentElement.setAttribute('data-reduced-motion', reducedMotion.toString());
    if (reducedMotion) {
      document.documentElement.classList.add('reduced-motion');
    } else {
      document.documentElement.classList.remove('reduced-motion');
    }
  }, [reducedMotion]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  const setFontSize = (size: FontSize) => {
    setFontSizeState(size);
  };

  const setHighFocusMode = (enabled: boolean) => {
    setHighFocusModeState(enabled);
  };

  const setLineSpacing = (spacing: LineSpacing) => {
    setLineSpacingState(spacing);
  };

  const setHighContrast = (enabled: boolean) => {
    setHighContrastState(enabled);
  };

  const setReducedMotion = (enabled: boolean) => {
    setReducedMotionState(enabled);
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
        lineSpacing,
        setLineSpacing,
        highContrast,
        setHighContrast,
        reducedMotion,
        setReducedMotion,
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

