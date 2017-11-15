module.exports = {
	"-path"             : "TSTART_{projectPwd}_TEND",
	".gitignore"        : {"-file": ".gitignore"},
	"package.json"      : {"-file": "package.json"},	
	"README.md"         : {"-file": "README.md"},
	"tsconfig.json"     : {"-file": "tsconfig.json"},
	"webpack.config.js" : {"-file": "webpack.config.js"},
	"webpack": {
		"__base": {
			"assets.config.js"       : {"-file": "webpack/__base/assets.config.js"},
			"base.config.js"         : {"-file": "webpack/__base/base.config.js"},
			"bundle.dll.config.js"   : {"-file": "webpack/__base/bundle.dll.config.js"},
			"markup.config.js"       : {"-file": "webpack/__base/markup.config.js"},
			"typescript.config.js"   : {"-file": "webpack/__base/typescript.config.js"}
		},
		"markup.config.js"       : {"-file": "webpack/markup.config.js"},
	},
	"src": {
		"app": {
			"app.sample.tsx"            : { "-file": "src/app/app.sample.tsx" },
			"cytoscape.sample.tsx"      : { "-file": "src/app/cytoscape.sample.tsx" }
		},
		"templates": { 
			"entry.ejs"          : { "-file": "src/templates/entry.ejs" },
			"browserconfig.xml"  : { "-file": "src/templates/browserconfig.xml" },
			"robots.txt"         : { "-file": "src/templates/robots.txt" }
		}		
	}
}