/** @type {import('tailwindcss').Config} */

// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/daisyui/dist/**/*.js",
  ],

  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark"], // you can add more themes here
  },
};
