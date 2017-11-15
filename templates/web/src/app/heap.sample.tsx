import * as cy from './cytoscape.sample';
import * as Cytoscape from 'cytoscape';

const cyObj = cy.default;

cyObj.elements().remove();

cyObj.startBatch();
cyObj.add({ data: { id: 'a' } });
cyObj.add({ data: { id: 'b' } });
cyObj.add({ data: { id: 'c' } });
cyObj.add({ data: { id: 'd' } });
cyObj.add({ data: { id: 'e' } });
cyObj.add({ data: { id: 'ab', source: 'a', target: 'b' } });
cyObj.add({ data: { id: 'bc', source: 'b', target: 'c' } });
cyObj.add({ data: { id: 'bd', source: 'b', target: 'd' } });
cyObj.add({ data: { id: 'ae', source: 'a', target: 'e' } });
cyObj.endBatch();

cyObj.layout({
	name: 'breadthfirst'
}).run();

setTimeout(()=>{
	cyObj.remove( cyObj.$("#e") );
}, 2000);