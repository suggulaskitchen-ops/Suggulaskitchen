import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const securityHeadersPlugin = () => ({
  name: 'security-headers',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      res.setHeader('X-Frame-Options', 'DENY')
      res.setHeader('X-Content-Type-Options', 'nosniff')
      res.setHeader('Content-Security-Policy', "default-src 'self'; connect-src 'self' ws: wss: https://*.supabase.co; img-src 'self' data: blob: https://*.supabase.co https://images.unsplash.com; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;")
      next()
    })
  }
})

export default defineConfig({
  plugins: [react(), securityHeadersPlugin()],
  root: 'client',
  envDir: '../',
  base: '/',
  server: {
    headers: {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': "default-src 'self'; connect-src 'self' ws: wss: https://*.supabase.co; img-src 'self' data: blob: https://*.supabase.co https://images.unsplash.com; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;",
    }
  },
  build: {
    outDir: '../dist'
  }
})