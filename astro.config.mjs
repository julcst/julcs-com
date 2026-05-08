// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

import favicons from 'astro-favicons';

// https://astro.build/config
export default defineConfig(({ command }) => {
  const integrations = [sitemap()];
  if (command === 'build') {
    integrations.push(favicons());
  }

  return {
    site: 'https://julcs.com',

    output: 'static',
    build: {
      format: 'file'
    },

    integrations,
    vite: {
      optimizeDeps: {
        exclude: ['astro-favicons', 'virtual:astro-favicons']
      }
    }
  };
});