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
			style: {
				'background-color': 'black',
				'label': 'data(id)',
				'color': 'white',
				'padding': '5px',
				'font-size': '25px',
				'text-valign': 'center'
			}
		}
	],
	elements: [],
	userPanningEnabled: false,
	layout: {
		name: 'breadthfirst'
	}
};

const dataEls = [
	{ data: { id: 'a' } },
	{ data: { id: 'b' } },
	{ data: { id: 'ab', source: 'a', target: 'b' } },
];

config.elements = dataEls;

const cy = Cytoscape(config);

export default cy;