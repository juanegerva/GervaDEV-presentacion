import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import terser from '@rollup/plugin-terser';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': '"production"',
  },
  build: {
    outDir: 'dist', // Directorio de salida para producción
    rollupOptions: {
      external: ['framer-motion', 'react-icons'], // Excluir paquetes del bundle
      plugins: [
        terser({
          format: {
            comments: false,  // Elimina comentarios
          },
          compress: {
            drop_console: true,  // Elimina console.log
            drop_debugger: true,
          },
        }),
      ],
    },
  },
});
