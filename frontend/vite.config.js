import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuración de Vite
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://mi-backend-u1pz.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
