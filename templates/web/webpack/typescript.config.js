/*
* TSTART_fileMsg_TEND
*/

const path = require('path');
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = (isDev, conf) => {

	const TypescriptRule = {
		test: /\.ts(x?)$/,
		exclude: /node_modules/,
		use: [
			{
				loader: 'babel-loader',
				options: {
					presets: [[
						'env', {
							modules: false, 
							"targets": {
								"browsers": ["IE 11"]
							}
						}
					]],
					plugins: ["syntax-dynamic-import"],
					cacheDirectory: conf.cachePath
				}
			},
			{
				loader: 'ts-loader',
				options: {
					// transpileOnly: true,
					// compilerOptions: {"sourceMap": isDev}
				}
			}
		]
	};

	return {
		module: {
			rules: [ TypescriptRule ],
		}
		// plugins: []
		// plugins: [new ForkTsCheckerWebpackPlugin({workers: ForkTsCheckerWebpackPlugin.ALL_CPUS})]
	};

};