import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    allowedHosts: ['backend-production-a427.up.railway.app'],
    cors: true // This enables CORS with default options
  }
});
