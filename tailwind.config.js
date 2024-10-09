/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        ijoTebu: "#51cc51",
        ijoWasis: "#37696C",
        ijoDash: "#69B5B9",
        ijoIsiTabel: "#CCDFBA",
        ijoKepalaTabel: "#86AE61",
      },
    },
  },
  plugins: [],
};
