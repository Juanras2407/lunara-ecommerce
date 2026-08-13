import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: "var(--surface)",
        primary: "var(--primary)",
        accent: "var(--accent)",
        "on-primary": "var(--on-primary)",
        navy: "var(--navy)",
        beige: "var(--beige)",
        taupe: "var(--taupe)",
        brown: "var(--brown)",
        muted: "var(--muted)",
        "muted-2": "var(--muted-2)",
      },
    },
  },
  plugins: [],
};
export default config;
