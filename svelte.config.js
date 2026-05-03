import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: 'index.html',
      precompress: false,
      strict: true,
    }),
    alias: {
      $components: 'src/lib/components',
      $state: 'src/lib/state',
      $types: 'src/lib/types',
      $io: 'src/lib/io',
      $three: 'src/lib/three',
      $utils: 'src/lib/utils',
      $i18n: 'src/lib/i18n',
    },
  },
};

export default config;
