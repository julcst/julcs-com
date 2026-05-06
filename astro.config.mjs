// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

import favicons from 'astro-favicons';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://julcs.com',

  build: {
    format: 'file'
  },

  integrations: [sitemap(), favicons()],
  adapter: cloudflare()
});