import React, {Component} from 'react';
import NavHeader from '../../utils/NavHeader/NavHeader';
import {Container, Row, Col} from 'reactstrap';
import {CustomInput, Button, Form, FormGroup, Label, Input, FormText} from 'reactstrap';
import {Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

import '../../App.css';
import * as firebase from "firebase";
import hashtagRegex from 'hashtag-regex';

let element = [];
export default class AddPin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            turnOffModals: props.turnOffModals,
            getAllPins: props.getAllPins,
            add_id: props.add_id,
            modal: false,
            description: '',
            address: '',
            lat: 0,
            lon: 0,
            fun: 0,
            bathroom: 0,
            rollability: 0,
            transport: 0,
            tip: '',
            image: null,
            img_url: '',
            tripId: props.tripId,
            pins: {},
            location: '',
            hashtag: '',


        };
        this.pinRef = firebase.firestore().collection('pins');

        this.toggle = this.toggle.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handleAddressChange = this.handleAddressChange.bind(this);
        this.handleLatChange = this.handleLatChange.bind(this);
        this.handleLonChange = this.handleLonChange.bind(this);
        this.handleFunChange = this.handleFunChange.bind(this);
        this.handleBathroomChange = this.handleBathroomChange.bind(this);
        this.handleRollabilityChange = this.handleRollabilityChange.bind(this);
        this.handleTransportChange = this.handleTransportChange.bind(this);
        this.handleTipChange = this.handleTipChange.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.postPin = this.postPin.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.pushPinToStorage = this.pushPinToStorage.bind(this);
        this.updatePinsList = this.updatePinsList.bind(this);
        this.updateTripRating = this.updateTripRating.bind(this);
    }

    handleLocationChange = (event) => {
        this.setState({location: event.target.value});
    };
    handleHashtagChange = (event) => {
        // var patt = new RegExp('\\W(\\#[a-zA-Z]+\\b)(?!;)');
        // var hashTagAfterRegex = patt.exec(event.target.value);
        // console.log(hashTagAfterRegex);
        this.setState({hashtag: event.target.value});
    };

    handleDescriptionChange(event) {
        this.setState({description: event.target.value});
    }

    handleAddressChange(event) {
        this.setState({address: event.target.value});
    }

    handleLatChange(event) {
        this.setState({lat: event.target.value});
    }

    handleLonChange(event) {
        this.setState({lon: event.target.value});
    }

    handleFunChange(event) {
        this.setState({fun: event.target.value});
    }

    handleBathroomChange(event) {
        this.setState({bathroom: event.target.value});
    }

    handleRollabilityChange(event) {
        this.setState({rollability: event.target.value});
    }

    handleTransportChange(event) {
        this.setState({transport: event.target.value});
    }

    handleTipChange(event) {
        this.setState({tip: event.target.value});
    }

    handleFileChange(event) {
        this.setState({image: event.target.files[0]});
    }
    updateHashtag = (tripRef, hashtags) =>{
        let unionHashtag = [];
        let currentHashtag = [];
        let userRef = firebase.firestore().collection('trips').doc(this.state.tripId);

        // var patt = new RegExp('\\W(\\#[a-zA-Z]+\\b)(?!;)');
        // var hashTagAfterRegex = patt.exec(this.state.hashtag);
        // console.log(hashTagAfterRegex);


        // const text = "#paris#louve";
        const regex = hashtagRegex();
        let match;
        // console.log(regex.exec(text));
        // console.log("AAA");

        while (match = regex.exec(this.state.hashtag)) {
            // console.log(match[0]);
            let hashtag = match[0];
            currentHashtag.push(hashtag);
            //console.log(`Matched sequence ${ hashtag } — code points: ${ [...hashtag].length }`);
        }

        userRef.get().then((user)=>{
            unionHashtag = this.union_arrays( user.data().hashtag, currentHashtag);
        }).then(()=>{
            userRef.update({hashtag: unionHashtag}).then(()=> {
                this.updateHashtagDB(unionHashtag);
                // window.location.reload();
            })
        })
    };
    updateHashtagDB = (hashtags) =>{
        console.log(hashtags);
        let hashtagRef = firebase.firestore().collection('hashtags');
        for(let i = 0; i < hashtags.length; i++)
        {
            hashtagRef.doc(hashtags[i]).get().then((docSnapshot)=>{
                if(docSnapshot.exists)
                {
                    let existingList = docSnapshot.data().list;
                    existingList.push(this.state.tripId);
                    hashtagRef.doc(hashtags[i]).update({list: existingList}).then(()=>{window.location.reload();})
                }
                else{
                    let existingList = [];
                    existingList.push(this.state.tripId);
                    hashtagRef.doc(hashtags[i]).set({list: existingList}).then(()=>{window.location.reload();});
                }
            })
        }
    };
    union_arrays= (x, y) =>{
        if(x == null) return y;
        if(y == null) return x;
        var set = new Set();
        for(let i = 0; i < x.length; i++)
        {
            set.add(x[i])
        }
        // for(let item of set)
        //     console.log("first "+item);
        for(let j = 0; j < y.length; j++)
        {
            set.add(y[j])
        }
        // for(let item of set)
        //     console.log("second" +item);
        // var oldSet = new Set(x);
        // var newSet = new Set(y);
        // var merged = new Set([oldSet, newSet]);
        // console.log(JSON.stringify(oldSet));
        // console.log(JSON.stringify(newSet));
        // console.log(merged);
        // console.log(JSON.stringify(merged));
        // let array = Array.from(set);
        let arr = [...set];
        return arr;
    };
    updatePinsList(tripRef, pins) {
        element = [];
        let bool = false;
        let userRef = firebase.firestore().collection('trips').doc(this.state.tripId);
        userRef.get().then((user) => {
            if (user.data().images == null && this.state.img_url != '') {
                bool = true;
                element.push(this.state.img_url)
            }
            else {
                element = user.data().images;
                if (this.state.img_url != '') {
                    bool = true;
                    element.push(this.state.img_url);
                }
            }
        }).then(() => {
            //updating trip in db
            if (bool == true) {
                tripRef.update({
                    "pins": pins, "images": element
                }).then(() => {
                    this.updateTripRating(tripRef, pins);
                });
            }
            else {
                tripRef.update({
                    "pins": pins
                }).then(() => {
                    this.updateTripRating(tripRef, pins);
                    this.updateHashtagDB();
                });
            }

        })
    }

    updateTripRating = (tripRef, pins) => {

        let rate = 0;
        if (pins != null) {
            for (let i = 0; i < pins.length; i++) {
                this.pinRef.doc(pins[i]).get().then((rec) => {
                    let p = rec.data();
                    let avgRate = (parseInt(p.transport) + parseInt(p.fun) + parseInt(p.rollability) + parseInt(p.bathroom)) / 4;
                    rate += avgRate;
                    this.state.pins[rec.id] = {rate: avgRate};
                    if (pins.length === Object.keys(this.state.pins).length) {
                        rate /= pins.length;
                        tripRef.update({
                            stars: rate,
                            address: this.state.address
                        });
                    }
                });
            }
        }
    };

    pushPinToStorage(imgPath, pin_ref, pinId) {

        var storageRef = firebase.storage().ref();
        //this should be bound
        var self_ref = this;
        //get public link for image

        storageRef.child(imgPath).getDownloadURL().then(function (url) {
            self_ref.setState({img_url: url});
            //push pin to firestore

            pin_ref.set({
                description: self_ref.state.description,
                address: self_ref.state.address,
                lat: self_ref.state.lat,
                lon: self_ref.state.lon,
                fun: self_ref.state.fun,
                bathroom: self_ref.state.bathroom,
                rollability: self_ref.state.rollability,
                transport: self_ref.state.transport,
                tip: self_ref.state.tip,
                image: self_ref.state.img_url,
                location: self_ref.state.location,
                hashtag: self_ref.state.hashtag,

            }).then(() => {
                //gets the ID of newly created doc
                //add the pin id to the trip
                const db = firebase.firestore();
                var tripRef = db.collection('trips').doc(self_ref.state.tripId);
                var pins = [];
                var hashtags = [];
                tripRef.get().then(function (trip) {
                    //getting current list of pins and pushing newly created pin
                    hashtags = trip.data().hashtags;
                    if(hashtags == undefined)
                        hashtags = [];

                    pins = trip.data().pins;
                    if (pins == undefined) {
                        pins = [];
                    }

                    pins.push(pinId);
                    self_ref.state.add_id(pinId, self_ref.state.lat, self_ref.state.lon);
                    self_ref.updatePinsList(tripRef, pins);
                    self_ref.updateHashtag(tripRef, hashtags);
                    self_ref.toggle();
                    self_ref.state.turnOffModals();
                    self_ref.state.getAllPins();
                });
            });
        });
    };

    postPin(event) {
        event.preventDefault();
        event.stopPropagation();

        //referencing pins database
        const db = firebase.firestore();
        const settings = {timestampsInSnapshots: true};
        //db.settings(settings);
        var pin_ref = db.collection('pins');
        pin_ref = pin_ref.doc();
        var pinId = pin_ref.id;
        //referencing the trip to update pins list
        // var trip_ref = db.collection('trips');
        // var query = usersRef.where('user_id', '==', this.props.match.params.userId);

        // Create a root reference to push pin to cloud storage
        var storageRef = firebase.storage().ref();
        var imgRefPath = 'trips/' + this.state.tripId + "/pins/" + pinId + ".jpg";
        var dbImageRef = storageRef.child(imgRefPath);

        var self_ = this;
        dbImageRef.put(this.state.image).then(function (snapshot) {
            if (snapshot.state == "success") {
                self_.pushPinToStorage(imgRefPath, pin_ref, pinId);
            }
        });
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }

    turnOff() {
        this.setState({
            modal: false
        });
    }

    componentWillReceiveProps(newProps) {
        //safely update states
        if (newProps.modal) {
            this.setState({
                modal: newProps.modal,
            });
        }
        if (newProps.lon && newProps.lat) {
            this.setState({
                lat: newProps.lat,
                lon: newProps.lon
            });
        }
    }

    render() {
        return (
            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                <ModalHeader toggle={this.toggle}>Add Location</ModalHeader>
                <ModalBody>

                    <Form onSubmit={this.postPin}>
                        <FormGroup>
                            <Label for="Location">Location</Label>
                            <Input required type="textarea" name="text" id="Location" value={this.state.location}
                                   onChange={this.handleLocationChange}/>
                        </FormGroup>

                        <FormGroup>
                            <Label for="Description">Description</Label>
                            <Input required type="textarea" name="text" id="Description" value={this.state.description}
                                   onChange={this.handleDescriptionChange}/>
                        </FormGroup>

                        <FormGroup>
                            <Label for="Hashtag">Hashtag</Label>
                            <Input required type="textarea" name="text" id="Hashtag" value={this.state.hashtag}
                                   onChange={this.handleHashtagChange}/>
                        </FormGroup>

                        <FormGroup>
                            <Label for="Address">Address</Label>
                            <Input required type="textarea" name="text" id="Address" value={this.state.address}
                                   onChange={this.handleAddressChange}/>
                        </FormGroup>

                        <FormGroup>
                            <Label for="Latitude">Lat</Label>
                            <Input disabled placeholder={this.state.lat} type="Number" name="text" id="Lat"
                                   value={this.state.lat} onChange={this.handleLatChange}/>
                        </FormGroup>

                        <FormGroup>
                            <Label for="Longitude">Lon</Label>
                            <Input disabled placeholder={this.state.lon} type="Number" name="text" id="exampleText"
                                   value={this.state.lon}
                                   onChange={this.handleLonChange}/>
                        </FormGroup>

                        <FormGroup>
                            <FormGroup>

                                <Label for="Access">Total accessibility</Label>
                                <Input type="Number" name="text" id="fun" placeholder="Fun" value={this.state.fun}
                                       onChange={this.handleFunChange}/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="Access">Bathroom Accessibility</Label>

                                <Input type="Number" name="text" id="bathroom" placeholder="Bathroom"
                                       value={this.state.bathroom}
                                       onChange={this.handleBathroomChange}/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="Access">Rollability</Label>

                                <Input type="Number" name="text" id="rollability" placeholder="Rollability"
                                       value={this.state.rollability} onChange={this.handleRollabilityChange}/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="Access">Transport quality</Label>

                                <Input type="Number" name="text" id="transport" placeholder="Transport"
                                       value={this.state.transport}
                                       onChange={this.handleTransportChange}/>
                            </FormGroup>
                        </FormGroup>

                        <FormGroup>
                            <Input type="textarea" name="tip" id="tip" placeholder="Any tips?" value={this.state.tip}
                                   onChange={this.handleTipChange}/>
                        </FormGroup>

                        <FormGroup>
                            <Label for="picture">Image</Label>
                            <Input required type="file" id="picture" onChange={this.handleFileChange} name="picture"
                                   label="Select an image!"/>
                        </FormGroup>

                        <FormGroup>
                            <Button className="float-right" type="submit" color="secondary">Submit</Button>
                        </FormGroup>
                    </Form>

                </ModalBody>
            </Modal>
        );
    }
}

// import React, {Component} from 'react';
// import NavHeader from '../../utils/NavHeader/NavHeader';
// import {Container, Row, Col} from 'reactstrap';
// import {CustomInput, Button, Form, FormGroup, Label, Input, FormText} from 'reactstrap';
// import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
//
// import '../../App.css';
// import * as firebase from "firebase";
// import hashtagRegex from 'hashtag-regex';
//
// let element = [];
//
// export default class AddPin extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       turnOffModals: props.turnOffModals,
//       getAllPins: props.getAllPins,
//       add_id: props.add_id,
//       modal: false,
//       description: '',
//       address: '',
//       lat: 0,
//       lon: 0,
//       fun: 0,
//       bathroom: 0,
//       rollability: 0,
//       transport: 0,
//       tip: '',
//       image: null,
//       img_url: '',
//       tripId: props.tripId,
//       pins : {},
//         hashtag: ''
//     };
//     this.pinRef = firebase.firestore().collection('pins');
//
//     this.toggle = this.toggle.bind(this);
//     this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
//     this.handleAddressChange = this.handleAddressChange.bind(this);
//     this.handleLatChange = this.handleLatChange.bind(this);
//     this.handleLonChange = this.handleLonChange.bind(this);
//     this.handleFunChange = this.handleFunChange.bind(this);
//     this.handleBathroomChange = this.handleBathroomChange.bind(this);
//     this.handleRollabilityChange = this.handleRollabilityChange.bind(this);
//     this.handleTransportChange = this.handleTransportChange.bind(this);
//     this.handleTipChange = this.handleTipChange.bind(this);
//     this.handleFileChange = this.handleFileChange.bind(this);
//     this.postPin = this.postPin.bind(this);
//     this.handleFileChange = this.handleFileChange.bind(this);
//     this.pushPinToStorage = this.pushPinToStorage.bind(this);
//     this.updatePinsList = this.updatePinsList.bind(this);
//     this.updateTripRating = this.updateTripRating.bind(this);
//
//   }
//
//   handleDescriptionChange(event) {
//     this.setState({description: event.target.value});
//   }
//     handleHashtagChange = (event) => {
//         // var patt = new RegExp('\\W(\\#[a-zA-Z]+\\b)(?!;)');
//         // var hashTagAfterRegex = patt.exec(event.target.value);
//         // console.log(hashTagAfterRegex);
//         this.setState({hashtag: event.target.value});
//     };
//
//   handleAddressChange(event) {
//     this.setState({address: event.target.value});
//   }
//
//   handleLatChange(event) {
//     this.setState({lat: event.target.value});
//   }
//
//   handleLonChange(event) {
//     this.setState({lon: event.target.value});
//   }
//
//   handleFunChange(event) {
//     this.setState({fun: event.target.value});
//   }
//
//   handleBathroomChange(event) {
//     this.setState({bathroom: event.target.value});
//   }
//
//   handleRollabilityChange(event) {
//     this.setState({rollability: event.target.value});
//   }
//
//   handleTransportChange(event) {
//     this.setState({transport: event.target.value});
//   }
//
//   handleTipChange(event) {
//     this.setState({tip: event.target.value});
//   }
//
//   handleFileChange(event) {
//     this.setState({image: event.target.files[0]});
//   }
//
//   updatePinsList(tripRef, pins) {
//     //updating trip in db
//     tripRef.update({
//       "pins": pins
//     }).then(() => {
//       this.updateTripRating(tripRef, pins);
//     });
//   }
//     updateHashtag = (tripRef, hashtags) =>{
//         let unionHashtag = [];
//         let currentHashtag = [];
//         let userRef = firebase.firestore().collection('trips').doc(this.state.tripId);
//
//         // var patt = new RegExp('\\W(\\#[a-zA-Z]+\\b)(?!;)');
//         // var hashTagAfterRegex = patt.exec(this.state.hashtag);
//         // console.log(hashTagAfterRegex);
//
//
//         // const text = "#paris#louve";
//         const regex = hashtagRegex();
//         let match;
//         // console.log(regex.exec(text));
//         // console.log("AAA");
//
//         while (match = regex.exec(this.state.hashtag)) {
//             // console.log(match[0]);
//             let hashtag = match[0];
//             currentHashtag.push(hashtag);
//             //console.log(`Matched sequence ${ hashtag } — code points: ${ [...hashtag].length }`);
//         }
//
//         userRef.get().then((user)=>{
//             unionHashtag = this.union_arrays( user.data().hashtag, currentHashtag);
//         }).then(()=>{
//             userRef.update({hashtag: unionHashtag}).then(()=> {
//                 this.updateHashtagDB(unionHashtag);
//                 // window.location.reload();
//             })
//         })
//     };
//     updateHashtagDB = (hashtags) =>{
//         console.log(hashtags);
//         let hashtagRef = firebase.firestore().collection('hashtags');
//         for(let i = 0; i < hashtags.length; i++)
//         {
//             hashtagRef.doc(hashtags[i]).get().then((docSnapshot)=>{
//                 if(docSnapshot.exists)
//                 {
//                     let existingList = docSnapshot.data().list;
//                     existingList.push(this.state.tripId);
//                     hashtagRef.doc(hashtags[i]).update({list: existingList}).then(()=>{window.location.reload();})
//                 }
//                 else{
//                     let existingList = [];
//                     existingList.push(this.state.tripId);
//                     hashtagRef.doc(hashtags[i]).set({list: existingList}).then(()=>{window.location.reload();});
//                 }
//             })
//         }
//     };
//     union_arrays= (x, y) =>{
//         if(x == null) return y;
//         if(y == null) return x;
//         var set = new Set();
//         for(let i = 0; i < x.length; i++)
//         {
//             set.add(x[i])
//         }
//         // for(let item of set)
//         //     console.log("first "+item);
//         for(let j = 0; j < y.length; j++)
//         {
//             set.add(y[j])
//         }
//         // for(let item of set)
//         //     console.log("second" +item);
//         // var oldSet = new Set(x);
//         // var newSet = new Set(y);
//         // var merged = new Set([oldSet, newSet]);
//         // console.log(JSON.stringify(oldSet));
//         // console.log(JSON.stringify(newSet));
//         // console.log(merged);
//         // console.log(JSON.stringify(merged));
//         // let array = Array.from(set);
//         let arr = [...set];
//         return arr;
//     };
//   updateTripRating = (tripRef, pins) => {
//     let rate = 0;
//     if (pins != null) {
//       for (let i = 0; i < pins.length; i++) {
//         this.pinRef.doc(pins[i]).get().then((rec) => {
//           let p = rec.data();
//           let avgRate = (parseInt(p.transport) + parseInt(p.fun) + parseInt(p.rollability) + parseInt(p.bathroom)) / 4;
//           rate += avgRate;
//           this.state.pins[rec.id] = {rate: avgRate};
//           if (pins.length === Object.keys(this.state.pins).length) {
//             rate /= pins.length;
//             tripRef.update({
//               stars: rate
//             });
//           }
//         });
//       }
//     }
//   };
//
//     pushPinToStorage(imgPath, pin_ref, pinId) {
//
//         var storageRef = firebase.storage().ref();
//         //this should be bound
//         var self_ref = this;
//         //get public link for image
//
//         storageRef.child(imgPath).getDownloadURL().then(function (url) {
//             self_ref.setState({img_url: url});
//             //push pin to firestore
//
//             pin_ref.set({
//                 description: self_ref.state.description,
//                 address: self_ref.state.address,
//                 lat: self_ref.state.lat,
//                 lon: self_ref.state.lon,
//                 fun: self_ref.state.fun,
//                 bathroom: self_ref.state.bathroom,
//                 rollability: self_ref.state.rollability,
//                 transport: self_ref.state.transport,
//                 tip: self_ref.state.tip,
//                 image: self_ref.state.img_url,
//                 location: self_ref.state.location,
//                 hashtag: self_ref.state.hashtag,
//
//             }).then(() => {
//                 //gets the ID of newly created doc
//                 //add the pin id to the trip
//                 const db = firebase.firestore();
//                 var tripRef = db.collection('trips').doc(self_ref.state.tripId);
//                 var pins = [];
//                 var hashtags = [];
//                 tripRef.get().then(function (trip) {
//                     //getting current list of pins and pushing newly created pin
//                     hashtags = trip.data().hashtags;
//                     if(hashtags == undefined)
//                         hashtags = [];
//
//                     pins = trip.data().pins;
//                     if (pins == undefined) {
//                         pins = [];
//                     }
//
//                     pins.push(pinId);
//                     self_ref.state.add_id(pinId, self_ref.state.lat, self_ref.state.lon);
//                     self_ref.updatePinsList(tripRef, pins);
//                     self_ref.updateHashtag(tripRef, hashtags);
//                     self_ref.toggle();
//                     self_ref.state.turnOffModals();
//                     self_ref.state.getAllPins();
//                 });
//             });
//         });
//     };
//
//
//
//     postPin(event) {
//     event.preventDefault();
//     event.stopPropagation();
//
//     //referencing pins database
//     const db = firebase.firestore();
//     const settings = {timestampsInSnapshots: true};
//     //db.settings(settings);
//     var pin_ref = db.collection('pins');
//     pin_ref = pin_ref.doc();
//     var pinId = pin_ref.id;
//     //referencing the trip to update pins list
//     // var trip_ref = db.collection('trips');
//     // var query = usersRef.where('user_id', '==', this.props.match.params.userId);
//
//     // Create a root reference to push pin to cloud storage
//     var storageRef = firebase.storage().ref();
//     var imgRefPath = 'trips/' + this.state.tripId + "/pins/" + pinId + ".jpg";
//     var dbImageRef = storageRef.child(imgRefPath);
//
//     var self_ = this;
//     dbImageRef.put(this.state.image).then(function (snapshot) {
//       if (snapshot.state == "success") {
//         self_.pushPinToStorage(imgRefPath, pin_ref, pinId);
//       }
//     });
//   }
//
//   toggle() {
//     this.setState({
//       modal: !this.state.modal
//     });
//   }
//   turnOff(){
//     this.setState({
//       modal: false
//     });
//   }
//   componentWillReceiveProps(newProps) {
//     //safely update states
//     if(newProps.modal){
//       this.setState({
//         modal: newProps.modal,
//       });
//     }
//     if(newProps.lon && newProps.lat){
//       this.setState({
//         lat: newProps.lat,
//         lon: newProps.lon
//       });
//     }
//   }
//   render() {
//     return (
//       <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
//         <ModalHeader toggle={this.toggle}>Add Location</ModalHeader>
//         <ModalBody>
//
//         <Form onSubmit={this.postPin}>
//           <FormGroup>
//             <Label for="Description">Description</Label>
//             <Input required type="textarea" name="text" id="Description" value={this.state.description}
//                    onChange={this.handleDescriptionChange}/>
//           </FormGroup>
//
//           <FormGroup>
//             <Label for="Address">Address</Label>
//             <Input required type="textarea" name="text" id="Address" value={this.state.address}
//                    onChange={this.handleAddressChange}/>
//           </FormGroup>
//
//           <FormGroup>
//             <Label for="Latitude">Lat</Label>
//             <Input disabled placeholder={this.state.lat} type="Number" name="text" id="Lat" value={this.state.lat} onChange={this.handleLatChange}/>
//           </FormGroup>
//
//           <FormGroup>
//             <Label for="Longitude">Lon</Label>
//             <Input disabled placeholder={this.state.lon} type="Number" name="text" id="exampleText" value={this.state.lon}
//                    onChange={this.handleLonChange}/>
//           </FormGroup>
//
//           <FormGroup>
//             <FormGroup>
//
//               <Label for="Access">Total accessibility</Label>
//               <Input type="Number" name="text" id="fun" placeholder="Fun" value={this.state.fun}
//                      onChange={this.handleFunChange}/>
//             </FormGroup>
//             <FormGroup>
//               <Label for="Access">Bathroom Accessibility</Label>
//
//               <Input type="Number" name="text" id="bathroom" placeholder="Bathroom" value={this.state.bathroom}
//                      onChange={this.handleBathroomChange}/>
//             </FormGroup>
//             <FormGroup>
//               <Label for="Access">Rollability</Label>
//
//               <Input type="Number" name="text" id="rollability" placeholder="Rollability"
//                      value={this.state.rollability} onChange={this.handleRollabilityChange}/>
//             </FormGroup>
//             <FormGroup>
//                <Label for="Access">Transport quality</Label>
//
//               <Input type="Number" name="text" id="transport" placeholder="Transport" value={this.state.transport}
//                      onChange={this.handleTransportChange}/>
//             </FormGroup>
//           </FormGroup>
//
//           <FormGroup>
//             <Input type="textarea" name="tip" id="tip" placeholder="Any tips?" value={this.state.tip}
//                    onChange={this.handleTipChange}/>
//           </FormGroup>
//
//           <FormGroup>
//             <Label for="picture">Image</Label>
//             <Input required type="file" id="picture" onChange={this.handleFileChange} name="picture" label="Select an image!"  />
//           </FormGroup>
//
//           <FormGroup>
//             <Button className = "float-right" type="submit" color="secondary">Submit</Button>
//           </FormGroup>
//         </Form>
//
//         </ModalBody>
//       </Modal>
//     );
//   }
// }
