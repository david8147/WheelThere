import React, {Component} from 'react';
import '../../App.css';

export default class TripDetails extends Component {

  render() {
    return (

        <div className="App">
          HELLO FROM TRIP DETAILS
          {console.log(this.props.match.params.tripId)}
        </div>
    );
  }
}