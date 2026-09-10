import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: 'client',
  envDir: '../',
  base: '/',
  build: {
    outDir: '../dist'
  }
})