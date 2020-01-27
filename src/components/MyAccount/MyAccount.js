import React, {Component} from 'react';
import '../../App.css';
import './MyAccount.css';
import * as firebase from 'firebase';
import MyTrips from "../../utils/MyTrips/MyTrips.js";
import SavedTrips from "../../utils/SavedTrips/SavedTrips.js";
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import NavHeader from '../../utils/NavHeader/NavHeader';
import AuthUserContext from '../../components/auth/AuthUserContext';
import MyTrip from '../../components/MyTrip/MyTrip';
import Modal from 'react-responsive-modal';

export default class MyAccount extends Component {

    constructor(props) {
        super();
        this.state = {
            set: false,
            about: "",
            email: "",
            first_name: "",
            last_name: "",
            my_trips: "",
            saved_trips: "",
            password: "",
            userId: props.match.params.userId,
            tripsList:[],
        };

    };
    onOpenModal = () => {
        this.setState({ open: true });
    };

    onCloseModal = () => {
        this.setState({ open: false });
    };
    passwordReset=()=>{
        let auth = firebase.auth();
        let emailAddress = this.state.email;
        auth.sendPasswordResetEmail(emailAddress).then(function() {
            console.log("email sent")
        }).catch(function(error) {
            // An error happened.
        });
    }
    onSubmit = (event) => {
        event.preventDefault();

        var user = firebase.auth().currentUser;
        let changeEmail = this.state.email;
        let changeFirstName = this.state.first_name;
        let changeLastName = this.state.last_name;

        // console.log(changeEmail);
        // console.log(changeFirstName);
        // console.log(changeLastName);

        if(user == null)
        {
            window.alert("Log In First")
            window.location.reload();
        }


        user.updateEmail(changeEmail).then(()=>{
            console.log(user.email);
        }).catch(()=>{
            window.alert("Log Out and Log Back In")
            firebase.auth().signOut();
        })
        let userRef = firebase.firestore().collection('users').doc(this.state.userId);
        userRef.update({first_name: changeFirstName, last_name: changeLastName, email:changeEmail}).then(()=>{
            window.location.reload();
        })
    };

    componentDidMount() {
        //db querying
        const db = firebase.firestore();
        //getting all users
        var userRef = db.collection('users').doc(this.state.userId);
        userRef.get().then((user) => {
            var data = user.data();
            console.log(data.my_trips);
            this.setState({
                about: data.about,
                image: data.image,
                email: data.email,
                first_name: data.first_name,
                last_name: data.last_name,
                saved_trips: data.saved_trips,
                my_trips: data.my_trips,
                set: true
            },()=>{
                this.loadTrips(this.state.my_trips);
            });
        });

    }
    consoleTrips=()=>{
        return this.state.tripsList.map((trip, index)=>(
            <MyTrip
                image={trip.image}
                images={trip.images}
                name={trip.name}
                data={this.state.my_trips[index]}
                stars={trip.stars}
            />
            // <div>
            //     {console.log(trip)}
            // </div>
        ))
    }

    loadTrips=(myTrips)=>{
        const db = firebase.firestore();
        let promiseList = [];
        let loadTrips = [];
        for (let i in myTrips) {
            let query = db.collection('trips').doc(myTrips[i]).get();
            promiseList.push(query);
        }
        Promise.all(promiseList).then((tripsList)=>{
            for(let i = 0; i < tripsList.length; i++){
                loadTrips.push(tripsList[i].data())
            }
        }).then(()=>{
            this.setState({tripsList:loadTrips})
        })
        // Promise.all(promiseList).then((tripsList)=>{
        //     for(let i = 0; i < tripsList.length; i++){
        //         loadTrips.push(tripsList[i].data())
        //     }
        // }).then(()=>{
        //     this.setState({tripsList:loadTrips},()=>{
        //         this.consoleTrips();
        //     })
        // })


    }

    loadSavedTrips = () => {
        if (this.state.set == true) {
            return (<SavedTrips tripIds={this.state.saved_trips}/>);
        }
    };

    render() {
        let that = this;
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                // console.log(user.uid);
                that.state.userIdFromFB = user.uid;
            }
        });
        const { open } = this.state;
        return (
            <div>
                <NavHeader/>
                <div style={{marginTop:70, backgroundColor:'#e8e8e8', overflowY: 'scroll', height:620   }}>
                    <p></p>
                    <div>
                        <img style={{marginTop:30,height:140, width:150}} src="https://t3.ftcdn.net/jpg/00/64/67/80/240_F_64678017_zUpiZFjj04cnLri7oADnyMH0XBYyQghG.jpg"
                             className="account-picture"/>

                        <p style={{marginTop:5,marginBottom:0,fontFamily:'Damascus',fontSize:22}}>{this.state.first_name+" "+this.state.last_name}</p>
                    </div>
                    <div>
                        <AuthUserContext.Consumer>
                            {authUser => authUser &&  this.state.userIdFromFB == this.state.userId
                                ? <button style={{size:'sm', height:30,  width:200, fontFamily:'Damascus'}}onClick={this.onOpenModal}>Edit Profile</button>
                                : null}
                        </AuthUserContext.Consumer>

                        <Modal open={open} onClose={this.onCloseModal} center>
                            <Form onSubmit={this.onSubmit}>
                                <FormGroup>
                                    <Label for="firstName">First Name</Label>
                                    <Input onChange={e => this.setState({first_name: e.target.value})} type="text" name="text" placeholder={this.state.first_name} />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="lastName">Last Name</Label>
                                    <Input onChange={e => this.setState({last_name: e.target.value})}type="text" name="text" placeholder={this.state.last_name} />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="exampleEmail">Email</Label>
                                    <Input onChange={e => this.setState({email: e.target.value})}type="email" name="email" id="exampleEmail" placeholder={this.state.email} />
                                </FormGroup>
                                <FormGroup>
                                    <a href="" onClick={this.passwordReset}>Reset Password Through Email</a>
                                </FormGroup>
                                <Button type = "submit">Submit</Button>
                            </Form>
                        </Modal>
                    </div>

                    <p style={{marginTop:50, fontSize:22, fontFamily:'Cochin', color:'#545454'}}><u>{this.state.my_trips.length} Past Trips:</u></p>
                    {/*<p>{this.state.about}</p>*/}

                    {/*<MyTrips userId={this.state.userId}/>*/}
                    <div style={{display:'flex', flexDirection:'column', justifyContents:'flex-start',alignItems:'flex-start'}}>
                        {this.consoleTrips()}
                    </div>
                </div>
            </div>
        );
    }
}
