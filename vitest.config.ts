import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
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
