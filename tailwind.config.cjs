module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				"fx-blue-dark": "#213B54",
				"fx-blue-light": "#12B5EA",
				"fx-orange": "#EC7104",
				"fx-gray-light": "#F7FAFE",
			},
			backgroundColor: {
				"fx-gray-light": "#F7FAFE",
			},
			borderColor: {
				"fx-gray-light": "#F7FAFE",
			},
			ring: {
				"fx-blue-light": "#12B5EA",
			},
		},
		fontFamily: {
			sans: ['"BL Melody"', 'ui-sans-serif','system-ui'],
		},
	},
	plugins: [
		require('@tailwindcss/forms'),
	],
};
