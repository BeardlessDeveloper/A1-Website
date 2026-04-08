import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// When deploying to GitHub Pages under a project repo (e.g. github.com/BeardlessDeveloper/A1-Website),
// set `base` to the repo name. If using a custom domain (e.g. www.a1qualityparalegal.com), remove `base`.
export default defineConfig({
  site: 'https://beardlessdeveloper.github.io',
  base: '/A1-Website',
  output: 'static',
  integrations: [react()],
});
