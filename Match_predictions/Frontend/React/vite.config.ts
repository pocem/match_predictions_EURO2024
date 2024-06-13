import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: '.',  // Ensure this points to the directory containing index.html
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: 'index.html'  // Ensure this is correct
    }
  }
})
