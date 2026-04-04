import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'json', 'json-summary', 'clover', 'html'],
      exclude: [
        'bin/**',
        'dist/**',
        'test/**',
        'vitest.config.ts',
      ],
    },
  },
});
