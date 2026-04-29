import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular"],
        serif: ["var(--font-serif)", "ui-serif", "Georgia"],
      },
      colors: {
        canvas: "#fafbfc",
        surface: "#ffffff",
        border: "#e6e8eb",
        muted: "#6b7280",
        ink: {
          DEFAULT: "#0f1419",
          50: "#f7f8f9",
          100: "#eef0f2",
          200: "#e1e4e8",
          300: "#c8ccd1",
          400: "#9aa0a6",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#0f1419",
        },
        brand: {
          50: "#eef1ff",
          100: "#e0e5ff",
          200: "#c7cfff",
          300: "#a5b0fb",
          400: "#7d88f4",
          500: "#5b63e8",
          600: "#4a4bd6",
          700: "#3e3cb8",
          800: "#333494",
          900: "#2b2d74",
          DEFAULT: "#4a4bd6",
        },
        tool: {
          salesforce: "#00a1e0",
          slack: "#611f69",
          bookit: "#ff6b35",
          "11x": "#111111",
          warmly: "#f59e0b",
          clay: "#dc2626",
          "1mind": "#7c3aed",
          zoominfo: "#0ea5e9",
        },
        decision: {
          go: "#16a34a",
          no_go: "#dc2626",
          wait: "#d97706",
          redirect: "#2563eb",
        },
        status: {
          red: "#dc2626",
          amber: "#d97706",
          green: "#16a34a",
        },
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.6", transform: "scale(1.2)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-in": "fade-in 300ms ease-out both",
        "fade-in-up": "fade-in-up 300ms ease-out both",
        "pulse-dot": "pulse-dot 2s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
