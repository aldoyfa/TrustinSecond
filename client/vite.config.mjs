import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

const FRONTEND_PORT = process.env.FRONTEND_PORT || 15152;
const BACKEND_PORT = process.env.BACKEND_PORT || 15151;

export default defineConfig({
  plugins: [react()],
  server: {
    port: parseInt(FRONTEND_PORT),
    proxy: {
      '/api': `http://localhost:${BACKEND_PORT}`,
      '/uploads': `http://localhost:${BACKEND_PORT}`
    }
  }
});
