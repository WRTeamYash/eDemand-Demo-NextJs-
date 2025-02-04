import { miniDevider } from "@/utils/Helper";
import React, { useState, useRef, useEffect } from "react";
import { IoTimeOutline } from "react-icons/io5";
import dayjs from "dayjs"; // Import dayjs
import customParseFormat from "dayjs/plugin/customParseFormat";  // Import the plugin

// Extend dayjs to use custom parsing
dayjs.extend(customParseFormat);

const CustomTimePicker = ({ value, onChange, setSelectedTimeSlot }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState("00");
  const [selectedMinute, setSelectedMinute] = useState("00");
  const [selectedPeriod, setSelectedPeriod] = useState("PM");
  const dropdownRef = useRef(null);

  const hours = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    String(i).padStart(2, "0")
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTimeSelection = (type, value) => {
    let newHour = selectedHour;
    let newMinute = selectedMinute;
    let newPeriod = selectedPeriod;

    if (type === "hour") newHour = value;
    if (type === "minute") newMinute = value;
    if (type === "period") newPeriod = value;

    setSelectedHour(newHour);
    setSelectedMinute(newMinute);
    setSelectedPeriod(newPeriod);

    // Construct the time string and log it for debugging
    const newTime = `${newHour}${newMinute} ${newPeriod}`;

    // Use customParseFormat to parse the time string explicitly
    const formattedTime = dayjs(newTime, "hh:mm A").isValid()
      ? dayjs(newTime, "hh:mm A").format("HH:mm:00")
      : "Invalid Time"; // Ensure the time is valid before formatting


    onChange?.(formattedTime); // Call onChange with the formatted time
  };





  return (
    <div className="relative w-full !bg-transparent" ref={dropdownRef}>
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setSelectedTimeSlot(null);
        }}
        className="w-full flex items-center gap-2 p-2 rounded-md"
      >
        <IoTimeOutline size={24} />
        <span>{miniDevider}</span>
        <span>{value ? value : "Add Time"}</span>
      </button>

      {isOpen && (
        <div className="absolute mt-1 bg-white border rounded-lg shadow-lg z-50 flex">
          {/* Hours */}
          <div className="w-16 h-48 overflow-y-auto border-r">
            {hours.map((hour) => (
              <button
                key={hour}
                onClick={() => handleTimeSelection("hour", hour)}
                className={`w-full p-2 text-center hover:bg-blue-100 ${
                  selectedHour === hour ? "primary_bg_color text-white" : ""
                }`}
              >
                {hour}
              </button>
            ))}
          </div>

          {/* Minutes */}
          <div className="w-16 h-48 overflow-y-auto border-r">
            {minutes.map((minute) => (
              <button
                key={minute}
                onClick={() => handleTimeSelection("minute", minute)}
                className={`w-full p-2 text-center hover:bg-blue-100 ${
                  selectedMinute === minute ? "primary_bg_color text-white" : ""
                }`}
              >
                {minute}
              </button>
            ))}
          </div>

          {/* AM/PM */}
          <div className="w-16">
            <button
              onClick={() => handleTimeSelection("period", "AM")}
              className={`w-full p-2 text-center hover:bg-blue-100 ${
                selectedPeriod === "AM" ? "primary_bg_color text-white" : ""
              }`}
            >
              AM
            </button>
            <button
              onClick={() => handleTimeSelection("period", "PM")}
              className={`w-full p-2 text-center hover:bg-blue-100 ${
                selectedPeriod === "PM" ? "primary_bg_color text-white" : ""
              }`}
            >
              PM
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomTimePicker;
