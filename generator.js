#!/usr/bin/env node

const _ = require('lodash');
const Mustache = require('mustache');
const Path = require('path');
const Jsondir = require('jsondir');
const Optimist = require('optimist');
const colors = require('colors');
const SRCDIR = Path.join(__dirname, 'templates');
const Validator = require('jsonschema').Validator;
const validator = new Validator();

Mustache.tags = ['TSTART_', '_TEND'];

const options = {
	version       : { alias: 'v', describe: 'Print Version and Exit'.cyan, type: 'boolean' },
	type          : { alias: 't', describe: 'Project Type [web|node]'.cyan, default: 'web', type: 'string' },
	outDir        : { alias: 'o', describe: 'Output Directory Name (String)'.cyan, default: './', type: 'string' },
	projectName   : { alias: 'p', describe: 'Project Name (String)'.cyan, type: 'string' },
	force         : { alias: 'f', describe: 'Force overwrite changes'.cyan, type: 'boolean'},
};

const schema = {
	id:'/argsSchema',
	type: 'object',
	properties: options,
	required: [
		'projectName'
	]
};

// Get current version
const version = require(Path.join(__dirname,'package.json')).version;

// Usage text
const usage = `One-App Generator Version: ${version}\nUsage: oneapp {Options..}`;


// Get user arguments
const argsVerify = Optimist.usage(usage.yellow).options(options);
argsVerify.check((args) => {
	if(args.version){
		console.log(version.cyan);
		process.exit(0);
	}
	const validation = validator.validate(args, schema);
	if(validation.errors.length){
		throw(validation.errors.map((e)=>{
			return e.stack.replace(validation.propertyPath, 'Generator')
		}).join('\n').red + '\n' );
	}
	return true;
})

const args = argsVerify.argv;

// Default Arguments
_.merge(args,{
	fileMsg           : 'Auto-generated file by one-app generator. Do NOT Modify! \\n' + 
						'* Create an overrides file in the webpack directory instead.',
	projectNameDashed : (args.projectName+'').split(' ').join('-').toLowerCase(),
	projectPwd        : Path.join(process.cwd(), args.outDir || options.outDir.default)
});

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

	Jsondir.json2dir(jsonObj, {overwrite: !!args.force}, function(err) {
		if (err) throw err;
		console.log('Success: Complete!\n'.green);
	});

});