import { criarProxyApi } from './configuracao/proxy-api.js'
import react from '@vitejs/plugin-react'
import process from 'node:process'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const ambiente = loadEnv(mode, process.cwd(), '')

  return {
    base: process.env.VITE_BASE_PATH || ambiente.VITE_BASE_PATH || '/',
    plugins: [react()],
    optimizeDeps: {
      include: [
        '@tiptap/react',
        '@tiptap/starter-kit',
        '@tiptap/extension-placeholder',
        'tiptap-markdown',
      ],
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      proxy: criarProxyApi({ ...ambiente, ...process.env }),
    },
  }
})
