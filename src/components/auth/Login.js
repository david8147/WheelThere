import React, {Component} from 'react';
import '../../App.css';
import * as firebase from "firebase";
import {Container, Row, Col, Form, Input, Button, Alert} from 'reactstrap';
import NavHeader from '../../utils/NavHeader/NavHeader';
import './Login.css'


const byPropKey = (propertyName, value) => () => ({
    [propertyName]: value,
});

const INITIAL_STATE = {
    email: '',
    password: '',
    error: false,
};

export default class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
    }

    onSubmit = (event) => {
        const {
            email,
            password,
        } = this.state;

        firebase.auth().signInWithEmailAndPassword(email, password).then(function (data) {
          console.log(data);
          console.log('Logged in!');
          console.log(firebase.User);
          window.location.assign('/');
        }.bind(this)).catch(function(error) {

          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;

          this.setState({error: true});
          this.setState({errorMessage: errorMessage});
        }.bind(this));

        event.preventDefault();
    }

    render() {
        const {
            email,
            password,
            error,
        } = this.state;

        const isInvalid =
            password === '' ||
            email === '';

        return (

            <div>
                <NavHeader />
                <Row>
                    <Col>
                        <p> </p>
                        <h3>Log In</h3>
                        <p> </p>
                        <p> </p>
                    </Col>
                </Row>
                <Row>
                <Col xs = "4" />
                <Col xs = "4">
                  <Form onSubmit={this.onSubmit}>
                          <Input
                              className="field"
                              value={email}
                              onChange={event => this.setState(byPropKey('email', event.target.value))}
                              type="text"
                              placeholder="Email Address"
                          />
                          <Input
                              className="field"
                              value={password}
                              onChange={event => this.setState(byPropKey('password', event.target.value))}
                              type="password"
                              placeholder="Password"
                          />
                          <Button
                              className="field"
                              disabled={isInvalid} type="submit">
                              Sign In
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
                            Don't have an account? <a href="/signup/">Sign Up</a>
                        </p>
                    </Col>
                </Row>

            </div>
        );
    }
}
