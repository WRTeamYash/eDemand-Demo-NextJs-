import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import ServiceCard from "../Cards/ServiceCard";
import {
  MdOutlineArrowForwardIos,
  MdOutlineArrowBackIosNew,
} from "react-icons/md";
import CommanCenterText from "../ReUseableComponents/CommanCenterText";
import { useRTL } from "@/utils/Helper";

const OurServices = ({ title, desc, data }) => {
  const swiperRef = useRef(null);
  const isRTL = useRTL();
  const breakpoints = {
    320: {
      slidesPerView: 1,
    },
    375: {
      slidesPerView: 1.5,
    },
    576: {
      slidesPerView: 2,
    },
    768: {
      slidesPerView: 2.5,
    },
    992: {
      slidesPerView: 3,
    },
    1200: {
      slidesPerView: 4.5,
    },
    1400: {
      slidesPerView: 5,
    },
  };

  return (
    <section id="our_service" className="relative py-8 md:py-20">
      <div className="container mx-auto">
        <div className="detail flex flex-col items-center justify-center">
          <CommanCenterText
            highlightedText={""}
            title={title}
            description={desc}
          />
          <div className="services mt-10 w-full relative">
            <Swiper
              spaceBetween={20}
              slidesPerView={1}
              breakpoints={breakpoints}
              dir={isRTL ? "rtl" : "ltr"}
              modules={[Navigation]}
              key={isRTL}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              className="custom-swiper"
            >
              {data.map((service, index) => (
                <SwiperSlide key={index}>
                  <ServiceCard data={service} />
                </SwiperSlide>
              ))}
            </Swiper>
            {data && data?.length > 5 &&
            <div className="flex items-center justify-center gap-[32px] w-full mt-[70px]">
              <button
                onClick={() => swiperRef.current.slidePrev()}
                className="p-2 bg-transparent border-solid border-[1px] border-black dark:border-white rounded-full"
                >
                <MdOutlineArrowBackIosNew size={20} />
              </button>
              <button
                onClick={() => swiperRef.current.slideNext()}
                className="p-2 bg-transparent border-solid border-[1px] border-black dark:border-white rounded-full"
                >
                <MdOutlineArrowForwardIos size={20} />
              </button>
            </div>
              }
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurServices;
