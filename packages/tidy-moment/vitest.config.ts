import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    exclude: ['**/dist/**', '**/lib/**', '**/esm/**', '**/node_modules/**'],
  },
});
