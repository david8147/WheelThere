import React, {Component} from 'react';
import HomePage from "./components/HomePage/HomePage.js"
import MapView from "./components/MapView/MapView.js"
import MyAccount from "./components/MyAccount/MyAccount.js"
import TripDetails from "./components/TripDetails/TripDetails.js"
import LoginForm from "./components/auth/Login.js"
import SignUpForm from "./components/auth/SignUp.js"
import HashtagPage from "./components/HashtagPage/HashtagPage.js"

import withAuthentication from './components/auth/WithAuthentication.js';
import Submit from "./components/MapView/Submit.js"
import NewTrip from "./utils/NewTrip/NewTrip.js"

import {BrowserRouter} from 'react-router-dom'
import {Route} from 'react-router-dom';

import * as firebase from "firebase";


import './App.css';
import NavHeader from "./utils/NavHeader/NavHeader";


const Home = () => (
    <div>
          <NavHeader/>
        <HomePage/>
    </div>
);



class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: ''
    };
  }


  render() {

    return (
        <BrowserRouter>
          <div className="App">
            <Route exact={true} path="/" component={Home}/>
            <Route path="/mapview/:tripId" component={MapView}/>
            <Route path="/myaccount/:userId" component={MyAccount}/>
            <Route path="/tripdetails/:tripId" component={TripDetails}/>
            <Route path="/newtrip/:userId" component={NewTrip}/>
            <Route path="/login/" component={LoginForm} />
            <Route path="/signup/" component={SignUpForm} />
            <Route path="/hashtags/:hashtag" component={HashtagPage}/>
            <Route path="/submitpin/:tripId" component={Submit}/>
          </div>
        </BrowserRouter>
    );
  }
}

export default withAuthentication(App);
