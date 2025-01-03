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
});
