export const theme = {
  colors: {
    background: "#09090B",
    surface: "#111113",
    surfaceSecondary: "#18181B",
    surfaceMuted: "#141416",
    surfaceHover: "#1D1D20",
    
    border: "#232326",
    borderHover: "#3F3F46",
    borderSubtle: "#1C1C1F",
    
    primary: "#7C5CFC",
    primaryHover: "#6B46F7",
    primaryActive: "#5A32F5",
    primaryForeground: "#FFFFFF",
    primaryMuted: "rgba(124, 92, 252, 0.12)",
    primaryBorder: "rgba(124, 92, 252, 0.25)",
    
    secondary: "#18181B",
    secondaryHover: "#232326",
    secondaryForeground: "#FAFAFA",
    
    ghost: "transparent",
    ghostHover: "#18181B",
    ghostForeground: "#A1A1AA",
    ghostForegroundHover: "#FAFAFA",
    
    text: {
      primary: "#FAFAFA",
      secondary: "#A1A1AA",
      muted: "#71717A",
      subtle: "#52525B",
    },
    
    status: {
      success: "#22C55E",
      successBg: "rgba(34, 197, 94, 0.1)",
      successBorder: "rgba(34, 197, 94, 0.25)",
      successText: "#4ADE80",
      
      warning: "#F59E0B",
      warningBg: "rgba(245, 158, 11, 0.1)",
      warningBorder: "rgba(245, 158, 11, 0.25)",
      warningText: "#FBBF24",
      
      error: "#EF4444",
      errorBg: "rgba(239, 68, 68, 0.1)",
      errorBorder: "rgba(239, 68, 68, 0.25)",
      errorText: "#F87171",
      
      info: "#38BDF8",
      infoBg: "rgba(56, 189, 248, 0.1)",
      infoBorder: "rgba(56, 189, 248, 0.25)",
      infoText: "#38BDF8",
    },
    
    tags: {
      purple: {
        bg: "rgba(124, 92, 252, 0.12)",
        text: "#C4B5FD",
        border: "rgba(124, 92, 252, 0.25)",
      },
      emerald: {
        bg: "rgba(34, 197, 94, 0.1)",
        text: "#86EFAC",
        border: "rgba(34, 197, 94, 0.25)",
      },
      amber: {
        bg: "rgba(245, 158, 11, 0.1)",
        text: "#FDE68A",
        border: "rgba(245, 158, 11, 0.25)",
      },
      blue: {
        bg: "rgba(56, 189, 248, 0.1)",
        text: "#BAE6FD",
        border: "rgba(56, 189, 248, 0.25)",
      },
      rose: {
        bg: "rgba(244, 63, 94, 0.1)",
        text: "#FECDD3",
        border: "rgba(244, 63, 94, 0.25)",
      },
    },
  },
  
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    "2xl": "48px",
    "3xl": "64px",
  },
  
  radius: {
    none: "0px",
    sm: "6px",
    md: "10px",
    lg: "12px",
    xl: "16px", // standard card radius
    full: "9999px",
  },
  
  border: {
    width: "1px",
    style: "solid",
    color: "#232326",
    colorHover: "#3F3F46",
  },
  
  typography: {
    fontSans: "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontMono: "var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    sizes: {
      xs: "11px",
      sm: "13px",
      base: "14px",
      lg: "16px",
      xl: "18px",
      "2xl": "22px",
      "3xl": "28px",
      "4xl": "36px",
      "5xl": "44px",
    },
    weights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeights: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.625,
    },
    letterSpacing: {
      tight: "-0.015em",
      normal: "0",
      wide: "0.05em",
    },
  },
  
  animation: {
    duration: {
      fast: "150ms",
      normal: "200ms",
      slow: "300ms",
    },
    timing: {
      easeOut: "cubic-bezier(0.16, 1, 0.3, 1)",
      easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    },
  },
  
  transition: {
    default: "all 150ms cubic-bezier(0.16, 1, 0.3, 1)",
    colors: "color 150ms ease, background-color 150ms ease, border-color 150ms ease",
    transform: "transform 150ms cubic-bezier(0.16, 1, 0.3, 1)",
  },
} as const;

export type Theme = typeof theme;
export default theme;
