import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // BrewIQ Brand Kit Colors
        amber: {
          DEFAULT: "#9A6200",
          50: "#FFF8ED",
          100: "#F5E6C8",
          200: "#E8C896",
          300: "#DBAA64",
          400: "#9A6200",
          500: "#B8760D",
          600: "#9C630B",
          700: "#805009",
          800: "#643D07",
          900: "#482A05",
        },
        signal: {
          DEFAULT: "#00D4AA",
          light: "#33DDBB",
          dark: "#00A888",
        },
        copper: {
          DEFAULT: "#9C630B",
          light: "#B8760D",
          dark: "#805009",
        },
        wheat: {
          DEFAULT: "#F5E6C8",
          light: "#FFF8ED",
          dark: "#E8C896",
        },
        stout: {
          DEFAULT: "#1A1208",
          50: "#F5E6C8",
          100: "#E8D4B0",
          200: "#D6B888",
          300: "#A89060",
          400: "#7A6838",
          500: "#4C4010",
          600: "#3E350D",
          700: "#2C1E0F",
          800: "#1A1208",
          900: "#0D0904",
        },
        porter: {
          DEFAULT: "#2C1E0F",
          light: "#3E350D",
          dark: "#1A1208",
        },
        foam: {
          DEFAULT: "#FFF8ED",
          dark: "#F5E6C8",
        },
        // Tier colors for IQ scores
        tier: {
          bronze: "#CD7F32",
          silver: "#C0C0C0",
          gold: "#FFD700",
          platinum: "#E5E4E2",
          diamond: "#B9F2FF",
        },
        // Semantic colors
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#9A6200",
          foreground: "#1A1208",
        },
        secondary: {
          DEFAULT: "#00D4AA",
          foreground: "#1A1208",
        },
        muted: {
          DEFAULT: "#F5E6C8",
          foreground: "#7A6838",
        },
        accent: {
          DEFAULT: "#FFF8ED",
          foreground: "#9C630B",
        },
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#FFFFFF",
        },
        border: "#E8C896",
        input: "#E8C896",
        ring: "#9A6200",
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#1A1208",
        },
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        display: ["Georgia", "serif"],
        editorial: ["Georgia", "serif"],
        ui: ["var(--font-sora)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        beer: "0 4px 14px 0 rgba(154, 98, 0, 0.15)",
        signal: "0 4px 14px 0 rgba(0, 212, 170, 0.20)",
        card: "0 2px 8px 0 rgba(26, 18, 8, 0.08)",
        "card-hover": "0 8px 24px 0 rgba(26, 18, 8, 0.12)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
        "spin-slow": "spin 3s linear infinite",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-beer":
          "linear-gradient(135deg, #9A6200 0%, #B8760D 50%, #9C630B 100%)",
        "gradient-signal":
          "linear-gradient(135deg, #00D4AA 0%, #00A888 100%)",
        shimmer:
          "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
      },
    },
  },
  plugins: [],
};

export default config;
