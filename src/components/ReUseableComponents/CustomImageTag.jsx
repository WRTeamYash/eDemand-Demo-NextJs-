"use client";
import React, { useEffect, useState } from "react";
import ImagePlaceholder from "../../assets/placeholder.svg";
import { store } from "@/redux/store";

const CustomImageTag = ({ src, alt, className }) => {
  let settings = store.getState().settingsData?.settings?.web_settings;
  const placeholderLogo = settings?.web_half_logo
    ? settings?.web_half_logo
    : ImagePlaceholder;
  const [imageSrc, setImageSrc] = useState(src); // Initialize with the actual image src
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!src || src === "") {
      // If the `src` is empty or undefined, use the placeholder image
      setImageSrc(placeholderLogo || ImagePlaceholder);
    } else {
      setImageSrc(src);
    }
  }, [src, settings]); // Add `src` to the dependency array

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    // If there's an error loading the image, fall back to the placeholder
    setImageSrc(placeholderLogo || ImagePlaceholder);
  };

  return (
    <img
      src={
        typeof imageSrc === "object" && imageSrc?.src ? imageSrc.src : imageSrc
      }
      alt={alt}
      className={className}
      onLoad={handleLoad}
      onError={handleError}
      loading="lazy"
    />
  );
};

export default CustomImageTag;
