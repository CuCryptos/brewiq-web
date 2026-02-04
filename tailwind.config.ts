import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary beer-inspired colors
        amber: {
          DEFAULT: "#F59E0B",
          50: "#FEF3C7",
          100: "#FDE68A",
          200: "#FCD34D",
          300: "#FBBF24",
          400: "#F59E0B",
          500: "#D97706",
          600: "#B45309",
          700: "#92400E",
          800: "#78350F",
          900: "#451A03",
        },
        copper: {
          DEFAULT: "#B45309",
          light: "#D97706",
          dark: "#92400E",
        },
        cream: {
          DEFAULT: "#FFFBEB",
          50: "#FFFEF5",
          100: "#FFFBEB",
          200: "#FEF3C7",
        },
        stout: {
          DEFAULT: "#1C1917",
          50: "#F5F5F4",
          100: "#E7E5E4",
          200: "#D6D3D1",
          300: "#A8A29E",
          400: "#78716C",
          500: "#57534E",
          600: "#44403C",
          700: "#292524",
          800: "#1C1917",
          900: "#0C0A09",
        },
        foam: {
          DEFAULT: "#FAFAF9",
          dark: "#F5F5F4",
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
          DEFAULT: "#F59E0B",
          foreground: "#1C1917",
        },
        secondary: {
          DEFAULT: "#B45309",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#F5F5F4",
          foreground: "#78716C",
        },
        accent: {
          DEFAULT: "#FEF3C7",
          foreground: "#92400E",
        },
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#FFFFFF",
        },
        border: "#E7E5E4",
        input: "#E7E5E4",
        ring: "#F59E0B",
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#1C1917",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        beer: "0 4px 14px 0 rgba(245, 158, 11, 0.15)",
        card: "0 2px 8px 0 rgba(0, 0, 0, 0.08)",
        "card-hover": "0 8px 24px 0 rgba(0, 0, 0, 0.12)",
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
          "linear-gradient(135deg, #F59E0B 0%, #D97706 50%, #B45309 100%)",
        shimmer:
          "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
      },
    },
  },
  plugins: [],
};

export default config;
