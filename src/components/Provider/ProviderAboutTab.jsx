import { t, useGoogleMapsLoader } from "@/utils/Helper";
import { GoogleMap, MarkerF } from "@react-google-maps/api";
import React, { useState, useEffect, useRef } from "react";
import { GrLocation } from "react-icons/gr";
import { useTranslation } from "../Layout/TranslationContext";

const ProviderAboutTab = ({ providerData }) => {
  const t = useTranslation()

  const { isLoaded, loadError } = useGoogleMapsLoader();

  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const aboutRef = useRef(null);

  // Convert time from 24-hour format to 12-hour format
  const convertTo12HourFormat = (time) => {
    const [hours, minutes] = time?.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const adjustedHours = hours % 12 || 12; // Convert 0 or 24 to 12
    return `${adjustedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  // Mapping provider's data to opening hours
  const openingHours = days?.map((day) => ({
    day: day.charAt(0).toUpperCase() + day.slice(1), // Capitalize the day
    hours:
      providerData[`${day}_is_open`] === "1"
        ? `${convertTo12HourFormat(
          providerData[`${day}_opening_time`]
        )} - ${convertTo12HourFormat(providerData[`${day}_closing_time`])}`
        : "Closed",
  }));

  const todayIndex = new Date().getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
  const today = openingHours[todayIndex];

  const todayHours =
    today.hours !== "Closed"
      ? today.hours.replace(/:00/g, "") // Optional: remove ":00" from times
      : "Closed";

  // Check if About Us section is overflowing
  useEffect(() => {
    if (aboutRef.current) {
      const lineHeight = parseFloat(
        getComputedStyle(aboutRef.current).lineHeight
      );
      const maxLinesHeight = lineHeight * 4; // Height for 4 lines
      setIsOverflowing(aboutRef.current.scrollHeight > maxLinesHeight);
    }
  }, [providerData]);

  // Error or loading states
  if (loadError) {
    return <div>Error loading Google Maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  // Center coordinates for the map
  const center = {
    lat: Number(providerData?.latitude) || 0,
    lng: Number(providerData?.longitude) || 0,
  };
  return (
    <div className="space-y-6">
      {/* Company Information */}
      {providerData?.about && (
        <div className="rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
            {t("companyInformation")}
          </h2>
          <div className="space-y-4">
            <p
              ref={aboutRef}
              className={`text-sm description_color leading-relaxed ${!isExpanded ? "line-clamp-4" : ""
                } transition-all duration-300`}
            >
              {providerData?.about}
            </p>
            {isOverflowing && (
              <button
                className="text-sm hover:underline"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? "View Less" : "View More"}
              </button>
            )}
          </div>
        </div>
      )}
      {/* Business Hours */}
      <div className="rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {t("bussinessHours")}
          </h2>
          <div className="text-sm text-nowrap ">
            <span className="description_color">{t("today")} </span>
            <span className="primary_text_color">
              {todayHours !== "Closed" ? todayHours : "Closed"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 light_bg_color p-[18px] rounded-md">
          {openingHours?.map((schedule, index) => (
            <div key={index} className="card_bg p-3 shadow-sm rounded-md">
              <p className="font-medium text-gray-900 dark:text-white">
                {schedule?.day}
              </p>
              <p className="text-sm description_color">{schedule?.hours}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Us */}
      {providerData?.latitude &&
        providerData?.longitude &&
        providerData?.address && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {t("contactUs")}
            </h2>

            {/* Map */}
            <div className="w-full h-[320px] rounded-lg mb-4 relative overflow-hidden">
              <GoogleMap
                mapContainerClassName="w-full h-full"
                center={center}
                zoom={15}
              >
                {providerData?.latitude && providerData?.longitude && (
                  <MarkerF position={center} />
                )}
              </GoogleMap>
            </div>

            {/* Address */}
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center p-[12px] light_bg_color rounded-md primary_text_color">
                <GrLocation className="h-5 w-5 mt-1 flex-shrink-0" />
              </div>
              <div>
                <p className="text-sm primary_text_color">{t("address")}</p>
                <p className="text-xs sm:text-base md:text-lg font-medium">{providerData?.address}</p>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default ProviderAboutTab;
