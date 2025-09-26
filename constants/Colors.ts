// Premium color palette - sophisticated and cohesive
const tintColorLight = '#0ea5e9'; // Rich, deep teal-blue
const tintColorDark = '#7dd3fc'; // Softer teal-blue for dark mode

export default {
  light: {
    text: '#0f172a', // Deep slate - more sophisticated than pure black
    background: '#f8fafc', // Clean, premium white with subtle warmth
    tint: tintColorLight,
    tabIconDefault: '#64748b', // Muted slate for inactive states
    tabIconSelected: tintColorLight,
    tabActive: '#0f172a', // Deep slate for active states
    tabInactive: 'rgba(139, 92, 246, 0.8)', // Purple with 80% opacity
    tabBarBackground: '#f1f5f9', // Subtle gray-blue background
    tabBarBorder: '#0ea5e9', // Rich teal-blue border
    accent1: '#0ea5e9', // Primary accent - rich teal-blue
    accent2: '#3b82f6', // Secondary accent - deep blue
    accent3: '#06b6d4', // Tertiary accent - cyan
    accentPurple: '#8b5cf6', // Premium purple for buttons
    accentPurpleBg: '#f3f4f6', // Subtle gray background for purple elements
    titleColor: '#0f172a', // Deep slate for titles
    // New premium colors
    premiumTeal: '#0ea5e9', // Rich, saturated teal
    premiumBlue: '#3b82f6', // Deep, sophisticated blue
    premiumPurple: '#8b5cf6', // Rich purple
    premiumGray: '#64748b', // Muted slate gray
    premiumBackground: '#f8fafc', // Clean, warm white
  },
  dark: {
    text: '#f1f5f9', // Clean, premium white
    background: '#0f172a', // Deep slate background
    tint: tintColorDark,
    tabIconDefault: '#64748b', // Muted slate for inactive states
    tabIconSelected: tintColorDark,
    tabActive: '#f1f5f9', // Clean white for active states
    tabInactive: 'rgba(139, 92, 246, 0.8)', // Purple with 80% opacity
    tabBarBackground: '#1e293b', // Dark slate background
    tabBarBorder: '#7dd3fc', // Soft teal-blue border
    accent1: '#7dd3fc', // Primary accent - soft teal-blue
    accent2: '#60a5fa', // Secondary accent - soft blue
    accent3: '#22d3ee', // Tertiary accent - soft cyan
    accentPurple: '#a78bfa', // Premium purple for buttons
    accentPurpleBg: '#1e293b', // Dark slate background for purple elements
    titleColor: '#f1f5f9', // Clean white for titles
    // New premium colors
    premiumTeal: '#7dd3fc', // Soft, sophisticated teal
    premiumBlue: '#60a5fa', // Soft, deep blue
    premiumPurple: '#a78bfa', // Rich purple
    premiumGray: '#64748b', // Muted slate gray
    premiumBackground: '#0f172a', // Deep slate background
  },
};
