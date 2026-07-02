import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Minimal typing for the one env var we read (avoids pulling in @types/node).
declare const process: { env: Record<string, string | undefined> };

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: Number(process.env.PORT) || 5173,
  },
  build: {
    target: "es2020",
    rollupOptions: {
      output: {
        manualChunks: {
          motion: ["gsap", "lenis"],
        },
      },
    },
  },
});
