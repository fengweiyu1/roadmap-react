import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 把本地 /api 开头的请求转发到你线上站点
      '/api': {
        target: 'https://xiaowantree.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})