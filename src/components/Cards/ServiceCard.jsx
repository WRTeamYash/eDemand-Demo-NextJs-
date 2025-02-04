"use client"
import React from 'react'
import Image from 'next/image'
import { placeholderImage } from '@/utils/Helper'
import CustomImageTag from '../ReUseableComponents/CustomImageTag'

const ServiceCard = ({ data }) => {
    return (
        <>
            <div className="service_card light_bg_color py-[34px] px-[30px] rounded-[20px] flex flex-col gap-3 items-center justify-center h-[230px] w-full">
                <div className="service_item_img_div bg-white rounded-[14px] p-1">
                <CustomImageTag src={data?.image} alt={data?.name} width={0} height={0} loading='lazy' className='w-[80px] h-[80px]' onError={placeholderImage}/>
                </div>
                <div className="service_title font-bold text-base w-full">
                    <span>
                        {data?.name}
                    </span>
                </div>
            </div>
        </>
    )
}

export default ServiceCard