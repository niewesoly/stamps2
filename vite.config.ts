/// <reference types="vitest" />
import { defineConfig } from 'vite'
import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    reactRouter(),
    tailwindcss(),
  ],
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable sourcemaps for production
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
