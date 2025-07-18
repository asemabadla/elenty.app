// Modern, beautiful color scheme inspired by iOS and Linear
export const colors = {
  // Primary colors - soft, modern palette
  primary: "#6366F1", // Modern indigo
  secondary: "#F59E0B", // Warm amber
  accent: "#10B981", // Fresh emerald
  
  // Backgrounds
  background: "#FAFAFA", // Very light gray
  backgroundSecondary: "#F5F5F7", // iOS-style secondary background
  card: "#FFFFFF", // Pure white cards
  surface: "#F8FAFC", // Subtle surface color
  
  // Text colors
  text: "#1F2937", // Rich dark gray
  textSecondary: "#6B7280", // Medium gray
  textTertiary: "#9CA3AF", // Light gray
  textInverse: "#FFFFFF", // White text
  
  // Borders and dividers
  border: "#E5E7EB", // Light border
  borderSecondary: "#F3F4F6", // Very light border
  divider: "#F1F5F9", // Subtle divider
  
  // Status colors
  success: "#10B981", // Green
  warning: "#F59E0B", // Amber
  error: "#EF4444", // Red
  info: "#3B82F6", // Blue
  
  // Interactive states
  inactive: "#D1D5DB", // Disabled state
  hover: "#F9FAFB", // Hover background
  pressed: "#F3F4F6", // Pressed state
  
  // Gradients (used sparingly)
  gradientPrimary: ["#6366F1", "#8B5CF6"], // Primary gradient
  gradientSecondary: ["#F59E0B", "#F97316"], // Secondary gradient
  
  // Dark theme
  dark: {
    background: "#0F0F0F",
    backgroundSecondary: "#1A1A1A",
    card: "#1F1F1F",
    surface: "#2A2A2A",
    text: "#FFFFFF",
    textSecondary: "#A1A1AA",
    textTertiary: "#71717A",
    border: "#2A2A2A",
    borderSecondary: "#1F1F1F",
    divider: "#262626",
  }
};

// Spacing system inspired by Tailwind/Linear
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

// Typography system
export const typography = {
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    xxxxl: 48,
  },
  weights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  }
};

// Border radius system
export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
};

// Shadow system
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
};