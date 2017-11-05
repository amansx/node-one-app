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

			conf = _.mergeWith(_.cloneDeep(conf), confPartial, (o, s)=>{
				if (_.isArray(o)) { return o.concat(s); }
			});

		});
		return conf;
	};

	if (buildDll) {
		rimraf.sync(BuildConfig.distPath);
		return loadConfig('./webpack/**/*.dll.config.js');
	} else {
		return loadConfig('./webpack/**/!(*.dll.config.js)');
	}

};

// console.log( JSON.stringify(CONFIG(), null, 4) );

module.exports = CONFIG;