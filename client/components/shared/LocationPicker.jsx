import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 0,
  lng: 0
};

function LocationPicker({ onLocationSelect }) {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY // Replace with your actual API key
  });

  const onMapClick = useCallback((event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setMarker({ lat, lng });
    onLocationSelect({ type: "Point", coordinates: [lng, lat] });
  }, [onLocationSelect]);

  const onMapLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const handleSearch = () => {
    if (map && searchQuery) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: searchQuery }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const { lat, lng } = results[0].geometry.location;
          map.setCenter({ lat: lat(), lng: lng() });
          setMarker({ lat: lat(), lng: lng() });
          onLocationSelect({ type: "Point", coordinates: [lng(), lat()] });
        }
      });
    }
  };

  useEffect(() => {
    if (isLoaded && map && marker) {
      map.panTo(marker);
    }
  }, [isLoaded, map, marker]);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for a location"
          className="flex-1"
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={2}
        onClick={onMapClick}
        onLoad={onMapLoad}
      >
        {marker && <Marker position={marker} />}
      </GoogleMap>
    </div>
  );
}

export default LocationPicker;