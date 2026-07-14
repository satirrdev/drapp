import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: process.env.VERCEL ? '/' : '/drapp/',
  build: {
    outDir: process.env.VERCEL ? 'dist' : 'docs',
  },
})
