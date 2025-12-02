import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*',
      '**/e2e/**' // Exclude Playwright E2E tests
    ],
    
    // REGULA 16: >80% TEST COVERAGE - Enterprise gate
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/**',
        'dist/**',
        '**/*.config.*',
        '**/*.d.ts',
        'e2e/**',
        'tests/**',
        '**/{test,tests,__tests__,__mocks__}/**',
        '**/*.{test,spec}.{js,ts,jsx,tsx}'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    }
  },
  resolve: {
    alias: {
      '@features': path.resolve(__dirname, './apps/admin/features'),
      '@entities': path.resolve(__dirname, './apps/admin/entities'),
      '@admin-shared': path.resolve(__dirname, './apps/admin/shared'),
      '@': path.resolve(__dirname, './'),
      '@vantage-lane/ui-core': path.resolve(__dirname, './packages/ui-core/src'),
      '@vantage-lane/ui-icons': path.resolve(__dirname, './packages/ui-icons/src'),
      '@vantage-lane/ui-dashboard': path.resolve(__dirname, './packages/ui-dashboard/src'),
    },
  },
});
