"use client";
import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, MarkerF, Autocomplete } from "@react-google-maps/api";
import { FaSearch } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/components/Layout/TranslationContext";

// Define the map container style
const containerStyle = {
  width: "100%",
  height: "100%",
};

// Default position of the marker (can be updated later)
const defaultPosition = { lat: 40.748817, lng: -73.985428 }; // Example: New York City

const Map = ({
  latitude,
  longitude,
  isLoaded,
  loadError,
  isClicked,
  onLocationChange, // Function to update the selected location address
}) => {
  const t = useTranslation();


  const [markerPosition, setMarkerPosition] = useState(defaultPosition);
  const [map, setMap] = useState(null); // Store the map instance
  const [zoom, setZoom] = useState(14);
  const autocompleteRef = useRef(null); // Reference for the autocomplete input
  const geocoder = new window.google.maps.Geocoder(); // Geocoder instance for reverse geocoding

  // Set initial marker position when latitude/longitude props change
  useEffect(() => {
    if (latitude && longitude) {
      setMarkerPosition({
        lat: parseFloat(latitude),
        lng: parseFloat(longitude),
      });
    }
  }, [latitude, longitude]);

  // Function to handle geocoding (reverse lookup from lat/lon)
  const geocodeLatLng = (lat, lng) => {
    const latLng = new window.google.maps.LatLng(lat, lng);
    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === "OK" && results.length > 0) {
        // Find the first valid formatted_address
        const address =
          results.find((result) => result.formatted_address)
            ?.formatted_address || "Address not found";
        const fullAddress = {
          lat: lat,
          lng: lng,
          address: address,
        };
        onLocationChange(fullAddress); // Pass the address back to the parent component
      } else {
        console.error("Geocode failed due to: " + status);
      }
    });
  };
  // Handle marker drag end event
  const handleMarkerDragEnd = (e) => {
    const newLat = e.latLng.lat(); // Get latitude after drag
    const newLng = e.latLng.lng(); // Get longitude after drag

    // Update the marker position state
    setMarkerPosition({ lat: newLat, lng: newLng });

    // Get the address for the new position
    geocodeLatLng(newLat, newLng);
  };

  // Handle place selection from autocomplete
  const handlePlaceSelect = () => {
    const place = autocompleteRef.current.getPlace();
    if (place && place.geometry) {
      const newLat = place.geometry.location.lat();
      const newLng = place.geometry.location.lng();

      // Update the marker position
      setMarkerPosition({ lat: newLat, lng: newLng });
      setZoom(18);

      // Center the map to the selected place
      if (map) {
        map.panTo({ lat: newLat, lng: newLng });
      }

      // Get the address for the selected place
      geocodeLatLng(newLat, newLng);
    }
  };

  // Error or loading states
  if (loadError) {
    return <div>Error loading Google Maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative w-full h-full">
      {/* Autocomplete Search Input */}
      <div
        className={cn("absolute z-10 w-full p-4 transition-all duration-700", {
          "top-0 opacity-100": isClicked,
          "-top-16 opacity-0": !isClicked,
        })}
      >
        <Autocomplete
          onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
          onPlaceChanged={handlePlaceSelect}
        >
          <div className="flex items-center gap-3 card_bg p-2 w-full border rounded-xl">
            <FaSearch />
            <input
              type="text"
              placeholder={t("searchPlace")}
              className="bg-transparent focus:outline-none w-full"
            />
          </div>
        </Autocomplete>
      </div>

      {/* Google Map */}
      <GoogleMap
        className="map_box w-full relative"
        center={markerPosition} // Use current marker position
        zoom={zoom}
        mapContainerStyle={containerStyle}
        options={{
          fullscreenControl: false,
          mapTypeControl: false,
          streetViewControl: false,
          zoomControl: true,
        }}
        onLoad={(mapInstance) => setMap(mapInstance)} // Get map instance
      >
        <MarkerF
          position={markerPosition} // Set marker position
          draggable={true} // Make marker draggable
          onDragEnd={handleMarkerDragEnd} // Trigger when dragging ends
        />
      </GoogleMap>
    </div>
  );
};

export default Map;
