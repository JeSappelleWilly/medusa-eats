import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    allowedHosts: true,
    cors: true // This enables CORS with default options
  }
});
