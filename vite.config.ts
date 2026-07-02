import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// IMPORTANT: Change 'persona-portfolio' to your actual GitHub repo name before deploying
const REPO_NAME = 'persona-portfolio'

export default defineConfig({
  base: `/${REPO_NAME}/`,

  plugins: [
    react(),
    tailwindcss(),
  ],

  resolve: {
    alias: {
      '@':            path.resolve(__dirname, './src'),
      '@components':  path.resolve(__dirname, './src/components'),
      '@pages':       path.resolve(__dirname, './src/pages'),
      '@data':        path.resolve(__dirname, './src/data'),
      '@hooks':       path.resolve(__dirname, './src/hooks'),
      '@styles':      path.resolve(__dirname, './src/styles'),
      '@types':       path.resolve(__dirname, './src/types'),
      '@lib':         path.resolve(__dirname, './src/lib'),
    },
  },

  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
