import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    VitePWA({
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.ts",
      registerType: "autoUpdate",
      injectRegister: false,
      includeAssets: ["favicon.ico", "pwa-icon-192.png", "pwa-icon-512.png"],
      injectManifest: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webp,woff2}"],
      },
      devOptions: {
        enabled: false,
        type: "module",
      },
      manifest: {
        name: "הימורים ביציע",
        short_name: "הימורים ביציע",
        description: "פלטפורמת הימורים בין חברים על משחקי כדורגל",
        theme_color: "#0f1419",
        background_color: "#0f1419",
        display: "standalone",
        dir: "rtl",
        lang: "he",
        start_url: "/",
        icons: [
          { src: "pwa-icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "pwa-icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "pwa-icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
