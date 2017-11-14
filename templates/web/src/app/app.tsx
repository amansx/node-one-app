class App {
	
	private title: string;
	
	constructor(title: string){
		this.title = title;
	}

	public printTitle(): void{
		console.log(this.title);
	}

}

// Generator Functions
const generatorFunction = function* () {
	let i = 0;
	while (i < 100) {
		yield ++i;
	}
}

const gen = generatorFunction();
setInterval(()=>{
	console.log(gen.next().value);
}, 1000);

const app: App = new App('My App');
app.printTitle();