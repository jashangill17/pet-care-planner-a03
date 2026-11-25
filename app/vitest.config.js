// vitest.config.js
import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    include: ['__tests__/components/**/*.test.{js,jsx,ts,tsx}'],
    exclude: ['__tests__/e2e/**'],
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
    },
  },
});
