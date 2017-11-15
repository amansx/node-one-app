import * as Cytoscape from 'cytoscape';
import * as $ from 'jquery';
import * as _ from 'lodash';

const styleEl = $('<style></style');

styleEl.html(`
	*{
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	#uiView{		
		width: 100vw;
		height: 100vh;
		border: 0 black solid;
	}
`);

$('head').append(styleEl);

const config = {
	container: $('#uiView')[0],
	style: [
		{
			selector: 'node',
			style: { 'background-color': 'red', label: 'data(id)' }
		}
	],
	elements: [],
	userPanningEnabled: false,
	layout: {
		name: 'grid'
	}
};

const dataEls = [
	{ data: { id: 'a' } },
	{ data: { id: 'b' } },
	{
		data: { id: 'ab', source: 'a', target: 'b' }
	},
];

config.elements = dataEls;

var cy = Cytoscape(config);