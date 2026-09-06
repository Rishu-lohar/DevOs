/**
 * DevOS Central Design Token System
 * ---------------------------------------------------------------
 * SINGLE SOURCE OF TRUTH for the entire design language.
 * Every component consumes these tokens via CSS variables
 * (see app/globals.css). Never hardcode a raw value in a component.
 */

export const palette = {
  dark: {
    background: "#08090A",
    sidebar: "#0E0F11",
    surface: "#111214",
    surfaceHover: "#16181B",
    surfaceActive: "#1A1D21",
    card: "#111214",
    border: "#1F2023",
    borderStrong: "#2A2C31",
    textPrimary: "#F5F5F5",
    textSecondary: "#A1A1AA",
    textMuted: "#8A8F98",
    accent: "#5E6AD2",
    accentHover: "#6E79DC",
    accentActive: "#4F5BC4",
    accentSubtle: "rgba(94, 106, 210, 0.12)",
    accentBorder: "rgba(94, 106, 210, 0.32)",
    success: "#30D158",
    successSubtle: "rgba(48, 209, 88, 0.12)",
    warning: "#FFB020",
    warningSubtle: "rgba(255, 176, 32, 0.12)",
    danger: "#FF5C5C",
    dangerSubtle: "rgba(255, 92, 92, 0.12)",
  },
  light: {
    background: "#FFFFFF",
    sidebar: "#FAFAFA",
    surface: "#FFFFFF",
    surfaceHover: "#F4F4F5",
    surfaceActive: "#EBEBED",
    card: "#FFFFFF",
    border: "#E4E4E7",
    borderStrong: "#D4D4D8",
    textPrimary: "#18181B",
    textSecondary: "#52525B",
    textMuted: "#71717A",
    accent: "#5E6AD2",
    accentHover: "#4F5BC4",
    accentActive: "#4550B0",
    accentSubtle: "rgba(94, 106, 210, 0.08)",
    accentBorder: "rgba(94, 106, 210, 0.28)",
    success: "#1BA94C",
    successSubtle: "rgba(27, 169, 76, 0.1)",
    warning: "#B45309",
    warningSubtle: "rgba(180, 83, 9, 0.1)",
    danger: "#DC2626",
    dangerSubtle: "rgba(220, 38, 38, 0.1)",
  },
} as const;

export const typography = {
  fontSans: "var(--font-sans)",
  fontMono: "var(--font-mono)",
  size: {
    "2xs": "10px",
    xs: "11px",
    sm: "12px",
    base: "13px",
    md: "14px",
    lg: "16px",
    xl: "18px",
    "2xl": "22px",
    "3xl": "28px",
    "4xl": "36px",
    "5xl": "48px",
    "6xl": "60px",
  },
  weight: { normal: 400, medium: 500, semibold: 590, bold: 680 },
  leading: { tight: 1.15, snug: 1.3, normal: 1.5, relaxed: 1.65 },
  tracking: { tighter: "-0.03em", tight: "-0.015em", normal: "0", wide: "0.06em" },
} as const;

export const spacing = {
  px: "1px",
  0.5: "2px",
  1: "4px",
  1.5: "6px",
  2: "8px",
  2.5: "10px",
  3: "12px",
  4: "16px",
  5: "20px",
  6: "24px",
  8: "32px",
  10: "40px",
  12: "48px",
  16: "64px",
  20: "80px",
  24: "96px",
} as const;

export const radius = {
  none: "0",
  sm: "4px",
  md: "6px",
  lg: "8px",
  xl: "10px",
  "2xl": "12px",
  "3xl": "16px",
  full: "9999px",
} as const;

export const border = { width: "1px", style: "solid" } as const;

/** Depth comes ONLY from spacing + subtle borders. No heavy shadows. */
export const elevation = {
  none: "none",
  hairline: "0 0 0 1px var(--border)",
  overlay: "0 8px 24px -8px rgba(0,0,0,0.45)",
} as const;

export const animation = {
  duration: { instant: "80ms", fast: "140ms", normal: "200ms", slow: "320ms", slower: "600ms" },
  easing: {
    standard: "cubic-bezier(0.32, 0.72, 0, 1)",
    out: "cubic-bezier(0.16, 1, 0.3, 1)",
    inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
} as const;

export const transition = {
  colors: "color 140ms cubic-bezier(0.32,0.72,0,1), background-color 140ms cubic-bezier(0.32,0.72,0,1), border-color 140ms cubic-bezier(0.32,0.72,0,1)",
  transform: "transform 200ms cubic-bezier(0.32,0.72,0,1)",
  opacity: "opacity 140ms cubic-bezier(0.32,0.72,0,1)",
} as const;

export const layout = {
  sidebarWidth: "232px",
  navbarHeight: "48px",
  contentMaxWidth: "1600px",
  landingMaxWidth: "1200px",
} as const;

/** Framer Motion presets — subtle, premium, never flashy. */
export const motionPreset = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] as const },
  },
  fadeUp: {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.32, ease: [0.16, 1, 0.3, 1] as const },
  },
  scrollReveal: {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
  stagger: (i: number) => ({
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] as const },
  }),
} as const;

export const theme = {
  palette,
  typography,
  spacing,
  radius,
  border,
  elevation,
  animation,
  transition,
  layout,
  motionPreset,
} as const;

export type Theme = typeof theme;
export default theme;
