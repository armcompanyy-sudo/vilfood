import type { Config } from "tailwindcss";

/**
 * Vilfood design tokens — "Sunlight, sealed."
 * Warm Armenian-harvest palette: apricot + pomegranate + orchard green on cream.
 * Spacing follows an 8px rhythm (Tailwind's default 4px scale × 2).
 */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Backgrounds
        cream: {
          DEFAULT: "#F4EDE1", // bone / paper
          deep: "#EFE5D4", // slightly warmer panel
          dim: "#E8DAC4",
        },
        ink: {
          DEFAULT: "#231C16", // warm near-black text
          soft: "#3A2F26",
          mute: "#6F6155",
        },
        // Accents
        apricot: {
          DEFAULT: "#E8A14B", // primary warm accent
          light: "#F2BE78",
          deep: "#D2842B",
          glow: "#FFD9A0",
        },
        pomegranate: {
          DEFAULT: "#8E2434", // rich accent / CTA
          light: "#B5384A",
          deep: "#6E1726",
        },
        orchard: {
          DEFAULT: "#3F5E3A", // secondary green
          light: "#5E7E54",
          deep: "#2C4429",
        },
      },
      fontFamily: {
        display: ["var(--font-display)"],
        sans: ["var(--font-sans)"],
      },
      fontSize: {
        // fluid display steps (clamp handled inline where needed)
        "display-sm": ["clamp(2.1rem, 5.5vw, 3.6rem)", { lineHeight: "1.06", letterSpacing: "-0.02em" }],
        "display-md": ["clamp(2.3rem, 6.5vw, 5rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(3.4rem, 11vw, 9rem)", { lineHeight: "0.9", letterSpacing: "-0.03em" }],
      },
      letterSpacing: {
        label: "0.28em",
      },
      borderRadius: {
        jar: "1.4rem",
      },
      boxShadow: {
        warm: "0 22px 60px -28px rgba(110, 64, 20, 0.45)",
        "warm-lg": "0 40px 120px -40px rgba(110, 64, 20, 0.55)",
        lift: "0 30px 80px -30px rgba(35, 28, 22, 0.35)",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        "sun-drift": {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "grain-shift": {
          "0%,100%": { transform: "translate(0,0)" },
          "10%": { transform: "translate(-3%,-4%)" },
          "30%": { transform: "translate(2%,-2%)" },
          "50%": { transform: "translate(-2%,3%)" },
          "70%": { transform: "translate(3%,1%)" },
          "90%": { transform: "translate(-1%,2%)" },
        },
      },
      animation: {
        "sun-drift": "sun-drift 6s ease-in-out infinite",
        "grain-shift": "grain-shift 1.2s steps(3) infinite",
        "fade-up": "fade-up 0.5s cubic-bezier(0.16,1,0.3,1) both",
      },
    },
  },
  plugins: [],
} satisfies Config;
