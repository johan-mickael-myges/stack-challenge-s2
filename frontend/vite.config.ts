import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'https://api.laposte.fr',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('X-Okapi-Key', 'LsyWFj+2oA21v5F/vVVZCpQD91H6ffLfROlO+/eAjuZCFOAyB+8ehoBPOPwtncLl');
          });
        }
      }
    }
  }
})
