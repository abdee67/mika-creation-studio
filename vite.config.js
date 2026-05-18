import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from "vite-plugin-compression";

// https://vite.dev/config/
export default defineConfig({
  base: '/mika-creation-studio/',
  plugins: [
    react(),
    viteCompression({ algorithm: "gzip" }),
    viteCompression({ algorithm: "brotliCompress" }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          "gsap-vendor": ["gsap", "@gsap/react"],
        },
      },
    },
  },
})
