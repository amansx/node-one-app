
module.exports = (isDev, conf) => {

	const ImagesRule = {
		test: /\.png|jpeg|jpg$/,
		exclude: /(node_modules|bower_components)/,
		use: {
			loader: 'file-loader',
			query: {
				name: isDev ? '[name].[ext]' : '[name].[hash:10].[ext]',
				// publicPath: 'http://cdn.***.com/',
				outputPath: 'assets/images/',
			}
		}
	};

	const FontsRule = {
		test: /\.ttf$/,
		exclude: /(node_modules|bower_components)/,
		use: {
			loader: 'file-loader',
			query: {
				name: isDev ? '[name].[ext]' : '[name].[hash:10].[ext]',
				// publicPath: 'http://cdn.***.com/',
				outputPath: 'assets/fonts/',
			}
		}
	};	

	return {
		module: {
			rules: [ 
				ImagesRule,
				FontsRule
			]
		}
	};

};	