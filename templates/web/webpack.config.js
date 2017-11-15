/*
* TSTART_fileMsg_TEND
*/

const _       = require('lodash');
const glob    = require('glob');
const path    = require('path');
const rimraf  = require('rimraf');
const colors  = require('colors');

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
		
		const userDir = path.join(process.cwd(), './webpack/');
		const baseDir = path.join(process.cwd(), './webpack/__base/');

		glob.sync(globpath, {cwd: baseDir}).forEach(function(file) {

			let confPartial = require(path.resolve(baseDir, file));
			if(typeof confPartial === 'function'){
				confPartial = confPartial(isDev, _.merge(_.cloneDeep(env), BuildConfig));
			}
			
			let userConfPartial;
			try{
				userConfPartial = require(path.resolve(userDir, file));
			}catch(e){}
			if(typeof userConfPartial === 'function'){
				userConfPartial = userConfPartial(isDev, confPartial, _.merge(_.cloneDeep(env), BuildConfig));
			}

			if(userConfPartial){
				conf = deepMerge(conf, userConfPartial);
			}else{
				conf = deepMerge(conf, confPartial);
			}

		});
		
		// console.log(JSON.stringify(conf, null, 4).white);
		return conf;
	};

	if (buildDll) {
		rimraf.sync(BuildConfig.distPath);
		return loadConfig('*.dll.config.js');
	} else {
		return loadConfig('./!(*.dll.config.js|!(*.config.js))');
	}

};

module.exports = CONFIG;