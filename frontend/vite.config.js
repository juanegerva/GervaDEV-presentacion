import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
  'process.env.NODE_ENV': '"development"',
},

  build: {
    outDir: 'dist', // Directorio de salida para producción
    rollupOptions: {
      external: ['framer-motion']['react-icons'] // Asegura que framer-motion se trate como dependencia externa
    }
  },
});
