import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Recommendations service (must be before /api to take precedence)
      '/api/recommendations': {
        target: 'http://localhost:6611',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/api': {
        target: 'http://localhost:8082',
        changeOrigin: true,
        secure: false,
      },
      '/ws': {
        target: 'http://localhost:8082',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
})
