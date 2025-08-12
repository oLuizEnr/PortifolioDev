import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          50: "hsl(214.3 100% 96.9%)",
          100: "hsl(213.8 100% 93.1%)",
          500: "hsl(214.12 88.24% 60%)",
          600: "hsl(214.7 83.2% 52.9%)",
          700: "hsl(215.4 91.2% 45.3%)",
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
        // Professional developer color palette
        slate: {
          50: "hsl(210 40% 98%)",
          100: "hsl(210 40% 96%)",
          200: "hsl(214 32% 91%)",
          300: "hsl(213 27% 84%)",
          400: "hsl(215 20% 65%)",
          500: "hsl(215 16% 47%)",
          600: "hsl(215 19% 35%)",
          700: "hsl(215 25% 27%)",
          800: "hsl(217 33% 17%)",
          900: "hsl(222 84% 5%)",
        },
        // Additional professional colors
        emerald: {
          50: "hsl(151.8 81% 95.9%)",
          600: "hsl(158.1 64.4% 51.6%)",
        },
        amber: {
          50: "hsl(48 100% 96.1%)",
          100: "hsl(48 96.5% 88.8%)",
          600: "hsl(32.1 94.6% 43.7%)",
          800: "hsl(31.8 81% 28.8%)",
        },
        purple: {
          50: "hsl(270 100% 98%)",
          600: "hsl(271.5 81.3% 55.9%)",
        },
        yellow: {
          50: "hsl(48 100% 96.1%)",
          200: "hsl(48 96.5% 88.8%)",
          500: "hsl(45.4 93.4% 47.5%)",
          600: "hsl(45.4 93.4% 47.5%)",
          700: "hsl(40.6 96.1% 40.4%)",
          800: "hsl(39.3 85.2% 32.5%)",
        },
        blue: {
          500: "hsl(217.2 91.2% 59.8%)",
          600: "hsl(221.2 83.2% 53.3%)",
        },
        green: {
          500: "hsl(142.1 76.2% 36.3%)",
        },
        red: {
          500: "hsl(0 84.2% 60.2%)",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Georgia", "serif"],
        mono: ["'Fira Code'", "monospace"],
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
