import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: '/Match_predictions/Frontend/React/index.html'  // Make sure the path is correct relative to your project root
    }
  }
});