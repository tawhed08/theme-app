import type { Theme } from "@/types/theme";

interface ThemeSeed {
  category: string;
  names: string[];
  background: string;
  surface: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
}

const defaultTypography = {
  fontFamily: "Inter",
  headingSize: 48,
  bodySize: 16,
  headingWeight: 700,
  bodyWeight: 400,
  lineHeight: 1.6,
  letterSpacing: 0,
};

const defaultRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 20,
  custom: 16,
};

const defaultShadows = {
  none: "none",
  sm: "0 1px 3px rgba(0, 0, 0, 0.08)",
  md: "0 4px 10px rgba(0, 0, 0, 0.10)",
  lg: "0 10px 25px rgba(0, 0, 0, 0.14)",
  xl: "0 20px 45px rgba(0, 0, 0, 0.18)",
  custom: "0 18px 50px rgba(0, 0, 0, 0.25)",
};

const defaultSpacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  huge: 48,
  custom: 20,
};

const seeds: ThemeSeed[] = [
  {
    category: "Ocean",
    names: [
      "Ocean Breeze",
      "Deep Ocean",
      "Blue Harbor",
      "Arctic Tide",
      "Sea Glass",
    ],
    background: "#07111F",
    surface: "#0D1B2F",
    primary: "#38BDF8",
    secondary: "#818CF8",
    accent: "#22D3EE",
    text: "#F8FAFC",
  },
  {
    category: "Purple",
    names: [
      "Royal Violet",
      "Mystic Purple",
      "Purple Dream",
      "Velvet Night",
      "Lavender Core",
    ],
    background: "#11091C",
    surface: "#1C102C",
    primary: "#8B5CF6",
    secondary: "#A855F7",
    accent: "#EC4899",
    text: "#FAF5FF",
  },
  {
    category: "Emerald",
    names: [
      "Emerald",
      "Mint Forest",
      "Green Pulse",
      "Jade",
      "Evergreen",
    ],
    background: "#061512",
    surface: "#0D231E",
    primary: "#10B981",
    secondary: "#14B8A6",
    accent: "#34D399",
    text: "#ECFDF5",
  },
  {
    category: "Sunset",
    names: [
      "Sunset Glow",
      "Golden Hour",
      "Burning Sky",
      "Warm Horizon",
      "Solar Flame",
    ],
    background: "#1C0B06",
    surface: "#2A120C",
    primary: "#F97316",
    secondary: "#FB7185",
    accent: "#F59E0B",
    text: "#FFF7ED",
  },
  {
    category: "Cyber",
    names: [
      "Cyber Core",
      "Neon Grid",
      "Digital Pulse",
      "Quantum",
      "Synthwave",
    ],
    background: "#09090F",
    surface: "#141420",
    primary: "#E879F9",
    secondary: "#22D3EE",
    accent: "#A3E635",
    text: "#FAFAFA",
  },
  {
    category: "Rose",
    names: [
      "Rose Bloom",
      "Crimson Rose",
      "Pink Signal",
      "Ruby",
      "Velvet Rose",
    ],
    background: "#19080D",
    surface: "#291019",
    primary: "#F43F5E",
    secondary: "#EC4899",
    accent: "#FB7185",
    text: "#FFF1F2",
  },
  {
    category: "Indigo",
    names: [
      "Indigo Night",
      "Blue Crown",
      "Deep Indigo",
      "Indigo Wave",
      "Sapphire",
    ],
    background: "#080B1A",
    surface: "#11152B",
    primary: "#6366F1",
    secondary: "#3B82F6",
    accent: "#818CF8",
    text: "#EEF2FF",
  },
  {
    category: "Amber",
    names: [
      "Amber Gold",
      "Golden Sand",
      "Honey",
      "Amber Fire",
      "Royal Gold",
    ],
    background: "#1A1005",
    surface: "#2A1A09",
    primary: "#F59E0B",
    secondary: "#F97316",
    accent: "#FBBF24",
    text: "#FFFBEB",
  },
  {
    category: "Teal",
    names: [
      "Teal Wave",
      "Aqua Mint",
      "Deep Teal",
      "Lagoon",
      "Tropical",
    ],
    background: "#041312",
    surface: "#0B2220",
    primary: "#14B8A6",
    secondary: "#06B6D4",
    accent: "#2DD4BF",
    text: "#F0FDFA",
  },
  {
    category: "Minimal",
    names: [
      "Minimal Black",
      "Minimal Steel",
      "Minimal White",
      "Mono",
      "Graphite",
    ],
    background: "#08090C",
    surface: "#12141A",
    primary: "#F8FAFC",
    secondary: "#94A3B8",
    accent: "#64748B",
    text: "#F8FAFC",
  },
];

const variants = [
  {
    success: "#22C55E",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#3B82F6",
  },
  {
    success: "#34D399",
    warning: "#FBBF24",
    error: "#FB7185",
    info: "#60A5FA",
  },
  {
    success: "#16A34A",
    warning: "#D97706",
    error: "#DC2626",
    info: "#2563EB",
  },
  {
    success: "#4ADE80",
    warning: "#FACC15",
    error: "#F43F5E",
    info: "#38BDF8",
  },
  {
    success: "#86EFAC",
    warning: "#FDE68A",
    error: "#FDA4AF",
    info: "#93C5FD",
  },
];

export const themes: Theme[] = seeds.flatMap(
  (seed, seedIndex) =>
    seed.names.map((name, nameIndex) => {
      const semantic =
        variants[nameIndex];

      return {
        name,
        description: `${seed.category} inspired professional design system.`,

        background: seed.background,
        surface: seed.surface,

        primary: seed.primary,
        secondary: seed.secondary,
        text: seed.text,
        accent: seed.accent,

        success: semantic.success,
        warning: semantic.warning,
        error: semantic.error,
        info: semantic.info,

        gradient: `linear-gradient(135deg, ${seed.primary}, ${seed.secondary}, ${seed.accent})`,

        typography: {
          ...defaultTypography,
        },

        radius: {
          ...defaultRadius,
          md:
            seedIndex % 2 === 0
              ? 8
              : 10,
          lg:
            seedIndex % 2 === 0
              ? 12
              : 14,
        },

        shadows: {
          ...defaultShadows,
        },

        spacing: {
          ...defaultSpacing,
        },
      };
    }),
);

export default themes;