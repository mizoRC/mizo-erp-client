import React from 'react';
import Map from '../../Segments/Map';

const PartsMap = ({height, parts}) => {
    let geocoder = new window.google.maps.Geocoder();
    const[markers, setMarkers] = React.useState([]);

    const findLatLang = address => {
        return new Promise((resolve, reject) => {
            geocoder.geocode({'address': address}, function(results, status) {
                if (status === "OK" && status !== "ZERO_RESULTS") {
                    const coords = results[0].geometry.location.toJSON();
                    resolve(coords);
                } else {
                    reject(new Error('Couldnt\'t find the location ' + address));
                }
            })
        })
    } 

    const getLocations = async() => {
        try {
            let locationPromises = [];
            for(let i = 0; i < parts.length; i++){
                locationPromises.push(findLatLang(parts[i].address))
            }
            
            const locations = await Promise.all(locationPromises);
            return locations;
        } catch (error) {
            throw Error(error);
        }
    }

    const buildMarkers = async() => {
        let newMarkers = [];
        
        const locations = await getLocations();
        parts.forEach((part,index) => {
            let marker = {
                position: locations[index],
                label: part.reason
            }
            newMarkers.push(marker);
        });

        setMarkers(newMarkers);
    }

    React.useEffect(() => {
        buildMarkers();
    }, [parts]);

    return(
        <Map
            googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_APIKEY}&v=3.exp&libraries=geometry,drawing,places`}
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: height, width: '100%'}} />}
            mapElement={<div style={{ height: `100%` }} />}
            markers={markers}
        />
    )
}

export default PartsMap;