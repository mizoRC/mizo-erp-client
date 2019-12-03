import React from 'react';
import { withGoogleMap, GoogleMap, Marker, InfoWindow } from "react-google-maps";
import { locationIcon } from '../../assets/locationB64';
let currentPositionIntervalID;

const Map = ({markers}) => {
    const map = React.useRef();
    const [opened, setOpened] = React.useState();
    const [position, setPosition] = React.useState();

    const toggleOpen = index => {
        if(opened !== index){
            setOpened(index);
        }
        else{
            setOpened();
        }
    }

    const getCenter = () => {
        let bounds = new window.google.maps.LatLngBounds();

        markers.forEach(marker => {
            bounds.extend(marker.position);
        });

        map.current.fitBounds(bounds);
    }

    const getGeoLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const newPosition = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    }
                    setPosition(newPosition);
                }
            )
        }
    }

    React.useEffect(() => {
        currentPositionIntervalID = setInterval(() => {
            getGeoLocation();
        }, 1000);

        return () => clearInterval(currentPositionIntervalID);
    },[])

    React.useEffect(() => {
        if(!!map.current) getCenter();
    },[map, markers]);

    return(
        <GoogleMap
            ref={map}
            defaultZoom={14}
        >
            {markers.map((marker, index) => (
                <Marker
                    position={marker.position}
                    onClick={() => {toggleOpen(index)}}
                >
                    {(opened === index) && 
                        <InfoWindow onCloseClick={() => {toggleOpen(index)}}>
                            <div>{marker.label}</div>
                        </InfoWindow>
                    }
                </Marker>
            ))}

            {/* <Marker
                position={position}
                icon={locationIcon}
            ></Marker> */}

            <Marker
                position={position}
                icon={{ url: locationIcon, scaledSize: { width: 32, height: 32 } }}
            ></Marker>
        </GoogleMap>
    )
}

export default withGoogleMap(Map);