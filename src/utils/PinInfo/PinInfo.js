import React from 'react';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import * as firebase from "firebase";
import {Container, Row, Col} from 'reactstrap';

export default class PinInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: props.modal,
            //TODO: add in the next properties for rendering
        };
        this.toggle = this.toggle.bind(this);
        this.getPinInfo = this.getPinInfo.bind(this);
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }

    getPinInfo(pid, modal) {
        const db = firebase.firestore();
        var pinRef = db.collection('pins');
        pinRef.doc(pid).get().then((rec) => {
            //assumes get doesn't shit itself
            var pind = rec.data();
            this.setState({
                description: pind.description,
                address: pind.address,
                image: pind.image,
                bathroom: pind.bathroom,
                rollability: pind.rollability,
                transport: pind.transport,
                tip: pind.tip,
                fun: pind.fun,
                modal: modal, //if the modal should be on or not
                pid: pid,
            });
        });
    }

    componentWillReceiveProps(newProps) {
        //fucking jank ass code, newProps.modal = should be on?
        if (newProps.pid) {
            //sigh
            this.getPinInfo(newProps.pid, newProps.modal);
        }
    }

    render() {
        return (
            <Modal size="md"
                   isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                <ModalHeader style={{marginLeft:10}}toggle={this.toggle}>Location Info</ModalHeader>
                <ModalBody>
                    <Row style={{marginBottom:0}}>
                        <Col>
                            <img style={{width: '95%', height: '35vh', marginLeft:7, borderRadius:5, marginTop:-5}} src={this.state.image}/>
                        </Col>
                    </Row>
                    <div style={{marginTop:15, marginLeft:7}}>
                        <p style={styles.text}><b>Description: </b>{this.state.description}</p>
                        <p style={styles.text}><b>Address: </b>{this.state.address}</p>
                        <p style={styles.text}><b>Rollability:</b> {this.state.rollability}</p>
                        <p style={styles.text}><b>Transport: </b> {this.state.transport}</p>
                        <p style={styles.text}><b>Fun: </b> {this.state.fun}</p>
                        <p style={styles.text}><b>Tip: </b>{this.state.tip}</p>
                    </div>
                </ModalBody>
            </Modal>
        );
    }
}
const styles={
    text:{
        // fontFamily:'Cochin',
        fontFamily:'Damascus',
        marginTop:5,
        marginBottom:0,
        fontSize:22,
    }
}
