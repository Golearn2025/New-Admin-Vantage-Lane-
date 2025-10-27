import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  target: 'es2017',
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: ['react', 'react-dom', 'recharts'],
  // Don't bundle CSS - let Next.js handle CSS modules
  injectStyle: false,
  esbuildOptions(options) {
    options.loader = {
      ...options.loader,
      '.css': 'empty',
    };
  },
});
