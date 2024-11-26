import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: "http://localhost:5000", // Your backend server
        changeOrigin: true,             // Ensures the host header matches the target
        secure: false,                  // Allows HTTP requests
        rewrite: (path) => path.replace(/^\/api/, ""), // Strips "/api" if your backend doesn't use it
      },
    },
  },
  plugins: [react()],
});
