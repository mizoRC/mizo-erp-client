import React from 'react';
import { withGoogleMap, GoogleMap, Marker, InfoWindow } from "react-google-maps";
import { locationIcon, markerIcon, markerDoneIcon } from '../../assets/locationB64';
import { TranslatorContext } from '../../contextProviders/Translator';
// let currentPositionIntervalID;

const Map = ({markers}) => {
    const { translations } = React.useContext(TranslatorContext);
    const map = React.useRef();
    const [opened, setOpened] = React.useState();
    const [position, setPosition] = React.useState();
    const [openedPosition, setOpenedPosition] = React.useState(false);

    const toggleOpen = index => {
        if(opened !== index){
            setOpened(index);
            setOpenedPosition(false);
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

        if(position) bounds.extend(position);

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

    const toggleOpenPosition = () => {
        if(!openedPosition) setOpened();
        setOpenedPosition(!openedPosition);
    }

    React.useEffect(() => {
        getGeoLocation();
        /* currentPositionIntervalID = setInterval(() => {
            getGeoLocation();
        }, 1000);

        return () => clearInterval(currentPositionIntervalID); */
    },[map])

    React.useEffect(() => {
        if(!!map.current) getCenter();
    },[map, markers, position]);

    return(
        <GoogleMap
            ref={map}
            defaultZoom={14}
        >
            {markers.map((marker, index) => (
                <Marker
                    key={index}
                    position={marker.position}
                    onClick={() => {toggleOpen(index)}}
                    icon={{ 
                        url: marker.finished ? markerDoneIcon : markerIcon, 
                        scaledSize: { width: 32, height: 32 } 
                    }}
                >
                    {(opened === index) && 
                        <InfoWindow onCloseClick={() => {toggleOpen(index)}}>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexDirection: 'column'
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: '18px',
                                        marginBottom: '10px'
                                    }}
                                >
                                    {marker.labelCustomer}
                                </div>
                                <div
                                    style={{
                                        fontSize: '13px'
                                    }}
                                >
                                    {marker.labelReason}
                                </div>
                            </div>
                        </InfoWindow>
                    }
                </Marker>
            ))}

            <Marker
                position={position}
                icon={{ url: locationIcon, scaledSize: { width: 32, height: 32 } }}
                onClick={toggleOpenPosition}
            >
                {openedPosition && 
                    <InfoWindow onCloseClick={toggleOpenPosition}>
                        <div>{translations.currentLocation}</div>
                    </InfoWindow>
                }
            </Marker>
        </GoogleMap>
    )
}

export default withGoogleMap(Map);