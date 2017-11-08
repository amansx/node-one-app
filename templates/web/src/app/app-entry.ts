import { createStore } from 'redux';

interface Action {
	type: String
}

interface State{
	Aman: number
}

const myReducer = (state: State, action: Action) => {
	switch(action.type){
		case 'pappu':
			return { ...state, 'Aman': 123 };
		case 'aman':
			return { ...state, 'Aman1': 123 };
		default:
			return state ? { ...state, 'Aman': ++state.Aman } : {};
	}
};

const myaction: Action = {
	type : 'pappu'
};

const myaction1: Action = {
	type : 'aman'
};

const store = createStore(myReducer);

store.dispatch(myaction);
console.log(store.getState());

store.dispatch(myaction1);
console.log(store.getState());

store.dispatch({ type: 'pintu' });
console.log(store.getState());


const Perms = [
	'Read',
	'Write'
];

const PermObj = {};

let i = 32;
while (i--){PermObj['perm'+(i+1)]=(1 << i) >>> 0;}

const admin = PermObj['perm1'] | PermObj['perm4'];
console.log(admin);

console.log(!!(admin & PermObj['perm2']));
console.log(!!(admin & PermObj['perm4']));