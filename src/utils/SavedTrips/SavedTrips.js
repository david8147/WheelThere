import React, {Component} from 'react';
import '../../App.css';
import * as firebase from "firebase";

export default class SavedTrips extends Component {
  constructor(props) {

    super();
    this.savedTripsList = props.tripIds;
  }

  componentDidMount() {
    //db querying
    const db = firebase.firestore();
    //getting all users
    var usersRef = db.collection('trips');
    //getting all trips from the saved_trips list
    for (let tripId of this.savedTripsList) {
      console.log(this.savedTripsList.length);
      usersRef.doc(tripId).get().then(trip =>{
        var tripData = trip.data();
        //TODO here we looping over all saved trips
      });
    }
    }


  render() {
    return (
        <div className="App">
          <p>Saved Trips</p>
          /*Map Objects Here*/
        </div>
    );
  }
}