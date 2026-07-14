import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  base: `/${process.env.VITE_REPO_NAME ?? "portfolio-pages"}/`,
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  server: { host: "::", port: 8080, strictPort: true },
  preview: { host: "::", port: 8080, strictPort: true },
});
