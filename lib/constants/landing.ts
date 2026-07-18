export const LANDING_HERO = {
  imageUrl: "/images/hero/hero.jpg",
  imageAlt: "Students walking on a tree-lined university campus path",
} as const;

export const LANDING_THEME = {
  dark: "#0a100e",
  light: "#f8f7f4",
  accent: "#E8B84A",
} as const;

/** @deprecated Use LANDING_THEME.accent */
export const LANDING_HERO_ACCENT = LANDING_THEME.accent;
