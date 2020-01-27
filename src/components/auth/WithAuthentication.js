import React from 'react';

import AuthUserContext from './AuthUserContext';
import * as firebase from "firebase";

const withAuthentication = (Component) =>
  class WithAuthentication extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        authUser: null,
      };
    }

    componentDidMount() {

      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          this.setState({ authUser: user });
        } else {
          this.setState({ authUser: null});
        }
      }.bind(this));

    }

    render() {
      const { authUser } = this.state;

      return (
        <AuthUserContext.Provider value={authUser}>
          <Component />
        </AuthUserContext.Provider>
      );
    }
  }

export default withAuthentication;
