import React, {Component} from 'react';
import PropTypes from 'prop-types';
import SpeechRecognition from 'react-speech-recognition'
import AddMap from '../AddMap/AddMap'
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Button
} from 'reactstrap';

import {Input} from 'reactstrap';
import {FaBeer, FaAccessibleIcon, FaGooglePlusSquare} from 'react-icons/fa';
import SearchBar from '../SearchBar/SearchBar'

import $ from 'jquery';
import AuthUserContext from '../../components/auth/AuthUserContext';
import * as firebase from "firebase";

const propTypes = {
  // Props injected by SpeechRecognition
  transcript: PropTypes.string,
  resetTranscript: PropTypes.func,
  browserSupportsSpeechRecognition: PropTypes.bool
};

const options = {
  autoStart: false
}

class NavHeader extends Component {
  constructor() {
    super();
    this.initMapModal = this.initMapModal.bind(this);
    this.turnOffModal = this.turnOffModal.bind(this);
    this.addMapAndResetVoiceCmd = this.addMapAndResetVoiceCmd.bind(this);
    this.myAccountAndResetVoiceCmd = this.myAccountAndResetVoiceCmd.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.goHome = this.goHome.bind(this);
    this.state = {
      modal: false
    }
  }

  turnOffModal() {
    this.setState({
      modal: false
    })
  }

  initMapModal(e) {
    e.preventDefault();
    this.setState({
      modal: true
    });
  }

  toggleMapModal() {
    this.setState({
      modal: true
    });
  }

  addMapAndResetVoiceCmd(resetVoice) {
    resetVoice();
    this.toggleMapModal();

  }

  myAccountAndResetVoiceCmd(resetVoice, user) {
    resetVoice();
    window.location.assign("/myaccount/" + user.uid);

  }
    myAccountAndResetVoiceCmdHashtag(resetVoice, user) {
        resetVoice();
        console.log(user);
        window.location.assign("/hashtags/" + user);

    }

  closeModal(resetVoice) {
    resetVoice();
    this.turnOffModal();
  }

  goHome(resetVoice) {
    resetVoice();
    window.location.assign("/");
  }

  getUserName = (curUserId) => {
    const db = firebase.firestore();
    const userRef = db.collection('users').doc(curUserId);
    userRef.get().then((user) => {
      this.setState({
        firstName: user.data().first_name
      });
    });
  };
  handleKeyDown = (event) => {
    //if(event.key == 'Enter'){
      console.log(event.key)
    //}
  }



  render() {
    const {transcript, resetTranscript, listening, startListening, stopListening, browserSupportsSpeechRecognition} = this.props;

    if (!browserSupportsSpeechRecognition) {
      return null
    }

    return (
        <div style={{position:'fixed', width:'100%', top:0, zIndex: 1}}>
          {transcript.search("home") < 0 ? "" : this.goHome(resetTranscript)}
          {transcript.length > 25 ? resetTranscript() : null}
          <Navbar className="drop-shadow" color="light" light expand="md" fixed="top">
            <NavbarBrand href="/" className="mr-auto">
              <img style={{width: '30px', height: '30px'}}
                   src="https://s3-us-west-2.amazonaws.com/badhorserecords/WheelthereIcon2.png"/>
              wheelthere
            </NavbarBrand>
              <SearchBar/>
              {/*<NavItem>{"                                              "}</NavItem>*/}
            <Nav navbar>
                <NavItem>
                    <NavLink  style={styles.navText}>{"      "}</NavLink>
                </NavItem>
               <NavItem>
                <NavLink  style={styles.navText}>{"      "}</NavLink>
            </NavItem>
              <AuthUserContext.Consumer>
                {authUser => authUser

                    ? <NavItem>
                      <NavLink href="/" onClick={this.initMapModal} style={styles.navText}>Add map</NavLink>
                      {transcript.search("add map") < 0 ? resetTranscript : this.addMapAndResetVoiceCmd(resetTranscript)}
                      {transcript.search("close") < 0 ? resetTranscript : this.closeModal(resetTranscript)}
                    </NavItem>
                    : null}
              </AuthUserContext.Consumer>
              <AuthUserContext.Consumer>
                {authUser => authUser
                    ? <NavItem>
                        {transcript.search("hashtags cold") < 0 ? resetTranscript : this.myAccountAndResetVoiceCmdHashtag(resetTranscript, 'cold')}
                        {transcript.search("hashtags beautiful") < 0 ? resetTranscript : this.myAccountAndResetVoiceCmdHashtag(resetTranscript, 'beautiful')}
                        {transcript.search("hashtags beach") < 0 ? resetTranscript : this.myAccountAndResetVoiceCmdHashtag(resetTranscript, 'beach')}
                        {transcript.search("hashtags hot") < 0 ? resetTranscript : this.myAccountAndResetVoiceCmdHashtag(resetTranscript, 'hot')}
                        {transcript.search("hashtags culture") < 0 ? resetTranscript : this.myAccountAndResetVoiceCmdHashtag(resetTranscript, 'culture')}
                        {transcript.search("hashtags snow") < 0 ? resetTranscript : this.myAccountAndResetVoiceCmdHashtag(resetTranscript, 'snow')}
                      <NavLink  style={styles.navText}>Messages</NavLink>
                    </NavItem>
                    : null}
              </AuthUserContext.Consumer>

              <AuthUserContext.Consumer>
                {authUser => authUser
                    ? <NavItem>
                      {transcript.search("account") < 0 ? resetTranscript : this.myAccountAndResetVoiceCmd(resetTranscript, authUser)}
                      <NavLink href={"/myaccount/" + authUser.uid}  style={styles.navText}>Account</NavLink>
                    </NavItem>
                    : null
                }
              </AuthUserContext.Consumer>


              <AuthUserContext.Consumer>
                {authUser => authUser
                    ? <NavItem >
                      {this.getUserName(authUser.uid)}
                      <NavLink  style={styles.navText}>Welcome {this.state.firstName}!</NavLink>
                    </NavItem>
                    : <NavItem>
                      <NavLink href={"/login/"}  style={styles.navText}>Log In</NavLink>
                    </NavItem>
                }
              </AuthUserContext.Consumer>

              <AuthUserContext.Consumer>
                {authUser => authUser
                    ? <div>
                      <NavItem>
                        <NavLink onClick={() => firebase.auth().signOut()}  style={styles.navText}>Sign Out</NavLink>
                        <AddMap turnOffModal={this.turnOffModal} modal={this.state.modal} userId={authUser.uid}/>
                      </NavItem>
                    </div>
                    : <NavItem>
                      <NavLink href={"/signup/"}  style={styles.navText}>Sign Up</NavLink>
                    </NavItem>
                }
              </AuthUserContext.Consumer>
            </Nav>
          </Navbar>
        </div>
    );
  }
}
const styles={
    navText:{
        color:'#737373',
        fontSize: 18,
        fontWeight:'lighter'

    }
}
NavHeader.propTypes = propTypes;
export default SpeechRecognition(NavHeader);


