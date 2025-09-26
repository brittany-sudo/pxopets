// Common style constants to avoid magic numbers
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 28,
} as const;

export const FONT_SIZES = {
  xs: 10,
  sm: 12,
  md: 13,
  lg: 16,
  xl: 18,
  xxl: 19,
} as const;

export const BORDER_RADIUS = {
  sm: 3,
  md: 4,
  lg: 6,
  xl: 8,
} as const;

export const ICON_SIZES = {
  sm: 20,
  md: 24,
  lg: 26,
  xl: 30,
} as const;

export const SHADOWS = {
  halftone: {
    textShadow: '2px 2px 0px #ff69b4',
    boxShadow: '3px 3px 0px #0ecab8',
  },
} as const;
