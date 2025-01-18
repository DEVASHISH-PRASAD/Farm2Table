import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 4000,  // Set the port to 4000 for local development
  },
  build: {
    // Adjust the chunk size warning limit (default is 500 kB)
    chunkSizeWarningLimit: 1000, // Increases the limit to 1000 kB (1 MB)
    
    rollupOptions: {
      output: {
        // Custom chunk splitting strategy
        manualChunks(id) {
          if (id.includes('node_modules/react')) {
            return 'react'; // Create a chunk for React
          }
          if (id.includes('node_modules/some-large-library')) {
            return 'large-lib'; // Create a chunk for a large library
          }
        },
      },
    },
  },
});
