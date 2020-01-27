import React, {Component} from 'react';
import {ReactDOM} from 'react';
import AddPin from '../../utils/AddPin/AddPin';
import PinInfo from '../../utils/PinInfo/PinInfo';
import $ from 'jquery';
import * as firebase from "firebase";

//asynchronous loading magic
function loadJS(src) {
    var ref = window.document.getElementsByTagName("script")[0];
    var script = window.document.createElement("script");
    script.src = src;
    script.async = true;
    ref.parentNode.insertBefore(script, ref);
}

var EIFFEL_TOWER_POSITION = {
    lat: 48.858608,
    lng: 2.294471
};
var map; //global name space, because react is stupid as f

export default class MapWrapper extends Component {
    constructor(props) {
        super(props);
        this.togglePinAddModal = this.togglePinAddModal.bind(this);
        this.togglePinInfoModal = this.togglePinInfoModal.bind(this);
        this.setActiveLatLng = this.setActiveLatLng.bind(this);
        this.turnOffModals = this.turnOffModals.bind(this);
        this.add_id = this.add_id.bind(this);
        this.state = {
            getAllPins: props.getAllPins,
            ref: props.mapRef,
            pid: '',
            shouldDisplay: false,
            tripId: props.tripId,
            pinAddModal: false,
            pinInfoModal: false,
            lat: EIFFEL_TOWER_POSITION.lat,
            lon: EIFFEL_TOWER_POSITION.lon,
            latlngmap: {}, //empty hashmap,
            map: map
        }
    }

    turnOffModals() {
        this.setState({
            shouldDisplay: false,
            pinAddModal: false,
            pinInfoModal: false,
        });
    }

    get_key(lat, lng) {
        var newLat = lat.toFixed(7);
        var newLon = lng.toFixed(7);
        return newLat.toString() + newLon.toString();
    }

    add_id(id, lat, lng) {
        var key = this.get_key(lat, lng);
        this.state.latlngmap[key] = id; //add to hashmap
    }

    setActiveLatLng(lat, lng) {
        this.setState({
            lat: lat,
            lon: lng
        });
    }

    getAllPins() {
        const db = firebase.firestore();
        var tripRef = db.collection('trips').doc(this.state.tripId);
        var pinRef = db.collection('pins');
        tripRef.get().then((trip) => {
            var pins = trip.data().pins;
            if (pins != undefined) {
                for (var i = 0; i < pins.length; i++) {
                    //concurrency wooh
                    pinRef.doc(pins[i]).get().then((rec) => {
                        var p = rec.data();
                        var temp_l = new window.google.maps.LatLng(p.lat, p.lon);
                        this.add_id(rec.id, p.lat, p.lon);
                        this.createMarker(temp_l);
                    });
                }
            }

        });
    }

    togglePinAddModal() {
        this.setState({
            shouldDisplay: false,
            pinAddModal: true,
            pinInfoModal: false,
        });
    }

    togglePinInfoModal(lat, lon) {
        var key = this.get_key(lat, lon);
        this.setState({
            shouldDisplay: true,
            pid: this.state.latlngmap[key],
            pinAddModal: false,
            pinInfoModal: true
        });
        map.setCenter(new window.google.maps.LatLng(lat, lon));
    }

    createMarker(latLng) {
        //used in the reres function;
        var marker = new window.google.maps.Marker({
            position: latLng,
            map: map
        });
        //add click event listener to the marker
        var self_reference = this;

        marker.addListener('click', function (evt) {
            self_reference.togglePinInfoModal(marker.position.lat(), marker.position.lng());
            map.setCenter(marker.position);
        });
    }
    componentDidMount() {
        const db = firebase.firestore();
        var tripRef = db.collection('trips').doc(this.state.tripId);
        var pinRef = db.collection('pins');
        tripRef.get().then((trip) => {
            if(trip.data()!== undefined && trip.data().images !== undefined){
                var pins = trip.data().pins;
                if (pins !== undefined && pins.length !== 0) {
                    pinRef.doc(pins[0]).get().then((rec) => {
                        var p = rec.data();
                        EIFFEL_TOWER_POSITION.lat = p.lat;
                        EIFFEL_TOWER_POSITION.lng = p.lon;
                        // console.log('position: ' +p.lat+", "+ p.lat)
                        this.after();
                    });
                }
            }else{
                this.after();
            }
        })
    }
    after=()=>{
        console.log('after effiel')
        // Connect the initMap() function within this class to the global window context,
        // so Google Maps can invoke it
        window.initMap = this.initMap;
        window.initMap = this.initMap.bind(this);
        // Asynchronously load the Google Maps script, passing in the callback reference
        loadJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyCUlyvUVgd_Ev_HlhcneCaBOzUcZC8CG8U&libraries=places&callback=initMap')
    }

    initMap() {
        map = new window.google.maps.Map(this.refs.map, {
            center: EIFFEL_TOWER_POSITION,
            zoom: 12
        });
        var bin = document.querySelector('#mapwrapper');
        var offset = document.getElementById("left-column").offsetWidth;
        var self_reference = this;

        function point2LatLng(point, map) {
            if (!map) {
                return null;
            }
            point.x = point.x - offset;
            var topRight = map.getProjection().fromLatLngToPoint(map.getBounds().getNorthEast());
            var bottomLeft = map.getProjection().fromLatLngToPoint(map.getBounds().getSouthWest());
            var scale = Math.pow(2, map.getZoom());
            var worldPoint = new window.google.maps.Point(point.x / scale + bottomLeft.x, point.y / scale + topRight.y);
            return map.getProjection().fromPointToLatLng(worldPoint);
        }

        bin.addEventListener('dragover', function (e) {
            if (e.preventDefault) e.preventDefault(); // allows us to drop
            e.dataTransfer.dropEffect = 'copy';
            return false;
        });

        bin.addEventListener('drop', function (e) {
            var p = new window.google.maps.Point(e.x, e.y);
            var latlng = point2LatLng(p, map);
            e.dataTransfer.dropEffect = 'copy';
            self_reference.setActiveLatLng(latlng.lat(), latlng.lng());
            self_reference.createMarker(latlng);
            self_reference.togglePinAddModal();
            return false;
        });
        var input = document.getElementById('place-input');
        var searchBox = new window.google.maps.places.SearchBox(input);

        map.addListener('bounds_changed', function () {
            searchBox.setBounds(map.getBounds());
        });
        searchBox.addListener('places_changed', function () {
            var places = searchBox.getPlaces();
            if (places.length == 0) {
                return;
            }
            // For each place, get the icon, name and location.
            var bounds = new window.google.maps.LatLngBounds();
            places.forEach(function (place) {
                if (!place.geometry) {
                    console.log("Returned place contains no geometry");
                    return;
                }
                if (place.geometry.viewport) {
                    // Only geocodes have viewport.
                    bounds.union(place.geometry.viewport);
                } else {
                    bounds.extend(place.geometry.location);
                }
            });
            map.fitBounds(bounds);
            var latlng = map.getCenter();
            self_reference.setActiveLatLng(latlng.lat(), latlng.lng());
            self_reference.createMarker(latlng);
            self_reference.togglePinAddModal();
        });
        this.getAllPins();
    }

    render() {
        return (
            <div ref="map" style={{height: '100%', width: '100%'}}>
                <AddPin
                    turnOffModals={this.turnOffModals}
                    getAllPins={this.state.getAllPins}
                    shouldDisplay={this.state.shouldDisplay}
                    modal={this.state.pinAddModal}
                    add_id={this.add_id}
                    tripId={this.state.tripId}
                    lat={this.state.lat}
                    lon={this.state.lon}
                />

                <PinInfo
                    shouldDisplay={this.state.shouldDisplay}
                    pid={this.state.pid}
                    modal={this.state.pinInfoModal}
                />
            </div>
        );
    }
}
