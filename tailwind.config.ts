import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-color": "#19A7CE",
      }
    },
  },
  plugins: [],
} satisfies Config;
