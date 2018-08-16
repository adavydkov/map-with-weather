import React from "react";

import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";

import { compose, withProps } from "recompose";

import "./style.css";

const GOOGLE_API_KEY = "AIzaSyAriseuZ90QqiVw_NihABttqK-hS0XkDM4";
const GOOGLE_MAP_URL = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}`;

export const Map = props => (
  <div className={`map-container`}>
    <GoogleMapComponent
      onClick={props.onClick}
      mapCenterLat={props.mapCenterLat}
      mapCenterLng={props.mapCenterLng}
      markerLat={props.markerLat}
      markerLng={props.markerLng}
      zoom={10}
    />
  </div>
);

const GoogleMapComponent = compose(
  withProps({
    googleMapURL: GOOGLE_MAP_URL,
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `50vh`, maxHeight: "400px" }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap
    defaultZoom={props.zoom}
    defaultCenter={{ lat: props.mapCenterLat, lng: props.mapCenterLng }}
    onClick={props.onClick}
  >
    {props.markerLat &&
      props.markerLng && (
        <Marker
          position={{ lat: props.markerLat, lng: props.markerLng }}
          draggable={false}
        />
      )}
  </GoogleMap>
));
