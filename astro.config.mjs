import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://www.a1paralegal.com',
  output: 'static',
  integrations: [react()],
});
