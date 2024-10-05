import React from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '200px'
};

function LocationViewer({ location }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY // Replace with your actual API key
  });

  const center = location ? 
    { lat: location.coordinates[1], lng: location.coordinates[0] } : 
    { lat: 0, lng: 0 };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="location-viewer">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        options={{ 
          disableDefaultUI: true,
          zoomControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false
        }}
      >
        {location && <Marker position={center} />}
      </GoogleMap>
    </div>
  );
}

export default LocationViewer;