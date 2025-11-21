// Design tokens for the application
// Based on Antique Academia theme from documentation

export const tokens = {
  colors: {
    light: {
      background: '#F8F3E8', // Parchment Light
      surface: '#FAF7EF', // Linen White
      border: '#C8BBA4', // Raw Umber
      text: {
        primary: '#3C2F2F', // Deep Sepia
        secondary: '#6B5E54', // Warm Taupe
      },
      accent: {
        primary: '#2E4A78', // Royal Blue Ink
        secondary: '#B28A4A', // Antique Brass
        highlight: '#E2C77E', // Veil Gold
      },
      semantic: {
        error: '#A6453E', // Wax Red
        success: '#6E8C5E', // Laurel Green
        warning: '#E7A637', // Candle Flame
      },
    },
    dark: {
      background: '#1A1410', // Night Leather
      surface: '#27211D', // Smoked Parchment
      border: '#3A302A', // Charred Umber
      text: {
        primary: '#EDE5CF', // Aged Ivory
        secondary: '#C0B099', // Dusty Clay
      },
      accent: {
        primary: '#6D88C2', // Sapphire Ink
        secondary: '#D1A95A', // Molten Brass
        highlight: '#EED595', // Wax Yellow
      },
      semantic: {
        error: '#B75A4A', // Ember Red
        success: '#88A46C', // Herbal Green
        warning: '#E7A637', // Candle Flame
      },
    },
  },
  typography: {
    fontFamily: {
      heading: ['Literata', 'Merriweather', 'serif'],
      body: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
    },
    fontSize: {
      xs: '0.75rem', // 12px
      sm: '0.875rem', // 14px
      base: '1rem', // 16px
      lg: '1.25rem', // 20px
      xl: '1.5rem', // 24px
      '2xl': '1.875rem', // 30px
      '3xl': '2.25rem', // 36px
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.3,
      normal: 1.5,
      reading: 1.75,
    },
  },
  spacing: {
    1: '0.25rem', // 4px
    2: '0.5rem', // 8px
    3: '0.75rem', // 12px
    4: '1rem', // 16px
    6: '1.5rem', // 24px
    8: '2rem', // 32px
    10: '2.5rem', // 40px
    12: '3rem', // 48px
  },
  borderRadius: {
    none: '0',
    sm: '0.25rem', // 4px
    md: '0.5rem', // 8px
    lg: '0.75rem', // 12px
    full: '9999px',
  },
  shadows: {
    soft: '0 2px 6px rgba(0, 0, 0, 0.08)',
    medium: '0 4px 12px rgba(0, 0, 0, 0.12)',
    large: '0 8px 16px rgba(0, 0, 0, 0.18)',
  },
} as const;

export type ThemeMode = 'light' | 'dark';
export type FontSize = 'small' | 'standard' | 'large';
export type LineSpacing = 'tight' | 'normal' | 'relaxed' | 'loose';
