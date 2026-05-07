// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

import favicons from 'astro-favicons';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig(({ command }) => {
  const integrations = [sitemap()];
  if (command === 'build') {
    integrations.push(favicons());
  }

  return {
    site: 'https://julcs.com',

    build: {
      format: 'file'
    },

    integrations,
    adapter: cloudflare(),
    vite: {
      optimizeDeps: {
        exclude: ['astro-favicons', 'virtual:astro-favicons']
      }
    }
  };
});