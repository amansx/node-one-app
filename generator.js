#!/usr/bin/env node

const _ = require('lodash');
const Mustache = require('mustache');
const Path = require('path');
const Jsondir = require('jsondir');
const args = require('minimist')(process.argv.slice(2));
const SRCDIR = Path.join(__dirname, 'templates');

Mustache.tags = ['<%%', '%%>'];

const ProjectType = args.type || 'Unknown';
const ProjectSettings = {
	WMCG_NAME                : 'Sample Project',
	WMCG_PROJECT_NAME_DASHED : 'sample-project',
	WMCG_PWD  				 : Path.join(process.cwd(), '/dist')
};

if(args.version){
	const version = require(Path.join(__dirname,'package.json')).version;
	console.log(version, "\n");
	return;	
}

let ProjectDir, ProjectConf;
try{
	ProjectDir  = Path.join(SRCDIR, ProjectType);
	ProjectConf = require(Path.join(SRCDIR, ProjectType + '.config' ));
}catch(e){
	console.log('Error: No Known Configuration for Type:', ProjectType +'!\n');
	return;
}

const generateFSJsonWithContents = function(results){

	const mapContentsToFile = function(projectConfFrag){
		const retObj = {};
		if(_.isPlainObject(projectConfFrag)){
			const filePath = projectConfFrag['-file'];
			if(filePath){
				const filepathContent = (filePath+'/-content').split('/');
				const contents = _.get(results, filepathContent);
				retObj['-content'] = contents;
			}else{
				Object.keys(projectConfFrag).forEach((key)=>{
					retObj[key] = mapContentsToFile(projectConfFrag[key]);
				})
			}
			return retObj;
		}else{
			return projectConfFrag;
		}
	}

	const Config = mapContentsToFile(ProjectConf);
	return Config;

};

// Read file content
Jsondir.dir2json(ProjectDir, {attributes: ['content', 'mode']}, function(err, results) {
	if (err) throw err;

	const contents = generateFSJsonWithContents(results);
	let template = JSON.stringify(contents, null, 4);
	Mustache.parse(template);
	const rendered = Mustache.render(template, ProjectSettings);
	const jsonObj = JSON.parse(rendered);

	Jsondir.json2dir(jsonObj, function(err) {
		if (err) throw err;
		console.log('Success: Done!\n');
	});

});