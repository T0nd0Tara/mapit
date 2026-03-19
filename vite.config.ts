import { defineConfig } from 'vite'
import path from 'node:path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    viteStaticCopy({
      targets: [
        { src: 'nwjs-package.json', dest: '.', rename: 'package.json' }
      ]
    }),
  ],
  base: './',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks: {
          // "utils": ['is-what', 'lodash', 'json5'],
          // "radix": ['@radix-ui', 'clsx', 'class-variance-authority']
        }
      }
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler' // or "modern"
      }
    }
  },
  optimizeDeps: {
    // Prevent esbuild pre-bundling from injecting polyfills
    exclude: ['fs', 'fs/promises', 'path', 'os', 'crypto', 'stream', 'util'],
  },
})
