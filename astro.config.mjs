import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
	integrations: [tailwind()],
	// support ssr with cloudflare wrangler 
	output: 'server',
	adapter: cloudflare()
});
