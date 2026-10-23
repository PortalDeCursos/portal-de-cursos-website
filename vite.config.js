import react from '@vitejs/plugin-react'
import process from 'node:process'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const ambiente = loadEnv(mode, process.cwd(), '')
  return {
    base: process.env.VITE_BASE_PATH || ambiente.VITE_BASE_PATH || '/',
    plugins: [react()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      proxy: {
        '/api/v1/cursos': {
          target: process.env.CURSOS_API_URL || ambiente.CURSOS_API_URL || 'http://127.0.0.1:8081',
          changeOrigin: true,
          rewrite: (caminho) => caminho.replace(/^\/api\/v1/, ''),
        },
        '/api/v1/disciplinas': {
          target: process.env.CURSOS_API_URL || ambiente.CURSOS_API_URL || 'http://127.0.0.1:8081',
          changeOrigin: true,
          rewrite: (caminho) => caminho.replace(/^\/api\/v1/, ''),
        },
        '/api/v1/campus': {
          target: process.env.CURSOS_API_URL || ambiente.CURSOS_API_URL || 'http://127.0.0.1:8081',
          changeOrigin: true,
          rewrite: (caminho) => caminho.replace(/^\/api\/v1/, ''),
        },
        '/api/v1/areas-conhecimento': {
          target: process.env.CURSOS_API_URL || ambiente.CURSOS_API_URL || 'http://127.0.0.1:8081',
          changeOrigin: true,
          rewrite: (caminho) => caminho.replace(/^\/api\/v1/, ''),
        },
        '/api/v1/usuarios': {
          target:
            process.env.USUARIOS_API_URL || ambiente.USUARIOS_API_URL || 'http://127.0.0.1:8080',
          changeOrigin: true,
          rewrite: (caminho) => caminho.replace(/^\/api\/v1\/usuarios/, ''),
        },
      },
    },
  }
})
