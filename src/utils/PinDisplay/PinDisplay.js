import React, {Component} from 'react';
import ReactDOM from 'react-dom';

export default class PinDisplay extends Component{
	constructor(props){
		super(props);
		this.state = {
			title: props.title,
			image: props.image,
			mapRef: props.mapRef,
			lat: props.lat,
			lon: props.lon
		}
		this.showModal = this.showModal.bind(this);
	}
	showModal(event){
		event.preventDefault();
		event.stopPropagation();
		var lon = this.state.lon;
		var lat = this.state.lat;
		this.state.mapRef.current.togglePinInfoModal(lat, lon);
	}
	render(){

		return (
			<div style={{marginLeft:15}} >
				<p style={{fontFamily:'Cochin', color:'#545454', marginBottom:0}}>  {this.state.title} </p>
				<a href = '/' onClick = {this.showModal}> <img onClick = {this.showModal} style={{width: '90%', height: '20vh', borderRadius:5}} src = {this.state.image}/></a>
				<br/>
                <div style={{backgroundColor:'#bdbdbd', borderWidth:10, width:'100%', border: 10, height:1, marginTop:10,marginBottom:4, marginLeft:5}}> </div>
			</div>
		);
	}

}
