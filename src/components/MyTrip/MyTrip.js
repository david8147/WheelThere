import React, {Component} from 'react';

import * as firebase from 'firebase';
import MyTrips from "../../utils/MyTrips/MyTrips.js";
import SavedTrips from "../../utils/SavedTrips/SavedTrips.js";
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import NavHeader from '../../utils/NavHeader/NavHeader';
import AuthUserContext from '../../components/auth/AuthUserContext';
import StarRatings from 'react-star-ratings';

import Modal from 'react-responsive-modal';

class MyTrip extends Component{

    constructor(props){
        super();
        this.state={
            image:props.image,
            images:props.images,
            name:props.name,
            data:props.data,
            stars:props.stars,
            allimages:[],
        }
    }
    changeRating=( newRating, name )=> {
        this.setState({
            rating: newRating
        });
    }
    componentDidMount(){
        let allimages = [];
        if(this.state.image != undefined)
            allimages.push(this.state.image)
        if(this.state.images != undefined){
            for(let i = 0; i < this.state.images.length; i++){
                // console.log(img);
                allimages.push(this.state.images[i]);
            }
        }
        console.log(this.state.images)
        this.setState({allimages:allimages},()=>{
            console.log(this.state.allimages);
        })
    }
    navigateToTrip =(trip)=>{
        window.open("/mapview/"+trip, '_blank')
    };
    loadImages=()=>{
        return this.state.allimages.map((trip)=>(
            <img
                src={trip}
                onClick={()=>{this.navigateToTrip(this.state.data)}}
                style={styles.image}
            />
        ))
    }
    render(){
        return(
            <div style={{display:'flex', flexDirection:'column', justifyContents:'center', alignItems:'center', marginBottom:10}}>
                <div style={{display:'flex', flexDirection:'row', justifyContents:'space-evenly',alignItems:'space-evenly',}}>
                    <p style={{marginBottom:0, marginRight:10,fontFamily:'Cochin', color:'#545454'}}>{this.state.name+ "  "}</p>

                    <StarRatings
                        rating={this.state.stars/2}
                        starRatedColor="#de574e"
                        numberOfStars={5}
                        name='rating'
                        starDimension='17px'
                        starSpacing= '1px'
                    />
                    <p style={{marginLeft:5, fontSize:10, marginBottom:0, color:'#545454'}}>{this.state.stars.toFixed(1) + "/10"}</p>
                </div>
                <div style={{display:'flex', flexDirection:'row',justifyContents:'space-evenly', alignItems:'space-evenly', flexWrap:'wrap', paddingBottom:10, marginLeft:60, marginRight:40}}>
                    {this.loadImages()}
                </div>
                <div
                    style={{
                        backgroundColor:'#bdbdbd',
                        borderWidth:10,
                        width:'80%',
                        border: 10,
                        height:1,
                        marginTop:30,
                    }}
                >

                </div>
            </div>
        )
    }
}
let styles={
    image:{
        height:150,
        width:220,
        margin:7,
        borderRadius:5,
    }
}
export default MyTrip
