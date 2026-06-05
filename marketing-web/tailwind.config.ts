import type { Config } from "tailwindcss";
export default { content: ["./src/**/*.{ts,tsx}"], theme: { extend: { colors: { brand: { DEFAULT: "#0a2540", accent: "#FFCC00" } } } }, plugins: [] } satisfies Config;
