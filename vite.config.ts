
import { sveltekit } from '@sveltejs/kit/vite';
import adapter from 'amplify-adapter';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    sveltekit({
      adapter: adapter()
    })
  ]
});

