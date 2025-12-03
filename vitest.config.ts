// srgmau2030/kaxanly/kaxanly-3d0b60dde7eca3b157237542fd22b47666ed06ec/vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path'; // <-- Importar path

export default defineConfig({
  plugins: [react()],
  // 1. Añadir la configuración de alias para que Vitest resuelva '@/...'
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/setup.ts',
        '**/*.d.ts',
        '**/*.config.*',
        '**/index.ts',
        '**/types.ts'
      ]
    }
  },
});
