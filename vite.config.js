import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/guty2906.github.io/', // 👈 CAMBIA ESTO por el nombre exacto de tu repositorio
})