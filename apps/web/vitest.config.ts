import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    exclude: ['**/node_modules/**', '**/e2e/**'],
    coverage: {
      provider: 'v8',
      include: [
        'src/lib/utils.ts',
        'src/lib/storage/local-storage-adapter.ts',
        'src/lib/api/projects.ts',
      ],
      thresholds: {
        'src/lib/utils.ts': { lines: 80, functions: 80, statements: 80 },
        'src/lib/storage/local-storage-adapter.ts': {
          lines: 70,
          functions: 70,
          statements: 70,
        },
      },
    },
  },
})
