// tailwind.config.js
import daisyui from 'daisyui';

export const content = [
  "./src/**/*.{js,jsx,ts,tsx}",
  "./node_modules/daisyui/dist/**/*.js",
];

export const theme = {
  extend: {},
};

export const plugins = [daisyui];

export const daisyui = {
  themes: ["light", "dark"], // you can add more themes here
};
