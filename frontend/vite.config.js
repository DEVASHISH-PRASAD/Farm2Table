import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base:"/Farm2Table/",
  plugins: [react()],
  server: {
    port: 10000,
    host: true,
  },
});
