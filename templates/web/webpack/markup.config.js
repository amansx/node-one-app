const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
// const HtmlWebpackExcludeAssetsPlugin = require('html-webpack-exclude-assets-plugin');

module.exports = (isDev, config) => {

	const MarkupRule = {
		test: /\.html|htm$/,
		exclude: /(node_modules|bower_components)/,
		use: [
			// { loader: "file-loader", options: { name: "[name].[ext]" }, },
			// { loader: "extract-loader" },
			{
				loader: 'html-loader',
				options: { 
					attrs: ["img:src"],
					root: config.srcPath 
				},
			}
		]
	};

	return {
		module: {
			rules: [ 
				MarkupRule
			],
		},
		plugins : [
			new HtmlWebpackIncludeAssetsPlugin({ 
				assets: ['vendor.bundle.js'],
				append: false
			}),
			new HtmlWebpackPlugin({
				xhtml         : true,
				inject        : 'body',
				title         : 'My App',
				filename      : 'index.htm',
				excludeAssets : [/Styles.*.js/],
				template      : path.join( config.srcPath, 'templates/entry.ejs' )
			})
		]
	};

};