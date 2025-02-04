"use client";
import React, { useState, useEffect } from "react";
import { GoogleMap, MarkerF } from "@react-google-maps/api";
import { FaSearch } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { IoLocationOutline } from "react-icons/io5";
import { useTranslation } from "@/components/Layout/TranslationContext";

// Define the map container style
const containerStyle = {
  width: "100%",
  height: "100%",
};

const Map = ({
  latitude,
  longitude,
  isLoaded,
  loadError,
  isClicked,
  onLocationChange, // Function to update the selected location address
}) => {
  const t = useTranslation();


  const [isLoading, setIsLoading] = useState(false); // API loading state
  const [isSelecting, setIsSelecting] = useState(false); // Prevent API calls during selection
  const [markerPosition, setMarkerPosition] = useState({}); // Marker position state
  const [map, setMap] = useState(null); // Store the map instance
  const [zoom, setZoom] = useState(14); // Map zoom level
  const geocoder = new window.google.maps.Geocoder(); // Geocoder instance for reverse geocoding

  const [searchInput, setSearchInput] = useState(""); // Track user input
  const [placeSuggestions, setPlaceSuggestions] = useState([]); // Store API results
  const [activeIndex, setActiveIndex] = useState(-1); // Track currently focused suggestion

  // Function to handle geocoding (reverse lookup from lat/lon)
  const geocodeLatLng = (lat, lng) => {
    const latLng = new window.google.maps.LatLng(lat, lng);
    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === "OK" && results.length > 0) {
        // Find the first valid formatted_address
        const address =
          results.find((result) => result.formatted_address)
            ?.formatted_address || "Address not found";

        let city = "City not found";
        for (const component of results[0].address_components) {
          if (component.types.includes("locality")) {
            city = component.long_name;
            break;
          }
        }

        const fullAddress = {
          lat: lat,
          lng: lng,
          address: address,
          city: city,
        };
        onLocationChange(fullAddress); // Pass the address back to the parent component
      } else {
        console.error("Geocode failed due to: " + status);
      }
    });
  };

  // Set initial marker position when latitude/longitude props change
  useEffect(() => {
    if (latitude && longitude) {
      setMarkerPosition({
        lat: parseFloat(latitude),
        lng: parseFloat(longitude),
      });
      geocodeLatLng(latitude, longitude);
    }
  }, [latitude, longitude]);

  // Handle marker drag end event
  const handleMarkerDragEnd = (e) => {
    const newLat = e.latLng.lat(); // Get latitude after drag
    const newLng = e.latLng.lng(); // Get longitude after drag

    // Update the marker position state
    setMarkerPosition({ lat: newLat, lng: newLng });

    // Get the address for the new position
    geocodeLatLng(newLat, newLng);
  };

  // Fetch places when input changes
  useEffect(() => {
    if (!searchInput.trim() || isSelecting) {
      // Clear suggestions if input is empty or during selection
      setPlaceSuggestions([]);
      setActiveIndex(-1);
      return;
    }

    const fetchPlaces = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/places-autocomplete?input=${searchInput}`
        );
        const data = await response.json();
        setPlaceSuggestions(data.predictions || []);
        setActiveIndex(-1); // Reset index when suggestions change
      } catch (error) {
        console.error("Error fetching places:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce API calls
    const timeoutId = setTimeout(fetchPlaces, 500);
    return () => clearTimeout(timeoutId);
  }, [searchInput, isSelecting]);

  // Handle place selection from suggestions
  const handlePlaceSelect = (place) => {
    setIsSelecting(true); // Mark as selecting to prevent API call

    // Update the marker position
    setMarkerPosition({ lat: place.lat, lng: place.lng });
    setZoom(18);

    // Center the map to the selected place
    if (map) {
      map.panTo({ lat: place.lat, lng: place.lng });
    }

    const fullAddress = {
      lat: place.lat,
      lng: place.lng,
      address: place.description,
    };
    onLocationChange(fullAddress); // Pass the address back to the parent component

    // Clear the search input and suggestions
    setSearchInput(""); // Clear the input field
    setPlaceSuggestions([]); // Clear suggestions
    setActiveIndex(-1); // Reset active index

    // Delay allowing API calls after a short timeout
    setTimeout(() => setIsSelecting(false), 500);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (placeSuggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      // Move focus down
      setActiveIndex((prevIndex) =>
        prevIndex < placeSuggestions.length - 1 ? prevIndex + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      // Move focus up
      setActiveIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : placeSuggestions.length - 1
      );
    } else if (e.key === "Enter" && activeIndex !== -1) {
      // Select the active suggestion
      handlePlaceSelect(placeSuggestions[activeIndex]);
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
        <div className="relative flex items-center gap-3 card_bg p-2 w-full border rounded-xl">
          <FaSearch />
          <input
            className="ml-2 focus:outline-none w-full text-sm sm:text-base bg-transparent"
            placeholder={t("enterLocation")}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)} // Update search input
            onKeyDown={handleKeyDown} // Handle keyboard events
          />
        </div>
        {/* Dropdown of suggestions */}
        {placeSuggestions.length > 0 && (
          <div
            className="absolute z-10 w-full top-14 card_bg rounded-b-xl shadow-lg max-h-60 overflow-y-auto primary_text_color"
            style={{
              scrollbarWidth: "none", // For Firefox
              msOverflowStyle: "none", // For Internet Explorer and Edge
            }}
          >
            {placeSuggestions.map((place, index) => (
              <div
                key={place.place_id}
                className={`cursor-pointer p-2 flex items-center gap-3 border-dashed border-b border-t-0 border-l-0 border-r-0 border last:border-none ${
                  index === activeIndex ? "primary_bg_color text-white" : ""
                }`}
                onClick={() => handlePlaceSelect(place)}
              >
                <span>
                  <IoLocationOutline size={22} />
                </span>
                <span>{place.description}</span>
              </div>
            ))}
          </div>
        )}
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