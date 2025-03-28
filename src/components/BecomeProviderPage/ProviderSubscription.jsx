import React, { useRef } from "react";
import SubscriptionCard from "../Cards/SubscriptionCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules"; // Import Navigation
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/scrollbar"; // Import Swiper scrollbar CSS
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useRTL } from "@/utils/Helper";

const ProviderSubscription = ({ data }) => {

  const swiperRef = useRef(null);
  const isRTL = useRTL();

  // Function to go to the next slide
  const goNext = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  // Function to go to the previous slide
  const goPrev = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  const breakpoints = {
    320: {
      slidesPerView: 1,
    },
    375: {
      slidesPerView: 1.1,
    },
    576: {
      slidesPerView: 1.5,
    },
    768: {
      slidesPerView: 2,
    },
    992: {
      slidesPerView: 2.5,
    },
    1200: {
      slidesPerView: 3,
    },
    1400: {
      slidesPerView: 3.5,
    },
  };

  return (
    <section id="provider_subscription" className="relative">
      <div className="subscription_details_header relative bg-black h-[405px]">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-4 items-start justify-start xl:items-center xl:justify-center py-8 md:py-20">
            <div className="sub_titles flex flex-col gap-4">
              <span className="background_color text-white flex items-center gap-2 px-3 py-1 rounded-md text-sm md:tag_lines w-fit font-medium">
                <div className="clip-star w-5 h-5 bg-white" />
                <span className="text uppercase">{data?.short_headline}</span>
                <div className="clip-star w-5 h-5 bg-white" />
              </span>
              <h2 className="text-xl md:text-2xl lg:main_headlines  font-bold text-white w-full mx-auto">
                {data?.title}
              </h2>
            </div>
            <div className="sub_desc flex flex-col gap-4">
              <p className="text-white text-sm md:description_text font-normal">
                {data?.description}
              </p>
              <div className="navigation_buttons flex items-center justify-start gap-2">
                <button
                  onClick={goPrev}
                  className="px-3 py-1 border border-white text-white rounded-full w-[38px] h-[38px] flex items-center justify-center p-5"
                >
                  <FaArrowLeft size={20} />
                </button>
                <button
                  onClick={goNext}
                  className="px-3 py-1 border border-white text-white rounded-full w-[38px] h-[38px] flex items-center justify-center p-5"
                >
                  <FaArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="subscription_cards light_bg_color">
        <div className="container mx-auto">
          <div className="sub_cards relative -mt-[40px] py-0 sm:-mt-[80px] lg:py-0 lg:-mt-[80px]">
            <div className="flex justify-center mx-auto h-auto sm:h-[600px]">
              <Swiper
                spaceBetween={20} // Space between slides
                slidesPerView={3.5}
                breakpoints={breakpoints}
                dir={isRTL ? "rtl" : "ltr"}
                key={isRTL}
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                }}
                modules={[Navigation, Autoplay]}
                autoplay={{
                  delay: 2500,
                  disableOnInteraction: false,
                }}
                loop={true}
                className="custom-swiper"
              >
                {data?.subscriptions?.map((plan, index) => (
                  <SwiperSlide key={index}>
                    <SubscriptionCard ele={plan} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProviderSubscription;
