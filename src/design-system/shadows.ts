// Multi-layer shadow system - Claude/Tesla level
// Each shadow has 3 layers: ambient + direct + contact

export const shadows = {
  // Level 0: Flat (no shadow)
  none: 'none',

  // Level 1: Subtle hover (cards at rest)
  xs: `
    0 1px 2px 0 rgba(0, 0, 0, 0.05),
    0 0 0 1px rgba(0, 0, 0, 0.02)
  `,

  // Level 2: Small elevation (buttons, inputs on focus)
  sm: `
    0 2px 4px -1px rgba(0, 0, 0, 0.06),
    0 4px 6px -1px rgba(0, 0, 0, 0.08),
    0 0 0 1px rgba(0, 0, 0, 0.03)
  `,

  // Level 3: Medium elevation (dropdowns, popovers)
  md: `
    0 4px 6px -2px rgba(0, 0, 0, 0.08),
    0 10px 15px -3px rgba(0, 0, 0, 0.10),
    0 0 0 1px rgba(0, 0, 0, 0.05)
  `,

  // Level 4: High elevation (modals)
  lg: `
    0 10px 15px -3px rgba(0, 0, 0, 0.10),
    0 20px 25px -5px rgba(0, 0, 0, 0.12),
    0 0 0 1px rgba(0, 0, 0, 0.05)
  `,

  // Level 5: Floating (command palette, toasts)
  xl: `
    0 20px 25px -5px rgba(0, 0, 0, 0.12),
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(0, 0, 0, 0.05)
  `,

  // Level 6: Maximum elevation (modals on modals)
  '2xl': `
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 40px 70px -20px rgba(0, 0, 0, 0.30),
    0 0 0 1px rgba(0, 0, 0, 0.05)
  `,

  // Colored shadows (for brand elements)
  primary: `
    0 4px 12px rgba(0, 112, 243, 0.15),
    0 8px 24px rgba(0, 112, 243, 0.20),
    0 0 0 1px rgba(0, 112, 243, 0.10)
  `,

  success: `
    0 4px 12px rgba(16, 185, 129, 0.15),
    0 8px 24px rgba(16, 185, 129, 0.20),
    0 0 0 1px rgba(16, 185, 129, 0.10)
  `,

  danger: `
    0 4px 12px rgba(239, 68, 68, 0.15),
    0 8px 24px rgba(239, 68, 68, 0.20),
    0 0 0 1px rgba(239, 68, 68, 0.10)
  `,

  warning: `
    0 4px 12px rgba(245, 158, 11, 0.15),
    0 8px 24px rgba(245, 158, 11, 0.20),
    0 0 0 1px rgba(245, 158, 11, 0.10)
  `,

  // Inner shadows (for recessed elements)
  inner: `
    inset 0 2px 4px 0 rgba(0, 0, 0, 0.06),
    inset 0 0 0 1px rgba(0, 0, 0, 0.04)
  `,

  // Glow effects (for orb, active states)
  glow: {
    blue: `
      0 0 20px rgba(26, 140, 255, 0.4),
      0 0 40px rgba(26, 140, 255, 0.2),
      0 0 60px rgba(26, 140, 255, 0.1)
    `,
    purple: `
      0 0 20px rgba(123, 44, 191, 0.4),
      0 0 40px rgba(123, 44, 191, 0.2),
      0 0 60px rgba(123, 44, 191, 0.1)
    `,
    pink: `
      0 0 20px rgba(240, 147, 251, 0.4),
      0 0 40px rgba(240, 147, 251, 0.2),
      0 0 60px rgba(240, 147, 251, 0.1)
    `,
  },
} as const;

// Shadow utility function for dynamic colored shadows
export function getColoredShadow(
  color: string,
  opacity = 0.2
): string {
  return `
    0 4px 12px ${color}${Math.round(opacity * 0.15 * 255).toString(16).padStart(2, '0')},
    0 8px 24px ${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')},
    0 0 0 1px ${color}${Math.round(opacity * 0.1 * 255).toString(16).padStart(2, '0')}
  `;
}
