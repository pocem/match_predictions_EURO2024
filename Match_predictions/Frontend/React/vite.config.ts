import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Output directory for the built files
    rollupOptions: {
      input: {
        main: './src/main.tsx' // Replace with your actual entry file path
      }
    }
  }
});
