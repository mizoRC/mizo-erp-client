import React from 'react';
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps"

const Map = () => {
    return(
        <GoogleMap
            defaultZoom={16}
            defaultCenter={{ lat: 42.394253, lng: -8.828826 }}
        >
            <Marker 
                position={{ lat: 42.394253, lng: -8.828826 }} 
            />
        </GoogleMap>
    )
}

export default withGoogleMap(Map);