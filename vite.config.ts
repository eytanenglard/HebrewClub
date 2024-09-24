import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://hebrewclubbackend-c462b6460a67.herokuapp.com', // שונה: עודכן ל-URL של השרת ב-Heroku
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/auth': {
        target: 'https://hebrewclubbackend-c462b6460a67.herokuapp.com', // שונה: עודכן ל-URL של השרת ב-Heroku
        changeOrigin: true,
      }
    }
  }
})