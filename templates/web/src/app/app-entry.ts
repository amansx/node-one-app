
class App {

	private _title: string;

	constructor( title?:string ){
		this._title = title || 'Undefined';
	}

	public displayTitle(){
		console.log(this._title);
	}

}

const app: App = new App('Hello');
app.displayTitle();