import React from 'react'
import CommanHeadline from '../ReUseableComponents/CommanHeadline';
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import { Autoplay, FreeMode, Pagination } from 'swiper/modules';
import TopRatedProviderCard from '../Cards/TopRatedProviderCard';
import { useRTL } from '@/utils/Helper';

const TopRatedProviders = ({sectionData}) => {
    
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
            slidesPerView: 2.8,
        },
        1400: {
            slidesPerView: 3.7,
        },
        1600: {
            slidesPerView:4.5,
        },
    };

    return (
        <div className='py-8'>
            <div className='container mx-auto px-4 md:px-8 topRatedProviders'>
                <CommanHeadline
                    headline={sectionData?.title}
                    subHeadline={sectionData?.description}
                    link={""}
                />
                <div>
                    <Swiper
                        modules={[Autoplay, FreeMode,Pagination]} // Include FreeMode module
                        spaceBetween={30}
                        loop={true}
                        key={isRTL}
                        dir={isRTL ? "rtl" : "ltr"}
                        autoplay={{ delay: 3000 }} // Autoplay functionality
                        freeMode={true} // Enable free mode
                        breakpoints={breakpoints} // Add breakpoints here
                        navigation
                        pagination={{
                          clickable: true,
                        }}
                        className="mySwiper"
                    >
                        {sectionData?.partners?.map(provider => (
                            <SwiperSlide key={provider.id}>
                                <TopRatedProviderCard provider={provider} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

            </div>
        </div>
    )
}

export default TopRatedProviders