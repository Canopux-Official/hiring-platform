import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: import.meta.env.VITE_API_URL, // use the env variable here
        changeOrigin: true,
        secure: true, // false only if dev has self-signed SSL
      },
    },
  },
});