import React, {Component} from 'react';
import { Col, Row, Container } from 'reactstrap';
import '../../App.css';
import './MiniPin.css';


export default class ImageBox extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: null,
    };

    this.pins = this.props.pins;
  }

  render() {

    const pinList = Object.keys(this.pins).map(key =>

        <img className='pin-box' src={this.pins[key].image} alt=''/>

    );

    return (
      <Container id="MiniPin" className="flex-container">
        {pinList}
      </Container>
    );
  }
}
