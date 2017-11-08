class App {
	
	private title: string;
	
	constructor(title: string){
		this.title = title;
	}

	public printTitle(): void{
		console.log(this.title);
	}

}

const app: App = new App('My App');
app.printTitle();