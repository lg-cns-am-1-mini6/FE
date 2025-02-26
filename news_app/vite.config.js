import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // "/api": "https://newjeans.site",
      "/auth": "https://newjeans.site",
      "/user": "https://newjeans.site",
      "/articles": "https://newjeans.site",
      "/image": "https://newjeans.site",
      "/keywords": "https://newjeans.site",

      // "/auth": "http://localhost:8080",
      // "/user": "http://localhost:8080",
      // "/articles": "http://localhost:8080",
      // "/image": "http://localhost:8080",
      // "/keywords": "http://localhost:8080",
      
    }
  }
})
