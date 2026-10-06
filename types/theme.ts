export interface TypographySettings {
  fontFamily: string;
  headingSize: number;
  bodySize: number;
  headingWeight: number;
  bodyWeight: number;
  lineHeight: number;
  letterSpacing: number;
}

export interface RadiusSettings {
  none: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  custom: number;
}

export interface ShadowSettings {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  custom: string;
}

export interface SpacingSettings {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  huge: number;
  custom: number;
}

export interface Theme {
  name: string;
  description: string;

  // Base Colors
  background: string;
  surface: string;
  primary: string;
  secondary: string;
  text: string;
  accent: string;

  // Semantic Colors
  success?: string;
  warning?: string;
  error?: string;
  info?: string;

  // Gradient
  gradient?: string;

  // Typography
  typography?: Partial<TypographySettings>;

  // Border Radius
  radius?: Partial<RadiusSettings>;

  // Shadows
  shadows?: Partial<ShadowSettings>;

  // Spacing
  spacing?: Partial<SpacingSettings>;
}