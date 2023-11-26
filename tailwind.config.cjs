module.exports = {
	darkMode: 'class',
	content: ['./src/**/*.{astro,html,js,jsx,md,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				"fx-blue-dark": "#213B54",
				"fx-blue-light": "#12B5EA",
				"fx-blue-fade": "#BBF3FD",
				"fx-orange": "#EC7104",
				"fx-gray-light": "#F7FAFE",
			},
			backgroundColor: {
				"fx-gray-light": "#F7FAFE",
				"fx-chart-one": '#219653',
				"fx-chart-two": '#F2994A',
				"fx-chart-three": '#EB5757',
				"dark-fx-blue": "#0D1822",
				"dark-fx-blue-light": "#142332",
			},
			borderColor: {
				"fx-gray-light": "#F7FAFE",
				"dark-fx-blue-light": "#142332",
				
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
