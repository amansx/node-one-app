/*
* TSTART_fileMsg_TEND
*/

const _       = require('lodash');
const path    = require('path');
const webpack = require('webpack');

const timefix = 11000;
function MultiCompileFix() {};
MultiCompileFix.prototype.apply = function(compiler) {
	compiler.plugin('watch-run', (watching, callback) => {
		watching.startTime += timefix;
		callback()
	});
	compiler.plugin('done', (stats) => {
		stats.startTime -= timefix
	})
};

module.exports = (isDev, conf) => {

	const hashLength = conf.hashLength || 10;

	const plugins = {

		uglifyJs: new webpack.optimize.UglifyJsPlugin({
			comments   : false,
			beautify   : false,
			compress   : { screw_ie8: true },
			mangle     : { screw_ie8: true, keep_fnames: true },
		}),

		loaderOptions: new webpack.LoaderOptionsPlugin({
			minimize   : true,
			debug      : false
		}),

		dll: new webpack.DllReferencePlugin({ 
			context: conf.rootPath,
			manifest: path.resolve(conf.distPath, 'vendor.bundle.json')
		}),

		multiCompileFix: new MultiCompileFix()

	};
	
	const baseConfig = {
		entry : path.resolve(conf.srcPath, "app/app.tsx"),
		output: {
			path                : path.resolve(conf.distPath),
			filename            : isDev ? 'app.[name].js' : `app.[name].[id].[chunkhash:${hashLength}].js`,
			sourceMapFilename   : "sourcemaps/[file].map",
		},
		// devtool      : isDev ? "eval-source-map" : false,
		profile      : true,
		cache        : true,
		watch        : isDev ? true : false,
		stats: {
			maxModules   : 0,
			assets       : true,
			cached       : true,
			colors       : true,
			cachedAssets : true,
			version      : !isDev,
			hash         : !isDev,
			warnings     : !isDev
		},
		performance: {
			hints             : "warning",
			maxAssetSize      : 2000000,
			maxEntrypointSize : 2000000,
			assetFilter       : function(assetFilename) { 
				return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
			}
		},	
		resolve : {
			unsafeCache : true,
			modules     : [ "node_modules", conf.srcPath ],
			extensions  : [ '.ts', '.tsx', '.js', '.jsx', '.styl' ]
		},
		plugins : isDev ? [
			plugins.dll,
			plugins.multiCompileFix			
		] : [
			plugins.uglifyJs,
			plugins.loaderOptions,
		] 
	};

	return baseConfig;

};