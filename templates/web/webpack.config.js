/*
* TSTART_fileMsg_TEND
*/

const _       = require('lodash');
const glob    = require('glob');
const path    = require('path');
const rimraf  = require('rimraf');

const BuildConfig = {
	rootPath:   process.cwd(),
	srcPath:    path.resolve(process.cwd(), 'src'),
	distPath:   path.resolve(process.cwd(), 'dist'),
	cachePath:  path.resolve(process.cwd(), '.cache')
};

const deepMerge = (conf, confb) => {
	return _.mergeWith(_.cloneDeep(conf), _.cloneDeep(confb), (o, s)=>{
		if (_.isArray(o)) { return o.concat(s); }
	});	
}

const CONFIG = (env = {ENV:'prod'}) => {

	const isDev = env.ENV === 'dev';
	const buildDll = !!env.DLL;

	if (isDev) {
		console.log('Running in Development Mode!');
	}

	const loadConfig = (globpath) => {
		let conf = {};
		glob.sync(globpath).forEach(function(file) {

			let confPartial = require(path.resolve(file));
			
			if(typeof confPartial === 'function'){
				confPartial = confPartial(isDev, _.merge(_.cloneDeep(env), BuildConfig));
			}

			conf = deepMerge(conf, confPartial);

		});
		
		return conf;
	};

	if (buildDll) {
		rimraf.sync(BuildConfig.distPath);
		return loadConfig('./webpack/__base/*.dll.config.js');
	} else {
		return _.merge(
			loadConfig('./webpack/__base/!(*.dll.config.js).js'),
			loadConfig('./webpack/!(*.dll.config.js).js')
		)
	}

};

module.exports = CONFIG;