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
    }
  }
})
