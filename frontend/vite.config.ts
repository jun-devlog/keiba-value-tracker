import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // /api/* → FastAPI (localhost:8000) に転送
      '/api': 'http://localhost:8000',
    },
  },
})
