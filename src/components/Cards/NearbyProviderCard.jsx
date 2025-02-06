"use client";
import { miniDevider, placeholderImage, useRTL } from "@/utils/Helper";
import Link from "next/link";
import { BsBookmarkCheckFill } from "react-icons/bs";
import { FaStar, FaMapMarkerAlt } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa6";
import CustomImageTag from "../ReUseableComponents/CustomImageTag";
import { useTranslation } from "../Layout/TranslationContext";

const NearbyProviderCard = ({ provider, isBookmark, handleRemoveBookMark }) => {
  const t = useTranslation();
  const isRTL = useRTL();
  return (
    <Link
      href={`/provider-details/${
        provider?.partner_id ? provider?.partner_id : provider?.id
      }`}
      title={provider?.name}
    >
      <div className="w-full flex flex-col border rounded-2xl p-4 max-w-md sm:max-w-full mx-auto custom-shadow card_bg hover:border_color transition-all duration-300 group">
        {/* Top Section: Provider Image and Details */}
        <div className="flex items-center mb-2">
          {/* Provider Image */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
            <CustomImageTag
              src={provider?.image} // Using provider's image URL
              alt={provider?.company_name}
              className="rounded-md object-cover w-full h-full"
              width={0}
              height={0}
              loading="lazy"
              onError={placeholderImage}
            />
          </div>

          {/* Provider Details */}
          <div className="ml-4 flex-grow h-full">
            <div className="flex flex-col justify-between">
              <h2 className="font-semibold text-xl line-clamp-1 xl:line-clamp-2">
                {provider?.company_name}
              </h2>
              <p className="text-sm description_color">
                {provider?.description}
              </p>
            </div>

            {/* Services and Discount */}
            <div className="flex flex-wrap md:flex-nowrap gap-4 items-center text-sm mt-2">
              {provider?.total_services > 0 && (
                <>
                  <span className="primary_text_color underline">
                    {provider?.total_services &&
                      provider?.total_services.toString().padStart(2, "0")}{" "}
                    {t("services")}
                  </span>
                
                </>
              )}
               {provider?.total_services > 0 && provider?.discount > 0
              ? miniDevider
              : null}
              {provider?.discount > 0 && (
                <div className="flex items-center text-green-600 font-semibold">
                  <span className="text-xs bg-green-100 px-1 py-0.5 rounded-full mr-1 flower flex items-center justify-center mx-auto">
                    %
                  </span>
                  {provider?.discount}% {t("off")}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-2" />

        {/* Bottom Section: Rating, Distance, and Arrow */}
        <div className="flex items-center justify-between text-sm sm:text-base">
          {/* Rating and Distance Grouped */}
          <div className="flex items-center space-x-4">
            {/* Rating */}
            {provider?.number_of_ratings > 0 && (
              <div className="flex items-center">
                <FaStar className="text-yellow-500 mr-1" />
                <span className="font-semibold">
                  {provider?.number_of_ratings}
                </span>
              </div>
            )}

            {/* Show miniDevider only if both rating and distance exist */}
            {provider?.number_of_ratings > 0 && provider?.distance > 0
              ? miniDevider
              : null}

            {/* Distance */}
            {provider?.distance > 0 && (
              <div className="flex items-center">
                <FaMapMarkerAlt className="primary_text_color mr-1" />
                <span className="font-semibold">
                  {`${parseFloat(provider?.distance).toFixed(2)} km`}
                </span>
              </div>
            )}
          </div>
          {isBookmark ? (
            <div
              className="primary_text_color"
              onClick={(e) => handleRemoveBookMark(e, provider)}
            >
              <BsBookmarkCheckFill size={22} />
            </div>
          ) : (
            // {/* Arrow Icon */}

            <div className="flex items-center gap-1 relative">
              <div className="flex items-center gap-1">
                {/* Show hover effect only on large screens */}
                <span
                  className={`text-base font-normal primary_text_color underline transform transition-transform duration-500 opacity-0 ${
                    isRTL ? "-translate-x-2" : "translate-x-2"
                  } hidden xl:inline group-hover:opacity-100 group-hover:translate-x-0`}
                >
                  {t("viewMore")}
                </span>
                {/* Always visible icon */}
                <FaAngleRight
                  size={16}
                  className={`group-hover:primary_text_color hidden xl:inline ${
                    isRTL ? "rotate-180" : "rotate-0"
                  }`}
                />
                {/* Always visible text and icon on small screens */}
                {/* <span className="text-base font-normal primary_text_color xl:hidden">
                  View More
                </span> */}
                <FaAngleRight
                  size={16}
                  className={`primary_text_color xl:hidden ${
                    isRTL ? "rotate-180" : "rotate-0"
                  }`}
                />
              </div>
            </div>
            // </Link>
          )}
        </div>
      </div>
    </Link>
  );
};

export default NearbyProviderCard;
