import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          about: path.resolve(__dirname, 'about.html'),
          formations: path.resolve(__dirname, 'formations.html'),
          ccna1: path.resolve(__dirname, 'ccna1.html'),
          ccna2: path.resolve(__dirname, 'ccna2.html'),
          ccna3: path.resolve(__dirname, 'ccna3.html'),
          linux: path.resolve(__dirname, 'linux.html'),
          python1: path.resolve(__dirname, 'python1.html'),
          python2: path.resolve(__dirname, 'python2.html'),
          inscription: path.resolve(__dirname, 'inscription.html'),
          landing_ccna1: path.resolve(__dirname, 'landing-ccna1.html'),
          contact: path.resolve(__dirname, 'contact.html'),
        },
      },
    },
  };
});
