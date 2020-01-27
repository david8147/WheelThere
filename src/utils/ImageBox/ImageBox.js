import React, {Component} from 'react';
import { Col, Row } from 'reactstrap';
import { IoIosArrowDown } from 'react-icons/io'
import '../../App.css';
import './ImageBox.css';


export default class ImageBox extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: null,
      active: false,
      activeTarget: false
    };

    this.setActive = this.setActive.bind(this);
    this.trips = this.props.trips;
    console.log("TRIPS IN CONSTRUCTOR");
    console.log(this.trips);
    this.overflow = this.props.overflow;
  }

  setActive(e) {
    this.setState({active: !this.state.activeTarget})
  }

  render() {
    let activeImgCol = this.state.active ? "image-col active-image-col" : "image-col";
    let activeImgRow = this.state.active ? "image-row active-image-row" : "image-row";
    let activeImgMore = this.state.active ? "image-more active-image-more" : "image-more";
    let activeImgDetails = this.state.active ? "image-details active-image-details" : "image-details";
    const tripList = Object.keys(this.trips).map(key =>
      <Col sm='3' className={activeImgCol} key={key} data-id={key} onClick={ (e) => this.setActive(e) }>
        <div className='image-container'>
          <img className='image-box' src={this.trips[key].image} alt=''/>
          <div className={activeImgDetails}>
            <div className={activeImgMore}>
              <IoIosArrowDown/>
            </div>
          </div>
        </div>
        <div className='image-title'>{this.trips[key].name}</div>
      </Col>
    );




    return (
      <div href = '/' id="ImageBox">
        <Row className={activeImgRow}>
        {tripList}
        </Row>
      </div>
    );
  }
}
