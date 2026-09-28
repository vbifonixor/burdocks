import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    reactRouter(),
    VitePWA({
      devOptions: {
        enabled: true,
        type: "module",
      },
      registerType: "autoUpdate",
      workbox: {
        globPatterns: [],
        navigateFallback: null,
        runtimeCaching: [
          {
            handler: "NetworkFirst",
            options: {
              cacheName: "burdocks-static-v1",
            },
            urlPattern: /\/(assets\/|icons\/|favicon\.png$)/,
          },
        ],
      },
      manifest: {
        background_color: "#ffffff",
        display: "standalone",
        icons: [
          {
            sizes: "192x192",
            src: "/pwa-192x192.png",
            type: "image/png",
          },
          {
            sizes: "512x512",
            src: "/pwa-512x512.png",
            type: "image/png",
          },
          {
            purpose: "maskable",
            sizes: "512x512",
            src: "/maskable-icon-512x512.png",
            type: "image/png",
          },
        ],
        name: "Burdocks",
        short_name: "Burdocks",
        start_url: "/",
        theme_color: "#ffffff",
      },
    }),
  ],
});
