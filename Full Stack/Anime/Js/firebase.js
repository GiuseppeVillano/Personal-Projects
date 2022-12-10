import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.9/firebase-app.js'
import { getAuth, signOut, signInWithPopup, GoogleAuthProvider } from 'https://www.gstatic.com/firebasejs/9.6.9/firebase-auth.js'
import { getDatabase, 
		ref,set,get,push,update,remove,runTransaction,query,
		child,onValue,orderByChild,limitToLast,limitToFirst,
		serverTimestamp,onDisconnect} from 'https://www.gstatic.com/firebasejs/9.6.9/firebase-database.js'

let app;
const database = getDatabase(await init());
const auth = getAuth();

//Config
async function init(){
	if(app==undefined){
		let obj= await fetch("../config.JSON")
				.then(res => res.json())
				.then(data =>{ return data;});

		const firebaseConfig = {
			apiKey: obj["apiKey"],
			authDomain: obj["authDomain"],
			databaseURL: obj["databaseURL"],
			projectId: obj["projectId"],
			storageBucket: obj["storageBucket"],
			messagingSenderId: obj["messagingSenderId"],
			appId: obj["appId"],
			measurementId: obj["measurementId"]
		  };
		app = initializeApp(firebaseConfig);
	}
	return app;	
}

function queryIt(path,order,number){
	if(order){
		return query(ref(database,path), limitToFirst(number),orderByChild("prop", "desc"));
	}
	return query(ref(database,path),orderByChild("prop", "desc"), limitToLast(number));
}

function date(){
	const date= new Date();
	var obj={
		day: date.getDate(),
		month: date.getMonth()+1,
		year: date.getFullYear(),
		hour: date.getHours(),
		minutes: date.getMinutes(),
		seconds: date.getSeconds()	
	}
	return obj;
}

//Funzioni Firebase
export async function SignInGoogle(){
	let operation= false;
	await signInWithPopup(auth, new GoogleAuthProvider())
		.then((result) => {
			localStorage.setItem("TokenId",result.user.uid);
			operation=true;
		}).catch((error) => {
			const errorCode = error.code;
			const errorMessage = error.message;
			const email = error.email;
			const credential = GoogleAuthProvider.credentialFromError(error);
			let x={
				0:errorCode,
				1:errorMessage,
				2:email,
				3:credential
			}
	});
	return operation;
}

export function SignOut(){
	signOut(auth).then(() => {
		console.log("Signed Out!")
	}).catch((error) => {
		console.log(error);
	});
}

export async function countChilds(path){
	var number=0;
	await get(ref(database,path))
		.then((snapshot)=>{
			if(snapshot.exists()){
				number=snapshot.size;
			}
			else{
				console.log("No data found!");
			}})
		.catch((error)=>{console.log(error);});
	return number;
}

export async function getChilds(path){
	var object=new Array();
	await get(ref(database,path))
		.then((snapshot)=>{
			if(snapshot.exists()){
				//console.log("Got data Successfully!");
				snapshot.forEach(function(child) {
					object.push(child.key);					
 				 });
			}
			else{
				console.log("No data found!");
			}})
		.catch((error)=>{console.log(error);});
	return object;
}

//True:limitToFirst e False:limitToLast
export async function limitBy(path,number,order){
	const regex= /\D/;
	if(!regex.test(number)){
		number=parseInt(number);
	}
	let jsonstring;
	
	const snap= queryIt(path,order,number);
	await get(snap).then(snapshot => {
		if(snapshot.exists()){
			jsonstring=snapshot.val();
			console.log("Presi con successo");
		}
		else{
			console.log("Non c'è nulla!");
		}	
	})	
	.catch((error)=>{console.log(error);});	
	;
	return jsonstring;
}

export async function deleteVal(path){	
	await remove(ref(database,path))
	.then(()=>{console.log("Data successfully removed!");})
	.catch((error)=>{console.log(error);});	
}

export async function pushVal(path,refs,jsonObj){
	var key;
	await push(ref(database,path),{[refs]:jsonObj})
	.then((snapshot)=>{
		key = snapshot.key;
		console.log(key);
	})
	.catch((error)=>{console.log(error);});
	return key;
}

//update mantiene i siblings
export async function updateVal(path,refs,jsonstring){	
	await update(ref(database,path),{
		[refs]:jsonstring
		})
	.then(()=>{})
	.catch((error)=>{console.log(error);});
	return "";
}
//set rimuove i siblings
export async function setVal(path,refs,jsonstring){	
	await set(ref(database,path),{
		[refs]:jsonstring
		})
	.then(()=>{console.log("Aggiunto!");})
	.catch((error)=>{console.log(error);});
	return "";
}

export async function transaction(path,key,callback) {	
	await runTransaction(ref(database, path), (transaction) => {
		if(transaction!==null){
			const regex= /\D/;
			if(!regex.test(transaction[key])){
				transaction[key]=parseInt(transaction[key]);
			}
			transaction[key]=callback(transaction[key]);
			transaction[key]=transaction[key].toString();
		}
		return transaction;
	}).then((result)=>{
		console.log("Transaction effettuata!");
		//console.log(result.snapshot.val());
	})
	.catch((error)=>{console.log(error);});
}

export async function getVal(path){
	var jsonstring="";

	await get(ref(database,path))
		.then((snapshot)=>{
			if(snapshot.exists()){
				jsonstring=snapshot.val();
			}
			else{
				console.log("Non c'è nulla!");
			}})
		.catch((error)=>{console.log(error);});
	return jsonstring;
}

export function notifyUpdate(path){
	let skipfirst=true;
	//nel momento in cui viene chiamata rimane in listening
	onValue(ref(database,path), (snapshot) => {
		if(!skipfirst){
			console.log("Update");
			console.log(snapshot.val());
			//appDiv.innerHTML = JSON.stringify(snapshot);
		}
		skipfirst=false;
	});
}
export function onDisc(){
	let data=date();
	let string=data.year+"/"+data.month+"/"+data.day+"/"+data.hour+"/"+data.minutes+"/"+data.seconds;
	onDisconnect(ref(database,"asd/a/time")).set(string);
}