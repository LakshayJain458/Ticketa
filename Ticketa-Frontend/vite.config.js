import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    proxy: {
      "/events": "http://localhost:8080",
      "/tickets": "http://localhost:8080",
      "/ticket-validations": "http://localhost:8080",
      "/published-events": "http://localhost:8080",
    },
  },
});
