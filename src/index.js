import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import * as firebase from 'firebase';

var config = {
  apiKey: "AIzaSyBQEov_3Wfj0IeJ49RTQFiB5eqOfjEn0kI",
  authDomain: "wheelthere-cb237.firebaseapp.com",
  databaseURL: "https://wheelthere-cb237.firebaseio.com",
  projectId: "wheelthere-cb237",
  storageBucket: "wheelthere-cb237.appspot.com",
  messagingSenderId: "1035127950489",
};
firebase.initializeApp(config);

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
