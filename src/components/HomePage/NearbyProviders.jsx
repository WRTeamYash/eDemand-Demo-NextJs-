import React from 'react';
import CommanHeadline from '../ReUseableComponents/CommanHeadline';
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import { Autoplay, FreeMode } from 'swiper/modules';
import NearbyProviderCard from '../Cards/NearbyProviderCard';
import { useRTL } from '@/utils/Helper';

const NearbyProviders = ({sectionData}) => {
    const isRTL = useRTL();
    const breakpoints = {
        320: {
            slidesPerView: 1,
        },
        375: {
            slidesPerView: 1.2,
        },
        576: {
            slidesPerView: 1.5,
        },
        768: {
            slidesPerView: 1.5,
        },
        992: {
            slidesPerView: 1.8,
        },
        1200: {
            slidesPerView: 1.8,
        },
        1400: {
            slidesPerView: 2.7,
        },
        1600: {
            slidesPerView:3.5,
        },
    };

    return (
        <div className='categories py-[32px]'>
            <div className='container mx-auto'>
                <CommanHeadline
                    headline={sectionData?.title}
                    subHeadline={sectionData?.description}
                    link={""}
                />

                <div>
                    <Swiper
                        modules={[Autoplay, FreeMode]} // Include FreeMode module
                        spaceBetween={20}
                        loop={true}
                        key={isRTL}
                        dir={isRTL ? "rtl" : "ltr"}
                        autoplay={{ delay: 3000 }} // Autoplay functionality
                        freeMode={true} // Enable free mode
                        breakpoints={breakpoints} // Add breakpoints here
                        className="mySwiper"
                    >
                        {sectionData?.partners?.map(provider => (
                            <SwiperSlide key={provider.id}>
                                <NearbyProviderCard provider={provider} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </div>
    );
};

export default NearbyProviders;
