// src/firebase.js
import firebase from 'firebase'

const config = {
	apiKey: "AIzaSyBQEov_3Wfj0IeJ49RTQFiB5eqOfjEn0kI",
	authDomain: "wheelthere-cb237.firebaseapp.com",
	databaseURL: "https://wheelthere-cb237.firebaseio.com",
	projectId: "wheelthere-cb237",
	storageBucket: "wheelthere-cb237.appspot.com",
	messagingSenderId: "1035127950489"
};

firebase.initializeApp(config);
export default firebase;