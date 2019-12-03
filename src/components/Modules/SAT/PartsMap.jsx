import React from 'react';
import Map from '../../Segments/Map';

const PartsMap = ({height, parts}) => {
    let geocoder = new window.google.maps.Geocoder();
    const[markers, setMarkers] = React.useState([]);

    React.useEffect(() => {
        console.info(geocoder);
    },[geocoder])

    return(
        <Map
            googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_APIKEY}&v=3.exp&libraries=geometry,drawing,places`}
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: height, width: '100%'}} />}
            mapElement={<div style={{ height: `100%` }} />}
        />
    )
}

export default PartsMap;