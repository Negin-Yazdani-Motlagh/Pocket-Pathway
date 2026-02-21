import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fef7ee",
          100: "#fdedd6",
          200: "#f9d7ac",
          300: "#f4ba77",
          400: "#ee9240",
          500: "#ea751a",
          600: "#db5b10",
          700: "#b54410",
          800: "#903615",
          900: "#742f14",
          950: "#3f1508",
        },
        slate: {
          850: "#172033",
          950: "#0a0f1a",
        },
      },
      fontFamily: {
        sans: ["var(--font-outfit)", "system-ui", "sans-serif"],
        display: ["var(--font-clash)", "var(--font-outfit)", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-mesh": "linear-gradient(135deg, var(--tw-gradient-from) 0%, transparent 50%), linear-gradient(225deg, var(--tw-gradient-to) 0%, transparent 50%)",
      },
    },
  },
  plugins: [],
} satisfies Config;
