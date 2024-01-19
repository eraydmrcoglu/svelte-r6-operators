/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			backgroundImage: {
				'card-background': 'linear-gradient(to top, #131619 0%, #131619 75%, transparent 100%)'
			},
			colors: {
				attack: '#0078D1',
				defense: '#DD5701',
				danger: '#DE1738',
				light: '#F2F2F2',
				dark: '#131619',
				'gray-bege': '#8C8581',
				'light-gray': '#A5A7AA',
				'blue-gray': '#1F242A',
				'dark-gray': '#16191D'
			},
			boxShadow: {
				glow: '0 0 10px 0 #F2F2F2'
			},
			animation: {
				'reverse-spin': 'reverse-spin 1s linear infinite'
			},
			screens: {
				xl: '1440px'
			}
		},
		fontFamily: {
			inter: ['Inter', 'sans-serif']
		}
	},
	plugins: []
};
