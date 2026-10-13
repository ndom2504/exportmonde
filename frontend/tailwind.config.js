/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(220 22% 91%)",
        input: "hsl(220 22% 91%)",
        ring: "hsl(214 82% 52%)",
        background: "hsl(0 0% 100%)",
        foreground: "hsl(214 60% 14%)",
        primary: { DEFAULT: "hsl(215 61% 14%)", foreground: "hsl(0 0% 100%)" },
        secondary: { DEFAULT: "hsl(220 14% 96%)", foreground: "hsl(215 61% 14%)" },
        muted: { DEFAULT: "hsl(220 14% 96%)", foreground: "hsl(220 9% 42%)" },
        accent: { DEFAULT: "hsl(214 82% 52%)", foreground: "hsl(0 0% 100%)" },
        destructive: { DEFAULT: "hsl(0 72% 51%)", foreground: "hsl(0 0% 100%)" },
        navy: {
          950: "#040B18",
          900: "#071230",
          800: "#0A1E3C",
          700: "#0F2A52",
          600: "#143A6E",
          500: "#1E4E8C",
        },
        electric: { DEFAULT: "#1E6FEB", bright: "#5EA2FF", dark: "#1254B8" },
        turquoise: { DEFAULT: "#14C0B0", bright: "#3FE0CF" },
        ink: "#0B1B33",
        graphite: "#414B5C",
        steel: "#7A8494",
        paper: "#F6F7F9",
        line: "#E3E8EF",
      },
      fontFamily: {
        display: ['"Fraunces"', "Georgia", "serif"],
        sans: ['"Instrument Sans"', "system-ui", "sans-serif"],
      },
      letterSpacing: { tightest: "-0.03em", widest2: "0.22em" },
      boxShadow: {
        card: "0 1px 2px rgba(10,30,60,.06), 0 12px 40px -12px rgba(10,30,60,.18)",
        lift: "0 2px 4px rgba(10,30,60,.08), 0 24px 60px -16px rgba(10,30,60,.28)",
        inset: "inset 0 1px 0 rgba(255,255,255,.08)",
      },
      keyframes: {
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        pulseGlow: { "0%,100%": { opacity: ".5" }, "50%": { opacity: "1" } },
      },
      animation: {
        marquee: "marquee 46s linear infinite",
        pulseGlow: "pulseGlow 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
