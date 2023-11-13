import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import cloudflare from '@astrojs/cloudflare';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind()],
  // support ssr with cloudflare wrangler 
  output: 'server',
  adapter: cloudflare(),
  vite: {
    plugins: [nodePolyfills()]
  }
});