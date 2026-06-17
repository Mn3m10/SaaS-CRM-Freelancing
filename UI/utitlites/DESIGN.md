---
name: Kinetic Ledger
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#434655'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#4059aa'
  on-secondary: '#ffffff'
  secondary-container: '#8fa7fe'
  on-secondary-container: '#1d3989'
  tertiary: '#4e5566'
  on-tertiary: '#ffffff'
  tertiary-container: '#666d7f'
  on-tertiary-container: '#ecf0ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#dce1ff'
  secondary-fixed-dim: '#b6c4ff'
  on-secondary-fixed: '#00164e'
  on-secondary-fixed-variant: '#264191'
  tertiary-fixed: '#dce2f7'
  tertiary-fixed-dim: '#c0c6db'
  on-tertiary-fixed: '#141b2b'
  on-tertiary-fixed-variant: '#404758'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  sidebar-width: 260px
  container-max: 1440px
  gutter: 24px
---

## Brand & Style

This design system is built for the modern independent professional and small-scale enterprise. The brand personality is **precise, effortless, and premium**, leaning heavily into a **high-fidelity minimalism** that mirrors the operational efficiency of leaders like Stripe and Linear.

The visual style utilizes **Corporate Modernism** with a focus on deep clarity. We employ a "Depth-First" approach where hierarchy is defined through subtle layers, microscopic detail in borders, and generous whitespace. The emotional response should be one of "calm control"—reducing the anxiety of CRM data management through a structured, airy, and predictable interface. High-contrast typography paired with low-contrast structural elements ensures the user's focus remains on data and action.

## Colors

The palette is anchored by **Pure White (#FFFFFF)** to maximize the sense of "space." 

- **Primary Blue (#2563EB):** Used exclusively for primary actions, active states, and critical progress indicators.
- **Dark Blue (#1E3A8A):** Reserved for high-level navigation and headers to provide a grounded, authoritative frame for the light content area.
- **Dark Gray (#111827):** Used for primary text to ensure WCAG AAA readability against white backgrounds.
- **Off White (#F8F9FA):** Used for subtle section nesting, card backgrounds, and secondary layout regions to prevent "snow blindness."

Gradients should be used sparingly: only as a subtle 10% vertical tint on primary buttons to provide a tactile, "pressed" feel.

## Typography

The design system relies entirely on **Inter** to leverage its exceptional legibility and systematic "neutrality." 

- **Weight Strategy:** Use `600` (SemiBold) for most headers to maintain a premium feel without the bulk of `700`.
- **Optical Sizing:** For display sizes (32px+), always use negative letter spacing (`-0.02em`) to tighten the character lockup.
- **Hierarchy:** Use color (Dark Gray for body vs. a slightly lighter 60% opacity for secondary info) rather than just size to differentiate information density.

## Layout & Spacing

The system follows a strict **8px Grid**. All dimensions, padding, and margins must be multiples of 8 (or 4 for micro-adjustments).

- **Navigation:** A fixed 260px left sidebar using the `Dark Blue` palette.
- **Top Bar:** A 64px height utility bar for global search and profile, utilizing a `1px` bottom border in `#E5E7EB`.
- **Main Canvas:** Content resides in a fluid container with a maximum width of 1440px to ensure line lengths remain readable on ultra-wide monitors.
- **Grid:** Use a 12-column grid for dashboard layouts. On mobile (under 768px), the sidebar collapses into a drawer and the grid reflows to a single column with 16px margins.

## Elevation & Depth

Hierarchy is established through **Ambient Shadows** and **Tonal Layering**. 

1.  **Level 0 (Base):** Pure White (#FFFFFF) background.
2.  **Level 1 (Cards/Sections):** Off White (#F8F9FA) or White with a `1px` border (#E5E7EB).
3.  **Level 2 (Active Floating):** Used for cards containing primary data. Shadow: `0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)`.
4.  **Level 3 (Overlays):** Used for Modals and Popovers. Shadow: `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)`.

Borders are preferred over shadows for defining structural zones (like table cells or sidebar dividers). Shadows are reserved for "elevated" interactive elements.

## Shapes

The design system utilizes a **Rounded** aesthetic to appear approachable and modern. 

- **Small elements (Checkboxes, Tags):** 4px - 6px radius.
- **Standard elements (Buttons, Inputs):** 8px - 12px radius.
- **Large elements (Cards, Modals):** 12px - 16px radius.

Consistency in the "inner-radius" is key: when a button is nested inside a card, the button's radius should be slightly smaller than the card's radius to maintain visual harmony.

## Components

### Buttons
- **Primary:** Solid `#2563EB` with white text. Subtle `2px` bottom shadow for a tactile look. 
- **Secondary:** White background, `#E5E7EB` border, `#111827` text.
- **Tertiary:** Ghost style; no background or border until hover.

### Cards
Cards are the primary container for data. They use a white background, a subtle `#E5E7EB` 1px border, and a `Level 2` shadow on hover to indicate interactivity.

### Tables
Clean, un-striped tables. Use 1px horizontal dividers only. Header cells use `label-sm` in all-caps with `500` weight and a light gray text color.

### Inputs
Height of 40px for standard, 48px for large. Background is white with a `1px` border. On focus, the border changes to `#2563EB` with a `4px` soft blue outer glow (ring).

### Badges/Status
Small, semi-rounded (pill) shapes. Use a 10% opacity version of the status color for the background and 100% opacity for the text (e.g., Success: Background `rgba(16, 185, 129, 0.1)`, Text `#10B981`).