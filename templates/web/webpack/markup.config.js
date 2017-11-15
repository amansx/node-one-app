/*
* TSTART_fileMsg_TEND
*/

module.exports = (isDev, baseConfig, config) => {

	baseConfig.plugins[0].options.assets.push('additionalAsset.js');
	return baseConfig;

};