import { miniDevider, placeholderImage } from "@/utils/Helper";
import Image from "next/image";
import React from "react";
import { BsBookmarkPlus } from "react-icons/bs";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";
import CustomImageTag from "../ReUseableComponents/CustomImageTag";
import Link from "next/link";
import { useTranslation } from "../Layout/TranslationContext";

const TopRatedProviderCard = ({ provider }) => {
  const t = useTranslation();

  return (
    <div className="card_bg rounded-2xl overflow-hidden border group ">
      <div className="relative">
        <CustomImageTag
          width={0}
          height={0}
          loading="lazy"
          onError={placeholderImage}
          className="w-full h-[180px] object-cover"
          src={provider?.banner_image}
          alt={`${provider?.username} cover`}
        />
        {provider?.discount > 0 && (
          <div className="absolute top-3 left-3 card_bg text-green-500 text-xs font-semibold px-2 py-1 rounded-[8px]">
            {provider?.discount}% {t("off")}
          </div>
        )}
        <div className="absolute top-3 -right-10 card_bg text-black text-xs font-semibold px-2 py-1 rounded-[8px] transition-all duration-300 group-hover:right-3">
          <BsBookmarkPlus size={22} />
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center mb-3">
          <CustomImageTag
            width={0}
            height={0}
            loading="lazy"
            onError={placeholderImage}
            className="w-12 h-12 rounded-xl mr-3"
            src={provider?.image}
            alt={`${provider?.name} logo`}
          />
          <div>
            <h2 className="font-semibold text-lg leading-tight">
              {provider?.username}
            </h2>
            {provider?.total_services > 0 && (
              <span className="text-sm primary_text_color font-medium">
                {provider?.total_services} {t("services")}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {/* Rating */}
          {provider.number_of_rating > 0 && (
            <>
              <div className="flex items-center">
                <FaStar className="text-yellow-500 mr-1" />
                <span className="font-semibold">
                  {provider.number_of_rating}
                </span>
              </div>

              {/* Vertical Divider */}
              {miniDevider}
            </>
          )}

          {/* Distance */}
          <div className="flex items-center">
            <FaMapMarkerAlt className="primary_text_color mr-1" />
            <span className="font-semibold">
              {" "}
              {`${parseFloat(provider?.distance).toFixed(2)} km`}
            </span>
          </div>
        </div>
        <button className="w-full light_bg_color primary_text_color dark:text-white font-normal py-2.5 px-4 rounded-lg text-sm mt-4">
          <Link href={`/provider-details/${provider?.id}`}>
            {t("viewService")}
          </Link>
        </button>
      </div>
    </div>
  );
};

export default TopRatedProviderCard;
