import React from 'react';
import { getCurrentPosition } from '../../../utils/geo';
import Map from '../../Segments/Map';

const PartsMap = ({height, parts, setDistances}) => {
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

    const getDistance = async (location, currentPosition) => {
        return new Promise((resolve, reject) => {
            const fromLocation = new window.google.maps.LatLng(location.lat, location.lng);
            const toLocation = new window.google.maps.LatLng(currentPosition.lat, currentPosition.lng);
            const distance = window.google.maps.geometry.spherical.computeDistanceBetween (fromLocation, toLocation);
            const kmDistance = parseFloat((distance / 1000).toFixed(2));
            resolve(kmDistance);
        })
    }

    const getDistances = async (locations, currentPosition) => {
        try {
            let distancePromises = [];
            for(let i = 0; i < locations.length; i++){
                distancePromises.push(getDistance(locations[i], currentPosition))
            }
            
            const distances = await Promise.all(distancePromises);
            return distances;
        } catch (error) {
            throw Error(error);
        }
    }

    const buildMarkers = async() => {
        let newMarkers = [];
        let currentPosition;

        try {
            const { coords } = await getCurrentPosition();
            const { latitude, longitude } = coords;
            currentPosition = {
                lat: latitude,
                lng: longitude
            }
        } catch (error) {
            currentPosition = null;
        }

        const locations = await getLocations();
        let distances;
        if(currentPosition) distances = await getDistances(locations, currentPosition);

        parts.forEach((part,index) => {
            let marker = {
                position: locations[index],
                labelReason: part.reason,
                labelCustomer: part.customer.name,
                finished: part.finished
            }
            if(distances) marker.distance = distances[index];
            newMarkers.push(marker);
        });

        setMarkers(newMarkers);
        if(distances) setDistances(distances);
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