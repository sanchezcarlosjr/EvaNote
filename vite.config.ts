import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
      react(),
    VitePWA({
        registerType: 'prompt',
        workbox: {
            globPatterns: ['**/*.{js,css,html,ico,png,svg,wasm}']
        }
    })
  ],
    resolve: {
        alias: {
            app: "/src",
        },
    },
});