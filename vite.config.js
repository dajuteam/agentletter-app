import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// [https://vitejs.dev/config/](https://vitejs.dev/config/)
export default defineConfig({
  plugins: [react()],
  base: '/agentletter-app/', // 這邊填寫您的儲存庫名稱 (Repository Name)
})