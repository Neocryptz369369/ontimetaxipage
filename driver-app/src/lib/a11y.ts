import { AccessibilityRole } from 'react-native'
export const a11yButton = (label: string, hint?: string) => ({
  accessible: true, accessibilityRole: 'button' as AccessibilityRole,
  accessibilityLabel: label, accessibilityHint: hint,
})
export const a11yHeader = (label: string) => ({
  accessible: true, accessibilityRole: 'header' as AccessibilityRole, accessibilityLabel: label,
})
export const a11yImage = (label: string) => ({
  accessible: true, accessibilityRole: 'image' as AccessibilityRole, accessibilityLabel: label,
})
// Color tokens that meet WCAG AA against white & dark backgrounds.
export const AA = {
  text: '#111827',       // 16.07:1 on white
  textMuted: '#4b5563',  // 7.59:1 on white
  primary: '#1f6feb',    // 4.6:1 — used for non-text UI; pair w/ white text
  danger: '#b91c1c',     // 6.78:1
  success: '#15803d',    // 4.96:1
}
