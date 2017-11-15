/*
* TSTART_fileMsg_TEND
*/

const webpack = require('webpack');
const path    = require('path');

module.exports = (isDev, config) => {

	const CONFIG = {
		name: "vendorDLL",
		context: config.rootPath,
		entry: {
			vendorDLL:[
				'react', 
				'react-dom',
				'lodash',
				'redux',
				'cytoscape',
				'jquery',
				'babel-polyfill'
			],
		},

		output: {
			filename: 'vendor.bundle.js',
			path: config.distPath,
			library: '[name]',
		},

		profile : true,
		cache   : true,

		plugins: [
			new webpack.DllPlugin({ 
				name: '[name]', 
				path: path.resolve(config.distPath, 'vendor.bundle.json') 
			})
		]
	}

	return CONFIG;

};