import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#050511",
        panel: "rgba(255,255,255,0.07)",
        violet: "#8b5cf6",
        cyan: "#22d3ee"
      },
      boxShadow: {
        glow: "0 0 50px rgba(139, 92, 246, 0.28)"
      }
    }
  },
  plugins: []
};

export default config;
