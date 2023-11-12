module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,svelte,ts,tsx,vue}'],
	theme: {
		extend: {},
		fontFamily: {
			sans: ['"BL Melody"', 'ui-sans-serif','system-ui'],
		}
	},
	plugins: [
		require('@tailwindcss/forms'),
	],
};
