import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_ANAM_API_KEY': JSON.stringify(env.ANAM_API_KEY || env.VITE_ANAM_API_KEY || ''),
      'import.meta.env.VITE_ANAM_PERSONA_ID': JSON.stringify(env.ANAM_PERSONA_ID || env.VITE_ANAM_PERSONA_ID || ''),
    },
    server: {
      port: 5173,
      host: true, // Allows access via mobile on local network
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
