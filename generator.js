#!/usr/bin/env node

const _ = require('lodash');
const Mustache = require('mustache');
const Path = require('path');
const Jsondir = require('jsondir');
const Optimist = require('optimist');
const colors = require('colors');
const SRCDIR = Path.join(__dirname, 'templates');

Mustache.tags = ['<%%', '%%>'];

const options = {
	type          : 'web',
	outDir        : './',
	projectName   : undefined
};

const usage = 'Usage: $0 -' + Object.keys(options).join('=[value] -') + '=[value]'
const args = Optimist
    		.usage(usage.yellow)
    		.default(options)
    		.demand(Object.keys(options))
			.argv;

args.projectNameDashed = (args.projectName+'').split(' ').join('-').toLowerCase();
args.projectPwd        = Path.join(process.cwd(), args.outDir || options.outDir);

if(args.version){
	const version = require(Path.join(__dirname,'package.json')).version;
	console.log(version, "\n");
	return;	
}

const ProjectDir  = Path.join(SRCDIR, args.type);
let ProjectConf;
try{
	ProjectConf = require(Path.join(SRCDIR, (args.type+'.config') ));
}catch(e){
	const msg = 'Error: No Known Configuration for Type:' + args.type + '!\n';
	console.log(msg.red);
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
	const rendered = Mustache.render(template, args);
	const jsonObj = JSON.parse(rendered);

	Jsondir.json2dir(jsonObj, function(err) {
		if (err) throw err;
		console.log('Success: Complete!\n'.green);
	});

});