import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        // Rolldown in Vite 8 requires manualChunks to be a function
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // Massive 3D Engine (Only loads when needed)
            if (id.includes("three") || id.includes("@react-three")) {
              return "three";
            }
            // Massive Text Editor (Only loads for BlogWriter)
            if (id.includes("@tiptap") || id.includes("prosemirror")) {
              return "editor";
            }
            // Heavy Animation Library
            if (id.includes("framer-motion")) {
              return "framer";
            }
            // Core React dependencies
            if (
              id.includes("react") ||
              id.includes("react-dom") ||
              id.includes("react-router-dom")
            ) {
              return "vendor";
            }
          }
        },
      },
    },
  },
});