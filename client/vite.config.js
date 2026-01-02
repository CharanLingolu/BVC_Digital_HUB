import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/", // ✅ required for BrowserRouter on Vercel
  plugins: [react()],
});

// vercel-force-redeploy
