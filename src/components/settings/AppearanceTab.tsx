import { useTheme } from '@/theme';
import { setSetting } from '@/hooks/useSettings';
import { Section, Stack } from '@/components/ui/layout';
import { Heading, Paragraph } from '@/components/ui/typography';
import { HandDrawnBox } from '@/components/ui/HandDrawnBox';
import { Moon, Sun, Type, Focus, Contrast, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeSetting } from './ThemeSetting';
import { FontSizeSetting } from './FontSizeSetting';
import { LineSpacingSetting } from './LineSpacingSetting';
import { ToggleSetting } from './ToggleSetting';

export function AppearanceTab() {
  const {
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
  } = useTheme();

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    setSetting('theme', newTheme).catch(console.error);
  };

  const handleFontSizeChange = (newSize: 'small' | 'standard' | 'large') => {
    setFontSize(newSize);
    setSetting('fontSize', newSize).catch(console.error);
  };

  const handleHighFocusModeChange = (enabled: boolean) => {
    setHighFocusMode(enabled);
    setSetting('highFocusMode', enabled.toString()).catch(console.error);
  };

  const handleLineSpacingChange = (spacing: 'tight' | 'normal' | 'relaxed' | 'loose') => {
    setLineSpacing(spacing);
    setSetting('lineSpacing', spacing).catch(console.error);
  };

  const handleHighContrastChange = (enabled: boolean) => {
    setHighContrast(enabled);
    setSetting('highContrast', enabled.toString()).catch(console.error);
  };

  const handleReducedMotionChange = (enabled: boolean) => {
    setReducedMotion(enabled);
    setSetting('reducedMotion', enabled.toString()).catch(console.error);
  };

  return (
    <Stack spacing="md">
      <ThemeSetting theme={theme} onThemeChange={handleThemeChange} />
      <FontSizeSetting fontSize={fontSize} onFontSizeChange={handleFontSizeChange} />
      <LineSpacingSetting lineSpacing={lineSpacing} onLineSpacingChange={handleLineSpacingChange} />
      <ToggleSetting
        icon={<Contrast className="w-5 h-5 text-accent-primary" />}
        title="High Contrast Mode"
        description="Increase contrast for better visibility and accessibility"
        checked={highContrast}
        onChange={handleHighContrastChange}
        label="Enable High Contrast Mode"
      />
      <ToggleSetting
        icon={<Focus className="w-5 h-5 text-accent-primary" />}
        title="High Focus Mode"
        description="Reduce visual distractions by hiding decorative elements and secondary cards"
        checked={highFocusMode}
        onChange={handleHighFocusModeChange}
        label="Enable High Focus Mode"
      />
      <ToggleSetting
        icon={<Minimize2 className="w-5 h-5 text-accent-primary" />}
        title="Reduced Motion"
        description="Disable animations and transitions for users sensitive to motion"
        checked={reducedMotion}
        onChange={handleReducedMotionChange}
        label="Enable Reduced Motion"
      />
    </Stack>
  );
}

