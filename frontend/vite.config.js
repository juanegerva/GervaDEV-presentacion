import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['framer-motion']['react-icons'] // Asegura que framer-motion se trate como dependencia externa
    }
  },
  server: {
    proxy: {
      '/csrf-token': 'http://localhost:5000', // Proxy para obtener el token CSRF
      '/send': 'http://localhost:5000', // Proxy para enviar datos al backend
    },
  },
});
