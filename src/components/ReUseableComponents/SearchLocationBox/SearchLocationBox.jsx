"use client";
import React, { useState, useEffect } from "react";
import { IoLocationOutline, IoLocationSharp, IoSearch } from "react-icons/io5";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import {
  locationAddressData,
  setLatitude,
  setLongitude,
} from "@/redux/reducers/locationSlice";
import { useRouter } from "next/router";
import { getFormattedAddress } from "@/utils/Helper";
import { useTranslation } from "@/components/Layout/TranslationContext";
import { getPlacesDetailsForWebApi, getPlacesForWebApi } from "@/api/apiRoutes";

const SearchLocationBox = ({ open, setIsModalOpen }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const t = useTranslation();

  const closeModal = () => setIsModalOpen(false);

  const [searchInput, setSearchInput] = useState(""); // Track user input
  const [isSelecting, setIsSelecting] = useState(false); // Prevent API calls during selection
  const [placeSuggestions, setPlaceSuggestions] = useState([]); // Store API results
  const [isLoading, setIsLoading] = useState(false); // API loading state
  const [activeIndex, setActiveIndex] = useState(-1); // Track currently focused suggestion
  const [fullAddress, setFullAddress] = useState({
    lat: "",
    lng: "",
    address: "",
  });

  // Fetch places when input changes
  useEffect(() => {
    if (!searchInput.trim() || isSelecting) {
      setPlaceSuggestions([]);
      setActiveIndex(-1);
      return;
    }

    const fetchPlaces = async () => {
      setIsLoading(true);
      try {
        const response = await getPlacesForWebApi({
          input: searchInput,
        });
        const data = await response?.data?.data;
        setPlaceSuggestions(data.predictions || []);
        setActiveIndex(-1); // Reset index when suggestions change
      } catch (error) {
        toast.error("Failed to fetch places. Please try again.");
        console.error("Error fetching places:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce API calls
    const timeoutId = setTimeout(fetchPlaces, 500);
    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  const fetchPlaceDetails = async (place) => {
    try {
      const response = await getPlacesDetailsForWebApi({
        place_id: place?.place_id,
      });
      return response?.data?.data?.results[0];
    } catch (error) {
      console.log(error);
    }
  };
  // Handle place selection
  const handlePlaceSelect = async (place) => {
    setIsSelecting(true); // Mark as selecting to prevent API call

    setSearchInput(place.description); // Set the selected place in the input field

    const fullAddress = await fetchPlaceDetails(place);

    setFullAddress({
      lat: fullAddress?.geometry?.location?.lat,
      lng: fullAddress?.geometry?.location?.lng,
      address: fullAddress?.formatted_address,
    });

    // Clear the search input and suggestions
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

  const handleSearchPlace = () => {
    if (fullAddress.lat && fullAddress.lng && fullAddress.address) {
      dispatch(setLatitude(fullAddress.lat));
      dispatch(setLongitude(fullAddress.lng));
      dispatch(locationAddressData(fullAddress.address));
      router.push("/");
    } else {
      toast.error(t("pleaseSelectValidLocation"));
    }
  };

  const getCurrentLocation = async () => {
    try {
      if (!navigator.geolocation) {
        toast.error(t("notSupportedGeolocation"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          // Dispatch latitude and longitude to Redux
          dispatch(setLatitude(latitude));
          dispatch(setLongitude(longitude));

          // Fetch and dispatch the formatted address
          const address = await getFormattedAddress(latitude, longitude);
          dispatch(locationAddressData(address));

          // Open the modal to show the location
          setIsModalOpen(true);
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              toast.error(t("permissionDenied"));
              break;
            case error.POSITION_UNAVAILABLE:
              toast.error(t("positionUnavailable"));
              break;
            case error.TIMEOUT:
              toast.error(t("timeoutforlocation"));
              break;
            default:
              toast.error(t("unknownError"));
              break;
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000, // 10 seconds
          maximumAge: 0,
        }
      );
    } catch (error) {
      console.error("Error fetching location:", error.message);
      toast.error("Failed to fetch location: " + error.message);
    }
  };
  return (
    <>
      <div className="search_input_box w-full relative flex flex-col sm:flex-row items-center card_bg p-2 rounded-md mt-4 sm:mt-6 lg:mt-10 gap-4">
        <div className="flex flex-1 items-center relative w-full">
          <IoLocationSharp size={20} className="description_color" />
          <input
            className="ml-2 focus:outline-none w-full text-sm sm:text-base bg-transparent"
            placeholder={t("enterLocation")}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)} // Update search input
            onKeyDown={handleKeyDown} // Handle keyboard events
          />
          {/* Dropdown of suggestions */}
          {placeSuggestions.length > 0 && (
            <div
              className="absolute z-10 w-full top-10 card_bg rounded-b-xl shadow-lg max-h-60 overflow-y-auto primary_text_color"
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
        <div className="flex-none flex sm:flex-row items-center justify-center gap-2 sm:gap-4 relative">
          <button
            className="px-3 py-2 bg-transparent description_color hover:primary_text_color rounded-md flex items-center justify-center gap-2 text-sm sm:text-base"
            onClick={() => getCurrentLocation()}
          >
            <FaLocationCrosshairs size={18} />
            <span>{t("locateMe")}</span>
          </button>
          <button
            className="px-3 py-2 primary_bg_color text-white rounded-md flex items-center justify-center gap-2 text-sm sm:text-base"
            onClick={handleSearchPlace}
          >
            <IoSearch size={18} />
            <span>{t("search")}</span>
          </button>
        </div>
        {/* Modal */}
      </div>
    </>
  );
};

export default SearchLocationBox;
