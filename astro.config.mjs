import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import cloudflare from '@astrojs/cloudflare';
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind()],
  // support ssr with cloudflare wrangler 
  output: 'server',
  adapter: cloudflare({ mode: "directory" }),
  vite: {
    resolve: {
      alias: {
        "svgo": import.meta.env.PROD ? "svgo/dist/svgo.browser.js" : "svgo"
      }
    }
  },
});