import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/unit/**/*.test.ts'],
    // A stray `.only` silences every other test in its file. Vitest defaults
    // this to `!process.env.CI`, so locally it narrows the run without a word —
    // you push green having actually run one test. Off everywhere: `.only` is
    // an error, never a mute. Guards the consent seal among the rest
    // (tests/unit/consent-seal-guard.test.ts).
    allowOnly: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/i18n/**', 'netlify/functions/**'],
    },
  },
});
