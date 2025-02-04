"use client";
import React, { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { IoLocationOutline, IoSearchOutline } from "react-icons/io5";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { convertToSlug, placeholderImage, useRTL } from "@/utils/Helper";
import { FiChevronRight } from "react-icons/fi";

import CustomImageTag from "../ReUseableComponents/CustomImageTag";
import LocationModal from "../ReUseableComponents/LocationModal";
import { toast } from "react-toastify";
import { useTranslation } from "../Layout/TranslationContext";

const CustomNavigation = ({ onPrev, onNext }) => (
  <>
    <button
      onClick={onPrev}
      className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white z-10 p-2 rounded-full focus:outline-none hover:bg-opacity-75 transition-all"
      aria-label="Previous slide"
    >
      <ChevronLeft className="w-6 h-6 text-black" />
    </button>
    <button
      onClick={onNext}
      className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white z-10 p-2 rounded-full focus:outline-none hover:bg-opacity-75 transition-all"
      aria-label="Next slide"
    >
      <ChevronRight className="w-6 h-6 text-black" />
    </button>
  </>
);

const CustomPagination = ({ totalSlides, currentSlide, goToSlide, isRTL }) => {
  const [progress, setProgress] = useState(0);
  const [opacity, setOpacity] = useState(0);
  const animationRef = useRef(null);

  useEffect(() => {
    setProgress(0);
    setOpacity(0);

    const duration = 3000;
    const totalSteps = 100;
    const stepDuration = duration / totalSteps;

    const animateProgress = () => {
      let currentStep = 0;

      const interval = setInterval(() => {
        if (currentStep < totalSteps) {
          const newProgress = (currentStep / totalSteps) * 100;
          const newOpacity = newProgress / 100;

          setProgress(newProgress);
          setOpacity(newOpacity);

          currentStep += 1;
        } else {
          setProgress(100);
          setOpacity(1);
          clearInterval(interval);
        }
      }, stepDuration);

      return interval;
    };

    animationRef.current = animateProgress();

    return () => {
      clearInterval(animationRef.current);
    };
  }, [currentSlide]);

  return (
    <div className="absolute bottom-24 md:bottom-24 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10 bg-white dark:bg-[#212121] p-2 rounded-full">
      {Array.from({ length: totalSlides }).map((_, index) => (
        <button
          key={index}
          onClick={() => goToSlide(index)}
          className={`rounded-full transition-all relative overflow-hidden light_bg_color border border-[#ebf4ff] ${
            index === currentSlide ? "w-6 h-3" : "w-3 h-3"
          } ${isRTL ? "ml-2" : "mr-2"} last:m-0`}
          aria-label={`Go to slide ${index + 1}`}
        >
          {index === currentSlide && (
            <div
              className="absolute bottom-0 primary_bg_color border border_color"
              style={{
                [isRTL ? "right" : "left"]: "0",
                width: `${progress}%`,
                height: "12px",
                opacity: opacity,
                transition: "width 0.1s ease-in-out, opacity 0.1s ease-in-out",
                transform: isRTL ? "scaleX(-1)" : "none"
              }}
            ></div>
          )}
        </button>
      ))}
    </div>
  );
};

const HeroSlider = ({ sliderData }) => {
  const t = useTranslation();
  const isRTL = useRTL();
  const locationData = useSelector((state) => state.location);
  const swiperRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const handleClose = () => setIsModalOpen(false);

  const handleSlideChange = (swiper) => {
    let newIndex = swiper.realIndex; // `realIndex` gives the actual slide index in loop mode
    setCurrentSlide(newIndex);
  };

  const router = useRouter();

  const handleRouteSlider = (e, slide) => {
    e.preventDefault();

    switch (slide?.type) {
      case "url":
        if (slide?.url) {
          // If the slide type is "url", open the specified URL in a new tab
          window.open(slide?.url, "_blank");
        } else {
          console.warn("Missing URL:", slide);
        }
        break;

      case "provider":
        // For "provider", open the provider route in a new tab
        const providerRoute = `/provider-details/${slide?.type_id}`;
        router.push(providerRoute);
        break;

      case "Category":
        const cateID =
          slide?.category_parent_id === "0"
            ? slide?.type_id
            : slide?.category_parent_id;
        // For "category", open the category route in a new tab
        const categoryRoute = `/categories/${cateID}`;
        router.push(categoryRoute);
        break;

      default:
        console.warn("Invalid slide type or missing data:", slide);
        break;
    }
  };

  const handleSearchServiceOrProvider = () => {
    if (!searchQuery.trim()) {
      // Show a toast error when search query is empty
      toast.error("Please type a service or provider name!");
      return; // Exit the function
    }

    const slug = convertToSlug(searchQuery); // Convert the search query to a slug

    // Navigate to the search page
    router.push(`/search/${slug}`);
  };
  useEffect(() => {
    const swiperInstance = swiperRef.current;

    const stopAutoplay = () => {
      swiperInstance?.autoplay?.stop(); // Safely stop autoplay on hover
    };

    const startAutoplay = () => {
      swiperInstance?.autoplay?.start(); // Safely restart autoplay
    };

    if (swiperInstance && swiperInstance.el) {
      // Attach hover events to handle autoplay
      swiperInstance.el.addEventListener("mouseenter", stopAutoplay);
      swiperInstance.el.addEventListener("mouseleave", startAutoplay);

      return () => {
        // Cleanup the event listeners when component unmounts
        if (swiperInstance.el) {
          swiperInstance.el.removeEventListener("mouseenter", stopAutoplay);
          swiperInstance.el.removeEventListener("mouseleave", startAutoplay);
        }
      };
    }
  }, []);

  return (
    <div className="relative pb-16">
      <div className="relative w-full h-[500px] md:h-[600px] xl:h-[700px] group">
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          spaceBetween={0}
          slidesPerView={1}
          dir={isRTL ? "rtl" : "ltr"}
          key={isRTL}
          loop={true}
          onSlideChange={handleSlideChange}
          navigation={{
            prevEl: ".swiper-button-prev",
            nextEl: ".swiper-button-next",
          }}
          // autoplay={false} // Prevents autoplay pause on hover
          autoplay={{ delay: 3000, pauseOnMouseEnter: false }} // Prevents autoplay pause on hover
          pagination={{ clickable: true }}
          className="h-[500px] md:h-[600px] xl:h-[700px]"
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
        >
          {sliderData.map((slide, index) => (
            <SwiperSlide
              key={slide?.id}
              onClick={(e) => handleRouteSlider(e, slide)}
            >
              <CustomImageTag
                alt="slider_image"
                src={slide?.slider_web_image}
                width={0}
                height={0}
                onError={placeholderImage}
                className="w-full h-[450px] md:h-full object-contain cursor-pointer"
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom navigation buttons */}
        <div className="hidden group-hover:block opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <CustomNavigation
            onPrev={() => swiperRef.current?.slidePrev()}
            onNext={() => swiperRef.current?.slideNext()}
          />
        </div>

        {/* Custom pagination */}
        <CustomPagination
          totalSlides={sliderData?.length}
          currentSlide={currentSlide}
          goToSlide={(index) => swiperRef.current?.slideTo(index)}
          isRTL={isRTL}
        />

        <div className="searchLocation">
          <div className="container mx-auto">
            <div className="card_bg rounded-xl p-4 relative -mt-20 md:-mt-8 left-0 right-0 mx-auto z-10 max-w-full lg:max-w-4xl flex flex-col md:flex-row items-center justify-between border border-[#2121212e] gap-4">
              {/* Location Section */}
              <div className="location flex items-center w-full md:w-1/2 text-center md:text-left">
                <div className="flex flex-1 items-center justify-between  w-full">
                  <IoLocationOutline size={24} className="primary_text_color max-w-6 w-full" />
                  <input
                    readOnly
                    className="ml-2 focus:outline-none w-full text-sm sm:text-base bg-transparent"
                    placeholder={t("enterLocation")}
                    value={locationData?.locationAddress}
                  />
                  <div
                    className={`flex flex-1 items-center w-full ${isRTL ? "rotate-180" : "rotate-0"}`}
                    onClick={() => setIsModalOpen(true)}
                  >
                   {""} <FiChevronRight size={24} />
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="hidden md:block divider h-6 w-px bg-gray-300"></div>

              {/* Search Input */}
              <div className="searchProvider w-full md:w-1/2 flex items-center gap-1">
                <IoSearchOutline size={24} className="description_color" />

                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)} // Corrected here
                  type="text"
                  placeholder={t("searchService")}
                  className="bg-transparent border-none focus:outline-none w-full description_color"
                />
              </div>

              {/* Search Button */}
              <div
                className="search w-full md:w-auto text-center md:text-end"
                onClick={handleSearchServiceOrProvider}
              >
                <button className="primary_bg_color text-white rounded-md px-6 py-2 w-full md:w-auto transition">
                  {t("search")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <LocationModal open={isModalOpen} onClose={handleClose} />
      )}
    </div>
  );
};

export default HeroSlider;
