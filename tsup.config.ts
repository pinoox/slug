import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: {
      index: 'src/index.ts',
      'vue/index': 'src/vue/index.ts',
      'react/index': 'src/react/index.ts',
      'svelte/index': 'src/svelte/index.ts',
    },
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    clean: true,
    splitting: false,
    treeshake: true,
    external: ['vue', 'react', 'svelte', 'svelte/store'],
  },
  {
    entry: { 'pinoox-slug': 'src/index.ts' },
    format: ['iife'],
    globalName: 'PinooxSlug',
    dts: false,
    sourcemap: true,
    clean: false,
    minify: true,
    outExtension: () => ({ js: '.global.js' }),
  },
]);
