import React, {Component} from 'react';
import { Container, Row, Col, Form, Button, Input, Alert} from 'reactstrap';
import '../../App.css';
import * as firebase from "firebase";
import NavHeader from '../../utils/NavHeader/NavHeader';
import './Login.css'


const INITIAL_STATE = {
    firstName: '',
    lastName: '',
    email: '',
    passwordOne: '',
    passwordTwo: '',
    error: false,
    errorMessage: null
};

const byPropKey = (propertyName, value) => () => ({
    [propertyName]: value,
});

export default class SignUpForm extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
    }

    onSubmit = (event) => {
        const {
            firstName,
            lastName,
            email,
            passwordOne,
        } = this.state;

    firebase.auth().createUserWithEmailAndPassword(email, passwordOne).then(function (data) {
      console.log('Signed Up!');
      var user = firebase.auth().currentUser;
      //adding user do firestore
      const db = firebase.firestore();
      var usersRef = db.collection('users');
      usersRef.doc(user.uid).set({
        about : "",
        email : email,
        first_name: firstName,
        last_name: lastName,
        saved_trips : [],
        my_trips : [],
        image: null
      }).then(()=>{
        window.location.assign('/');
      });


    }).catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;

      this.setState({error: true});
      this.setState({errorMessage: errorMessage});
    }.bind(this));

        event.preventDefault();
    };

    render() {
        const {
            firstName,
            lastName,
            email,
            passwordOne,
            passwordTwo,
            error,
        } = this.state;

        const isInvalid =
            passwordOne !== passwordTwo ||
            passwordOne === '' ||
            email === '';

        return (
            <div>
                <NavHeader />
                <Row>
                    <Col>
                        <h1>Sign Up</h1>
                    </Col>
                </Row>

                <Row>
                  <Col xs = "4" />
                  <Col xs = "4" className="form">
                    <Form onSubmit={this.onSubmit}>
                        <Input
                            className="field"
                            value={firstName}
                            onChange={event => this.setState(byPropKey('firstName', event.target.value))}
                            type="text"
                            placeholder="First Name"
                        />
                        <Input
                            className="field"
                            value={lastName}
                            onChange={event => this.setState(byPropKey('lastName', event.target.value))}
                            type="text"
                            placeholder="Last Name"
                        />

                        <Input
                            className="field"
                            value={email}
                            onChange={event => this.setState(byPropKey('email', event.target.value))}
                            type="text"
                            placeholder="Email Address"
                        />
                        <Input
                            className="field"
                            value={passwordOne}
                            onChange={event => this.setState(byPropKey('passwordOne', event.target.value))}
                            type="password"
                            placeholder="Password"
                        />
                        <Input
                            className="field"
                            value={passwordTwo}
                            onChange={event => this.setState(byPropKey('passwordTwo', event.target.value))}
                            type="password"
                            placeholder="Confirm Password"
                        />

                        <Button
                            type="submit">
                            Sign Up
                        </Button>
                    </Form>
                    {
                      this.state.error
                        ? <Alert color="danger" className="field">{this.state.errorMessage}</Alert>
                        : null
                    }
                  </Col>
                  <Col xs = "4" />
                </Row>

                <Row>
                    <Col>
                        <p>
                            Have an account? <a href="/login/">Login</a>
                        </p>
                    </Col>
                </Row>
            </div>
        );
    }
}
