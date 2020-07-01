const { request } = require('express');

const webpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');

const config = {
	mode: 'production',
	entry: {
		index: './public/js/index.js'
	},
	output: {
		path: `${__dirname}/public/dist`,
		filename: '[name].bundle.js'
	},
	plugins: [
		new webpackPwaManifest({
			fingerprints: false,
			inject: false,
			name: 'Budget Tracker',
			short_name: 'Budget Tracker',
			description: 'A budget tracking application',
			background_color: '#ffffff',
			theme_color: '#ffffff',
			start_url: '/',
			icons: [
				{
					src: path.resolve(
						'public/assets/icons/icon-192x169.png'
					),
					sizes: [144, 192, 512]
				}
			]
		})
	]
};

module.exports = config;
