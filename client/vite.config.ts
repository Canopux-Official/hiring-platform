import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import path from "path";

export default defineConfig({
  plugins: [react()],
  // resolve: {
  //   alias: { "@": path.resolve(__dirname, "./src") },
  // },
  server: {
    proxy: {
      // This tells Vite to intercept any request starting with /api
      '/api': {
        target: 'https://hiring-platform-c8w3.vercel.app',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});