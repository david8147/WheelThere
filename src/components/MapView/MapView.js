import React, {Component} from 'react';
import MapWrapper from './MapWrapper';
import NavHeader from '../../utils/NavHeader/NavHeader';
import {Container, Row, Col} from 'reactstrap';
import '../../App.css';
import PinDisplay from '../../utils/PinDisplay/PinDisplay'
import * as firebase from "firebase";
import CommentSection from '../../components/CommentSection/CommentSection'
import AuthUserContext from '../../components/auth/AuthUserContext';

const divInlineStyle = {
    float: 'left'
}


export default class MapView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tripId: props.match.params.tripId,
            pin_ids: {},
            mapRef: React.createRef(),
            viewRef: React.createRef(),

            editable: false,
            userId: null,
        }
        this.getAllPins = this.getAllPins.bind(this);
        this.showPins = this.showPins.bind(this);
    }

    getAllPins() {
        const db = firebase.firestore();
        var tripRef = db.collection('trips').doc(this.state.tripId);
        var pinRef = db.collection('pins');

        tripRef.get().then((trip) => {
            var pins = trip.data().pins;
            if (pins != undefined) {
                for (var i = 0; i < pins.length; i++) {
                    pinRef.doc(pins[i]).get().then((rec) => {
                        var p = rec.data();
                        this.state.pin_ids[rec.id] = {
                            description: p.description,
                            image: p.image,
                            lat: p.lat,
                            lon: p.lon
                        };
                        if (pins.length == Object.keys(this.state.pin_ids).length) {
                            this.setState({
                                loaded: true,
                            });
                            //chain async call
                        }
                    });
                }
            }

        });
    }

    componentDidMount() {
        let userId = null;
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                userId = user.uid;
                // User is signed in.
            }
        });
        let userRef = firebase.firestore().collection('trips').doc(this.state.tripId);
        userRef.get().then((trip) => {
            if (userId == trip.data().owner_id) {
                // console.log("userid "+ userId)
                this.updateUserId(userId)
            }
        })
    }

    updateUserId = (userId) => {
        this.setState({editable: true, userId: userId});
    }

    showPins() {
        if (this.state.loaded) {
            {
                var x = [];
                Object.keys(this.state.pin_ids).map((key) => {
                    var image = this.state.pin_ids[key].image;
                    var description = this.state.pin_ids[key].description;
                    var lat = this.state.pin_ids[key].lat;
                    var lon = this.state.pin_ids[key].lon;
                    x.push(<PinDisplay key={lat.toString() + lon.toString()} lat={lat} lon={lon}
                                       mapRef={this.state.mapRef} id={'pin' + key} image={image} title={description}/>);
                });
                return x;
            }
        }
        else {
            this.getAllPins();
        }
    }

    render() {
        return (
            <div>
                {/*<NavHeader/>*/}
                <Row>
                    <Col id='left-column' xs="3">
                        <div className="maps-container" >
                            <h5><u> Pins </u></h5>
                            {this.showPins()}
                        </div>
                        <div style={{top:550, backgroundColor:'#e8e8e8'}}className="drag-container">
                            <div className="box-border shadow" style={{backgroundColor:'#e8e8e8', paddingTop:5}}>
                                <img style={{width: '30px', height: '50px'}}
                                     src="https://i.pinimg.com/originals/f2/57/78/f25778f30e29a96c44c4f72ef645aa63.png"/>
                                <p>Drag to add to the map.</p>
                            </div>
                        </div>
                    </Col>
                    <Col id="mapwrapper" xs="9" style={{width: '100vw', height: '90vh'}}>
                        <input type="text" className="text-center map-query-control form-control" id="place-input"
                               placeholder="Search for a place!" autoComplete="on"/>
                        <MapWrapper getAllPins={this.getAllPins} viewRef={this.state.viewRef} ref={this.state.mapRef}
                                    tripId={this.state.tripId}/>
                        {/*<CommentSection tripId = {this.state.tripId}/>*/}
                    </Col>
                </Row>
            </div>
        );
        //   render() {
        //
        //       let pin = (<div style={{top:600}}className="drag-container">
        //           <div className="box-border shadow">
        //               <img style={{width: '30px', height: '50px'}}
        //                    src="https://i.pinimg.com/originals/f2/57/78/f25778f30e29a96c44c4f72ef645aa63.png"/>
        //               <p>Drag to add to the map.</p>
        //           </div>
        //       </div>);
        //       // if (this.state.editable == false)
        //       //     pin = null;
        //
        //       return (
        //           <div>
        //               {/*<NavHeader/>*/}
        //               <Row >
        //                   <Col id='left-column' xs="3">
        //                       <h5> Pins </h5>
        //                       <div className="maps-container">
        //
        //                           <div id="pinsMainDiv">
        //                               {this.showPins()}
        //                           </div>
        //                       </div>
        //                       <AuthUserContext.Consumer>
        //                           {authUser => authUser
        //                               ? pin
        //                               : null}
        //                       </AuthUserContext.Consumer>
        //
        //                   </Col>
        //                   <Col id="mapwrapper" xs="9" style={{width: '100vw', height: '80vh'}}>
        //                       <input type="text" className="text-center map-query-control form-control" id="place-input"
        //                              placeholder="Search for a place!" autoComplete="on"/>
        //                       <MapWrapper getAllPins={this.getAllPins} viewRef={this.state.viewRef} ref={this.state.mapRef}
        //                                   tripId={this.state.tripId}/>
        //                       <CommentSection tripId = {this.state.tripId}/>
        //                   </Col>
        //               </Row>
        //               <br/>
        //               <br/>
        //               <br/>
        //               <br/>
        //               <br/>
        //               <br/>
        //               <br/>
        //               <br/>
        //               <br/>
        //               <p></p>
        //               <p></p>
        //               <p></p><p></p>
        //               <p></p>
        //               <p></p>
        //
        //           </div>
        //       );
        //Bottom right when we need i
        /*

                  <div className="sticky-right">
                <a href="/"><img style={{width: '70px', height: '70px'}}
                                 src="http://www.free-icons-download.net/images/plus-icon-27951.png"/></a>
                <br/>
                Testing the bottom right
                </div> */
    }
}
