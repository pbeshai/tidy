import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    exclude: ['**/dist/**', '**/lib/**', '**/esm/**', '**/node_modules/**'],
  },
});
