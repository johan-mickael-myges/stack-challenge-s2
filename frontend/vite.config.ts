import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
    proxy: {
      '/laposte': {
        target: 'https://api.laposte.fr',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/laposte/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('X-Okapi-Key', 'LsyWFj+2oA21v5F/vVVZCpQD91H6ffLfROlO+/eAjuZCFOAyB+8ehoBPOPwtncLl');
          });
        }
      }
    }
  }
})
