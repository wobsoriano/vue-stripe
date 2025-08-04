import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['node_modules/@testing-library/jest-dom/vitest'],
  },
  plugins: [vue()],
})
